import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const data = db.getGraphData();
  return NextResponse.json(data);
}
