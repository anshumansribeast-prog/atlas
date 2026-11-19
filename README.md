# AI Atlas

AI Atlas is a source-backed directory and learning workspace for AI tools, models, agents, APIs, frameworks, datasets and courses.

## Principles
- **Evidence first:** every factual catalog record must link to a source and record when it was checked.
- **No invented rankings:** recommendations must show the task, evidence, scoring method and limitations.
- **Freshness matters:** pricing, model availability and feature claims can change; stale records are visibly marked.
- **Secrets stay secret:** never store provider API keys in catalog tables or commit them. Store secret references in a backend secret manager.
- **Real functionality only:** do not label mock data, placeholder integrations or untested connections as live.

## Stack
- PostgreSQL 16+
- SQL-first schema and migrations in `database/migrations/`
- Seed data in `database/seeds/`
- Application/API layer will be added in later milestones.

## Quick start
1. Create a PostgreSQL database.
2. Apply migrations in filename order:
   ```bash
   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/001_core.sql
   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/002_learning_and_ai.sql
   ```
3. Load verified starter catalog records:
   ```bash
   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/seeds/001_verified_catalog.sql
   ```

For local development, use the provided Docker Compose file. Change all example passwords before exposing any service. Do not expose PostgreSQL directly to the public internet.

## Data quality
Catalog entries are not endorsements. A source record describes where a claim came from; it does not guarantee the claim remains current. The seed set intentionally avoids hard-coded prices and fabricated benchmark scores. Add pricing only from a current official pricing source, with currency, unit, region (when applicable), effective date and checked timestamp.

## Planned product areas
1. Discovery: searchable tools, models, providers, agents, APIs and frameworks.
2. Comparison: compare up to four items with capability and pricing evidence.
3. Task guides: coding, research, writing, image, video, audio, data and automation workflows.
4. Academy: structured courses, tracks, lessons, exercises and progress.
5. AI tutor: course-scoped retrieval, citations, adaptive explanations and progress-aware guidance.
6. Model gateway: provider adapters, custom OpenAI-compatible endpoints, routing, fallbacks and health checks.
7. Admin: source review, catalog ingestion, model assignments, usage, errors and audit logs.

## Current status
This repository currently contains the database foundation and a small official-source starter catalog. It is **not yet** a deployed web application, live AI gateway, automatic crawler or fully populated directory. Those features must be implemented and tested before being marked complete.
