"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  Shield,
  RotateCcw,
} from "lucide-react";
import { LevelBadge } from "@/components/LevelBadge";
import { useAtlasStore } from "@/lib/store";

interface Message {
  role: "user" | "assistant";
  text: string;
  provider?: string;
  model?: string;
  durationMs?: number;
}

function TutorContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "";

  const { user } = useAtlasStore();
  const [level, setLevel] = useState(user.level || "beginner");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: `Hello! I am the **AI ATLAS Tutor**. I specialize in breaking down complex Artificial Intelligence concepts into clear, actionable understanding.\n\nI am currently calibrated for **${level.toUpperCase()}** learners. What AI concept or system can I help you master today?`,
    },
  ]);
  const [inputQuery, setInputQuery] = useState(
    initialTopic ? `Can you explain ${initialTopic} with an intuitive analogy?` : ""
  );
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("gemini");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          level,
          provider: selectedProvider,
          contextTopic: initialTopic,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.text,
            provider: data.provider,
            model: data.model,
            durationMs: data.durationMs,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `⚠️ **Error:** ${data.error || "Failed to reach AI Tutor"}`,
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `⚠️ **Connection Error:** Could not contact server. ${err.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "What is the intuitive difference between weights and activations?",
    "Why does quantization (like 4-bit) save memory with minimal accuracy loss?",
    "How does RAG prevent hallucinations in corporate document search?",
    "What makes Multi-Head Attention superior to standard Recurrent Neural Networks?",
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 flex-1 flex flex-col h-[calc(100vh-120px)]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-atlas-border pb-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-atlas-violet/20 text-atlas-violet">
              <Bot className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-white">
              AI ATLAS Tutor
            </h1>
          </div>
          <p className="text-xs text-atlas-textMuted">
            Level-adaptive Socratic teaching assistant for Artificial Intelligence concepts.
          </p>
        </div>

        {/* Level & Provider Selector Controls */}
        <div className="flex items-center gap-3">
          {/* Level Switcher */}
          <div className="flex items-center gap-1 p-1 bg-atlas-surface border border-atlas-border rounded-xl text-xs font-mono">
            {(["beginner", "intermediate", "advanced", "expert"] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  level === lvl
                    ? "bg-atlas-blue text-white font-bold"
                    : "text-atlas-textMuted hover:text-white"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Provider Selector */}
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-2.5 py-1.5 bg-atlas-surface border border-atlas-border rounded-xl text-xs font-mono text-white focus:outline-none"
          >
            <option value="gemini">Google Gemini</option>
            <option value="openai">OpenAI GPT-4o</option>
            <option value="anthropic">Anthropic Claude</option>
            <option value="ollama">Local Ollama</option>
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-atlas-card border border-atlas-border">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-atlas-violet/20 border border-atlas-violet/40 text-atlas-violet flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-atlas-blue text-white rounded-tr-none font-medium"
                  : "bg-atlas-surface border border-atlas-border text-foreground/90 rounded-tl-none whitespace-pre-wrap"
              }`}
            >
              {msg.text}

              {msg.model && (
                <div className="mt-3 pt-2 border-t border-atlas-border/50 text-[10px] font-mono text-atlas-textFaint flex items-center justify-between">
                  <span>Inference: {msg.provider?.toUpperCase()} • {msg.model}</span>
                  {msg.durationMs && <span>{msg.durationMs}ms</span>}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs font-mono text-atlas-textMuted py-2">
            <div className="w-7 h-7 rounded-lg bg-atlas-violet/20 text-atlas-violet flex items-center justify-center animate-spin">
              ⟳
            </div>
            <span>AI Tutor formulating explanation tailored for {level.toUpperCase()} level...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sample Quick Questions */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 text-xs font-mono shrink-0">
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="px-3 py-1.5 rounded-xl bg-atlas-surface border border-atlas-border text-atlas-textMuted hover:text-white hover:border-atlas-cyan/50 text-left transition-colors"
            >
              &ldquo;{sq}&rdquo;
            </button>
          ))}
        </div>
      )}

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 p-1.5 rounded-2xl bg-atlas-card border border-atlas-border shrink-0 focus-within:border-atlas-blue transition-colors"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={`Ask the AI Tutor anything (Level: ${level.toUpperCase()})...`}
          className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-atlas-textMuted focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="p-2.5 rounded-xl bg-atlas-blue hover:bg-atlas-blue/90 disabled:opacity-40 text-white transition-all shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

export default function AITutorPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-atlas-textMuted font-mono">Loading AI Tutor...</div>}>
      <TutorContent />
    </Suspense>
  );
}
