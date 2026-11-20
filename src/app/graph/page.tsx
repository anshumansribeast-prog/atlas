import React from "react";
import { db } from "@/lib/db";
import { KnowledgeGraphCanvas } from "@/components/KnowledgeGraphCanvas";
import { Network, Info } from "lucide-react";

export const metadata = {
  title: "Interactive Knowledge Graph — AI ATLAS",
  description: "Explore the interconnected universe of Artificial Intelligence concepts, models, architectures, and tools.",
};

export default function GraphExplorerPage() {
  const { nodes, edges } = db.getGraphData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atlas-surface border border-atlas-border text-xs font-mono text-atlas-cyan">
            <Network className="w-3.5 h-3.5" />
            <span>2D Relational Topology</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            Interactive AI Knowledge Graph
          </h1>
          <p className="text-xs sm:text-sm text-atlas-textMuted leading-relaxed">
            Drag, zoom, and navigate the structural relationships of modern intelligence systems. Nodes represent concepts, foundation models, and tools; edges denote prerequisite hierarchies and architectural dependencies.
          </p>
        </div>
      </div>

      <div className="flex-1 w-full rounded-3xl overflow-hidden border border-atlas-border shadow-2xl">
        <KnowledgeGraphCanvas
          initialNodes={nodes}
          initialEdges={edges}
          height="680px"
          interactive={true}
        />
      </div>
    </div>
  );
}
