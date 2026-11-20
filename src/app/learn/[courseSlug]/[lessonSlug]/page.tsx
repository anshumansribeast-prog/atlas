"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { db } from "@/lib/db";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronRight,
  HelpCircle,
  CheckCircle,
  XCircle,
  Bot,
} from "lucide-react";
import { useAtlasStore } from "@/lib/store";

export default function CoursePlayerPage() {
  const params = useParams();
  const courseSlug = (params?.courseSlug as string) || "ai-for-beginners";
  const lessonSlug = (params?.lessonSlug as string) || "what-is-ai";

  const lessonData = db.getLesson(courseSlug, lessonSlug);
  const { user, markLessonComplete } = useAtlasStore();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [completedSuccess, setCompletedSuccess] = useState(false);

  if (!lessonData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-heading font-bold text-white">Lesson Not Found</h2>
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-atlas-surface border border-atlas-border text-white text-xs font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
        </Link>
      </div>
    );
  }

  const { course, module, lesson } = lessonData;
  const isLessonCompleted = user.completedLessons.includes(lesson.id) || completedSuccess;

  const handleMarkComplete = () => {
    markLessonComplete(lesson.id);
    setCompletedSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col lg:flex-row gap-8">
      {/* Left Sidebar: Course Curriculum Tree */}
      <div className="w-full lg:w-72 shrink-0 space-y-4">
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-xs font-mono text-atlas-textMuted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Course Catalog
        </Link>

        <div className="p-4 rounded-2xl bg-atlas-card border border-atlas-border space-y-4">
          <div className="border-b border-atlas-border/60 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-atlas-cyan">
              {course.category}
            </span>
            <h3 className="font-heading font-bold text-white text-sm mt-0.5">
              {course.title}
            </h3>
          </div>

          {/* Module / Lessons Tree */}
          <div className="space-y-4">
            {course.modules.map((mod) => (
              <div key={mod.id} className="space-y-2">
                <div className="text-[11px] font-mono text-atlas-textFaint uppercase">
                  {mod.title}
                </div>
                <div className="space-y-1">
                  {mod.lessons.map((les) => {
                    const isActive = les.slug === lesson.slug;
                    const isDone = user.completedLessons.includes(les.id);

                    return (
                      <Link
                        key={les.id}
                        href={`/learn/${course.slug}/${les.slug}`}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                          isActive
                            ? "bg-atlas-blue text-white font-medium"
                            : "text-atlas-textMuted hover:bg-atlas-surface hover:text-white"
                        }`}
                      >
                        <span className="truncate pr-2">{les.title}</span>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-8 max-w-3xl">
        {/* Lesson Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-atlas-textFaint">
            <span>{module.title}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="flex items-center gap-1 text-atlas-cyan">
              <Clock className="w-3.5 h-3.5" /> {lesson.readTimeMinutes} min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-heading font-bold text-white">
            {lesson.title}
          </h1>
          <p className="text-sm text-atlas-textMuted">{lesson.summary}</p>
        </div>

        {/* Lesson Markdown Content Body */}
        <div className="p-6 sm:p-8 rounded-3xl bg-atlas-card border border-atlas-border text-sm text-foreground/90 space-y-4 leading-relaxed whitespace-pre-wrap font-sans">
          {lesson.contentMarkdown}
        </div>

        {/* Embedded Lesson Quiz Check */}
        {lesson.quiz && (
          <div className="p-6 sm:p-8 rounded-3xl bg-atlas-surface border border-atlas-border space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <h3 className="font-heading font-bold text-white text-lg">Lesson Mastery Quiz</h3>
            </div>

            <div className="space-y-6">
              {lesson.quiz.questions.map((q, qIdx) => (
                <div key={q.id} className="space-y-3">
                  <p className="text-sm font-medium text-white">
                    {qIdx + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[qIdx] === optIdx;
                      const isCorrect = submittedQuiz && optIdx === q.correctIndex;
                      const isWrong = submittedQuiz && isSelected && optIdx !== q.correctIndex;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            if (!submittedQuiz) {
                              setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
                            }
                          }}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                            isCorrect
                              ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-semibold"
                              : isWrong
                              ? "bg-rose-500/10 border-rose-500/50 text-rose-300"
                              : isSelected
                              ? "bg-atlas-blue/20 border-atlas-blue text-white"
                              : "bg-atlas-card border-atlas-border text-atlas-textMuted hover:border-atlas-blue/40"
                          }`}
                        >
                          <span>{opt}</span>
                          {isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {isWrong && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {submittedQuiz && (
                    <div className="p-3 rounded-xl bg-atlas-card border border-atlas-border text-xs text-atlas-textMuted font-mono">
                      <span className="text-atlas-cyan font-bold">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!submittedQuiz ? (
              <button
                onClick={() => setSubmittedQuiz(true)}
                disabled={Object.keys(selectedAnswers).length < lesson.quiz.questions.length}
                className="w-full py-2.5 rounded-xl bg-atlas-blue hover:bg-atlas-blue/90 disabled:opacity-50 text-white font-medium text-xs font-mono transition-all"
              >
                Validate Quiz Answers
              </button>
            ) : (
              <button
                onClick={() => {
                  setSubmittedQuiz(false);
                  setSelectedAnswers({});
                }}
                className="w-full py-2 rounded-xl bg-atlas-card hover:bg-atlas-cardHover border border-atlas-border text-white text-xs font-mono"
              >
                Retake Lesson Quiz
              </button>
            )}
          </div>
        )}

        {/* Completion & Next Action */}
        <div className="p-6 rounded-2xl bg-atlas-card border border-atlas-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-heading font-bold text-white text-sm">
              {isLessonCompleted ? "✓ Lesson Completed" : "Ready to progress?"}
            </div>
            <div className="text-xs text-atlas-textMuted">
              Record this lesson in your permanent learning dashboard.
            </div>
          </div>

          <button
            onClick={handleMarkComplete}
            disabled={isLessonCompleted}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              isLessonCompleted
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default"
                : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
            }`}
          >
            {isLessonCompleted ? "Completed & Synced" : "Mark as Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}
