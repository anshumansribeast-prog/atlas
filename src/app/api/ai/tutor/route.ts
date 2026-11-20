import { NextResponse } from "next/server";
import { aiGateway, AIProviderName } from "@/lib/ai-provider";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, level = "beginner", provider, contextTopic } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Missing question string" }, { status: 400 });
    }

    const systemPrompt = `You are the AI ATLAS Tutor, an authoritative, rigorous, yet empathetic teaching assistant embedded in the AI ATLAS platform.
Current Learner Level: ${level.toUpperCase()}.
Topic Context: ${contextTopic || "General Artificial Intelligence"}.

Guiding Principles:
1. Calibrate depth strictly to the user's level:
   - BEGINNER: Focus on intuitive real-world analogies, demystify jargon, avoid mathematical symbols unless explained visually.
   - INTERMEDIATE: Introduce conceptual mechanics, system flow, architecture distinctions, and practical applications.
   - ADVANCED / EXPERT: Discuss algorithmic tradeoffs, mathematical foundations, computational complexity, and systems engineering.
2. Ground your answers in empirical reality. Distinguish verified consensus from active open research.
3. Be candid about limitations and unknowns—never hallucinate certainty.
4. Conclude with one thought-provoking follow-up question or practical exercise for the student.`;

    const result = await aiGateway.complete({
      provider: provider as AIProviderName,
      systemPrompt,
      prompt: question,
      temperature: 0.65,
      maxTokens: 1200,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("AI Tutor endpoint error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process tutor query" },
      { status: 500 }
    );
  }
}
