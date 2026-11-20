import { NextResponse } from "next/server";
import { slugify } from "@/lib/utils";
import {
  createCatalogSubmission,
  listCatalogItems,
  toToolDto,
} from "@/lib/catalog/queries";

// Every response here is generated from PostgreSQL at request time.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const search = searchParams.get("q") ?? undefined;

  try {
    const rows = await listCatalogItems({
      types: ["tool", "platform", "framework", "agent"],
      category,
      search,
      limit: Number(searchParams.get("limit") ?? 200),
    });

    return NextResponse.json({
      tools: rows.map(toToolDto),
      count: rows.length,
      source: "postgres",
    });
  } catch (error) {
    console.error("[api/tools] query failed", error);
    return NextResponse.json(
      { error: "Catalog database is unavailable. Start PostgreSQL and retry." },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, websiteUrl, description } = body ?? {};

    if (!name || !category || !websiteUrl) {
      return NextResponse.json(
        { error: "name, category and websiteUrl are required" },
        { status: 400 }
      );
    }

    const slug = slugify(String(name));
    const submission = await createCatalogSubmission({
      name: String(name),
      slug,
      category: String(category),
      officialUrl: String(websiteUrl),
      shortDescription: String(description ?? "").slice(0, 280) || String(name),
      longDescription: description ? String(description) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        submission,
        message:
          "Submitted for review. The entry stays unverified and hidden from the verified filter until an editor checks its sources.",
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submission failed";
    const conflict = /already exists/i.test(message);
    return NextResponse.json({ error: message }, { status: conflict ? 409 : 500 });
  }
}
