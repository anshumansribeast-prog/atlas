"use client";

import React, { useState } from "react";
import {
  HardDrive,
  Cpu,
  ShieldCheck,
  Terminal,
  Zap,
  CheckCircle,
  HelpCircle,
  Calculator,
} from "lucide-react";

function getRecommendedHardware(vram: number): string {
  if (vram <= 6) return "Consumer Laptop (Apple M-series 8GB+, or Nvidia GTX 1660 / RTX 3050 6GB)";
  if (vram <= 12) return "Mid-Range Gaming PC / Mac (Apple 16GB Unified RAM, or Nvidia RTX 3060/4060 12GB)";
  if (vram <= 24) return "High-End Workstation (Apple 32GB Unified RAM, or Nvidia RTX 3090/4090 24GB VRAM)";
  if (vram <= 48) return "Dual-GPU Workstation or Apple Mac Studio (M2/M3 Max 64GB Unified RAM)";
  return "Enterprise Multi-GPU Cluster (Apple 128GB Mac Studio or 2x-4x Nvidia RTX 4090 / A6000)";
}

export default function LocalAIPage() {
  // Interactive Hardware Calculator State
  const [paramSize, setParamSize] = useState(8); // in Billions
  const [quantBits, setQuantBits] = useState(4); // 4-bit, 8-bit, 16-bit

  // VRAM formula estimate: (params * bits / 8) * 1.2 (for KV cache overhead)
  const estimatedVramGB = Math.max(
    1,
    Math.round(((paramSize * quantBits) / 8) * 1.2 * 10) / 10
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atlas-surface border border-atlas-border text-xs font-mono text-emerald-400">
          <HardDrive className="w-3.5 h-3.5" />
          <span>Sovereign & Private Computing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">
          Local AI Center
        </h1>
        <p className="text-base text-atlas-textMuted leading-relaxed">
          Run high-capability foundation models entirely on your own hardware. Zero cloud subscription fees, zero internet dependency, and 100% data sovereignty.
        </p>
      </div>

      {/* Why Run AI Locally? */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-atlas-card border border-atlas-border space-y-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-white text-base">Absolute Privacy</h3>
          <p className="text-xs text-atlas-textMuted leading-relaxed">
            Your proprietary documents, source code, and private emails never leave your computer or get used for third-party training.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-atlas-card border border-atlas-border space-y-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 w-fit">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-white text-base">Zero API Costs</h3>
          <p className="text-xs text-atlas-textMuted leading-relaxed">
            Generate millions of tokens completely free after hardware investment. Perfect for background tasks and local test suites.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-atlas-card border border-atlas-border space-y-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-white text-base">Offline Resilience</h3>
          <p className="text-xs text-atlas-textMuted leading-relaxed">
            Work in airplanes, remote locations, or offline networks without relying on cloud provider uptime or internet connectivity.
          </p>
        </div>
      </div>

      {/* INTERACTIVE HARDWARE & VRAM CALCULATOR */}
      <div className="p-6 sm:p-8 rounded-3xl bg-atlas-card border border-atlas-border space-y-6">
        <div className="border-b border-atlas-border/60 pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-atlas-cyan uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4" />
            Interactive Hardware Estimator
          </div>
          <h2 className="text-2xl font-heading font-bold text-white">
            Model Size & VRAM Calculator
          </h2>
          <p className="text-xs text-atlas-textMuted mt-1">
            Calculate exact memory requirements based on parameter count and quantization precision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Sliders */}
          <div className="space-y-6 text-xs font-mono">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">Model Parameter Count:</span>
                <span className="text-atlas-cyan font-bold text-sm">{paramSize}B Parameters</span>
              </div>
              <input
                type="range"
                min="1"
                max="70"
                step="1"
                value={paramSize}
                onChange={(e) => setParamSize(Number(e.target.value))}
                className="w-full accent-atlas-blue bg-atlas-surface h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-atlas-textFaint mt-1">
                <span>1B (Edge/Mobile)</span>
                <span>8B (Standard Desktop)</span>
                <span>32B (Coder)</span>
                <span>70B (Frontier Open)</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">Quantization Precision:</span>
                <span className="text-atlas-violet font-bold text-sm">{quantBits}-bit ({quantBits === 4 ? "Q4_K_M" : quantBits === 8 ? "Q8_0" : "FP16"})</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[4, 8, 16].map((b) => (
                  <button
                    key={b}
                    onClick={() => setQuantBits(b)}
                    className={`py-2 rounded-xl text-xs font-mono border transition-all ${
                      quantBits === b
                        ? "bg-atlas-violet text-white border-atlas-violet font-bold"
                        : "bg-atlas-surface border-atlas-border text-atlas-textMuted hover:text-white"
                    }`}
                  >
                    {b}-bit {b === 4 ? "(Recommended)" : b === 8 ? "(High Fidelity)" : "(Full FP16)"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="p-6 rounded-2xl bg-atlas-surface border border-atlas-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-atlas-textFaint">Estimated VRAM / RAM Needed:</span>
              <span className="text-3xl font-heading font-bold text-emerald-400">
                ~{estimatedVramGB} GB
              </span>
            </div>

            <div className="pt-3 border-t border-atlas-border/60 space-y-2 text-xs font-mono">
              <div className="text-white font-semibold">Recommended Hardware Specification:</div>
              <p className="text-atlas-cyan leading-relaxed">
                {getRecommendedHardware(estimatedVramGB)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QUICKSTART GUIDE: OLLAMA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-atlas-card border border-atlas-border space-y-6">
        <div className="space-y-1 border-b border-atlas-border/60 pb-4">
          <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-atlas-cyan" />
            Quickstart: 60-Second Setup with Ollama
          </h2>
          <p className="text-xs text-atlas-textMuted">
            Get up and running with Llama 3.1 or Mistral in 3 simple terminal commands.
          </p>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-atlas-bg border border-atlas-border text-atlas-textMuted space-y-3">
            <div>
              <div className="text-atlas-cyan font-bold mb-1"># Step 1: Install Ollama (macOS, Windows, Linux)</div>
              <div className="text-white bg-atlas-surface p-2.5 rounded-lg border border-atlas-border/50">
                curl -fsSL https://ollama.com/install.sh | sh
              </div>
            </div>

            <div>
              <div className="text-atlas-cyan font-bold mb-1"># Step 2: Download and Run Llama 3.1 (8B)</div>
              <div className="text-white bg-atlas-surface p-2.5 rounded-lg border border-atlas-border/50">
                ollama run llama3.1
              </div>
            </div>

            <div>
              <div className="text-atlas-cyan font-bold mb-1"># Step 3: Connect to your Apps (OpenAI Compatible API)</div>
              <pre className="text-white bg-atlas-surface p-2.5 rounded-lg border border-atlas-border/50 overflow-x-auto">
{`curl http://localhost:11434/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{"model": "llama3.1", "messages": [{"role": "user", "content": "Hello!"}]}'`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
