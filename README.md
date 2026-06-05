# Restaurant Operations Management Platform

> Multi-location restaurant operations SaaS — inventory, production, audits, staff, dashboards & AI

## 🎯 Business Problem Solved

Restaurant brands lose thousands monthly due to manual, disconnected operations: inventory shrinkage from untracked waste, compliance failures from undocumented SOP deviations, and staff inefficiency from paper-based shift management. This platform gives Operations Heads and Outlet Managers a single system to standardize checklists, track every stock movement, schedule audits with photo evidence, and get AI-powered cost optimization alerts — all from any device.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, React Query
- **Backend:** Node.js, Express, TypeScript, Prisma ORM
- **Database:** PostgreSQL (RDS / managed)
- **AI:** OpenAI GPT-4o / Anthropic Claude for forecasting, recommendations & SOP assistant
- **Infrastructure:** AWS (ECS Fargate, RDS, S3, CloudFront) / Azure App Service

## Features

| Module | Description |
|--------|-------------|
| **User Management** | RBAC: Super Admin → Operations Head → Area Manager → Outlet Manager → Store Staff |
| **Daily Operations** | Opening/mid-shift/closing checklists, shift handover reports, task assignment |
| **Inventory Management** | Stock in/out, transfers, physical verification, variance reporting |
| **Production Management** | Batch production sheets, yield tracking, recipe compliance |
| **Audit & Compliance** | Scheduled audits with image uploads, compliance scoring |
| **Staff Management** | Attendance, leave, performance tracking, shift scheduling |
| **Dashboard & Reporting** | Outlet performance, food cost, wastage, audit & productivity reports |
| **Notifications** | Task reminders, compliance alerts, inventory alerts, escalations |
| **AI Integration** | Inventory forecasting, production recommendations, SOP assistant, food cost optimization, wastage analysis |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- pnpm / npm / yarn

### Backend

```bash
cd backend
cp .env.example .env   # fill in your values
npm install
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env   # API_BASE_URL=http://localhost:3001
npm install
npm run dev
```

### Docker (local dev)

```bash
docker compose up --build
```

## Project Structure

```
backend/
├── src/
│   ├── routes/        # Express route handlers
│   ├── services/      # Business logic (including AI services)
│   ├── middleware/    # Auth, error handling, validation
│   ├── db/            # Prisma client & migrations
│   └── lib/           # Helpers, API clients
├── prisma/schema.prisma
└── package.json

frontend/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # Shared UI components
│   └── lib/           # API client, utilities
├── tailwind.config.ts
└── package.json

infra/
├── main.tf            # AWS/Azure infrastructure
└── variables.tf
```

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate, receive JWT |
| GET/POST | `/api/users` | User management |
| GET/POST | `/api/outlets` | Outlet management |
| GET/POST | `/api/ops/checklists` | Daily checklists |
| GET/POST | `/api/inventory/stock` | Inventory CRUD |
| GET/POST | `/api/production/batches` | Production batches |
| GET/POST | `/api/audits` | Audit scheduling & results |
| GET/POST | `/api/staff/attendance` | Attendance records |
| GET | `/api/dashboard/:outletId` | Aggregated outlet reports |
| POST | `/api/ai/forecast` | Inventory forecasting |
| POST | `/api/ai/recommend` | Production recommendations |

## Deployment

See [docs/deployment.md](docs/deployment.md) for full AWS/Azure deployment instructions.

## License

Proprietary — CYK Hospitalities Pvt. Ltd.
