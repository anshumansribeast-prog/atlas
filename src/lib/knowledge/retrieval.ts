import { Course, CourseKnowledgeChunk } from "../db/schema";

// In-memory knowledge store partitioned strictly by courseSlug
const courseKnowledgeBase: Map<string, CourseKnowledgeChunk[]> = new Map();

/**
 * Indexes all lessons, modules, summaries, and quizzes for a given course into isolated chunks.
 */
export function indexCourse(course: Course): CourseKnowledgeChunk[] {
  const chunks: CourseKnowledgeChunk[] = [];

  // 1. Index Course Overview & Objectives
  chunks.push({
    id: `chunk-${course.slug}-overview`,
    courseSlug: course.slug,
    moduleTitle: "Course Overview",
    lessonSlug: "syllabus",
    lessonTitle: course.title,
    type: "syllabus",
    content: `Course: ${course.title}\nCategory: ${course.category}\nLevel: ${course.level}\nDescription: ${course.description}\nTotal Modules: ${course.modules.length}`,
    keywords: [course.title, course.category, course.level, "syllabus", "overview"],
    orderIndex: 0,
  });

  // 2. Index Each Module and Lesson
  let indexCounter = 1;
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      // Chunk lesson content into manageable ~500 word semantic segments if long
      const paragraphs = lesson.contentMarkdown.split("\n\n").filter((p) => p.trim().length > 30);
      
      if (paragraphs.length <= 3) {
        chunks.push({
          id: `chunk-${lesson.id}-full`,
          courseSlug: course.slug,
          moduleTitle: module.title,
          lessonSlug: lesson.slug,
          lessonTitle: lesson.title,
          type: "lesson_content",
          content: `Module: ${module.title}\nLesson: ${lesson.title}\nSummary: ${lesson.summary}\n\n${lesson.contentMarkdown}`,
          keywords: extractKeywords(`${lesson.title} ${lesson.summary} ${module.title}`),
          orderIndex: indexCounter++,
        });
      } else {
        // Multi-chunk long lessons
        for (let i = 0; i < paragraphs.length; i += 2) {
          const slice = paragraphs.slice(i, i + 2).join("\n\n");
          chunks.push({
            id: `chunk-${lesson.id}-p${i}`,
            courseSlug: course.slug,
            moduleTitle: module.title,
            lessonSlug: lesson.slug,
            lessonTitle: lesson.title,
            type: "lesson_content",
            content: `Module: ${module.title} > ${lesson.title} (Part ${Math.floor(i / 2) + 1})\nSummary: ${lesson.summary}\n\n${slice}`,
            keywords: extractKeywords(`${lesson.title} ${slice}`),
            orderIndex: indexCounter++,
          });
        }
      }

      // Index quiz questions as assessment knowledge
      if (lesson.quiz && lesson.quiz.questions.length > 0) {
        const quizSummary = lesson.quiz.questions
          .map((q, idx) => `Q${idx + 1}: ${q.question} (Key insight: ${q.explanation})`)
          .join("\n");

        chunks.push({
          id: `chunk-${lesson.id}-quiz`,
          courseSlug: course.slug,
          moduleTitle: module.title,
          lessonSlug: lesson.slug,
          lessonTitle: `${lesson.title} - Self-Assessment`,
          type: "quiz_summary",
          content: `Key Knowledge Checks for ${lesson.title}:\n${quizSummary}`,
          keywords: extractKeywords(`Quiz Assessment Test Questions ${lesson.title}`),
          orderIndex: indexCounter++,
        });
      }
    }
  }

  // Store in isolated partition
  courseKnowledgeBase.set(course.slug, chunks);
  return chunks;
}

/**
 * Simple, fast keyword tokenization and stop-word removal.
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "and", "or", "in", "on", "at", "to", "for", "with", "by", "from",
    "that", "this", "it", "of", "as", "be", "was", "were", "what", "how", "why", "which", "can"
  ]);

  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^\w\s-]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !stopWords.has(w))
    )
  ).slice(0, 30);
}

/**
 * Isolated semantic-keyword retrieval strictly within the requested course.
 * Ensures zero leakage from other unrelated courses.
 */
export function retrieveCourseKnowledge(
  courseSlug: string,
  query: string,
  maxResults = 3
): { chunk: CourseKnowledgeChunk; score: number }[] {
  const chunks = courseKnowledgeBase.get(courseSlug);
  if (!chunks || chunks.length === 0) {
    return [];
  }

  const queryTokens = extractKeywords(query);
  if (queryTokens.length === 0) {
    return chunks.slice(0, maxResults).map((chunk) => ({ chunk, score: 1.0 }));
  }

  const scored = chunks.map((chunk) => {
    let score = 0;
    const lowerContent = chunk.content.toLowerCase();
    const lowerTitle = chunk.lessonTitle.toLowerCase();
    const lowerModule = chunk.moduleTitle.toLowerCase();

    for (const token of queryTokens) {
      // Title exact match has high weight
      if (lowerTitle.includes(token)) score += 5;
      if (lowerModule.includes(token)) score += 3;
      if (chunk.keywords.includes(token)) score += 2;

      // Count occurrences in content
      const regex = new RegExp(`\\b${token}\\b`, "gi");
      const matches = lowerContent.match(regex);
      if (matches) {
        score += Math.min(matches.length, 5); // Diminishing returns cap
      }
    }

    return { chunk, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

/**
 * Returns overall statistics for the knowledge management layer.
 */
export function getKnowledgeBaseStats() {
  const stats: { courseSlug: string; totalChunks: number }[] = [];
  let totalChunks = 0;

  courseKnowledgeBase.forEach((chunks, courseSlug) => {
    stats.push({ courseSlug, totalChunks: chunks.length });
    totalChunks += chunks.length;
  });

  return {
    indexedCoursesCount: courseKnowledgeBase.size,
    totalChunks,
    courseBreakdown: stats,
  };
}
