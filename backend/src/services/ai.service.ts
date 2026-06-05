import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { config } from '../lib/config';
import { logger } from '../lib/logger';
import {
  AICompletionRequest,
  AICompletionResponse,
  AIEmbedding,
  AIProvider
} from '../types/ai';

let openaiClient: OpenAI | null = null;
let anthropicClient: Anthropic | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    if (!config.ai.openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    openaiClient = new OpenAI({
      apiKey: config.ai.openaiApiKey,
      timeout: config.ai.timeoutMs,
      maxRetries: config.ai.maxRetries
    });
  }
  return openaiClient;
}

function getAnthropic(): Anthropic {
  if (!anthropicClient) {
    if (!config.ai.anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }
    anthropicClient = new Anthropic({
      apiKey: config.ai.anthropicApiKey,
      timeout: config.ai.timeoutMs,
      maxRetries: config.ai.maxRetries
    });
  }
  return anthropicClient;
}

function selectProvider(requested?: AIProvider): AIProvider {
  if (requested) return requested;
  return config.ai.provider;
}

export async function complete(
  req: AICompletionRequest,
  provider: AIProvider = config.ai.provider
): Promise<AICompletionResponse> {
  const chosen = selectProvider(provider);
  if (chosen === 'openai') {
    return completeOpenAI(req);
  }
  return completeAnthropic(req);
}

async function completeOpenAI(req: AICompletionRequest): Promise<AICompletionResponse> {
  const client = getOpenAI();
  const model = req.model || config.ai.openaiModel;

  const response = await client.chat.completions.create({
    model,
    messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
    temperature: req.temperature ?? 0.2,
    max_tokens: req.maxTokens ?? 1024,
    response_format: req.jsonMode ? { type: 'json_object' } : undefined
  });

  const choice = response.choices[0];
  const content = choice?.message?.content || '';
  return {
    content,
    model: response.model,
    usage: {
      promptTokens: response.usage?.prompt_tokens ?? 0,
      completionTokens: response.usage?.completion_tokens ?? 0,
      totalTokens: response.usage?.total_tokens ?? 0
    },
    provider: 'openai'
  };
}

async function completeAnthropic(req: AICompletionRequest): Promise<AICompletionResponse> {
  const client = getAnthropic();
  const model = req.model || config.ai.anthropicModel;

  const systemMessages = req.messages.filter((m) => m.role === 'system');
  const userMessages = req.messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  // Anthropic requires first user turn; if first is assistant, prepend a user
  if (userMessages.length === 0 || userMessages[0].role !== 'user') {
    userMessages.unshift({ role: 'user', content: '' });
  }

  const params: Anthropic.Messages.MessageCreateParams = {
    model,
    system: systemMessages.map((m) => m.content).join('\n\n') || undefined,
    messages: userMessages,
    max_tokens: req.maxTokens ?? 1024,
    temperature: req.temperature ?? 0.2
  };

  const response = await client.messages.create(params);
  const textBlock = response.content.find((b) => b.type === 'text');
  const content = textBlock && textBlock.type === 'text' ? textBlock.text : '';

  return {
    content,
    model: response.model,
    usage: {
      promptTokens: response.usage.input_tokens,
      completionTokens: response.usage.output_tokens,
      totalTokens: response.usage.input_tokens + response.usage.output_tokens
    },
    provider: 'anthropic'
  };
}

export async function embed(texts: string[]): Promise<AIEmbedding[]> {
  if (texts.length === 0) return [];
  const client = getOpenAI();
  const response = await client.embeddings.create({
    model: config.ai.openaiEmbeddingModel,
    input: texts
  });
  return response.data.map((d, i) => ({
    text: texts[i],
    vector: d.embedding
  }));
}

export async function completeJSON<T>(
  req: AICompletionRequest,
  provider: AIProvider = config.ai.provider
): Promise<T> {
  const result = await complete({ ...req, jsonMode: provider === 'openai' }, provider);
  const trimmed = result.content.trim();
  try {
    return JSON.parse(trimmed) as T;
  } catch (err) {
    logger.error({ err, content: trimmed.slice(0, 500) }, 'Failed to parse AI JSON output');
    throw new Error('AI provider returned invalid JSON');
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export const aiService = {
  complete,
  completeJSON,
  embed,
  cosineSimilarity
};

export default aiService;
