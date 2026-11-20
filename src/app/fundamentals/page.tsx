import React from "react";
import Link from "next/link";
import { LevelBadge } from "@/components/LevelBadge";
import { BookOpen, ArrowRight, Brain, Zap, Layers, Sparkles, Shield, Cpu } from "lucide-react";

export const metadata = {
  title: "AI Fundamentals — AI ATLAS",
  description: "Structured educational library breaking down how Artificial Intelligence actually works from first principles.",
};

export default function FundamentalsPage() {
  const topics = [
    {
      slug: "what-is-ai",
      title: "What is Artificial Intelligence? (Beyond the Hype)",
      category: "Foundations",
      level: "beginner",
      readTime: "8 min",
      icon: Brain,
      summary: "Understand the core distinction between traditional procedural software programming and machine learning algorithms.",
    },
    {
      slug: "how-llms-work",
      title: "How Large Language Models (LLMs) Actually Work",
      category: "Generative AI",
      level: "beginner",
      readTime: "11 min",
      icon: Sparkles,
      summary: "Tokens, high-dimensional vector embeddings, the Transformer self-attention mechanism, and next-token probability distribution.",
    },
    {
      slug: "neural-networks-deep-learning",
      title: "Neural Networks & Deep Learning Explained",
      category: "Deep Learning",
      level: "intermediate",
      readTime: "14 min",
      icon: Layers,
      summary: "Perceptrons, weights, biases, activation functions (ReLU, Sigmoid), backpropagation, and gradient descent optimization.",
    },
    {
      slug: "natural-language-processing",
      title: "Natural Language Processing (NLP) & Tokenization",
      category: "NLP",
      level: "intermediate",
      readTime: "10 min",
      icon: Cpu,
      summary: "From Bag-of-Words and Word2Vec to modern Byte-Pair Encoding (BPE) and contextual semantic embeddings.",
    },
    {
      slug: "computer-vision",
      title: "Computer Vision & Multimodal Perception",
      category: "Vision",
      level: "intermediate",
      readTime: "12 min",
      icon: Zap,
      summary: "Convolutional Neural Networks (CNNs), Vision Transformers (ViTs), patch projection, and multimodal alignment (CLIP).",
    },
    {
      slug: "reinforcement-learning-rlhf",
      title: "Reinforcement Learning & RLHF in Modern AI",
      category: "Training & Alignment",
      level: "advanced",
      readTime: "15 min",
      icon: Shield,
      summary: "Reward models, policy gradients (PPO, DPO), human feedback alignment, and reducing sycophancy.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atlas-surface border border-atlas-border text-xs font-mono text-atlas-cyan">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Core Educational Library</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">
          AI Fundamentals
        </h1>
        <p className="text-base text-atlas-textMuted leading-relaxed">
          Master the foundational mechanics of Artificial Intelligence. Every lesson includes intuitive non-technical explanations, rigorous mathematical details, real-world examples, and interactive knowledge checks.
        </p>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <Link
              key={topic.slug}
              href={`/fundamentals/${topic.slug}`}
              className="group p-6 rounded-2xl bg-atlas-card border border-atlas-border hover:border-atlas-blue/60 transition-all flex flex-col justify-between hover:bg-atlas-cardHover"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-atlas-surface border border-atlas-border text-atlas-cyan group-hover:border-atlas-blue/40">
                    <Icon className="w-5 h-5" />
                  </div>
                  <LevelBadge level={topic.level} />
                </div>

                <div>
                  <span className="text-[11px] font-mono text-atlas-textFaint uppercase tracking-wider">
                    {topic.category} • {topic.readTime}
                  </span>
                  <h3 className="text-lg font-heading font-bold text-white group-hover:text-atlas-cyan transition-colors mt-1">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-atlas-textMuted mt-2 leading-relaxed">
                    {topic.summary}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-atlas-border/50 mt-6 flex items-center justify-between text-xs font-mono">
                <span className="text-atlas-cyan group-hover:underline">Read Chapter</span>
                <ArrowRight className="w-4 h-4 text-atlas-textMuted group-hover:text-atlas-cyan transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
