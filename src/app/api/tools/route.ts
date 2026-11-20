import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let tools = db.getTools();
  if (category && category !== "All") {
    tools = tools.filter((t) => t.category.toLowerCase() === category.toLowerCase());
  }

  return NextResponse.json({ tools });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, websiteUrl, description, beginnerExplanation, pricingModel } = body;

    if (!name || !category || !websiteUrl) {
      return NextResponse.json({ error: "Missing required tool fields" }, { status: 400 });
    }

    const newTool = {
      id: "tool-" + slugify(name),
      slug: slugify(name),
      name,
      category,
      tagline: description.slice(0, 80),
      description,
      beginnerExplanation: beginnerExplanation || description,
      websiteUrl,
      pricingModel: pricingModel || "Freemium",
      pricingDetails: "Community submitted entry pending verification.",
      isVerified: false,
      lastVerifiedDate: new Date().toISOString().split("T")[0],
      platforms: ["Web"],
      capabilities: ["User-submitted capability"],
      pros: ["Newly submitted tool"],
      cons: ["Under verification"],
      alternatives: [],
      useCases: ["General productivity"],
      rating: 4.5,
      ratingCount: 1,
    };

    // Submissions go to moderation queue
    const submission = db.addSubmission({
      type: "tool",
      title: name,
      payload: newTool,
    });

    return NextResponse.json({ success: true, submission });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
