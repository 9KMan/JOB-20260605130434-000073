# Plan: AI Integration — OpenAI/Anthropic Powered Features

## Phase: 04-ai-integration

## Context
Implement AI-powered features for the Restaurant Operations Management Platform as specified in the job requirements: inventory forecasting, production planning recommendations, SOP assistant, food cost optimization alerts, wastage analysis, and operations performance benchmarking.

## Deliverables
- `backend/src/services/ai.service.ts` — OpenAI/Anthropic API integration service
- `backend/src/routes/ai.ts` — AI feature endpoints (enrich existing routes)
- `backend/src/services/inventory-forecast.service.ts` — ML-based inventory forecasting
- `backend/src/services/production-recommend.service.ts` — Production planning AI recommendations
- `backend/src/services/wastage-analysis.service.ts` — Wastage pattern analysis
- `backend/src/services/food-cost-optimizer.service.ts` — Food cost optimization alerts
- `backend/src/services/sop-assistant.service.ts` — SOP Q&A assistant (RAG over SOP documents)
- `backend/src/services/performance-benchmark.service.ts` — Operations benchmarking
- `backend/src/services/alert.service.ts` — Alert generation and dispatch
- `backend/.env.example` update — Add OPENAI_API_KEY, ANTHROPIC_API_KEY
- `backend/tests/ai.service.test.ts` — Unit tests for AI services
- `docs/ai-features.md` — AI feature design document

## Execution
1. Setup OpenAI and Anthropic API clients
2. Implement SOP assistant with document ingestion and RAG
3. Implement inventory forecasting (time-series on historical consumption)
4. Implement production recommendation engine
5. Implement wastage analysis with pattern detection
6. Implement food cost optimization alerts
7. Implement performance benchmarking
8. Wire all AI services into backend route handlers
9. Commit and push
