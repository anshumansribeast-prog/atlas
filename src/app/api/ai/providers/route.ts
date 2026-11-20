import { NextResponse } from "next/server";
import { aiGateway } from "@/lib/ai-provider";

export async function GET() {
  const providers = aiGateway.getAvailableProviders();
  return NextResponse.json({ providers });
}
