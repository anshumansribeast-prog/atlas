import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { LevelBadge } from "@/components/LevelBadge";
import {
  Terminal,
  Code2,
  Clock,
  Layers,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Database,
  Cpu,
} from "lucide-react";

export const metadata = {
  title: "AI Development Lab — AI ATLAS",
  description: "Practical engineering blueprints, vector database pipelines, and full-stack AI implementations.",
};

export default function DevLabPage() {
  const projects = db.getProjects();

  const developerTracks = [
    {
      title: "Retrieval-Augmented Generation (RAG)",
      desc: "Chunking strategies, dense vs sparse vector search, re-ranking with Cohere, and preventing context hallucinations.",
      tags: ["Vector DB", "Embeddings", "pgvector"],
    },
    {
      title: "Model Fine-Tuning & LoRA",
      desc: "Parameter-Efficient Fine-Tuning (PEFT), Low-Rank Adaptation (LoRA), QLoRA 4-bit quantization, and dataset curation.",
      tags: ["PyTorch", "Hugging Face", "LoRA"],
    },
    {
      title: "Structured Outputs & Function Calling",
      desc: "Ensuring LLMs reliably return valid JSON adhering strictly to Zod or Pydantic schemas without regex crashes.",
      tags: ["JSON Schema", "Zod", "Type Safety"],
    },
    {
      title: "AI Application Security & Guardrails",
      desc: "Preventing prompt injection, jailbreaks, data exfiltration, and enforcing rate-limiting token buckets.",
      tags: ["OWASP Top 10 for LLMs", "Llama Guard", "Security"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atlas-surface border border-atlas-border text-xs font-mono text-amber-400">
          <Terminal className="w-3.5 h-3.5" />
          <span>Full-Stack AI Engineering</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">
          AI Development Lab
        </h1>
        <p className="text-base text-atlas-textMuted leading-relaxed">
          Production blueprints for software developers. Learn how to ingest documents, generate embeddings, build low-latency RAG systems, and ship secure AI-native applications.
        </p>
      </div>

      {/* Developer Engineering Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {developerTracks.map((track, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-atlas-card border border-atlas-border space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <h3 className="text-base font-heading font-bold text-white">{track.title}</h3>
              <p className="text-xs text-atlas-textMuted leading-relaxed">{track.desc}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {track.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-atlas-surface border border-atlas-border text-atlas-cyan"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Practical Projects with Code Snippets */}
      <div className="space-y-6">
        <h2 className="text-2xl font-heading font-bold text-white">
          Practical Hands-On Projects
        </h2>

        <div className="space-y-8">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-6 sm:p-8 rounded-3xl bg-atlas-card border border-atlas-border space-y-6"
            >
              {/* Project Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-atlas-border/60 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <LevelBadge level={proj.difficulty} />
                    <span className="text-xs font-mono text-atlas-textFaint flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {proj.estimatedMinutes} Minutes
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-atlas-textMuted">{proj.description}</p>
                </div>
              </div>

              {/* Tools & Prerequisites */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-atlas-surface border border-atlas-border space-y-1">
                  <span className="text-atlas-cyan font-bold">Required Tools:</span>
                  <div className="text-atlas-textMuted">{proj.toolsNeeded.join(" • ")}</div>
                </div>
                <div className="p-4 rounded-xl bg-atlas-surface border border-atlas-border space-y-1">
                  <span className="text-amber-400 font-bold">Prerequisites:</span>
                  <div className="text-atlas-textMuted">{proj.prerequisites.join(" • ")}</div>
                </div>
              </div>

              {/* Step by Step Walkthrough */}
              <div className="space-y-4">
                <h4 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                  Implementation Steps
                </h4>

                {proj.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-5 rounded-2xl bg-atlas-surface border border-atlas-border space-y-3 text-xs"
                  >
                    <div className="flex items-center gap-2 text-atlas-cyan font-mono font-bold">
                      <span className="w-5 h-5 rounded-full bg-atlas-blue/20 flex items-center justify-center text-[10px]">
                        {step.stepNumber}
                      </span>
                      <span>{step.title}</span>
                    </div>

                    <p className="text-atlas-textMuted leading-relaxed">
                      {step.instructionsMarkdown}
                    </p>

                    {step.codeSnippet && (
                      <div className="p-3 rounded-xl bg-atlas-bg border border-atlas-border font-mono text-[11px] overflow-x-auto text-emerald-300">
                        <pre>{step.codeSnippet}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Expected Result & Troubleshooting */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Expected Outcome
                  </span>
                  <p className="text-atlas-textMuted">{proj.expectedOutcome}</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Troubleshooting & Watch-outs
                  </span>
                  <ul className="list-disc pl-4 text-atlas-textMuted space-y-1">
                    {proj.troubleshootingTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
