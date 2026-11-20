import React from "react";
import { db } from "@/lib/db";
import {
  Newspaper,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Tag,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "AI News & Discoveries — AI ATLAS",
  description: "Curated stream of verified foundation model releases, research breakthroughs, and industry announcements.",
};

export default function NewsPage() {
  const news = db.getNews();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atlas-surface border border-atlas-border text-xs font-mono text-atlas-cyan">
          <Newspaper className="w-3.5 h-3.5" />
          <span>Verified Dispatches</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">
          AI News & Breakthroughs
        </h1>
        <p className="text-base text-atlas-textMuted leading-relaxed">
          Stay informed on verifiable model releases, peer-reviewed research papers, and open-source milestones. No ungrounded rumors or AI hype.
        </p>
      </div>

      {/* News Stream Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {news.map((item) => (
          <article
            key={item.id}
            className="p-6 sm:p-8 rounded-3xl bg-atlas-card border border-atlas-border hover:border-atlas-cyan/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2.5 py-0.5 rounded-full bg-atlas-surface border border-atlas-border text-atlas-cyan">
                  {item.category}
                </span>

                <div className="flex items-center gap-2 text-atlas-textFaint">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.publishedAt}</span>
                  {item.isVerified && (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white leading-snug">
                {item.title}
              </h2>

              <p className="text-xs text-atlas-textMuted leading-relaxed">
                {item.summary}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-atlas-surface text-atlas-textMuted"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-atlas-border/60 flex items-center justify-between text-xs font-mono">
              <span className="text-atlas-textFaint">Source: {item.source}</span>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-atlas-cyan hover:underline flex items-center gap-1"
              >
                Read Source <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
