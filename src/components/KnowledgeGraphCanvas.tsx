"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { KnowledgeNode, KnowledgeEdge } from "@/lib/db/schema";
import { LevelBadge } from "./LevelBadge";
import { ZoomIn, ZoomOut, RotateCcw, Search, ExternalLink, X, Info } from "lucide-react";

interface KnowledgeGraphCanvasProps {
  initialNodes?: KnowledgeNode[];
  initialEdges?: KnowledgeEdge[];
  height?: string;
  interactive?: boolean;
}

export function KnowledgeGraphCanvas({
  initialNodes = [],
  initialEdges = [],
  height = "600px",
  interactive = true,
}: KnowledgeGraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<KnowledgeNode[]>(initialNodes);
  const [edges, setEdges] = useState<KnowledgeEdge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Viewport transforms
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const draggedNode = useRef<KnowledgeNode | null>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (initialNodes.length === 0) {
      fetch("/api/graph")
        .then((res) => res.json())
        .then((data) => {
          if (data.nodes) setNodes(data.nodes);
          if (data.edges) setEdges(data.edges);
        })
        .catch((err) => console.error("Failed to load graph:", err));
    }
  }, [initialNodes.length]);

  // Node position initialization if coordinates missing
  useEffect(() => {
    if (nodes.length > 0 && !nodes[0].x) {
      const centerX = 400;
      const centerY = 300;
      const radius = 220;
      const updated = nodes.map((node, i) => {
        const angle = (i / nodes.length) * 2 * Math.PI;
        return {
          ...node,
          x: centerX + radius * Math.cos(angle) + (Math.random() - 0.5) * 40,
          y: centerY + radius * Math.sin(angle) + (Math.random() - 0.5) * 40,
        };
      });
      setNodes(updated);
    }
  }, [nodes]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // Draw Edges
    edges.forEach((edge) => {
      const source = nodes.find((n) => n.id === edge.source);
      const target = nodes.find((n) => n.id === edge.target);
      if (!source || !target || !source.x || !source.y || !target.x || !target.y) return;

      const isConnectedToSelected =
        selectedNode && (source.id === selectedNode.id || target.id === selectedNode.id);

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = isConnectedToSelected
        ? "rgba(54, 217, 232, 0.8)"
        : "rgba(30, 44, 74, 0.7)";
      ctx.lineWidth = isConnectedToSelected ? 2.5 : 1.2;
      ctx.stroke();

      // Draw edge label if connected
      if (isConnectedToSelected && edge.label) {
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        ctx.fillStyle = "#9AA9C2";
        ctx.font = "10px JetBrains Mono";
        ctx.fillText(edge.label, midX + 5, midY - 5);
      }
    });

    // Draw Nodes
    nodes.forEach((node) => {
      if (!node.x || !node.y) return;

      const isMatchesSearch =
        searchQuery && node.label.toLowerCase().includes(searchQuery.toLowerCase());
      const isCategoryMatch =
        filterCategory === "All" || node.category === filterCategory;
      const isSelected = selectedNode?.id === node.id;

      // Glow effect for selected or search matching
      if (isSelected || isMatchesSearch) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 24, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? "rgba(57, 135, 255, 0.3)" : "rgba(54, 217, 232, 0.3)";
        ctx.fill();
      }

      // Outer ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, 16, 0, 2 * Math.PI);
      ctx.fillStyle = isCategoryMatch ? "#0D1424" : "#070B14";
      ctx.fill();
      ctx.strokeStyle = isSelected
        ? "#36D9E8"
        : isMatchesSearch
        ? "#3987FF"
        : getCategoryColor(node.category);
      ctx.lineWidth = isSelected ? 3 : 1.8;
      ctx.stroke();

      // Center Node Dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = getCategoryColor(node.category);
      ctx.fill();

      // Node Label
      ctx.fillStyle = isSelected ? "#36D9E8" : isCategoryMatch ? "#F5F7FF" : "#5A6E8C";
      ctx.font = isSelected ? "bold 12px Space Grotesk" : "11px Inter";
      ctx.textAlign = "center";
      ctx.fillText(node.label, node.x, node.y + 30);
    });

    ctx.restore();
  }, [nodes, edges, scale, offset, selectedNode, filterCategory, searchQuery]);

  function getCategoryColor(cat: string) {
    switch (cat) {
      case "Concept": return "#3987FF"; // Blue
      case "Tool": return "#36D9E8"; // Cyan
      case "Model": return "#895CFF"; // Violet
      case "Architecture": return "#10B981"; // Emerald
      case "Industry": return "#F59E0B"; // Amber
      default: return "#9AA9C2";
    }
  }

  // Mouse interaction handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - offset.x) / scale;
    const mouseY = (e.clientY - rect.top - offset.y) / scale;

    // Check if clicked a node
    const clickedNode = nodes.find((n) => {
      if (!n.x || !n.y) return false;
      const dist = Math.hypot(n.x - mouseX, n.y - mouseY);
      return dist <= 20;
    });

    if (clickedNode) {
      draggedNode.current = clickedNode;
      setSelectedNode(clickedNode);
    } else {
      isDragging.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    if (draggedNode.current) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const newX = (e.clientX - rect.left - offset.x) / scale;
      const newY = (e.clientY - rect.top - offset.y) / scale;

      setNodes((prev) =>
        prev.map((n) =>
          n.id === draggedNode.current!.id ? { ...n, x: newX, y: newY } : n
        )
      );
    } else if (isDragging.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    draggedNode.current = null;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    e.preventDefault();
    const zoomFactor = 1.1;
    const newScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
    setScale(Math.min(Math.max(0.4, newScale), 3));
  };

  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  return (
    <div className="relative w-full rounded-2xl bg-atlas-card border border-atlas-border overflow-hidden select-none">
      {/* Top Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-atlas-surface/90 backdrop-blur-md border border-atlas-border pointer-events-auto">
          {["All", "Concept", "Tool", "Model", "Architecture"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                filterCategory === cat
                  ? "bg-atlas-blue text-white"
                  : "text-atlas-textMuted hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Node Input & Zoom Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-atlas-textMuted absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find node..."
              className="pl-8 pr-3 py-1 bg-atlas-surface/90 backdrop-blur-md border border-atlas-border rounded-xl text-xs text-white placeholder-atlas-textMuted focus:outline-none focus:border-atlas-cyan w-36 sm:w-48"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-atlas-surface/90 backdrop-blur-md border border-atlas-border rounded-xl">
            <button
              onClick={() => setScale((s) => Math.min(s * 1.2, 3))}
              className="p-1.5 text-atlas-textMuted hover:text-white rounded-lg hover:bg-atlas-card"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setScale((s) => Math.max(s / 1.2, 0.4))}
              className="p-1.5 text-atlas-textMuted hover:text-white rounded-lg hover:bg-atlas-card"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetView}
              className="p-1.5 text-atlas-textMuted hover:text-white rounded-lg hover:bg-atlas-card"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        style={{ height, width: "100%" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="cursor-grab active:cursor-grabbing block w-full bg-atlas-bg"
      />

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-4 text-[11px] font-mono text-atlas-textFaint pointer-events-none flex items-center gap-2">
        <Info className="w-3 h-3 text-atlas-cyan" />
        <span>Drag nodes • Scroll to zoom • Click node to inspect</span>
      </div>

      {/* Selected Node Details Flyout */}
      {selectedNode && (
        <div className="absolute bottom-4 right-4 z-20 w-80 p-4 rounded-xl bg-atlas-surface/95 backdrop-blur-xl border border-atlas-border shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-atlas-cyan">
                  {selectedNode.category}
                </span>
                <LevelBadge level={selectedNode.level} />
              </div>
              <h3 className="font-heading font-bold text-base text-white mt-1">
                {selectedNode.label}
              </h3>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-atlas-textMuted hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-atlas-textMuted mt-2 leading-relaxed">
            {selectedNode.description}
          </p>

          <div className="mt-4 pt-3 border-t border-atlas-border/60 flex items-center justify-between">
            <span className="text-[11px] font-mono text-atlas-textFaint">
              Slug: {selectedNode.slug}
            </span>
            <Link
              href={selectedNode.linkUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-atlas-blue text-white text-xs font-medium hover:bg-atlas-blue/90 transition-colors shadow-sm"
            >
              Explore Node
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
