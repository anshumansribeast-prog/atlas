import {
  AITool,
  AIModel,
  Course,
  PromptTemplate,
  KnowledgeNode,
  KnowledgeEdge,
  GlossaryTerm,
  NewsArticle,
  PracticalProject,
  IndustryApplication,
  LearningProgress,
  User,
} from "./schema";
import {
  SEED_TOOLS,
  SEED_MODELS,
  SEED_COURSES,
  SEED_PROMPTS,
  SEED_GRAPH_NODES,
  SEED_GRAPH_EDGES,
  SEED_GLOSSARY,
  SEED_PROJECTS,
  SEED_INDUSTRIES,
  SEED_NEWS,
} from "./seed-data";

interface DatabaseStore {
  users: User[];
  tools: AITool[];
  models: AIModel[];
  courses: Course[];
  prompts: PromptTemplate[];
  knowledgeNodes: KnowledgeNode[];
  knowledgeEdges: KnowledgeEdge[];
  glossary: GlossaryTerm[];
  projects: PracticalProject[];
  industries: IndustryApplication[];
  news: NewsArticle[];
  progress: LearningProgress[];
  savedPrompts: { userId: string; promptId: string; savedAt: string }[];
  bookmarks: { userId: string; itemType: string; itemId: string; createdAt: string }[];
  auditLogs: { id: string; userId: string; action: string; timestamp: string; details: any }[];
  submissions: { id: string; type: string; title: string; payload: any; status: "pending" | "approved" | "rejected"; submittedAt: string }[];
}

const isServer = typeof window === "undefined";
const DB_FILE_PATH = "atlas-data.json";

function getFs() {
  if (!isServer) return null;
  try {
    return require("fs");
  } catch {
    return null;
  }
}

class DatabaseEngine {
  private store: DatabaseStore;

  constructor() {
    this.store = this.loadDatabase();
  }

  private loadDatabase(): DatabaseStore {
    const fs = getFs();
    if (fs) {
      try {
        if (fs.existsSync(DB_FILE_PATH)) {
          const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
          return JSON.parse(raw);
        }
      } catch (err) {
        console.warn("Could not read DB file, initializing fresh store.", err);
      }
    }

    const initialStore: DatabaseStore = {
      users: [
        {
          id: "usr-admin-1",
          email: "admin@aiatlas.io",
          name: "Atlas Admin",
          role: "admin",
          createdAt: new Date().toISOString(),
        },
        {
          id: "usr-demo-1",
          email: "learner@aiatlas.io",
          name: "Autonomous Learner",
          role: "user",
          createdAt: new Date().toISOString(),
        },
      ],
      tools: SEED_TOOLS,
      models: SEED_MODELS,
      courses: SEED_COURSES,
      prompts: SEED_PROMPTS,
      knowledgeNodes: SEED_GRAPH_NODES,
      knowledgeEdges: SEED_GRAPH_EDGES,
      glossary: SEED_GLOSSARY,
      projects: SEED_PROJECTS,
      industries: SEED_INDUSTRIES,
      news: SEED_NEWS,
      progress: [
        {
          userId: "usr-demo-1",
          courseSlug: "ai-for-beginners",
          lessonId: "les-1",
          completed: true,
          score: 100,
          updatedAt: new Date().toISOString(),
        },
      ],
      savedPrompts: [
        {
          userId: "usr-demo-1",
          promptId: "prompt-senior-architect",
          savedAt: new Date().toISOString(),
        },
      ],
      bookmarks: [
        {
          userId: "usr-demo-1",
          itemType: "tool",
          itemId: "tool-claude",
          createdAt: new Date().toISOString(),
        },
      ],
      auditLogs: [
        {
          id: "log-init",
          userId: "usr-admin-1",
          action: "INITIALIZE_DATABASE",
          timestamp: new Date().toISOString(),
          details: { message: "AI ATLAS database initialized with verified seed schemas" },
        },
      ],
      submissions: [],
    };

    this.saveDatabase(initialStore);
    return initialStore;
  }

  private saveDatabase(dataToSave?: DatabaseStore) {
    const fs = getFs();
    if (!fs) return;
    try {
      const data = dataToSave || this.store;
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to persist database to disk:", err);
    }
  }

  // --- TOOLS ---
  public getTools(): AITool[] {
    return this.store.tools;
  }

  public getToolBySlug(slug: string): AITool | undefined {
    return this.store.tools.find((t) => t.slug === slug || t.id === slug);
  }

  public addTool(tool: AITool): AITool {
    this.store.tools.push(tool);
    this.saveDatabase();
    return tool;
  }

  // --- MODELS ---
  public getModels(): AIModel[] {
    return this.store.models;
  }

  public getModelBySlug(slug: string): AIModel | undefined {
    return this.store.models.find((m) => m.slug === slug || m.id === slug);
  }

  // --- COURSES & LMS ---
  public getCourses(): Course[] {
    return this.store.courses;
  }

  public getCourseBySlug(slug: string): Course | undefined {
    return this.store.courses.find((c) => c.slug === slug);
  }

  public getLesson(courseSlug: string, lessonSlug: string) {
    const course = this.getCourseBySlug(courseSlug);
    if (!course) return null;
    for (const mod of course.modules) {
      const lesson = mod.lessons.find((l) => l.slug === lessonSlug || l.id === lessonSlug);
      if (lesson) return { course, module: mod, lesson };
    }
    return null;
  }

  // --- PROMPTS ---
  public getPrompts(): PromptTemplate[] {
    return this.store.prompts;
  }

  public getPromptBySlug(slug: string): PromptTemplate | undefined {
    return this.store.prompts.find((p) => p.slug === slug || p.id === slug);
  }

  public createPrompt(prompt: PromptTemplate): PromptTemplate {
    this.store.prompts.unshift(prompt);
    this.saveDatabase();
    return prompt;
  }

  public upvotePrompt(id: string): number {
    const prompt = this.store.prompts.find((p) => p.id === id || p.slug === id);
    if (prompt) {
      prompt.upvotes += 1;
      this.saveDatabase();
      return prompt.upvotes;
    }
    return 0;
  }

  // --- GRAPH ---
  public getGraphData() {
    return {
      nodes: this.store.knowledgeNodes,
      edges: this.store.knowledgeEdges,
    };
  }

  // --- GLOSSARY ---
  public getGlossary(): GlossaryTerm[] {
    return this.store.glossary;
  }

  // --- PROJECTS ---
  public getProjects(): PracticalProject[] {
    return this.store.projects;
  }

  public getProjectBySlug(slug: string): PracticalProject | undefined {
    return this.store.projects.find((p) => p.slug === slug);
  }

  // --- INDUSTRIES ---
  public getIndustries(): IndustryApplication[] {
    return this.store.industries;
  }

  public getIndustryBySlug(slug: string): IndustryApplication | undefined {
    return this.store.industries.find((i) => i.slug === slug);
  }

  // --- NEWS ---
  public getNews(): NewsArticle[] {
    return this.store.news;
  }

  // --- PROGRESS & USER TELEMETRY ---
  public getProgress(userId: string): LearningProgress[] {
    return this.store.progress.filter((p) => p.userId === userId);
  }

  public saveProgress(progress: LearningProgress) {
    const existingIndex = this.store.progress.findIndex(
      (p) => p.userId === progress.userId && p.lessonId === progress.lessonId
    );
    if (existingIndex >= 0) {
      this.store.progress[existingIndex] = progress;
    } else {
      this.store.progress.push(progress);
    }
    this.saveDatabase();
  }

  // --- BOOKMARKS & SAVED ---
  public toggleBookmark(userId: string, itemType: string, itemId: string) {
    const index = this.store.bookmarks.findIndex(
      (b) => b.userId === userId && b.itemType === itemType && b.itemId === itemId
    );
    if (index >= 0) {
      this.store.bookmarks.splice(index, 1);
    } else {
      this.store.bookmarks.push({
        userId,
        itemType,
        itemId,
        createdAt: new Date().toISOString(),
      });
    }
    this.saveDatabase();
    return this.store.bookmarks.filter((b) => b.userId === userId);
  }

  public getBookmarks(userId: string) {
    return this.store.bookmarks.filter((b) => b.userId === userId);
  }

  // --- SUBMISSIONS & AUDIT ---
  public addSubmission(sub: { type: string; title: string; payload: any }) {
    const item = {
      id: "sub-" + Date.now(),
      ...sub,
      status: "pending" as const,
      submittedAt: new Date().toISOString(),
    };
    this.store.submissions.push(item);
    this.addAuditLog("usr-demo-1", "SUBMIT_" + sub.type.toUpperCase(), item);
    this.saveDatabase();
    return item;
  }

  public getSubmissions() {
    return this.store.submissions;
  }

  public approveSubmission(id: string) {
    const sub = this.store.submissions.find((s) => s.id === id);
    if (sub) {
      sub.status = "approved";
      if (sub.type === "tool") {
        this.addTool(sub.payload);
      } else if (sub.type === "prompt") {
        this.createPrompt(sub.payload);
      }
      this.addAuditLog("usr-admin-1", "APPROVE_SUBMISSION", { id, type: sub.type });
      this.saveDatabase();
    }
    return sub;
  }

  public addAuditLog(userId: string, action: string, details: any) {
    this.store.auditLogs.unshift({
      id: "log-" + Date.now(),
      userId,
      action,
      timestamp: new Date().toISOString(),
      details,
    });
    this.saveDatabase();
  }

  public getAuditLogs() {
    return this.store.auditLogs;
  }

  // --- GLOBAL SEARCH ENGINE ---
  public search(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: {
      type: "course" | "tool" | "model" | "prompt" | "term" | "project" | "news";
      title: string;
      description: string;
      url: string;
      badge?: string;
    }[] = [];

    // Search Tools
    for (const tool of this.store.tools) {
      if (
        tool.name.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.capabilities.some((c) => c.toLowerCase().includes(q))
      ) {
        results.push({
          type: "tool",
          title: tool.name,
          description: tool.tagline,
          url: `/tools/${tool.slug}`,
          badge: tool.category,
        });
      }
    }

    // Search Models
    for (const model of this.store.models) {
      if (
        model.name.toLowerCase().includes(q) ||
        model.organization.toLowerCase().includes(q) ||
        model.description.toLowerCase().includes(q)
      ) {
        results.push({
          type: "model",
          title: model.name,
          description: `${model.organization} • ${model.category} (${model.contextWindow})`,
          url: `/models#${model.slug}`,
          badge: model.organization,
        });
      }
    }

    // Search Courses & Lessons
    for (const course of this.store.courses) {
      if (course.title.toLowerCase().includes(q) || course.description.toLowerCase().includes(q)) {
        results.push({
          type: "course",
          title: course.title,
          description: course.description,
          url: `/learn/${course.slug}`,
          badge: course.level.toUpperCase(),
        });
      }
      for (const mod of course.modules) {
        for (const les of mod.lessons) {
          if (les.title.toLowerCase().includes(q) || les.summary.toLowerCase().includes(q)) {
            results.push({
              type: "course",
              title: `${les.title} (${course.title})`,
              description: les.summary,
              url: `/learn/${course.slug}/${les.slug}`,
              badge: "Lesson",
            });
          }
        }
      }
    }

    // Search Glossary
    for (const term of this.store.glossary) {
      if (
        term.term.toLowerCase().includes(q) ||
        term.beginnerDefinition.toLowerCase().includes(q) ||
        term.advancedDefinition.toLowerCase().includes(q)
      ) {
        results.push({
          type: "term",
          title: term.term,
          description: term.beginnerDefinition,
          url: `/dictionary#${term.slug}`,
          badge: "Glossary",
        });
      }
    }

    // Search Prompts
    for (const prompt of this.store.prompts) {
      if (prompt.title.toLowerCase().includes(q) || prompt.objective.toLowerCase().includes(q)) {
        results.push({
          type: "prompt",
          title: prompt.title,
          description: prompt.objective,
          url: `/prompt-lab#${prompt.slug}`,
          badge: prompt.category,
        });
      }
    }

    // Search Projects
    for (const proj of this.store.projects) {
      if (proj.title.toLowerCase().includes(q) || proj.description.toLowerCase().includes(q)) {
        results.push({
          type: "project",
          title: proj.title,
          description: proj.description,
          url: `/dev-lab#${proj.slug}`,
          badge: proj.difficulty.toUpperCase(),
        });
      }
    }

    return results.slice(0, 15);
  }
}

// Global Singleton instance for server runtimes
export const db = new DatabaseEngine();
