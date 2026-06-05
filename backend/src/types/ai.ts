// Shared AI service types

export type AIProvider = 'openai' | 'anthropic';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICompletionRequest {
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  model?: string;
}

export interface AICompletionResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  provider: AIProvider;
}

export interface AIEmbedding {
  text: string;
  vector: number[];
}

export interface ForecastPoint {
  date: string; // ISO date
  predicted: number;
  lower: number;
  upper: number;
}

export interface InventoryForecastResult {
  ingredientId: string;
  ingredientName: string;
  historyDays: number;
  method: 'moving-average' | 'exponential-smoothing' | 'hybrid-llm';
  forecast: ForecastPoint[];
  reorderPoint: number;
  safetyStock: number;
  recommendedOrderQty: number;
  confidence: number; // 0-1
  notes: string;
}

export interface ProductionRecommendation {
  menuItemId: string;
  menuItemName: string;
  recommendedQty: number;
  confidence: number;
  reasoning: string;
  basedOn: string[];
  prepWindowStart: string;
  prepWindowEnd: string;
}

export interface WastageInsight {
  ingredientId: string;
  ingredientName: string;
  periodStart: string;
  periodEnd: string;
  totalWastedUnits: number;
  totalWastedCost: number;
  wastageRate: number; // 0-1
  pattern:
    | 'over-prep'
    | 'spoilage'
    | 'portion-drift'
    | 'storage-misuse'
    | 'menu-trend-shift'
    | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface FoodCostAlert {
  ingredientId: string;
  ingredientName: string;
  previousCostPerUnit: number;
  currentCostPerUnit: number;
  percentChange: number;
  affectedMenuItems: { id: string; name: string; marginImpact: number }[];
  suggestedActions: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SOPAnswer {
  question: string;
  answer: string;
  sources: { chunkId: string; documentTitle: string; excerpt: string; score: number }[];
  confidence: number;
}

export interface BenchmarkResult {
  metric: string;
  unit: string;
  ourValue: number;
  industryMedian: number;
  topQuartile: number;
  percentile: number; // 0-100
  narrative: string;
}

export interface AlertEvent {
  id: string;
  type: 'food-cost' | 'wastage' | 'inventory' | 'performance' | 'sop';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  body: string;
  payload: Record<string, unknown>;
  createdAt: string;
}
