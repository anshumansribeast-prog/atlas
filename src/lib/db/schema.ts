export type UserRole = "visitor" | "user" | "contributor" | "editor" | "admin";
export type LearningLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type PricingModel = "Free" | "Freemium" | "Paid" | "Open Source" | "Contact";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: LearningLevel;
  category: string;
  durationHours: number;
  lessonCount: number;
  enrolledCount: number;
  rating: number;
  published: boolean;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseSlug: string;
  slug: string;
  title: string;
  summary: string;
  contentMarkdown: string;
  readTimeMinutes: number;
  orderIndex: number;
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningProgress {
  userId: string;
  lessonId: string;
  courseSlug: string;
  completed: boolean;
  score?: number;
  updatedAt: string;
}

export interface AITool {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  beginnerExplanation: string;
  websiteUrl: string;
  logoUrl?: string;
  pricingModel: PricingModel;
  pricingDetails: string;
  isVerified: boolean;
  lastVerifiedDate: string;
  platforms: string[];
  capabilities: string[];
  pros: string[];
  cons: string[];
  alternatives: string[];
  useCases: string[];
  rating: number;
  ratingCount: number;
}

export interface AIModel {
  id: string;
  slug: string;
  name: string;
  organization: string;
  category: "LLM" | "Multimodal" | "Vision" | "Audio" | "Embedding" | "Reasoning";
  isOpenWeights: boolean;
  license: string;
  contextWindow: string;
  capabilities: string[];
  description: string;
  architectureDetails: string;
  officialDocUrl: string;
  benchmarks?: Record<string, string>;
  limitations: string[];
  releaseDate: string;
}

export interface PromptTemplate {
  id: string;
  slug: string;
  title: string;
  category: string;
  objective: string;
  context: string;
  instructions: string;
  constraints: string;
  outputFormat: string;
  fullTemplate: string;
  upvotes: number;
  author: string;
  tags: string[];
  createdAt: string;
}

export interface KnowledgeNode {
  id: string;
  slug: string;
  label: string;
  category: "Concept" | "Tool" | "Model" | "Course" | "Paper" | "Industry" | "Architecture";
  description: string;
  level: LearningLevel;
  linkUrl: string;
  x?: number;
  y?: number;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  relationship: "prerequisite_of" | "powers" | "uses" | "implements" | "belongs_to";
  label?: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  slug: string;
  category: string;
  beginnerDefinition: string;
  advancedDefinition: string;
  practicalExample: string;
  relatedTerms: string[];
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: string;
  publishedAt: string;
  isVerified: boolean;
  tags: string[];
}

export interface PracticalProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: LearningLevel;
  estimatedMinutes: number;
  toolsNeeded: string[];
  prerequisites: string[];
  steps: {
    stepNumber: number;
    title: string;
    instructionsMarkdown: string;
    codeSnippet?: string;
    codeLanguage?: string;
  }[];
  expectedOutcome: string;
  troubleshootingTips: string[];
}

export interface IndustryApplication {
  id: string;
  slug: string;
  name: string;
  iconName: string;
  overview: string;
  keyUseCases: {
    title: string;
    description: string;
    impact: string;
  }[];
  leadingCompanies: string[];
  ethicalConsiderations: string;
}

export interface AIModelEndpoint {
  id: string;
  name: string;
  provider: "openai-compatible" | "gemini" | "anthropic" | "ollama" | "custom";
  baseUrl: string;
  apiKey?: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
  status: "connected" | "error" | "untested";
  latencyMs?: number;
  isFallback?: boolean;
  lastTested?: string;
  createdAt: string;
}

export interface CourseModelAssignment {
  id: string;
  courseSlug: string;
  category: string;
  primaryModelId: string;
  fallbackModelId: string;
  systemPromptOverride?: string;
  temperature?: number;
  updatedAt: string;
}

export interface CourseKnowledgeChunk {
  id: string;
  courseSlug: string;
  moduleTitle: string;
  lessonSlug: string;
  lessonTitle: string;
  type: "syllabus" | "lesson_content" | "prerequisite" | "quiz_summary" | "code_example";
  content: string;
  keywords: string[];
  orderIndex: number;
}

export interface AIUsageMetric {
  id: string;
  timestamp: string;
  courseSlug: string;
  modelId: string;
  modelName: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  durationMs: number;
  success: boolean;
  fallbackTriggered: boolean;
  errorMessage?: string;
}
