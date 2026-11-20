import { NextResponse } from "next/server";
import { listCategories } from "@/lib/catalog/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await listCategories();
    return NextResponse.json({ categories, source: "postgres" });
  } catch (error) {
    console.error("[api/categories] query failed", error);
    return NextResponse.json(
      { error: "Category database is unavailable. Start PostgreSQL and retry." },
      { status: 503 }
    );
  }
}
