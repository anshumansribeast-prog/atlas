#!/usr/bin/env node
/**
 * Smoke test for the running application.
 *
 * It asserts that the API layer answers with real data from PostgreSQL instead
 * of trusting the build. Start the server first (`npm run dev` or `npm start`),
 * then run `node scripts/smoke-test.mjs`.
 *
 * Exits with code 1 if any check fails, so CI can gate on it.
 */

const BASE_URL = (process.env.ATLAS_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

let failures = 0;

function check(name, condition, detail = "") {
  if (condition) {
    console.log(`  PASS  ${name}`);
    return;
  }
  failures += 1;
  console.error(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function getJson(path) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(15_000),
  });
  const body = await response.json().catch(() => ({}));
  return { status: response.status, body };
}

console.log(`ATLAS smoke test against ${BASE_URL}\n`);

// 1. Health: the API must reach PostgreSQL.
{
  const { status, body } = await getJson("/api/health");
  check("GET /api/health returns 200", status === 200, `got ${status}`);
  check("database is reachable", body?.database?.reachable === true, JSON.stringify(body?.database));
}

// 2. Models: rows come from the catalog, with specs filled in.
{
  const { status, body } = await getJson("/api/models");
  check("GET /api/models returns 200", status === 200, `got ${status}`);
  check("models are sourced from postgres", body?.source === "postgres");
  check("at least one model is catalogued", (body?.count ?? 0) > 0, `count=${body?.count}`);
  const models = body?.models ?? [];
  const shaped = models.every(
    (model) => typeof model.slug === "string" && typeof model.name === "string" && typeof model.contextWindow === "string"
  );
  check("every model has slug, name and context window", shaped);
}

// 3. Tools: the directory is populated from the same database.
{
  const { status, body } = await getJson("/api/tools");
  check("GET /api/tools returns 200", status === 200, `got ${status}`);
  check("tools are sourced from postgres", body?.source === "postgres");
  check("at least one tool is catalogued", (body?.count ?? 0) > 0, `count=${body?.count}`);
  const tools = body?.tools ?? [];
  check("every tool carries a verification state", tools.every((tool) => typeof tool.isVerified === "boolean"));
  check(
    "no tool exposes a fabricated star rating",
    tools.every((tool) => tool.rating === 0 && tool.ratingCount === 0)
  );
}

// 4. Categories: filters are driven by what the database actually holds.
{
  const { status, body } = await getJson("/api/categories");
  check("GET /api/categories returns 200", status === 200, `got ${status}`);
  const categories = body?.categories ?? [];
  check("categories are returned", categories.length > 0, `count=${categories.length}`);
  check("categorised items are counted", categories.some((category) => category.itemCount > 0));
}

console.log("");
if (failures > 0) {
  console.error(`${failures} check(s) failed.`);
  process.exit(1);
}
console.log("All smoke checks passed.");
