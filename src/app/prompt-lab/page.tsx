"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PromptTemplate } from "@/lib/db/schema";
import {
  Sparkles,
  Copy,
  Check,
  ThumbsUp,
  PlusCircle,
  Play,
  Bookmark,
  Filter,
  Terminal,
} from "lucide-react";
import { useAtlasStore } from "@/lib/store";

export default function PromptLabPage() {
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 5-field Interactive Prompt Builder State
  const [objective, setObjective] = useState("Debug and optimize a React useEffect memory leak");
  const [context, setContext] = useState("High-throughput Next.js application polling websockets");
  const [instructions, setInstructions] = useState("Identify uncleaned event listeners, verify dependency arrays, and rewrite cleanly.");
  const [constraints, setConstraints] = useState("TypeScript only. Do not remove essential cleanup callbacks. Keep comments concise.");
  const [outputFormat, setOutputFormat] = useState("Markdown with exact diff comparison and brief explanation.");
  const [builderCopied, setBuilderCopied] = useState(false);

  // New Prompt Submission Modal State
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Coding & Architecture");
  const [newObjective, setNewObjective] = useState("");
  const [newTemplate, setNewTemplate] = useState("");

  const { user, toggleBookmark } = useAtlasStore();

  useEffect(() => {
    fetch("/api/prompts")
      .then((res) => res.json())
      .then((data) => {
        if (data.prompts) setPrompts(data.prompts);
      })
      .catch((err) => console.error(err));
  }, []);

  const generatedPrompt = `[OBJECTIVE]:
${objective}

[CONTEXT]:
${context}

[DETAILED INSTRUCTIONS]:
${instructions}

[CONSTRAINTS & RULES]:
${constraints}

[DESIRED OUTPUT FORMAT]:
${outputFormat}`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    if (id === "builder") {
      setBuilderCopied(true);
      setTimeout(() => setBuilderCopied(false), 2000);
    } else {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upvote", id }),
      });
      if (res.ok) {
        const data = await res.json();
        setPrompts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, upvotes: data.upvotes } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: {
            title: newTitle,
            category: newCategory,
            objective: newObjective,
            fullTemplate: newTemplate,
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.prompt) setPrompts([data.prompt, ...prompts]);
        setIsSubmitOpen(false);
        setNewTitle("");
        setNewObjective("");
        setNewTemplate("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ["All", ...Array.from(new Set(prompts.map((p) => p.category)))];

  const filteredPrompts =
    selectedCategory === "All"
      ? prompts
      : prompts.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atlas-surface border border-atlas-border text-xs font-mono text-atlas-violet">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Prompt Engineering Suite</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">
          Prompt Engineering Lab
        </h1>
        <p className="text-sm text-atlas-textMuted leading-relaxed">
          Master the discipline of structured prompting. Move beyond vague conversational chats to deterministic, reproducible, multi-constraint instructions that get frontier models to do exactly what you want.
        </p>
      </div>

      {/* SECTION 1: 5-FIELD INTERACTIVE PROMPT BUILDER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-atlas-card border border-atlas-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-atlas-border/60 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-atlas-cyan" />
              5-Field Structured Prompt Architect
            </h2>
            <p className="text-xs text-atlas-textMuted mt-1">
              Construct high-performance prompts adhering to the Objective-Context-Instruction-Constraint-Format protocol.
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(generatedPrompt, "builder")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-atlas-blue hover:bg-atlas-blue/90 text-white text-xs font-mono transition-all shrink-0 shadow-sm"
          >
            {builderCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {builderCopied ? "Copied Prompt!" : "Copy Generated Prompt"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs Column */}
          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-white font-medium mb-1">
                1. Primary Objective (Goal)
              </label>
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full px-3 py-2 bg-atlas-surface border border-atlas-border rounded-xl text-white focus:outline-none focus:border-atlas-cyan"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-1">
                2. Operational Context (Background / Environment)
              </label>
              <textarea
                rows={2}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full px-3 py-2 bg-atlas-surface border border-atlas-border rounded-xl text-white focus:outline-none focus:border-atlas-cyan"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-1">
                3. Step-by-Step Instructions
              </label>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3 py-2 bg-atlas-surface border border-atlas-border rounded-xl text-white focus:outline-none focus:border-atlas-cyan"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-white font-medium mb-1">
                  4. Constraints & Rules
                </label>
                <textarea
                  rows={2}
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  className="w-full px-3 py-2 bg-atlas-surface border border-atlas-border rounded-xl text-white focus:outline-none focus:border-atlas-cyan"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-1">
                  5. Desired Output Format
                </label>
                <textarea
                  rows={2}
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full px-3 py-2 bg-atlas-surface border border-atlas-border rounded-xl text-white focus:outline-none focus:border-atlas-cyan"
                />
              </div>
            </div>
          </div>

          {/* Real-Time Generated Preview */}
          <div className="flex flex-col justify-between p-5 rounded-2xl bg-atlas-surface border border-atlas-border font-mono text-xs space-y-4">
            <div className="space-y-2">
              <div className="text-atlas-cyan font-semibold uppercase tracking-wider flex items-center justify-between">
                <span>Output Prompt String</span>
                <span className="text-[10px] text-atlas-textFaint">Ready for Playground</span>
              </div>
              <pre className="text-atlas-textMuted whitespace-pre-wrap font-mono text-[11px] leading-relaxed max-h-72 overflow-y-auto p-3 rounded-xl bg-atlas-bg border border-atlas-border/50">
                {generatedPrompt}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-atlas-textFaint">
                Length: ~{Math.ceil(generatedPrompt.length / 4)} tokens
              </span>
              <Link
                href={`/playground?prompt=${encodeURIComponent(generatedPrompt)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-atlas-violet hover:bg-atlas-violet/90 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                Test in AI Playground
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: CURATED PROMPT LIBRARY */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">
              Curated Prompt Library
            </h2>
            <p className="text-xs text-atlas-textMuted mt-1">
              Battle-tested prompt templates for software engineering, learning, and structured data pipelines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-atlas-surface border border-atlas-border hover:text-white text-atlas-textMuted text-xs font-mono transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-atlas-cyan" />
              Add Custom Prompt
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-atlas-violet text-white font-semibold"
                  : "bg-atlas-surface border border-atlas-border text-atlas-textMuted hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Prompts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((p) => {
            const isCopied = copiedId === p.id;
            const isBookmarked = user.bookmarks.includes(p.id);

            return (
              <div
                key={p.id}
                className="p-6 rounded-2xl bg-atlas-card border border-atlas-border hover:border-atlas-violet/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-atlas-surface border border-atlas-border text-atlas-violet">
                      {p.category}
                    </span>
                    <button
                      onClick={() => toggleBookmark(p.id)}
                      className={`p-1 rounded hover:bg-atlas-surface ${
                        isBookmarked ? "text-amber-400" : "text-atlas-textFaint"
                      }`}
                      title="Bookmark"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  <h3 className="text-base font-heading font-bold text-white">{p.title}</h3>
                  <p className="text-xs text-atlas-textMuted line-clamp-3">
                    {p.objective}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-atlas-surface text-atlas-textMuted"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-atlas-border/50 flex items-center justify-between text-xs font-mono">
                  <button
                    onClick={() => handleUpvote(p.id)}
                    className="flex items-center gap-1.5 text-atlas-textMuted hover:text-atlas-cyan transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{p.upvotes}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/playground?prompt=${encodeURIComponent(p.fullTemplate)}`}
                      className="px-2.5 py-1 rounded-lg bg-atlas-surface hover:bg-atlas-card border border-atlas-border text-white text-[11px]"
                      title="Test Prompt in Playground"
                    >
                      Test
                    </Link>
                    <button
                      onClick={() => copyToClipboard(p.fullTemplate, p.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-atlas-blue hover:bg-atlas-blue/90 text-white text-[11px]"
                    >
                      {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {isCopied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Prompt Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-atlas-card border border-atlas-border rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-heading font-bold text-lg text-white">Submit Custom Prompt</h3>
            <form onSubmit={handleCreatePrompt} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-atlas-textMuted mb-1">Prompt Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Production Dockerfile Optimizer"
                  className="w-full px-3 py-2 bg-atlas-surface border border-atlas-border rounded-xl text-white focus:outline-none focus:border-atlas-cyan"
                />
              </div>

              <div>
                <label className="block text-atlas-textMuted mb-1">Objective *</label>
                <input
                  type="text"
                  required
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="What is this prompt designed to accomplish?"
                  className="w-full px-3 py-2 bg-atlas-surface border border-atlas-border rounded-xl text-white focus:outline-none focus:border-atlas-cyan"
                />
              </div>

              <div>
                <label className="block text-atlas-textMuted mb-1">Full Prompt Template *</label>
                <textarea
                  required
                  rows={5}
                  value={newTemplate}
                  onChange={(e) => setNewTemplate(e.target.value)}
                  placeholder="Paste the full prompt instructions here..."
                  className="w-full px-3 py-2 bg-atlas-surface border border-atlas-border rounded-xl text-white focus:outline-none focus:border-atlas-cyan"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitOpen(false)}
                  className="px-4 py-2 rounded-xl bg-atlas-surface hover:bg-atlas-card text-atlas-textMuted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-atlas-violet hover:bg-atlas-violet/90 text-white font-semibold shadow-sm"
                >
                  Save Prompt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
