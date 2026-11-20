# AI Atlas

AI Atlas is a source-backed directory and learning workspace for AI tools, models, agents, APIs, frameworks, datasets and courses.

## Principles
- **Evidence first:** every factual catalog record must link to a source and record when it was checked.
- **No invented rankings:** recommendations must show the task, evidence, scoring method and limitations.
- **Freshness matters:** pricing, model availability and feature claims can change; stale records are visibly marked.
- **Secrets stay secret:** never store provider API keys in catalog tables or commit them. Store secret references in a backend secret manager.
- **Real functionality only:** do not label mock data, placeholder integrations or untested connections as live.

## Stack
- PostgreSQL 16+ for catalog, learning and usage data
- Next.js 14 (App Router), TypeScript and Tailwind CSS for the web app in `src/`
- SQL-first schema and migrations in `database/migrations/`
- Seed data in `database/seeds/`
- `pg` with hand-written parameterised SQL in `src/lib/db/pg.ts` (no ORM layer yet)

## Quick start
1. Copy `.env.example` to `.env` and set a strong local `POSTGRES_PASSWORD`.
2. Start PostgreSQL with `docker compose up -d db`, or create a PostgreSQL 16+ database yourself.
3. Apply migrations in filename order:
   ```bash
   docker compose exec -T db psql -U atlas -d ai_atlas -v ON_ERROR_STOP=1 -f /atlas-database/migrations/001_core.sql
   docker compose exec -T db psql -U atlas -d ai_atlas -v ON_ERROR_STOP=1 -f /atlas-database/migrations/002_learning_and_ai.sql
   ```
4. Load verified starter catalog records:
   ```bash
   docker compose exec -T db psql -U atlas -d ai_atlas -v ON_ERROR_STOP=1 -f /atlas-database/seeds/001_verified_catalog.sql
   docker compose exec -T db psql -U atlas -d ai_atlas -v ON_ERROR_STOP=1 -f /atlas-database/seeds/002_tool_families.sql
   docker compose exec -T db psql -U atlas -d ai_atlas -v ON_ERROR_STOP=1 -f /atlas-database/seeds/003_model_specs.sql
   docker compose exec -T db psql -U atlas -d ai_atlas -v ON_ERROR_STOP=1 -f /atlas-database/seeds/004_openai_gemini_models.sql
   ```
5. Add the app connection string to `.env` (same password as above):
   ```
   DATABASE_URL=postgresql://atlas:<your-password>@localhost:5432/ai_atlas
   ```
6. Install and run the web app:
   ```bash
   npm install
   npm run dev     # http://localhost:3000
   ```
7. Verify the API layer is reading from PostgreSQL:
   ```bash
   npm run smoke   # 14 checks against the running server
   ```

For local development, use the provided Docker Compose file. Change all example passwords before exposing any service. Do not expose PostgreSQL directly to the public internet. The catalog seed is a curated starting point, not a complete index of every AI product.

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

What is **built and verified** today:

- PostgreSQL schema (catalog, providers, sources, capabilities, pricing, model
  profiles, model endpoints, courses, lessons, tutor sessions, knowledge
  chunks, usage events, audit events) applied through real migrations.
- A source-backed starter catalog: 11 providers, 17 sources, 24 catalog items
  (12 models, 10 tools, 2 platforms), 26 sourced claims and 8 priced API offers.
  All specification and price claims link to an official provider page with a
  `checked_at` date.
- A Next.js 14 web application with a discovery interface at `/models`,
  `/tools` and `/tools/[slug]`, reading the catalog **from PostgreSQL** through
  `/api/models`, `/api/tools`, `/api/categories` and `/api/health`.
- Community tool submissions persisted to `catalog_items` as `unreviewed`
  entries plus an `audit_events` row.
- `npm run smoke` — 14 API checks that fail if the database stops answering.

What is **not built yet**, and must not be described as working:

- Authentication, users and role-based permissions.
- The model gateway: provider adapters, encrypted credentials, live health checks.
- The agent ecosystem and supervisor.
- Courses, lessons and the AI tutor are still served from an in-process JSON
  store (`src/lib/db` + `atlas-data.json`); they have not been migrated to SQL.
- Knowledge ingestion, embeddings, vector retrieval.
- Research workspace, admin review queue, analytics dashboards.
- Automated crawling or automatic catalog refresh.

