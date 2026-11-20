"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Play,
  RotateCcw,
  Sparkles,
  Cpu,
  Layers,
  Terminal,
  Clock,
  CheckCircle,
} from "lucide-react";

function PlaygroundContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";

  const [prompt, setPrompt] = useState(
    initialPrompt ||
      "Explain the key architectural difference between Llama 3.1 and Claude 3.5 Sonnet in 3 concise bullet points."
  );
  const [provider, setProvider] = useState("gemini");
  const [model, setModel] = useState("gemini-1.5-flash");
  const [temperature, setTemperature] = useState(0.7);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<{ durationMs?: number; tokens?: number }>({});

  const handleExecute = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: prompt,
          provider,
          level: "advanced",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOutput(data.text);
        setMeta({ durationMs: data.durationMs, tokens: data.tokensUsed?.total });
      } else {
        setOutput(`⚠️ Error: ${data.error || "Failed to execute prompt"}`);
      }
    } catch (err: any) {
      setOutput(`⚠️ Connection Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sampleExperiments = [
    {
      title: "Structured JSON Output",
      prompt: "Extract entities (name, role, company) from: 'Ada Lovelace served as mathematician and computing pioneer collaborating with Charles Babbage at the Analytical Engine project.' Format strictly as valid JSON.",
    },
    {
      title: "Agent Reasoning Trace (ReAct)",
      prompt: "Plan the step-by-step actions required for an autonomous AI agent to audit an open-source repository for security vulnerabilities.",
    },
    {
      title: "Socratic Coding Review",
      prompt: "Review this TypeScript function for race conditions: async function fetchUser() { let data = null; await timeout(500); return data; }",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atlas-surface border border-atlas-border text-xs font-mono text-atlas-cyan">
          <Terminal className="w-3.5 h-3.5" />
          <span>Interactive Execution Environment</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">
          AI Playground
        </h1>
        <p className="text-sm text-atlas-textMuted leading-relaxed">
          Test prompt variations, evaluate temperature parameters, and observe model inferences in real-time.
        </p>
      </div>

      {/* Main Two-Column Experimental Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input & Parameter Controls */}
        <div className="p-6 rounded-3xl bg-atlas-card border border-atlas-border space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-atlas-border/60 pb-3">
              <span className="font-heading font-bold text-white text-base">Prompt Input</span>
              <div className="flex items-center gap-2 text-xs font-mono">
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="px-2.5 py-1 bg-atlas-surface border border-atlas-border rounded-lg text-white focus:outline-none"
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="ollama">Local Ollama</option>
                </select>
              </div>
            </div>

            <textarea
              rows={8}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your system prompt or user instructions..."
              className="w-full p-4 rounded-2xl bg-atlas-surface border border-atlas-border text-white text-xs font-mono focus:outline-none focus:border-atlas-cyan leading-relaxed resize-y"
            />

            {/* Hyperparameter Slider */}
            <div className="space-y-2 pt-2 text-xs font-mono">
              <div className="flex justify-between text-atlas-textMuted">
                <span>Temperature (Creativity vs Determinism):</span>
                <span className="text-white font-bold">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-atlas-blue bg-atlas-surface h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-atlas-textFaint">
                <span>0.0 (Strict / Code)</span>
                <span>0.7 (Balanced)</span>
                <span>1.0 (Creative)</span>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-atlas-textFaint block">
                Load Experiment Preset:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleExperiments.map((exp, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(exp.prompt)}
                    className="px-2.5 py-1 rounded-lg bg-atlas-surface border border-atlas-border text-[11px] font-mono text-atlas-textMuted hover:text-white hover:border-atlas-cyan/50"
                  >
                    {exp.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleExecute}
            disabled={loading || !prompt.trim()}
            className="w-full py-3 rounded-xl bg-atlas-blue hover:bg-atlas-blue/90 disabled:opacity-50 text-white font-medium text-xs font-mono flex items-center justify-center gap-2 shadow-atlas-glow transition-all"
          >
            {loading ? (
              <>
                <span className="animate-spin">⟳</span>
                <span>Running Inference Gateway...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Prompt</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Model Output Panel */}
        <div className="p-6 rounded-3xl bg-atlas-card border border-atlas-border space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-atlas-border/60 pb-3">
              <span className="font-heading font-bold text-white text-base">Inference Output</span>
              {meta.durationMs && (
                <div className="flex items-center gap-3 text-[11px] font-mono text-atlas-textFaint">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Clock className="w-3 h-3" /> {meta.durationMs}ms
                  </span>
                  {meta.tokens && <span>{meta.tokens} tokens</span>}
                </div>
              )}
            </div>

            <div className="min-h-[300px] max-h-[500px] overflow-y-auto p-4 rounded-2xl bg-atlas-surface border border-atlas-border text-xs leading-relaxed font-mono whitespace-pre-wrap text-foreground/90">
              {output ? (
                output
              ) : (
                <div className="text-center py-20 text-atlas-textFaint">
                  Run an experiment to observe model generation and latency benchmarks.
                </div>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-atlas-surface border border-atlas-border/60 text-[11px] font-mono text-atlas-textMuted flex items-center justify-between">
            <span>Provider: {provider.toUpperCase()}</span>
            <span>Real-time Output</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-atlas-textMuted font-mono">Loading AI Playground...</div>}>
      <PlaygroundContent />
    </Suspense>
  );
}
