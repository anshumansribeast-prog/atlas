import { NextResponse } from "next/server";
import {
  listCatalogItems,
  listModelProfiles,
  toModelDto,
} from "@/lib/catalog/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q") ?? undefined;

  try {
    const rows = await listCatalogItems({ type: "model", search, limit: 200 });
    const profiles = await listModelProfiles(rows.map((row) => row.id));
    const profileByItem = new Map(profiles.map((profile) => [profile.item_id, profile]));

    return NextResponse.json({
      models: rows.map((row) => toModelDto(row, profileByItem.get(row.id))),
      count: rows.length,
      source: "postgres",
    });
  } catch (error) {
    console.error("[api/models] query failed", error);
    return NextResponse.json(
      { error: "Model catalog database is unavailable. Start PostgreSQL and retry." },
      { status: 503 }
    );
  }
}
