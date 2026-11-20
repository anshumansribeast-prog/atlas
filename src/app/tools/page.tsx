"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AITool } from "@/lib/db/schema";
import {
  Wrench,
  Search,
  Filter,
  ShieldCheck,
  ExternalLink,
  PlusCircle,
  Star,
  Check,
  X,
  Bookmark,
} from "lucide-react";
import { useAtlasStore } from "@/lib/store";

// Categories come from PostgreSQL through /api/categories so the filter list can
// never drift away from what the catalog actually contains.
const DEFAULT_CATEGORIES = ["All"];

export default function ToolsDirectoryPage() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPricing, setSelectedPricing] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const { user, toggleBookmark } = useAtlasStore();

  // Submission Form State
  const [subName, setSubName] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subUrl, setSubUrl] = useState("");
  const [subDesc, setSubDesc] = useState("");
  const [subPricing, setSubPricing] = useState("Freemium");
  const [subSuccess, setSubSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/tools")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load tools");
        if (data.tools) setTools(data.tools);
        setLoadError(null);
      })
      .catch((err: Error) => setLoadError(err.message));
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        const names: string[] = (data.categories ?? []).map(
          (category: { name: string }) => category.name
        );
        if (names.length > 0) {
          setCategories(["All", ...names]);
          setSubCategory((current) => current || names[0]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleToolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: subName,
          category: subCategory,
          websiteUrl: subUrl,
          description: subDesc,
          pricingModel: subPricing,
        }),
      });
      if (res.ok) {
        setSubSuccess(true);
        setTimeout(() => {
          setIsSubmitModalOpen(false);
          setSubSuccess(false);
          setSubName("");
          setSubUrl("");
          setSubDesc("");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTools = tools.filter((tool) => {
    const matchesCategory =
      selectedCategory === "All" || tool.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesPricing =
      selectedPricing === "All" || tool.pricingModel.toLowerCase() === selectedPricing.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.capabilities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesPricing && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atlas-surface border border-atlas-border text-xs font-mono text-atlas-cyan">
            <Wrench className="w-3.5 h-3.5" />
            <span>Fact-Checked Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">
            AI Tools Discovery Directory
          </h1>
          <p className="text-sm text-atlas-textMuted leading-relaxed">
            Searchable, transparent database of artificial intelligence tools across {Math.max(categories.length - 1, 0)} structured categories. No sponsored placements. Genuine capabilities, pricing tiers, and honest trade-offs.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-atlas-blue hover:bg-atlas-blue/90 text-white text-xs font-mono shrink-0 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Suggest a Tool
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-atlas-textMuted absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, use-case, or capability (e.g., 'code', 'local', 'video')..."
              className="w-full pl-10 pr-4 py-2.5 bg-atlas-card border border-atlas-border rounded-xl text-sm text-white placeholder-atlas-textMuted focus:outline-none focus:border-atlas-cyan transition-colors"
            />
          </div>

          {/* Pricing Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-atlas-textMuted shrink-0 hidden sm:inline" />
            <select
              value={selectedPricing}
              onChange={(e) => setSelectedPricing(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 bg-atlas-card border border-atlas-border rounded-xl text-xs font-mono text-white focus:outline-none focus:border-atlas-cyan"
            >
              <option value="All">All Pricing Models</option>
              <option value="Free">Free</option>
              <option value="Freemium">Freemium</option>
              <option value="Paid">Paid Only</option>
              <option value="Open Source">Open Source</option>
            </select>
          </div>
        </div>

        {/* 17 Category Tabs (Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-atlas-blue text-white shadow-sm font-semibold"
                  : "bg-atlas-surface border border-atlas-border text-atlas-textMuted hover:text-white hover:border-atlas-blue/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const isBookmarked = user.bookmarks.includes(tool.id);
          return (
            <div
              key={tool.id}
              className="group p-6 rounded-2xl bg-atlas-card border border-atlas-border hover:border-atlas-blue/50 transition-all flex flex-col justify-between hover:bg-atlas-cardHover relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-atlas-surface border border-atlas-border text-atlas-cyan">
                    {tool.category}
                  </span>

                  <div className="flex items-center gap-2">
                    {tool.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400" title={`Verified on ${tool.lastVerifiedDate}`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                    <button
                      onClick={() => toggleBookmark(tool.id)}
                      className={`p-1 rounded-md hover:bg-atlas-surface transition-colors ${
                        isBookmarked ? "text-amber-400" : "text-atlas-textFaint hover:text-white"
                      }`}
                      title={isBookmarked ? "Remove Bookmark" : "Save Tool"}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-heading font-bold text-white group-hover:text-atlas-cyan transition-colors flex items-center justify-between">
                    <Link href={`/tools/${tool.slug}`} className="hover:underline">
                      {tool.name}
                    </Link>
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-atlas-textMuted hover:text-white"
                      title="Open Official Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </h3>
                  <p className="text-xs text-atlas-textMuted mt-1 line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                {/* Capabilities Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tool.capabilities.slice(0, 3).map((cap, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-atlas-surface border border-atlas-border/50 text-atlas-textMuted"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-atlas-border/60 mt-5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-white font-medium">{tool.pricingModel}</span>
                  <span className="text-atlas-border">â€¢</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{tool.rating}</span>
                  </div>
                </div>

                <Link
                  href={`/tools/${tool.slug}`}
                  className="font-mono text-atlas-cyan group-hover:underline text-xs"
                >
                  Full Profile â†’
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-16 text-atlas-textMuted space-y-2">
          <p className="text-base">No AI tools matched your filter criteria.</p>
          <p className="text-xs text-atlas-textFaint">Try switching category or clearing the search query.</p>
        </div>
      )}

      {/* Suggest a Tool Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-atlas-card border border-atlas-border rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-atlas-border/60 pb-3">
              <h3 className="font-heading font-bold text-lg text-white">Suggest an AI Tool</h3>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-atlas-textMuted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {subSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-bold text-white text-base">Submission Received</h4>
                <p className="text-xs text-atlas-textMuted">
                  Thank you! Your suggestion has been queued for editorial verification and fact-checking.
                </p>
              </div>
            ) : (
              <form onSubmit={handleToolSubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-atlas-textMuted mb-1">Tool Name *</label>
                  <input
                    type="text"
                    required
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    placeholder="e.g. Cursor"
                    className="w-full px-3 py-2 bg-atlas-surface border border-atlas-border rounded-xl text-white focus:outline-none focus:border-atlas-cyan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-atlas-textMuted mb-1">Category *</label>
                    <select
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-atlas-surface border border-atlas-border rounded-xl text-white focus:outline-none"
                    >
                      {categories.slice(1).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-atlas-textMuted mb-1">Pricing Model *</label>
                    <select
                      value={subPricing}
                      onChange={(e) => setSubPricing(e.target.value)}
                      className="w-full px-3 py-2 bg-atlas-surface border border-atlas-border rounded-xl text-white focus:outline-none"
                    >
                      <option value="Free">Free</option>
                      <option value="Freemium">Freemium</option>
                      <option value="Paid">Paid</option>
                      <option value="Open Source">Open Source</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-atlas-textMuted mb-1">Official Website URL *</label>
                  <input
                    type="url"
                    required
                    value={subUrl}
                    onChange={(e) => setSubUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-atlas-surface border border-atlas-border rounded-xl text-white focus:outline-none focus:border-atlas-cyan"
                  />
                </div>

                <div>
                  <label className="block text-atlas-textMuted mb-1">Description & Capabilities *</label>
                  <textarea
                    required
                    rows={3}
                    value={subDesc}
                    onChange={(e) => setSubDesc(e.target.value)}
                    placeholder="What does this AI tool do, and who is it for?"
                    className="w-full px-3 py-2 bg-atlas-surface border border-atlas-border rounded-xl text-white focus:outline-none focus:border-atlas-cyan"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-atlas-surface hover:bg-atlas-card border border-atlas-border text-atlas-textMuted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-atlas-blue hover:bg-atlas-blue/90 text-white font-semibold shadow-sm"
                  >
                    Submit for Fact-Checking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
