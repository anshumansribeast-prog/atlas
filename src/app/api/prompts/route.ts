import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET() {
  const prompts = db.getPrompts();
  return NextResponse.json({ prompts });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, id, prompt } = body;

    if (action === "upvote" && id) {
      const upvotes = db.upvotePrompt(id);
      return NextResponse.json({ success: true, upvotes });
    }

    if (prompt && prompt.title && prompt.objective) {
      const newPrompt = {
        id: "prompt-" + slugify(prompt.title),
        slug: slugify(prompt.title),
        title: prompt.title,
        category: prompt.category || "General",
        objective: prompt.objective,
        context: prompt.context || "",
        instructions: prompt.instructions || "",
        constraints: prompt.constraints || "",
        outputFormat: prompt.outputFormat || "",
        fullTemplate: prompt.fullTemplate || `${prompt.objective}\n\nContext:\n${prompt.context}\n\nInstructions:\n${prompt.instructions}`,
        upvotes: 1,
        author: prompt.author || "Community Contributor",
        tags: prompt.tags || ["custom"],
        createdAt: new Date().toISOString().split("T")[0],
      };

      const created = db.createPrompt(newPrompt);
      db.addAuditLog("usr-demo-1", "CREATE_PROMPT", { id: created.id, title: created.title });
      return NextResponse.json({ success: true, prompt: created });
    }

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
