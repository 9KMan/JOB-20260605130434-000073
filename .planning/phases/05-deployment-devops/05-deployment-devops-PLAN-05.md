# Plan: Deployment & DevOps — AWS/Azure Infrastructure

## Phase: 05-deployment-devops

## Context
Package the Restaurant Operations Management Platform for deployment. Infrastructure as Code, Docker containerization, CI/CD pipelines, and production deployment configuration.

## Deliverables
- `Dockerfile` — Multi-stage build for backend (Node.js)
- `Dockerfile.frontend` — Next.js production build
- `docker-compose.yml` — Local development environment
- `infra/main.tf` — Terraform: VPC, ECS/Fargate or Azure App Service, RDS/PostgreSQL, S3, CloudFront
- `infra/variables.tf` — Terraform variables
- `infra/outputs.tf` — Terraform outputs
- `.github/workflows/deploy.yml` — GitHub Actions CI/CD pipeline
- `.github/workflows/test.yml` — Test workflow
- `backend/Dockerfile` — Backend container
- `frontend/Dockerfile` — Frontend container (or use Vercel/Netlify)
- `docs/deployment.md` — Deployment guide (AWS/Azure, environment setup)
- `docs/environment-variables.md` — Full env var documentation

## Execution
1. Create Dockerfile for Node.js/Express backend
2. Create Next.js production Dockerfile
3. Write docker-compose.yml for local dev
4. Create Terraform IaC for AWS (VPC, ECS, RDS, S3, CloudFront) or Azure equivalents
5. Setup GitHub Actions workflows (test → build → deploy)
6. Document deployment steps and environment variables
7. Commit and push
