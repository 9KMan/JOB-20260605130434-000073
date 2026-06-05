import { query } from '../db/pool';
import { logger } from '../lib/logger';
import { aiService } from './ai.service';
import { ForecastPoint, InventoryForecastResult } from '../types/ai';

interface ConsumptionRow {
  date: string;
  consumed: number;
}

interface IngredientRow {
  id: string;
  name: string;
  unit: string;
  current_stock: number;
  lead_time_days: number;
  reorder_quantity: number;
  safety_stock: number;
  unit_cost: number;
}

/**
 * Holt-Winters-lite exponential smoothing
 * Single-series, additive level + trend, no seasonality (kept lean for
 * restaurant SKUs that have <180 days of history typically).
 */
function exponentialSmoothing(series: number[], alpha: number, beta: number, horizon: number) {
  if (series.length === 0) return [];
  let level = series[0];
  let trend = series.length > 1 ? series[1] - series[0] : 0;

  for (let i = 1; i < series.length; i++) {
    const prevLevel = level;
    level = alpha * series[i] + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
  }

  const forecasts: number[] = [];
  for (let h = 1; h <= horizon; h++) {
    forecasts.push(Math.max(0, level + h * trend));
  }
  return forecasts;
}

function stdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function movingAverage(series: number[], window: number): number[] {
  if (series.length < window) return series.slice();
  const out: number[] = [];
  for (let i = 0; i <= series.length - window; i++) {
    const slice = series.slice(i, i + window);
    out.push(slice.reduce((a, b) => a + b, 0) / window);
  }
  return out;
}

export async function getConsumptionHistory(
  ingredientId: string,
  days: number
): Promise<ConsumptionRow[]> {
  const { rows } = await query<ConsumptionRow>(
    `SELECT date::text AS date, COALESCE(SUM(quantity), 0)::float AS consumed
       FROM consumption_events
      WHERE ingredient_id = $1
        AND date >= (CURRENT_DATE - $2::int)
      GROUP BY date
      ORDER BY date ASC`,
    [ingredientId, days]
  );
  return rows;
}

export async function getIngredient(ingredientId: string): Promise<IngredientRow | null> {
  const { rows } = await query<IngredientRow>(
    `SELECT id, name, unit, current_stock, lead_time_days,
            reorder_quantity, safety_stock, unit_cost
       FROM ingredients
      WHERE id = $1`,
    [ingredientId]
  );
  return rows[0] || null;
}

export async function forecastInventory(
  ingredientId: string,
  opts: { historyDays?: number; horizonDays?: number; useLLM?: boolean } = {}
): Promise<InventoryForecastResult | null> {
  const historyDays = opts.historyDays ?? 60;
  const horizonDays = opts.horizonDays ?? 14;

  const ingredient = await getIngredient(ingredientId);
  if (!ingredient) return null;

  const history = await getConsumptionHistory(ingredientId, historyDays);
  const series = history.map((h) => h.consumed);

  // Fill missing days with 0 (closed days)
  const padded: number[] = [];
  for (let i = historyDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    const found = history.find((h) => h.date === key);
    padded.push(found ? found.consumed : 0);
  }

  const smoothed = movingAverage(padded, 7);
  const forecastValues = exponentialSmoothing(smoothed.length > 0 ? smoothed : padded, 0.4, 0.2, horizonDays);

  const recent = padded.slice(-Math.min(14, padded.length));
  const avgDaily = recent.length > 0 ? recent.reduce((a, b) => a + b, 0) / recent.length : 0;
  const sd = stdDev(recent);
  const safetyStock = Math.ceil(avgDaily * ingredient.lead_time_days + 1.65 * sd);
  const reorderPoint = Math.ceil(avgDaily * ingredient.lead_time_days + safetyStock);
  const recommendedOrderQty = Math.max(
    0,
    Math.ceil(reorderPoint + forecastValues.slice(0, 7).reduce((a, b) => a + b, 0) - ingredient.current_stock)
  );

  const confidence = Math.max(0.4, Math.min(0.95, 1 - sd / (avgDaily + 1)));

  let notes =
    `Forecast uses ${historyDays}-day window with 7-day moving average + ` +
    `exponential smoothing (alpha=0.4, beta=0.2). ` +
    `Lead time ${ingredient.lead_time_days}d, safety stock formula uses z=1.65 (95% service level).`;

  let method: InventoryForecastResult['method'] = 'exponential-smoothing';
  if (opts.useLLM) {
    try {
      const llm = await aiService.completeJSON<{
        notes: string;
        confidence: number;
        method: 'exponential-smoothing' | 'hybrid-llm';
      }>(
        {
          messages: [
            {
              role: 'system',
              content:
                'You are a restaurant operations analyst. Given numeric context, return JSON with keys: notes (string), confidence (0-1), method (string).'
            },
            {
              role: 'user',
              content: `Ingredient ${ingredient.name} (unit=${ingredient.unit}, lead time=${ingredient.lead_time_days}d). ` +
                `Avg daily consumption=${avgDaily.toFixed(2)} sd=${sd.toFixed(2)}. ` +
                `7-day forecast=${forecastValues.slice(0, 7).map((v) => v.toFixed(2)).join(',')}. ` +
                `Provide concise operations notes and a calibrated confidence.`
            }
          ]
        }
      );
      notes = llm.notes;
      method = llm.method;
    } catch (err) {
      logger.warn({ err }, 'LLM enrichment failed for forecast; using statistical notes only');
    }
  }

  const start = new Date();
  const forecast: ForecastPoint[] = forecastValues.map((v, idx) => {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + idx + 1);
    return {
      date: d.toISOString().slice(0, 10),
      predicted: Math.round(v * 100) / 100,
      lower: Math.max(0, Math.round((v - 1.65 * sd) * 100) / 100),
      upper: Math.round((v + 1.65 * sd) * 100) / 100
    };
  });

  return {
    ingredientId: ingredient.id,
    ingredientName: ingredient.name,
    historyDays,
    method,
    forecast,
    reorderPoint,
    safetyStock,
    recommendedOrderQty,
    confidence,
    notes
  };
}

export const inventoryForecastService = {
  forecastInventory,
  getConsumptionHistory,
  getIngredient
};

export default inventoryForecastService;
