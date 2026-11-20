import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { KnowledgeGraphCanvas } from "@/components/KnowledgeGraphCanvas";
import { LevelBadge } from "@/components/LevelBadge";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Wrench,
  Bot,
  Terminal,
  Cpu,
  Layers,
  Search,
  ExternalLink,
  ShieldCheck,
  Compass,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const tools = db.getTools().slice(0, 6);
  const courses = db.getCourses();
  const models = db.getModels().slice(0, 4);
  const news = db.getNews();
  const { nodes, edges } = db.getGraphData();

  const featuredTopics = [
    {
      title: "How LLMs Actually Work",
      slug: "how-llms-work",
      desc: "Tokens, embeddings, attention mechanisms, and next-token probability demystified.",
      level: "beginner",
      link: "/fundamentals/how-llms-work",
    },
    {
      title: "Autonomous Agent Architecture",
      slug: "ai-agents",
      desc: "ReAct loops, tool calling schemas, long-term memory, and multi-agent coordination.",
      level: "advanced",
      link: "/agents",
    },
    {
      title: "Retrieval-Augmented Generation (RAG)",
      slug: "rag-systems",
      desc: "Connect foundation models to private knowledge bases with vector embeddings.",
      level: "intermediate",
      link: "/dev-lab",
    },
    {
      title: "Local AI & Hardware Specs",
      slug: "local-ai",
      desc: "Run open-weights models offline on your own laptop with Ollama and quantization.",
      level: "intermediate",
      link: "/local-ai",
    },
  ];

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-atlas-blue/20 via-atlas-violet/20 to-atlas-cyan/20 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-atlas-surface border border-atlas-border text-xs font-mono text-atlas-cyan shadow-sm animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Independent Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Explore AI. Understand Intelligence.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-atlas-blue via-atlas-violet to-atlas-cyan">
              Build the Future.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-atlas-textMuted max-w-2xl mx-auto leading-relaxed">
            The complete destination for understanding how Artificial Intelligence works, discovering verified tools, mastering prompt engineering, and building production-ready autonomous systems.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/fundamentals"
              className="px-6 py-3 rounded-xl bg-atlas-blue hover:bg-atlas-blue/90 text-white font-medium text-sm flex items-center gap-2 shadow-atlas-glow transition-all hover:scale-105"
            >
              Start Learning Path
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tools"
              className="px-6 py-3 rounded-xl bg-atlas-surface hover:bg-atlas-card border border-atlas-border text-white font-medium text-sm flex items-center gap-2 transition-all hover:border-atlas-cyan/50"
            >
              <Wrench className="w-4 h-4 text-atlas-cyan" />
              Explore Tools Directory
            </Link>
            <Link
              href="/tutor"
              className="px-6 py-3 rounded-xl bg-atlas-card hover:bg-atlas-cardHover border border-atlas-border text-atlas-violet font-medium text-sm flex items-center gap-2 transition-all hover:border-atlas-violet/50"
            >
              <Bot className="w-4 h-4 text-atlas-violet" />
              Ask AI Tutor
            </Link>
          </div>

          {/* Quick Stats Banner */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-xl bg-atlas-surface/60 border border-atlas-border/80">
              <div className="text-2xl font-heading font-bold text-white">17</div>
              <div className="text-xs font-mono text-atlas-textMuted">Tool Categories</div>
            </div>
            <div className="p-4 rounded-xl bg-atlas-surface/60 border border-atlas-border/80">
              <div className="text-2xl font-heading font-bold text-atlas-cyan">100%</div>
              <div className="text-xs font-mono text-atlas-textMuted">Source-Verified</div>
            </div>
            <div className="p-4 rounded-xl bg-atlas-surface/60 border border-atlas-border/80">
              <div className="text-2xl font-heading font-bold text-atlas-violet">4 Levels</div>
              <div className="text-xs font-mono text-atlas-textMuted">Beginner to Expert</div>
            </div>
            <div className="p-4 rounded-xl bg-atlas-surface/60 border border-atlas-border/80">
              <div className="text-2xl font-heading font-bold text-emerald-400">2D Graph</div>
              <div className="text-xs font-mono text-atlas-textMuted">Interactive Engine</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED AI TOPICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-atlas-cyan uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Core Understanding</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1">
              Featured AI Fundamentals
            </h2>
          </div>
          <Link
            href="/fundamentals"
            className="text-xs font-mono text-atlas-blue hover:text-atlas-cyan flex items-center gap-1 transition-colors"
          >
            Browse All Topics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTopics.map((topic, i) => (
            <Link
              key={i}
              href={topic.link}
              className="group p-5 rounded-2xl bg-atlas-card border border-atlas-border hover:border-atlas-blue/60 transition-all flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <LevelBadge level={topic.level} />
                  <ArrowRight className="w-4 h-4 text-atlas-textFaint group-hover:text-atlas-cyan transition-colors" />
                </div>
                <h3 className="text-base font-heading font-bold text-white group-hover:text-atlas-blue transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs text-atlas-textMuted leading-relaxed">
                  {topic.desc}
                </p>
              </div>
              <span className="text-[11px] font-mono text-atlas-cyan pt-4 inline-block group-hover:underline">
                Read Deep-Dive →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE KNOWLEDGE GRAPH PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-6 sm:p-8 rounded-3xl bg-atlas-surface border border-atlas-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-atlas-violet uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>Knowledge Network</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1">
                Explore the AI Knowledge Graph
              </h2>
              <p className="text-xs text-atlas-textMuted mt-1">
                Interactive connected graph mapping AI foundations, tool dependencies, and model evolutions.
              </p>
            </div>
            <Link
              href="/graph"
              className="px-4 py-2 rounded-xl bg-atlas-violet hover:bg-atlas-violet/90 text-white text-xs font-mono flex items-center gap-2 shrink-0 shadow-violet-glow transition-all"
            >
              Full-Screen Canvas
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <KnowledgeGraphCanvas
            initialNodes={nodes}
            initialEdges={edges}
            height="460px"
            interactive={true}
          />
        </div>
      </section>

      {/* 4. EXPLORE AI TOOLS DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-atlas-cyan uppercase tracking-wider">
              <Wrench className="w-3.5 h-3.5" />
              <span>Fact-Checked Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1">
              AI Tools & Platforms Directory
            </h2>
            <p className="text-xs text-atlas-textMuted mt-1">
              17 curated categories with verified pricing models, capabilities, and honest tradeoffs.
            </p>
          </div>
          <Link
            href="/tools"
            className="text-xs font-mono text-atlas-blue hover:text-atlas-cyan flex items-center gap-1 transition-colors"
          >
            View All Tools ({db.getTools().length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="group p-5 rounded-2xl bg-atlas-card border border-atlas-border hover:border-atlas-cyan/50 transition-all flex flex-col justify-between hover:bg-atlas-cardHover"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-atlas-surface border border-atlas-border text-atlas-cyan">
                    {tool.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-heading font-bold text-white group-hover:text-atlas-cyan transition-colors flex items-center justify-between">
                    {tool.name}
                    <ExternalLink className="w-4 h-4 text-atlas-textFaint group-hover:text-atlas-cyan transition-colors" />
                  </h3>
                  <p className="text-xs text-atlas-textMuted mt-1 line-clamp-2">
                    {tool.tagline}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {tool.capabilities.slice(0, 3).map((cap, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-atlas-surface border border-atlas-border/60 text-atlas-textMuted"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-atlas-border/60 mt-4 flex items-center justify-between text-xs">
                <span className="font-mono text-white font-medium">{tool.pricingModel}</span>
                <span className="text-atlas-cyan font-mono group-hover:underline">View Profile →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. STRUCTURED LEARNING PATHS (LMS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Structured Education</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1">
              Learning Center & Guided Paths
            </h2>
          </div>
          <Link
            href="/learn"
            className="text-xs font-mono text-atlas-blue hover:text-atlas-cyan flex items-center gap-1 transition-colors"
          >
            All Courses <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-6 rounded-2xl bg-atlas-card border border-atlas-border flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <LevelBadge level={course.level} />
                  <span className="text-xs font-mono text-atlas-textMuted">
                    {course.durationHours} Hours • {course.lessonCount} Lessons
                  </span>
                </div>
                <h3 className="text-xl font-heading font-bold text-white">{course.title}</h3>
                <p className="text-xs text-atlas-textMuted leading-relaxed">
                  {course.description}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-mono text-atlas-textMuted uppercase tracking-wider">
                    Curriculum Highlights:
                  </div>
                  {course.modules.flatMap((m) => m.lessons).slice(0, 2).map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/learn/${course.slug}/${lesson.slug}`}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-atlas-surface hover:bg-atlas-cardHover border border-atlas-border text-xs text-white transition-colors"
                    >
                      <span className="truncate pr-2">{lesson.title}</span>
                      <span className="font-mono text-atlas-cyan shrink-0">Start →</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href={`/learn/${course.slug}`}
                className="w-full py-2.5 rounded-xl bg-atlas-blue hover:bg-atlas-blue/90 text-white text-xs font-medium text-center transition-all shadow-sm"
              >
                Enroll in Course Track
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. AI ATLAS TUTOR PROMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-atlas-surface via-atlas-card to-atlas-surface border border-atlas-border overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atlas-violet/20 border border-atlas-violet/30 text-xs font-mono text-atlas-violet">
              <Bot className="w-3.5 h-3.5" />
              <span>Intelligent Socratic Assistant</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">
              Meet the AI ATLAS Tutor
            </h2>
            <p className="text-sm text-atlas-textMuted leading-relaxed">
              Have a burning question about gradient descent, transformer attention heads, or running quantized models locally? The AI Tutor explains concepts calibrated precisely to your skill level.
            </p>
            <div className="pt-2">
              <Link
                href="/tutor"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-atlas-violet hover:bg-atlas-violet/90 text-white font-medium text-sm shadow-violet-glow transition-all"
              >
                Start Learning Conversation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
