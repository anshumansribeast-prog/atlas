"use client";

import React, { useState } from "react";
import { db } from "@/lib/db";
import {
  BookA,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export default function DictionaryPage() {
  const terms = db.getGlossary();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTerm, setSelectedTerm] = useState(terms[0] || null);

  const filteredTerms = terms.filter(
    (t) =>
      !searchQuery ||
      t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.beginnerDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atlas-surface border border-atlas-border text-xs font-mono text-atlas-cyan">
          <BookA className="w-3.5 h-3.5" />
          <span>Dual-Level AI Glossary</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">
          AI Dictionary
        </h1>
        <p className="text-base text-atlas-textMuted leading-relaxed">
          Demystifying machine learning terminology. Every definition provides both an intuitive analogy for beginners and a mathematically rigorous technical explanation for engineers.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl">
        <Search className="w-4 h-4 text-atlas-textMuted absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search glossary (e.g., 'Transformer', 'Quantization', 'RAG')..."
          className="w-full pl-10 pr-4 py-3 bg-atlas-card border border-atlas-border rounded-xl text-sm text-white placeholder-atlas-textMuted focus:outline-none focus:border-atlas-cyan"
        />
      </div>

      {/* Dual Layout: Term List & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Term List */}
        <div className="space-y-2">
          {filteredTerms.map((term) => (
            <button
              key={term.id}
              id={term.slug}
              onClick={() => setSelectedTerm(term)}
              className={`w-full text-left p-4 rounded-2xl border text-xs transition-all flex items-center justify-between ${
                selectedTerm?.id === term.id
                  ? "bg-atlas-blue/20 border-atlas-blue text-white font-semibold"
                  : "bg-atlas-card border-atlas-border text-atlas-textMuted hover:bg-atlas-cardHover hover:text-white"
              }`}
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-atlas-cyan block">
                  {term.category}
                </span>
                <span className="text-sm font-heading font-bold text-white mt-0.5 block">
                  {term.term}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-50 shrink-0" />
            </button>
          ))}

          {filteredTerms.length === 0 && (
            <div className="p-8 text-center text-xs text-atlas-textMuted">
              No matching terms found.
            </div>
          )}
        </div>

        {/* Selected Term Detail Card */}
        {selectedTerm && (
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-atlas-card border border-atlas-border space-y-6">
            <div className="border-b border-atlas-border/60 pb-4">
              <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-atlas-surface border border-atlas-border text-atlas-cyan">
                {selectedTerm.category}
              </span>
              <h2 className="text-3xl font-heading font-bold text-white mt-2">
                {selectedTerm.term}
              </h2>
            </div>

            {/* Beginner Definition */}
            <div className="p-5 rounded-2xl bg-atlas-surface border border-atlas-border space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Beginner Intuition
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {selectedTerm.beginnerDefinition}
              </p>
            </div>

            {/* Advanced Technical Definition */}
            <div className="p-5 rounded-2xl bg-atlas-surface border border-atlas-border space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-atlas-violet font-bold uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                Advanced Technical Definition
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {selectedTerm.advancedDefinition}
              </p>
            </div>

            {/* Practical Real-World Example */}
            <div className="p-5 rounded-2xl bg-atlas-bg border border-atlas-border/60 space-y-2 text-xs font-mono">
              <span className="text-amber-400 font-bold uppercase tracking-wider block">
                Practical Real-World Example:
              </span>
              <p className="text-atlas-textMuted leading-relaxed">
                {selectedTerm.practicalExample}
              </p>
            </div>

            {/* Related Terms */}
            {selectedTerm.relatedTerms && selectedTerm.relatedTerms.length > 0 && (
              <div className="flex items-center gap-2 text-xs font-mono pt-2">
                <span className="text-atlas-textFaint">Related Concepts:</span>
                {selectedTerm.relatedTerms.map((rt) => (
                  <span
                    key={rt}
                    className="px-2 py-0.5 rounded bg-atlas-surface border border-atlas-border text-atlas-cyan"
                  >
                    {rt}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
