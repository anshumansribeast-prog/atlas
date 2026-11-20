import React from "react";
import { db } from "@/lib/db";
import {
  Globe,
  Activity,
  Cpu,
  ShieldCheck,
  Building,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "AI Industries & Applications — AI ATLAS",
  description: "How Artificial Intelligence is applied across medicine, Web3, robotics, science, and education.",
};

export default function IndustriesPage() {
  const industries = db.getIndustries();

  const additionalSectors = [
    {
      name: "Space Exploration & Astrophysics",
      desc: "Gravitational wave anomaly detection, automated exoplanet transit identification, and autonomous rover navigation on Mars.",
      examples: ["NASA Jet Propulsion Laboratory", "ESA Gaia Mapping", "Perseverance Rover"],
    },
    {
      name: "Scientific Discovery & Materials",
      desc: "GNoME (Graph Networks for Materials Exploration) predicting 2.2 million new stable crystals for next-generation solar cells and solid-state batteries.",
      examples: ["DeepMind GNoME", "Lawrence Berkeley National Lab", "Microsoft MatterGen"],
    },
    {
      name: "Autonomous Robotics & Cybernetics",
      desc: "Vision-Language-Action (VLA) models enabling physical humanoid robots to translate conversational instructions into real-world motor actions.",
      examples: ["Boston Dynamics", "Figure AI", "Tesla Optimus", "Agility Robotics"],
    },
    {
      name: "Algorithmic Finance & Risk Modeling",
      desc: "High-frequency trade execution, synthetic liquidity generation, fraud detection graph networks, and macroeconomic forecasting.",
      examples: ["Two Sigma", "Renaissance Technologies", "JPMorgan Chase AI Research"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atlas-surface border border-atlas-border text-xs font-mono text-atlas-cyan">
          <Globe className="w-3.5 h-3.5" />
          <span>Real-World Implementations</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">
          AI Across Industries
        </h1>
        <p className="text-base text-atlas-textMuted leading-relaxed">
          Artificial Intelligence is moving from laboratory benchmarks to foundational enterprise infrastructure. Explore how real sectors deploy machine learning models, from biotechnology to blockchain analytics.
        </p>
      </div>

      {/* Featured Deep Dives */}
      <div className="space-y-8">
        <h2 className="text-2xl font-heading font-bold text-white">
          Deep-Dive Sector Case Studies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((ind) => (
            <div
              key={ind.id}
              className="p-6 sm:p-8 rounded-3xl bg-atlas-card border border-atlas-border space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-atlas-surface border border-atlas-border text-atlas-cyan">
                  Sector Overview
                </span>
                <h3 className="text-2xl font-heading font-bold text-white">{ind.name}</h3>
                <p className="text-xs text-atlas-textMuted leading-relaxed">{ind.overview}</p>
              </div>

              {/* Use Cases */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-white font-semibold uppercase tracking-wider">
                  Key Production Use Cases:
                </div>
                {ind.keyUseCases.map((uc, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-atlas-surface border border-atlas-border space-y-1"
                  >
                    <div className="text-xs font-bold text-atlas-cyan">{uc.title}</div>
                    <p className="text-xs text-atlas-textMuted">{uc.description}</p>
                    <div className="text-[11px] font-mono text-emerald-400 pt-1">
                      Impact: {uc.impact}
                    </div>
                  </div>
                ))}
              </div>

              {/* Leading Orgs & Ethical Considerations */}
              <div className="space-y-2 pt-2 border-t border-atlas-border/60 text-xs font-mono">
                <div>
                  <span className="text-white font-semibold">Leading Pioneers: </span>
                  <span className="text-atlas-textMuted">{ind.leadingCompanies.join(", ")}</span>
                </div>
                <div className="text-amber-400">
                  <span className="font-semibold">Ethical Note: </span>
                  <span className="text-atlas-textMuted">{ind.ethicalConsiderations}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Sectors Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-heading font-bold text-white">
          Expanded Industrial Applications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalSectors.map((sec, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-atlas-card border border-atlas-border space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-white text-base">{sec.name}</h3>
                <p className="text-xs text-atlas-textMuted leading-relaxed">{sec.desc}</p>
              </div>
              <div className="pt-2 border-t border-atlas-border/50 text-[11px] font-mono text-atlas-cyan">
                {sec.examples.join(" • ")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
