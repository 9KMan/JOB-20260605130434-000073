import 'dotenv/config';

function reqEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v;
}

function optEnv(name: string, fallback: string): string {
  const v = process.env[name];
  return v && v.trim() !== '' ? v : fallback;
}

export const config = {
  nodeEnv: optEnv('NODE_ENV', 'development'),
  port: Number(optEnv('PORT', '4000')),
  jwtSecret: reqEnv('JWT_SECRET'),
  jwtExpiresIn: optEnv('JWT_EXPIRES_IN', '8h'),
  databaseUrl: reqEnv('DATABASE_URL'),
  ai: {
    provider: optEnv('AI_PROVIDER', 'openai') as 'openai' | 'anthropic',
    openaiApiKey: optEnv('OPENAI_API_KEY', ''),
    openaiModel: optEnv('OPENAI_MODEL', 'gpt-4o-mini'),
    openaiEmbeddingModel: optEnv('OPENAI_EMBEDDING_MODEL', 'text-embedding-3-small'),
    anthropicApiKey: optEnv('ANTHROPIC_API_KEY', ''),
    anthropicModel: optEnv('ANTHROPIC_MODEL', 'claude-3-5-sonnet-20241022'),
    timeoutMs: Number(optEnv('AI_TIMEOUT_MS', '30000')),
    maxRetries: Number(optEnv('AI_MAX_RETRIES', '3'))
  },
  rag: {
    chunkSize: Number(optEnv('RAG_CHUNK_SIZE', '800')),
    chunkOverlap: Number(optEnv('RAG_CHUNK_OVERLAP', '120')),
    topK: Number(optEnv('RAG_TOP_K', '5'))
  },
  alerts: {
    webhookUrl: optEnv('ALERT_WEBHOOK_URL', ''),
    slackWebhookUrl: optEnv('ALERT_SLACK_WEBHOOK_URL', ''),
    emailFrom: optEnv('ALERT_EMAIL_FROM', 'alerts@restaurant-ops.local')
  }
};
