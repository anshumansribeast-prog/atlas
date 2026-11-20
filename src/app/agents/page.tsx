import React from "react";
import Link from "next/link";
import {
  Bot,
  Layers,
  Wrench,
  Workflow,
  Cpu,
  ShieldAlert,
  GitBranch,
  Terminal,
  CheckCircle,
} from "lucide-react";

export const metadata = {
  title: "AI Agents & Autonomous Automation — AI ATLAS",
  description: "Architectures, orchestration frameworks, tool-calling loops, and multi-agent systems.",
};

export default function AgentsPage() {
  const frameworks = [
    {
      name: "LangGraph",
      org: "LangChain",
      type: "Graph State Machine",
      desc: "Build cyclic, multi-actor LLM applications with fine-grained state management and time-travel debugging.",
      bestFor: "Complex multi-branch production workflows with loops & rollback",
      link: "https://langchain-ai.github.io/langgraph/",
    },
    {
      name: "CrewAI",
      org: "CrewAI Inc.",
      type: "Role-Playing Multi-Agent",
      desc: "Orchestrate autonomous AI agents assigning specific roles, goals, and backstories that collaborate like a software engineering team.",
      bestFor: "Task delegation, research teams, and autonomous collaborative work",
      link: "https://crewai.com",
    },
    {
      name: "Microsoft AutoGen",
      org: "Microsoft Research",
      type: "Multi-Agent Conversation",
      desc: "Enables multiple conversational agents to solve problems collaboratively through multi-turn dialogue with automated code execution.",
      bestFor: "Autonomous coding, math verification, and conversational debugging",
      link: "https://microsoft.github.io/autogen/",
    },
    {
      name: "Google Antigravity",
      org: "DeepMind",
      type: "Agentic Sandbox Runtime",
      desc: "Autonomous multi-agent execution environment featuring sandboxed command execution, dynamic scheduling, and subagent virtualization.",
      bestFor: "Safe terminal tool calling, background task orchestration, and verifiable builds",
      link: "https://deepmind.google",
    },
    {
      name: "n8n AI Workflows",
      org: "n8n",
      type: "Visual Node Orchestrator",
      desc: "Fair-code visual workflow platform with native LangChain nodes, database connectors, and human-in-the-loop approvals.",
      bestFor: "Connecting enterprise APIs, webhooks, and AI without writing boilerplate",
      link: "https://n8n.io",
    },
  ];

  const agentPillars = [
    {
      title: "1. Perception & Observation",
      desc: "How the agent reads incoming inputs: user messages, environment status, API responses, terminal stderr/stdout, and file system diffs.",
      icon: Terminal,
    },
    {
      title: "2. Working & Episodic Memory",
      desc: "Short-term conversational context buffers combined with long-term vector store embeddings for retrieving prior interactions.",
      icon: Layers,
    },
    {
      title: "3. Planning & Reflection (ReAct)",
      desc: "Reasoning step: breaking ambiguous goals into sub-tasks, estimating preconditions, and critiquing mistakes after tool outputs.",
      icon: Workflow,
    },
    {
      title: "4. Tool Execution & Structured Output",
      desc: "Calling external functions via JSON schema definitions: querying SQL databases, searching the web, executing bash commands, or sending notifications.",
      icon: Wrench,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atlas-surface border border-atlas-border text-xs font-mono text-atlas-cyan">
          <Bot className="w-3.5 h-3.5" />
          <span>Autonomous Systems Engineering</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">
          AI Agents & Autonomous Automation
        </h1>
        <p className="text-base text-atlas-textMuted leading-relaxed">
          Move from passive text generation to autonomous systems. An AI Agent uses a foundation model as its reasoning engine to perceive an environment, formulate multi-step plans, call external tools, and collaborate in swarms to accomplish real-world missions.
        </p>
      </div>

      {/* The 4 Core Architectural Pillars */}
      <div className="space-y-6">
        <h2 className="text-2xl font-heading font-bold text-white">
          Anatomy of an Autonomous Agent
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agentPillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-atlas-card border border-atlas-border space-y-3"
              >
                <div className="p-2.5 rounded-xl bg-atlas-surface border border-atlas-border w-fit text-atlas-cyan">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-white text-base">
                  {pillar.title}
                </h3>
                <p className="text-xs text-atlas-textMuted leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison of Top Agent Frameworks */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">
              Leading Agent Frameworks & Runtimes
            </h2>
            <p className="text-xs text-atlas-textMuted mt-1">
              Battle-tested open-source and enterprise frameworks for deploying multi-agent swarms.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {frameworks.map((fw, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-atlas-card border border-atlas-border hover:border-atlas-cyan/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-atlas-surface border border-atlas-border text-atlas-cyan">
                    {fw.type}
                  </span>
                  <span className="text-xs font-mono text-atlas-textFaint">{fw.org}</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-white">{fw.name}</h3>
                <p className="text-xs text-atlas-textMuted leading-relaxed">{fw.desc}</p>
                <div className="p-3 rounded-xl bg-atlas-surface border border-atlas-border/60 text-[11px] font-mono text-atlas-textMuted">
                  <span className="text-white font-semibold">Best For: </span>
                  {fw.bestFor}
                </div>
              </div>

              <a
                href={fw.link}
                target="_blank"
                rel="noopener noreferrer"
                className="pt-2 text-xs font-mono text-atlas-blue hover:text-atlas-cyan flex items-center gap-1 transition-colors"
              >
                Documentation & Repo →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Practical Agent Tutorial */}
      <div className="p-6 sm:p-8 rounded-3xl bg-atlas-card border border-atlas-border space-y-6">
        <div className="space-y-2 border-b border-atlas-border/60 pb-4">
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
            Hands-On Implementation
          </div>
          <h2 className="text-2xl font-heading font-bold text-white">
            How to Build a Tool-Calling Agent in TypeScript
          </h2>
          <p className="text-xs text-atlas-textMuted">
            Minimal, zero-dependency pattern illustrating how modern LLMs invoke functions and observe real outputs.
          </p>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-atlas-bg border border-atlas-border overflow-x-auto text-atlas-textMuted leading-relaxed">
            <pre className="text-emerald-400 font-bold mb-2">// 1. Define the Available Tools Schema</pre>
            <pre className="text-white">{`const tools = [
  {
    name: "calculate_expression",
    description: "Evaluates a mathematical expression safely",
    parameters: {
      type: "object",
      properties: { expression: { type: "string" } },
      required: ["expression"]
    }
  }
];`}</pre>

            <pre className="text-emerald-400 font-bold mt-4 mb-2">// 2. The ReAct Execution Loop</pre>
            <pre className="text-white">{`async function runAgent(userPrompt: string) {
  const conversation = [{ role: "user", content: userPrompt }];

  while (true) {
    // LLM reasons about state and decides whether to output text or trigger a tool
    const response = await callLLMWithTools(conversation, tools);

    if (response.toolCalls && response.toolCalls.length > 0) {
      for (const call of response.toolCalls) {
        console.log(\`[AGENT ACTION]: Invoking \${call.name} with \`, call.args);
        const result = await executeToolLocally(call.name, call.args);

        // Feedback observation into context
        conversation.push({ role: "tool", toolCallId: call.id, content: JSON.stringify(result) });
      }
    } else {
      // Agent finished its mission
      console.log("[AGENT FINAL ANSWER]:", response.content);
      return response.content;
    }
  }
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
