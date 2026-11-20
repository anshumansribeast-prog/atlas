import { NextResponse } from "next/server";
import { checkDatabaseHealth, isDatabaseConfigured } from "@/lib/db/pg";

export const dynamic = "force-dynamic";

/**
 * Readiness probe. Reports whether the API can reach PostgreSQL, with the
 * measured round-trip time. Never leaks the connection string or credentials.
 */
export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { status: "unconfigured", database: "DATABASE_URL is not set" },
      { status: 503 }
    );
  }

  const health = await checkDatabaseHealth();

  return NextResponse.json(
    {
      status: health.ok ? "ok" : "degraded",
      database: {
        reachable: health.ok,
        latencyMs: health.latencyMs,
        error: health.ok ? undefined : health.error,
      },
      checkedAt: new Date().toISOString(),
    },
    { status: health.ok ? 200 : 503 }
  );
}
