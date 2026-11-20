"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LevelBadge } from "@/components/LevelBadge";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Brain,
  Lightbulb,
  FileCode,
  Sparkles,
  HelpCircle,
  Bot,
} from "lucide-react";

export default function FundamentalDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "what-is-ai";
  const [activeTab, setActiveTab] = useState("intuitive");

  // Quiz interactive state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const contentMap: Record<
    string,
    {
      title: string;
      level: "beginner" | "intermediate" | "advanced";
      readTime: string;
      intuitive: string[];
      technical: string[];
      diagramTitle: string;
      diagramSteps: { step: string; desc: string }[];
      terminology: { term: string; def: string }[];
      quiz: { q: string; opts: string[]; correct: number; exp: string }[];
    }
  > = {
    "what-is-ai": {
      title: "What is Artificial Intelligence? (Beyond the Hype)",
      level: "beginner",
      readTime: "8 min",
      intuitive: [
        "In regular computer programming, a human software engineer sits down and writes every single rule explicitly. If an unexpected case happens, the computer fails.",
        "In Artificial Intelligence and Machine Learning, we don't write the rules. Instead, we show the computer thousands or millions of examples (data), and the algorithm automatically discovers the underlying patterns and mathematical rules on its own.",
        "Every single AI in the world today is 'Narrow AI' (ANI)—specialized in specific tasks like playing chess, recognizing faces, or translating speech. True human-level general intelligence (AGI) remains an active research frontier.",
      ],
      technical: [
        "Machine Learning models are parameterized mathematical functions f(x; θ) mapping an input vector x ∈ ℝⁿ to an output space y. Learning consists of finding parameter weights θ* that minimize empirical risk L(θ) over a dataset.",
        "Optimization utilizes gradient-based methods (Stochastic Gradient Descent, AdamW) computing the partial derivatives ∂L/∂θ via the chain rule (backpropagation).",
        "The model's capacity must be carefully calibrated against sample complexity to avoid overfitting (high variance) or underfitting (high bias).",
      ],
      diagramTitle: "Traditional Software vs. Machine Learning Paradigm",
      diagramSteps: [
        { step: "Traditional Code", desc: "Inputs + Hand-Written Rules (Logic) ➔ Explicit Outputs" },
        { step: "Machine Learning", desc: "Inputs + Historical Target Outputs (Data) ➔ Learned Predictive Model (Weights)" },
        { step: "Inference Phase", desc: "New Unseen Data + Learned Model ➔ Real-Time Probabilistic Predictions" },
      ],
      terminology: [
        { term: "Narrow AI (ANI)", def: "AI systems designed and optimized for a single dedicated domain (e.g., GPT-4, self-driving vision)." },
        { term: "General AI (AGI)", def: "A hypothetical autonomous system capable of mastering any intellectual task a human can perform." },
        { term: "Supervised Learning", def: "Training an algorithm using labeled pairs of input data and ground-truth answers." },
      ],
      quiz: [
        {
          q: "What fundamentally separates modern Machine Learning from standard computer programming?",
          opts: [
            "ML requires quantum supercomputers to boot",
            "ML models learn parameters from training data instead of humans hand-writing every explicit rule",
            "ML can only process English words",
            "ML does not require mathematics"
          ],
          correct: 1,
          exp: "Machine learning replaces manually programmed if-else rules with algorithms that infer mathematical weights from empirical data."
        },
        {
          q: "Which classification describes all AI tools currently active in the real world today?",
          opts: [
            "Artificial General Intelligence (AGI)",
            "Artificial Superintelligence (ASI)",
            "Artificial Narrow Intelligence (ANI)",
            "Sentient Silicon Systems"
          ],
          correct: 2,
          exp: "All commercial systems today—including LLMs and autonomous vehicles—are Narrow AI (ANI) trained on specific operational domains."
        }
      ]
    },
    "how-llms-work": {
      title: "How Large Language Models (LLMs) Actually Work",
      level: "beginner",
      readTime: "11 min",
      intuitive: [
        "Think of an LLM as the ultimate autocomplete engine. When you type on your smartphone, it suggests the next word based on common phrases. An LLM does this, but scaled to trillions of words from books, code, and dialogues.",
        "To a computer, words don't exist—only numbers. Text is chopped into small fragments called 'tokens' (about 4 letters each). Each token is converted into a list of numbers called an 'embedding' that places similar concepts close together in mathematical space (e.g., 'king' and 'queen').",
        "The secret sauce is the Transformer's 'Attention' mechanism. While reading a word, the model calculates how much attention it should pay to every other word in your paragraph.",
      ],
      technical: [
        "LLMs are autoregressive decoder-only transformer architectures trained on next-token prediction: maximizing the log-likelihood ∑ log P(w_t | w_<t; θ).",
        "Tokens are projected into a d-dimensional embedding space. The multi-head self-attention layer computes Attention(Q, K, V) = softmax((Q Kᵀ) / √d_k) V.",
        "Positional encodings (e.g., Rotary Position Embedding / RoPE) inject sequential order into the permutation-invariant attention matrix.",
      ],
      diagramTitle: "Autoregressive LLM Inference Pipeline",
      diagramSteps: [
        { step: "Tokenization", desc: "Raw Text String ➔ Discrete Token IDs (e.g., 'Artificial' ➔ 18452)" },
        { step: "Vector Embedding", desc: "Token IDs ➔ 4,096-Dimensional Numerical Coordinates" },
        { step: "Self-Attention Blocks", desc: "Tokens compute pairwise importance matrices across full context" },
        { step: "Logits & Sampling", desc: "Softmax probability distribution over ~128,000 vocabulary tokens ➔ Next token sampled" },
      ],
      terminology: [
        { term: "Token", def: "The atomic unit of text processed by an LLM (~0.75 words in English)." },
        { term: "Embedding", def: "A high-dimensional vector representing the semantic meaning of a word or chunk." },
        { term: "Self-Attention", def: "The algorithm allowing words to dynamically weight their relevance to other words in the sequence." },
      ],
      quiz: [
        {
          q: "What is the primary role of the 'Attention' mechanism in a Transformer?",
          opts: [
            "To monitor whether the human user is paying attention",
            "To allow each token in a sentence to calculate its contextual relationship to every other token",
            "To compress the file size for mobile downloads",
            "To translate speech directly to microphone hardware"
          ],
          correct: 1,
          exp: "Self-attention computes pairwise query-key dot products, enabling the model to dynamically contextualize words based on the surrounding sentence."
        }
      ]
    }
  };

  const currentTopic = contentMap[slug] || contentMap["what-is-ai"];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (submittedQuiz) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back Button */}
      <Link
        href="/fundamentals"
        className="inline-flex items-center gap-2 text-xs font-mono text-atlas-textMuted hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Fundamentals Library
      </Link>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <LevelBadge level={currentTopic.level} />
          <span className="text-xs font-mono text-atlas-textFaint">
            Read Time: {currentTopic.readTime}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white">
          {currentTopic.title}
        </h1>
      </div>

      {/* Explanation Mode Toggle: Intuitive vs Technical */}
      <div className="p-1 rounded-xl bg-atlas-surface border border-atlas-border inline-flex items-center gap-1">
        <button
          onClick={() => setActiveTab("intuitive")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
            activeTab === "intuitive"
              ? "bg-atlas-blue text-white shadow-sm font-semibold"
              : "text-atlas-textMuted hover:text-white"
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          Intuitive Explanation (Beginner Friendly)
        </button>
        <button
          onClick={() => setActiveTab("technical")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
            activeTab === "technical"
              ? "bg-atlas-violet text-white shadow-sm font-semibold"
              : "text-atlas-textMuted hover:text-white"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          Technical & Mathematical Mechanics
        </button>
      </div>

      {/* Primary Lesson Content */}
      <div className="p-6 sm:p-8 rounded-2xl bg-atlas-card border border-atlas-border space-y-4 leading-relaxed text-sm text-atlas-textMuted">
        <div className="flex items-center gap-2 font-mono text-xs text-atlas-cyan uppercase tracking-wider mb-2">
          {activeTab === "intuitive" ? (
            <>
              <Brain className="w-4 h-4" />
              <span>Conceptual Understanding</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-atlas-violet" />
              <span>Algorithmic Rigor</span>
            </>
          )}
        </div>

        {(activeTab === "intuitive" ? currentTopic.intuitive : currentTopic.technical).map(
          (paragraph, i) => (
            <p key={i} className="text-foreground/90 text-base leading-relaxed">
              {paragraph}
            </p>
          )
        )}
      </div>

      {/* Diagram / Architecture Flow */}
      <div className="p-6 rounded-2xl bg-atlas-surface border border-atlas-border space-y-4">
        <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-atlas-cyan" />
          {currentTopic.diagramTitle}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {currentTopic.diagramSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-atlas-card border border-atlas-border space-y-1.5"
            >
              <div className="text-[11px] font-mono text-atlas-cyan font-bold">
                STAGE 0{idx + 1}
              </div>
              <div className="text-xs font-semibold text-white">{step.step}</div>
              <p className="text-[11px] text-atlas-textMuted">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Terminology Glossary */}
      <div className="space-y-3">
        <h3 className="font-heading font-bold text-white text-lg">Essential Terminology</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {currentTopic.terminology.map((t, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-atlas-card border border-atlas-border space-y-1"
            >
              <div className="text-xs font-mono font-bold text-atlas-cyan">{t.term}</div>
              <p className="text-xs text-atlas-textMuted">{t.def}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Knowledge-Check Quiz */}
      <div className="p-6 sm:p-8 rounded-2xl bg-atlas-card border border-atlas-border space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading font-bold text-white text-lg">Knowledge Check</h3>
          </div>
          <span className="text-xs font-mono text-atlas-textMuted">
            {currentTopic.quiz.length} Questions
          </span>
        </div>

        <div className="space-y-6">
          {currentTopic.quiz.map((q, qIdx) => (
            <div key={qIdx} className="space-y-3">
              <p className="text-sm font-medium text-white">
                {qIdx + 1}. {q.q}
              </p>
              <div className="space-y-2">
                {q.opts.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[qIdx] === optIdx;
                  const isCorrect = submittedQuiz && optIdx === q.correct;
                  const isWrong = submittedQuiz && isSelected && optIdx !== q.correct;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                        isCorrect
                          ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-semibold"
                          : isWrong
                          ? "bg-rose-500/10 border-rose-500/50 text-rose-300"
                          : isSelected
                          ? "bg-atlas-blue/20 border-atlas-blue text-white"
                          : "bg-atlas-surface border-atlas-border text-atlas-textMuted hover:border-atlas-blue/40"
                      }`}
                    >
                      <span>{opt}</span>
                      {isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {isWrong && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {submittedQuiz && (
                <div className="p-3 rounded-xl bg-atlas-surface border border-atlas-border text-xs text-atlas-textMuted font-mono">
                  <span className="text-atlas-cyan font-bold">Explanation: </span>
                  {q.exp}
                </div>
              )}
            </div>
          ))}
        </div>

        {!submittedQuiz ? (
          <button
            onClick={() => setSubmittedQuiz(true)}
            disabled={Object.keys(selectedAnswers).length < currentTopic.quiz.length}
            className="w-full py-3 rounded-xl bg-atlas-blue hover:bg-atlas-blue/90 disabled:opacity-50 text-white font-medium text-xs font-mono transition-all"
          >
            Check Answers
          </button>
        ) : (
          <button
            onClick={() => {
              setSubmittedQuiz(false);
              setSelectedAnswers({});
            }}
            className="w-full py-2.5 rounded-xl bg-atlas-surface hover:bg-atlas-card border border-atlas-border text-white text-xs font-mono transition-all"
          >
            Retake Quiz
          </button>
        )}
      </div>

      {/* Ask AI Tutor about this topic */}
      <div className="p-4 rounded-xl bg-atlas-surface border border-atlas-border/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Bot className="w-5 h-5 text-atlas-violet" />
          <span className="text-xs text-atlas-textMuted">
            Still have questions about this topic? Ask the AI Tutor for real-time clarification.
          </span>
        </div>
        <Link
          href={`/tutor?topic=${encodeURIComponent(currentTopic.title)}`}
          className="px-3.5 py-1.5 rounded-lg bg-atlas-violet hover:bg-atlas-violet/90 text-white text-xs font-mono shrink-0 transition-colors"
        >
          Ask Tutor →
        </Link>
      </div>
    </div>
  );
}
