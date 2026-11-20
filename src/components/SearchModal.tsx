"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, BookOpen, Wrench, Cpu, Terminal, FileText, Sparkles, ArrowRight } from "lucide-react";

interface SearchResultItem {
  type: "course" | "tool" | "model" | "prompt" | "term" | "project" | "news";
  title: string;
  description: string;
  url: string;
  badge?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const filteredResults = activeTab === "all"
    ? results
    : results.filter((r) => r.type === activeTab);

  const getIcon = (type: string) => {
    switch (type) {
      case "tool": return <Wrench className="w-4 h-4 text-atlas-blue" />;
      case "model": return <Cpu className="w-4 h-4 text-atlas-cyan" />;
      case "course": return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case "prompt": return <Sparkles className="w-4 h-4 text-atlas-violet" />;
      case "project": return <Terminal className="w-4 h-4 text-amber-400" />;
      default: return <FileText className="w-4 h-4 text-atlas-textMuted" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-atlas-card border border-atlas-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-atlas-border bg-atlas-surface/60">
          <Search className="w-5 h-5 text-atlas-cyan shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI concepts, tools, models, courses, prompts, or papers..."
            className="w-full bg-transparent text-white placeholder-atlas-textMuted text-base focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-atlas-textMuted hover:text-white mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono text-atlas-textMuted bg-atlas-surface border border-atlas-border rounded">
            ESC
          </kbd>
        </div>

        {/* Category Filter Tabs */}
        {results.length > 0 && (
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-atlas-border/50 bg-atlas-bg/40 text-xs overflow-x-auto">
            {["all", "tool", "model", "course", "prompt", "term", "project"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 rounded-md font-mono capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-atlas-blue text-white"
                    : "text-atlas-textMuted hover:bg-atlas-cardHover"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-1 divide-y divide-atlas-border/30">
          {loading && (
            <div className="py-12 text-center text-atlas-textMuted font-mono text-sm">
              <span className="inline-block animate-spin mr-2">⟳</span> Querying Knowledge Database...
            </div>
          )}

          {!loading && query && filteredResults.length === 0 && (
            <div className="py-12 text-center text-atlas-textMuted">
              <p className="text-sm">No knowledge entries found matching &ldquo;<span className="text-white">{query}</span>&rdquo;.</p>
              <p className="text-xs text-atlas-textFaint mt-1">Try searching for concepts like &ldquo;Transformer&rdquo;, &ldquo;Ollama&rdquo;, &ldquo;Claude&rdquo;, or &ldquo;RAG&rdquo;.</p>
            </div>
          )}

          {!loading && !query && (
            <div className="py-8 px-4 text-center">
              <p className="text-xs font-mono text-atlas-textMuted uppercase tracking-wider mb-3">Popular Discoveries</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Large Language Models", "Claude 3.5 Sonnet", "Ollama", "Prompt Builder", "RAG Systems", "AI Agents"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-lg bg-atlas-surface border border-atlas-border text-xs text-atlas-textMuted hover:text-white hover:border-atlas-blue transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && filteredResults.map((item, idx) => (
            <Link
              key={idx}
              href={item.url}
              onClick={onClose}
              className="group flex items-start gap-3 p-3 rounded-xl hover:bg-atlas-cardHover transition-colors cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-atlas-surface border border-atlas-border group-hover:border-atlas-blue/40 shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white group-hover:text-atlas-cyan transition-colors truncate">
                    {item.title}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-atlas-surface border border-atlas-border text-atlas-textMuted">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-atlas-textMuted line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-atlas-textMuted opacity-0 group-hover:opacity-100 group-hover:text-atlas-blue transition-all shrink-0 mt-2" />
            </Link>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-atlas-surface/80 border-t border-atlas-border flex items-center justify-between text-[11px] text-atlas-textMuted font-mono">
          <span>AI ATLAS Global Discovery Engine</span>
          <div className="flex items-center gap-3">
            <span>Navigate: <kbd className="text-white">↑</kbd> <kbd className="text-white">↓</kbd></span>
            <span>Select: <kbd className="text-white">↵</kbd></span>
          </div>
        </div>
      </div>
    </div>
  );
}
