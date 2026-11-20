"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AITool } from "@/lib/db/schema";
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Star,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Laptop,
} from "lucide-react";
import { useAtlasStore } from "@/lib/store";

export default function ToolProfilePage() {
  const params = useParams();
  const slug = (params?.slug as string) || "chatgpt";
  const [tool, setTool] = useState<AITool | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, toggleBookmark } = useAtlasStore();

  useEffect(() => {
    fetch("/api/tools")
      .then((res) => res.json())
      .then((data) => {
        if (data.tools) {
          const match = data.tools.find(
            (t: AITool) => t.slug === slug || t.id === slug
          );
          setTool(match || null);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center text-atlas-textMuted font-mono">
        <span className="inline-block animate-spin mr-2">⟳</span> Loading verified tool profile...
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-heading font-bold text-white">Tool Not Found</h2>
        <p className="text-sm text-atlas-textMuted">
          The requested AI platform is not yet indexed in our directory.
        </p>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-atlas-surface border border-atlas-border text-white text-xs font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
        </Link>
      </div>
    );
  }

  const isBookmarked = user.bookmarks.includes(tool.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Nav Back */}
      <div className="flex items-center justify-between">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-xs font-mono text-atlas-textMuted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Tools Directory
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleBookmark(tool.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-colors ${
              isBookmarked
                ? "bg-amber-400/20 border-amber-400/50 text-amber-300"
                : "bg-atlas-surface border-atlas-border text-atlas-textMuted hover:text-white"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            {isBookmarked ? "Saved" : "Save Tool"}
          </button>
          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-atlas-blue hover:bg-atlas-blue/90 text-white text-xs font-medium shadow-sm transition-all"
          >
            Visit Official Website
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-atlas-card border border-atlas-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-atlas-surface border border-atlas-border text-atlas-cyan">
                {tool.category}
              </span>
              <div className="flex items-center gap-1 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                Verified ({tool.lastVerifiedDate})
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white">
              {tool.name}
            </h1>
            <p className="text-sm text-atlas-textMuted max-w-2xl">{tool.tagline}</p>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center p-4 rounded-2xl bg-atlas-surface border border-atlas-border shrink-0">
            <span className="text-xs font-mono text-atlas-textFaint">Verified Pricing</span>
            <span className="text-lg font-heading font-bold text-white mt-0.5">
              {tool.pricingModel}
            </span>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-mono mt-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{tool.rating} / 5.0</span>
            </div>
          </div>
        </div>

        {/* Pricing Details Breakdown */}
        <div className="p-4 rounded-xl bg-atlas-surface/80 border border-atlas-border/80 text-xs text-atlas-textMuted font-mono space-y-1">
          <div className="text-white font-semibold">Pricing Structure:</div>
          <div>{tool.pricingDetails}</div>
        </div>
      </div>

      {/* Beginner Explanation Callout */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-atlas-surface to-atlas-card border border-atlas-border space-y-2">
        <div className="flex items-center gap-2 font-mono text-xs text-atlas-cyan uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Beginner-Friendly Explanation</span>
        </div>
        <p className="text-sm text-white leading-relaxed">
          {tool.beginnerExplanation}
        </p>
      </div>

      {/* Capabilities & Supported Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-atlas-card border border-atlas-border space-y-4">
          <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
            <Layers className="w-4 h-4 text-atlas-blue" />
            Key Capabilities
          </h3>
          <ul className="space-y-2 text-xs text-atlas-textMuted font-mono">
            {tool.capabilities.map((cap, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-atlas-cyan shrink-0" />
                <span>{cap}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-atlas-card border border-atlas-border space-y-4">
          <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
            <Laptop className="w-4 h-4 text-atlas-cyan" />
            Supported Platforms
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {tool.platforms.map((p, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-xl bg-atlas-surface border border-atlas-border text-xs font-mono text-white"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pros & Cons (Objective Analysis) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros */}
        <div className="p-6 rounded-2xl bg-atlas-card border border-atlas-border space-y-3">
          <h3 className="font-heading font-bold text-emerald-400 text-base flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Key Advantages (Pros)
          </h3>
          <ul className="space-y-2.5 text-xs text-atlas-textMuted">
            {tool.pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="p-6 rounded-2xl bg-atlas-card border border-atlas-border space-y-3">
          <h3 className="font-heading font-bold text-amber-400 text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Known Limitations & Trade-Offs (Cons)
          </h3>
          <ul className="space-y-2.5 text-xs text-atlas-textMuted">
            {tool.cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold shrink-0">⚠</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Practical Use Cases & Alternatives */}
      <div className="p-6 rounded-2xl bg-atlas-surface border border-atlas-border space-y-4">
        <h3 className="font-heading font-bold text-white text-base">Practical Use Cases</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tool.useCases.map((useCase, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-atlas-card border border-atlas-border text-xs text-atlas-textMuted font-mono"
            >
              {useCase}
            </div>
          ))}
        </div>

        {tool.alternatives.length > 0 && (
          <div className="pt-4 border-t border-atlas-border/50 flex items-center gap-2 text-xs font-mono">
            <span className="text-atlas-textMuted">Alternatives to explore:</span>
            {tool.alternatives.map((alt) => (
              <span
                key={alt}
                className="px-2 py-0.5 rounded bg-atlas-card border border-atlas-border text-atlas-cyan"
              >
                {alt}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
