"use client";

import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { LevelBadge } from "@/components/LevelBadge";
import { useAtlasStore } from "@/lib/store";
import {
  User,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Sparkles,
  Wrench,
  Clock,
  ArrowRight,
  Shield,
  Award,
} from "lucide-react";

export default function DashboardPage() {
  const { user, isLoaded } = useAtlasStore();
  const allCourses = db.getCourses();
  const allTools = db.getTools();
  const allPrompts = db.getPrompts();

  if (!isLoaded) {
    return (
      <div className="py-24 text-center text-atlas-textMuted font-mono">
        <span className="inline-block animate-spin mr-2">⟳</span> Synchronizing profile state...
      </div>
    );
  }

  // Saved Tools
  const bookmarkedTools = allTools.filter((t) => user.bookmarks.includes(t.id));
  const bookmarkedPrompts = allPrompts.filter((p) => user.bookmarks.includes(p.id));

  // Lesson stats
  const totalCompleted = user.completedLessons.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* User Header Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-atlas-card border border-atlas-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-atlas-blue via-atlas-violet to-atlas-cyan p-0.5 shadow-atlas-glow">
            <div className="w-full h-full bg-atlas-surface rounded-[14px] flex items-center justify-center text-white font-heading font-bold text-xl">
              {user.name.charAt(0)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-heading font-bold text-white">{user.name}</h1>
              <LevelBadge level={user.level} />
            </div>
            <p className="text-xs font-mono text-atlas-textMuted">{user.email}</p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-atlas-surface border border-atlas-border text-center min-w-[90px]">
            <div className="text-xl font-heading font-bold text-emerald-400">{totalCompleted}</div>
            <div className="text-[10px] font-mono text-atlas-textFaint">Lessons Done</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-atlas-surface border border-atlas-border text-center min-w-[90px]">
            <div className="text-xl font-heading font-bold text-atlas-cyan">{bookmarkedTools.length}</div>
            <div className="text-[10px] font-mono text-atlas-textFaint">Saved Tools</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-atlas-surface border border-atlas-border text-center min-w-[90px]">
            <div className="text-xl font-heading font-bold text-atlas-violet">{bookmarkedPrompts.length}</div>
            <div className="text-[10px] font-mono text-atlas-textFaint">Saved Prompts</div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses & Progress */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-atlas-blue" />
            Enrolled Course Tracks
          </h2>
          <Link href="/learn" className="text-xs font-mono text-atlas-cyan hover:underline">
            Explore All Courses →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allCourses.map((course) => {
            const lessons = course.modules.flatMap((m) => m.lessons);
            const done = lessons.filter((l) => user.completedLessons.includes(l.id)).length;
            const pct = Math.round((done / lessons.length) * 100);

            return (
              <div
                key={course.id}
                className="p-6 rounded-2xl bg-atlas-card border border-atlas-border space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-atlas-surface text-atlas-cyan border border-atlas-border">
                    {course.category}
                  </span>
                  <LevelBadge level={course.level} />
                </div>

                <div>
                  <h3 className="text-xl font-heading font-bold text-white">{course.title}</h3>
                  <div className="flex items-center justify-between text-xs font-mono text-atlas-textFaint mt-2">
                    <span>{done} of {lessons.length} Lessons</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full bg-atlas-surface h-2 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs font-mono">
                  {pct === 100 ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <Award className="w-4 h-4" /> Track Completed
                    </span>
                  ) : (
                    <span className="text-atlas-textMuted">In Progress</span>
                  )}

                  <Link
                    href={`/learn/${course.slug}/${lessons[0]?.slug || ""}`}
                    className="px-3.5 py-1.5 rounded-lg bg-atlas-surface hover:bg-atlas-cardHover border border-atlas-border text-white transition-colors"
                  >
                    Resume →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved Tools & Prompts Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved AI Tools */}
        <div className="p-6 rounded-3xl bg-atlas-card border border-atlas-border space-y-4">
          <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
            <Wrench className="w-4 h-4 text-atlas-cyan" />
            Saved AI Tools ({bookmarkedTools.length})
          </h3>

          <div className="space-y-2">
            {bookmarkedTools.map((tool) => (
              <div
                key={tool.id}
                className="p-3.5 rounded-xl bg-atlas-surface border border-atlas-border flex items-center justify-between text-xs"
              >
                <div>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="font-bold text-white hover:text-atlas-cyan transition-colors"
                  >
                    {tool.name}
                  </Link>
                  <p className="text-[11px] text-atlas-textMuted line-clamp-1">{tool.tagline}</p>
                </div>
                <span className="font-mono text-atlas-textFaint shrink-0 pl-2">
                  {tool.pricingModel}
                </span>
              </div>
            ))}

            {bookmarkedTools.length === 0 && (
              <div className="py-8 text-center text-xs text-atlas-textFaint">
                You haven&apos;t bookmarked any AI tools yet. Explore the{" "}
                <Link href="/tools" className="text-atlas-cyan underline">
                  Tools Directory
                </Link>
                .
              </div>
            )}
          </div>
        </div>

        {/* Saved Prompts */}
        <div className="p-6 rounded-3xl bg-atlas-card border border-atlas-border space-y-4">
          <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-atlas-violet" />
            Saved Prompts ({bookmarkedPrompts.length})
          </h3>

          <div className="space-y-2">
            {bookmarkedPrompts.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl bg-atlas-surface border border-atlas-border flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white">{p.title}</div>
                  <p className="text-[11px] text-atlas-textMuted line-clamp-1">{p.objective}</p>
                </div>
                <Link
                  href={`/prompt-lab`}
                  className="font-mono text-atlas-violet hover:underline shrink-0 pl-2"
                >
                  View
                </Link>
              </div>
            ))}

            {bookmarkedPrompts.length === 0 && (
              <div className="py-8 text-center text-xs text-atlas-textFaint">
                You haven&apos;t saved any prompts yet. Explore the{" "}
                <Link href="/prompt-lab" className="text-atlas-violet underline">
                  Prompt Lab
                </Link>
                .
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
