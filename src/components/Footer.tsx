import React from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { ShieldCheck, Compass, GitBranch, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-atlas-border bg-atlas-surface/40 text-atlas-textMuted text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" />
            <p className="text-xs text-atlas-textMuted leading-relaxed max-w-sm">
              AI ATLAS is an independent, non-commercial education, research, and tools discovery platform.
              Our mission is to help people understand how intelligence works, discover trustworthy technologies,
              and build practical, human-centered AI systems.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
              <span className="text-atlas-border">•</span>
              <span className="text-atlas-textFaint">v1.0.0-PROD</span>
            </div>
          </div>

          {/* Column 1: Learning */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">Learning Paths</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/fundamentals" className="hover:text-white transition-colors">AI Fundamentals</Link></li>
              <li><Link href="/learn" className="hover:text-white transition-colors">Course Catalog (LMS)</Link></li>
              <li><Link href="/prompt-lab" className="hover:text-white transition-colors">Prompt Engineering Lab</Link></li>
              <li><Link href="/agents" className="hover:text-white transition-colors">Agents & Automation</Link></li>
              <li><Link href="/dev-lab" className="hover:text-white transition-colors">AI Developer Projects</Link></li>
              <li><Link href="/dictionary" className="hover:text-white transition-colors">AI Technical Dictionary</Link></li>
            </ul>
          </div>

          {/* Column 2: Discovery & Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">Discovery & Research</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/tools" className="hover:text-white transition-colors">AI Tools Directory (17 Cats)</Link></li>
              <li><Link href="/models" className="hover:text-white transition-colors">Frontier Model Database</Link></li>
              <li><Link href="/graph" className="hover:text-white transition-colors">Knowledge Graph Canvas</Link></li>
              <li><Link href="/local-ai" className="hover:text-white transition-colors">Local AI Hub (Ollama)</Link></li>
              <li><Link href="/industries" className="hover:text-white transition-colors">Industry Implementations</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">AI News & Breakthroughs</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">Platform & Governance</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/tutor" className="hover:text-white transition-colors">AI Atlas Tutor</Link></li>
              <li><Link href="/playground" className="hover:text-white transition-colors">Prompt & Model Playground</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Learner Dashboard</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Editorial & Audit Console</Link></li>
              <li>
                <span className="inline-flex items-center gap-1 text-atlas-cyan">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Fact-Checked
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="border-t border-atlas-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-atlas-textFaint">
          <p>© {new Date().getFullYear()} AI ATLAS Platform. Independent & Open Source Research.</p>
          <div className="flex items-center gap-6">
            <span>No Sponsored Rankings</span>
            <span>Zero Hallucinated Specs</span>
            <span>Privacy-Preserving Telemetry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
