"use client";

import React, { useState } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Course } from "@/lib/db/schema";
import { LevelBadge } from "@/components/LevelBadge";
import {
  Layers,
  Clock,
  BookOpen,
  Star,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useAtlasStore } from "@/lib/store";

export default function LearningCenterPage() {
  const courses = db.getCourses();
  const { user } = useAtlasStore();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "AI for Beginners",
    "AI for Developers",
    "AI for Business",
    "AI for Researchers",
    "AI for Automation",
  ];

  const filteredCourses =
    activeCategory === "All"
      ? courses
      : courses.filter((c) => c.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atlas-surface border border-atlas-border text-xs font-mono text-emerald-400">
          <Layers className="w-3.5 h-3.5" />
          <span>Learning Management System</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">
          AI Learning Center
        </h1>
        <p className="text-base text-atlas-textMuted leading-relaxed">
          Structured, step-by-step curriculum with real-world exercises, code walk-throughs, and verifiable mastery assessments. Progress from zero intuition to production agent architect.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
              activeCategory === cat
                ? "bg-atlas-blue text-white font-semibold"
                : "bg-atlas-surface border border-atlas-border text-atlas-textMuted hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCourses.map((course) => {
          const allLessons = course.modules.flatMap((m) => m.lessons);
          const completedCount = allLessons.filter((l) =>
            user.completedLessons.includes(l.id)
          ).length;
          const percent = Math.round((completedCount / allLessons.length) * 100);

          return (
            <div
              key={course.id}
              className="p-6 sm:p-8 rounded-3xl bg-atlas-card border border-atlas-border flex flex-col justify-between space-y-6 hover:border-atlas-blue/40 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-atlas-surface border border-atlas-border text-atlas-cyan">
                    {course.category}
                  </span>
                  <LevelBadge level={course.level} />
                </div>

                <div>
                  <h3 className="text-2xl font-heading font-bold text-white">
                    {course.title}
                  </h3>
                  <p className="text-xs text-atlas-textMuted mt-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] font-mono text-atlas-textFaint">
                    <span>Your Track Progress</span>
                    <span>{percent}% Completed</span>
                  </div>
                  <div className="w-full bg-atlas-surface h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Modules breakdown */}
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-atlas-textMuted font-semibold">
                    Curriculum Modules:
                  </div>
                  {course.modules.map((mod) => (
                    <div
                      key={mod.id}
                      className="p-3 rounded-xl bg-atlas-surface border border-atlas-border/60 text-xs text-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-atlas-cyan" />
                        <span className="font-medium">{mod.title}</span>
                      </div>
                      <span className="font-mono text-atlas-textFaint text-[11px]">
                        {mod.lessons.length} Lessons
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-4 border-t border-atlas-border/60 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-mono text-atlas-textMuted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {course.durationHours}h
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" /> {course.rating}
                  </span>
                </div>

                {allLessons.length > 0 && (
                  <Link
                    href={`/learn/${course.slug}/${allLessons[0].slug}`}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-atlas-blue hover:bg-atlas-blue/90 text-white text-xs font-medium shadow-sm transition-all"
                  >
                    <span>{percent > 0 ? "Continue Lesson" : "Start Course"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
