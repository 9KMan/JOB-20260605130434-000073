# Plan: Frontend — React/Next.js Web Application

## Phase: 03-frontend

## Context
Build the frontend web application for the Restaurant Operations Management Platform. Must be mobile-responsive, support all 9 modules, and work across Desktop/Tablet/Mobile. Stack: React.js + Next.js with a component library (Tailwind CSS or Material UI).

## Deliverables
- `frontend/package.json` — Next.js project with dependencies
- `frontend/next.config.js` — Next.js configuration
- `frontend/src/app/layout.tsx` — Root layout with auth provider
- `frontend/src/app/page.tsx` — Login page
- `frontend/src/app/(dashboard)/layout.tsx` — Dashboard layout with sidebar nav
- `frontend/src/app/(dashboard)/dashboard/page.tsx` — Main dashboard
- `frontend/src/app/(dashboard)/users/page.tsx` — User management
- `frontend/src/app/(dashboard)/ops/page.tsx` — Daily ops checklists
- `frontend/src/app/(dashboard)/inventory/page.tsx` — Inventory management
- `frontend/src/app/(dashboard)/production/page.tsx` — Production planning
- `frontend/src/app/(dashboard)/audits/page.tsx` — Audit & compliance
- `frontend/src/app/(dashboard)/staff/page.tsx` — Staff management
- `frontend/src/app/(dashboard)/notifications/page.tsx` — Notification center
- `frontend/src/components/ui/` — Shared UI components (Button, Card, Table, Modal)
- `frontend/src/lib/api.ts` — API client with JWT token handling
- `frontend/tailwind.config.ts` — Tailwind configuration
- `frontend/README.md` — Setup and dev instructions

## Execution
1. Scaffold Next.js project with TypeScript
2. Setup Tailwind CSS
3. Create shared UI component library
4. Implement dashboard layout with role-based sidebar
5. Build each module page with forms, tables, and interactive elements
6. Implement responsive design (mobile-first)
7. Add API integration layer with JWT auth
8. Commit and push
