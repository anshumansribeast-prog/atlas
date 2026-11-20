"use client";

import React, { useState } from "react";
import { db } from "@/lib/db";
import { AIModel } from "@/lib/db/schema";
import {
  Cpu,
  Layers,
  ExternalLink,
  ShieldCheck,
  Check,
  Lock,
  Unlock,
  Search,
  Filter,
} from "lucide-react";

export default function ModelsPage() {
  const models = db.getModels();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredModels = models.filter((m) => {
    const matchesOpen =
      selectedFilter === "All"
        ? true
        : selectedFilter === "Open"
        ? m.isOpenWeights
        : !m.isOpenWeights;

    const matchesSearch =
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesOpen && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atlas-surface border border-atlas-border text-xs font-mono text-atlas-cyan">
          <Cpu className="w-3.5 h-3.5" />
          <span>Foundation Models & Benchmarks</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">
          AI Models & Research Database
        </h1>
        <p className="text-base text-atlas-textMuted leading-relaxed">
          Structured specifications for frontier foundation models. Verified context windows, architectural weights, open-weights availability, and empirical benchmarks.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Open Weights Filter Tabs */}
        <div className="p-1 rounded-xl bg-atlas-surface border border-atlas-border inline-flex items-center gap-1 w-full sm:w-auto">
          {(["All", "Open", "Closed"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                selectedFilter === filter
                  ? "bg-atlas-blue text-white font-semibold"
                  : "text-atlas-textMuted hover:text-white"
              }`}
            >
              {filter === "All" ? "All Models" : filter === "Open" ? "Open Weights Only" : "Proprietary API"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-atlas-textMuted absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search model or org..."
            className="w-full pl-9 pr-3 py-2 bg-atlas-card border border-atlas-border rounded-xl text-xs text-white placeholder-atlas-textMuted focus:outline-none focus:border-atlas-cyan"
          />
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredModels.map((model) => (
          <div
            key={model.id}
            id={model.slug}
            className="p-6 sm:p-8 rounded-3xl bg-atlas-card border border-atlas-border hover:border-atlas-cyan/50 transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-atlas-surface border border-atlas-border text-atlas-cyan">
                    {model.category}
                  </span>
                  <span className="text-xs font-mono text-atlas-textFaint">
                    {model.organization}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono">
                  {model.isOpenWeights ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Unlock className="w-3.5 h-3.5" /> Open Weights
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-atlas-textFaint">
                      <Lock className="w-3.5 h-3.5" /> Proprietary API
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-heading font-bold text-white flex items-center justify-between">
                  {model.name}
                  <a
                    href={model.officialDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-atlas-textMuted hover:text-white"
                    title="Official Research & Docs"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </h3>
                <p className="text-xs text-atlas-textMuted mt-1 leading-relaxed">
                  {model.description}
                </p>
              </div>

              {/* Specs & Architecture */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-atlas-surface border border-atlas-border/80">
                  <span className="text-atlas-textFaint block">Context Window:</span>
                  <span className="text-white font-semibold">{model.contextWindow}</span>
                </div>
                <div className="p-3 rounded-xl bg-atlas-surface border border-atlas-border/80">
                  <span className="text-atlas-textFaint block">License:</span>
                  <span className="text-white font-semibold truncate block">{model.license}</span>
                </div>
              </div>

              {/* Verified Benchmarks */}
              {model.benchmarks && Object.keys(model.benchmarks).length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-mono text-atlas-cyan uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Empirical Benchmarks
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(model.benchmarks).map(([metric, score]) => (
                      <div
                        key={metric}
                        className="p-2.5 rounded-xl bg-atlas-surface border border-atlas-border text-center"
                      >
                        <div className="text-base font-heading font-bold text-white">{score}</div>
                        <div className="text-[10px] font-mono text-atlas-textFaint truncate">{metric}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Known Limitations */}
              {model.limitations && model.limitations.length > 0 && (
                <div className="p-3 rounded-xl bg-atlas-surface/60 border border-atlas-border/60 text-xs text-atlas-textMuted">
                  <span className="text-amber-400 font-mono font-semibold block mb-1">
                    Known Limitations:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    {model.limitations.map((lim, i) => (
                      <li key={i}>{lim}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-atlas-border/60 flex items-center justify-between text-xs font-mono">
              <span className="text-atlas-textFaint">Release Date: {model.releaseDate}</span>
              <a
                href={model.officialDocUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-atlas-cyan hover:underline flex items-center gap-1"
              >
                Official Technical Specs →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
