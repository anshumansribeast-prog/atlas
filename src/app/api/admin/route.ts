import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const submissions = db.getSubmissions();
  const auditLogs = db.getAuditLogs();
  const tools = db.getTools();
  const models = db.getModels();
  return NextResponse.json({ submissions, auditLogs, totalTools: tools.length, totalModels: models.length });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, submissionId } = body;

    if (action === "approve" && submissionId) {
      const approved = db.approveSubmission(submissionId);
      return NextResponse.json({ success: true, approved });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
