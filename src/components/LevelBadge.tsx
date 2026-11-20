import React from "react";
import { LearningLevel } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: LearningLevel | string;
  className?: string;
}

export function LevelBadge({ level, className }: LevelBadgeProps) {
  const norm = level.toLowerCase();

  const styles: Record<string, { bg: string; text: string; border: string; label: string }> = {
    beginner: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      label: "Beginner",
    },
    intermediate: {
      bg: "bg-sky-500/10",
      text: "text-sky-400",
      border: "border-sky-500/30",
      label: "Intermediate",
    },
    advanced: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/30",
      label: "Advanced",
    },
    expert: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/30",
      label: "Expert",
    },
  };

  const current = styles[norm] || {
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/30",
    label: level,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-medium border uppercase tracking-wider",
        current.bg,
        current.text,
        current.border,
        className
      )}
    >
      {current.label}
    </span>
  );
}
