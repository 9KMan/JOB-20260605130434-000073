# Plan: Backend API — Node.js/Express + PostgreSQL

## Phase: 02-backend-api

## Context
Implement the backend API for the Restaurant Operations Management Platform. All 9 modules require CRUD + business logic APIs: User Management (RBAC), Daily Ops, Inventory Management, Production Management, Audit & Compliance, Staff Management, Dashboard & Reporting, Notifications, AI Integration endpoints.

## Deliverables
- `backend/package.json` — Node.js project with Express, Prisma/Sequelize, JWT auth
- `backend/src/app.js` — Express app setup with middleware
- `backend/src/routes/auth.js` — Login, role-based JWT issuance
- `backend/src/routes/users.js` — User CRUD, role assignment
- `backend/src/routes/outlets.js` — Outlet management
- `backend/src/routes/ops.js` — Daily ops: checklists, shift handover
- `backend/src/routes/inventory.js` — Stock in/out, transfers, variance
- `backend/src/routes/production.js` — Batch production sheets, recipe compliance
- `backend/src/routes/audits.js` — Audit scheduling, image upload, compliance scoring
- `backend/src/routes/staff.js` — Attendance, leave, performance, shift scheduling
- `backend/src/routes/dashboard.js` — Aggregated reports per outlet
- `backend/src/routes/notifications.js` — Push/email notification dispatch
- `backend/src/routes/ai.js` — AI integration proxy endpoints (OpenAI/Anthropic)
- `backend/prisma/schema.prisma` — PostgreSQL schema via Prisma ORM
- `backend/.env.example` — Environment variables template
- `backend/README.md` — Setup instructions

## Execution
1. Scaffold Node.js/Express project with TypeScript or JavaScript
2. Setup Prisma with PostgreSQL connection
3. Implement JWT authentication middleware
4. Implement all route modules
5. Add input validation (Joi/Zod)
6. Add error handling middleware
7. Write unit tests for core services
8. Commit and push
