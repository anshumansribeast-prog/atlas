# Catalog data policy

## Evidence hierarchy
1. Official product documentation and API reference.
2. Official pricing pages and terms/licence pages.
3. Official repositories, model cards and release notes.
4. Peer-reviewed papers or benchmark owners' published methodology.
5. Community sources only as leads, never as the sole basis for a high-confidence capability or price claim.

## Required record fields
Every catalog item should have an official destination, a clear item type, a short neutral description, a provider, lifecycle status, verification status and at least one source record. Add a separate source for each material claim when possible.

## Pricing
Never infer a paid plan from a marketing page. Store amount, currency, billing unit, region, effective date and source. If any of those are unknown, keep the amount null and describe the plan as unverified rather than guessing. Prices must be rechecked before being shown as current.

## Capabilities
Use these levels consistently:
- native: first-party feature explicitly documented.
- supported: supported capability with a documented constraint or workflow.
- via_integration: requires an external connector or extension.
- limited: partial or constrained support.
- unknown: no reliable evidence yet.

A feature must not be marked native based only on a community post or marketing inference.

## Rankings
Do not create one universal "best AI" score. Rank against a named task and a published rubric. Suggested dimensions:
- task quality (from cited benchmark or repeatable evaluation),
- reliability (repeatable test results),
- latency (measured under stated conditions),
- cost (current sourced price and representative workload),
- privacy/deployment options,
- accessibility and learning curve.

Every ranking page must show its evaluation date, sample size, scoring weights, sources and known limitations. Never invent benchmark scores.

## Freshness
- Pricing and availability: recheck at least every 7 days.
- Model IDs and lifecycle: recheck at least every 14 days.
- Tool feature claims: recheck at least every 30 days.
- Static concepts and learning materials: review when their source changes or at least every 180 days.

A scheduled job should mark overdue claims as stale. It should not silently keep presenting stale values as current.

## Review workflow
1. Discover candidate from a source.
2. Normalize provider, item type and URL.
3. Extract claims with source references.
4. Validate URLs and duplicate slugs.
5. Human review before setting `verification_status='verified'`.
6. Record every material change in `catalog_change_log`.
7. Keep rejected and superseded data auditable.

## Privacy and security
Never put API keys, passwords, private user data or provider secrets in catalog records, logs, seed files or Git history. Store only a secret-manager reference in `model_endpoints.secret_ref`. Course knowledge retrieval must be scoped to the active course unless an explicit, active grant allows sharing.
