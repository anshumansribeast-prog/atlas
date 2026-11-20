"use client";

import { useState, useEffect } from "react";
import { UserRole, LearningLevel } from "./db/schema";

export interface UserState {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  level: LearningLevel;
  bookmarks: string[];
  completedLessons: string[];
}

const DEFAULT_USER: UserState = {
  id: "usr-learner",
  name: "Atlas Explorer",
  email: "learner@aiatlas.io",
  role: "user",
  level: "beginner",
  bookmarks: ["tool-claude", "tool-cursor"],
  completedLessons: ["les-1"],
};

export function useAtlasStore() {
  const [user, setUser] = useState<UserState>(DEFAULT_USER);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai_atlas_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {}
    setIsLoaded(true);
  }, []);

  const saveUser = (updated: UserState) => {
    setUser(updated);
    try {
      localStorage.setItem("ai_atlas_user", JSON.stringify(updated));
    } catch {}
  };

  const setRole = (role: UserRole) => {
    saveUser({ ...user, role });
  };

  const setLevel = (level: LearningLevel) => {
    saveUser({ ...user, level });
  };

  const toggleBookmark = (id: string) => {
    const exists = user.bookmarks.includes(id);
    const updated = exists ? user.bookmarks.filter((b) => b !== id) : [...user.bookmarks, id];
    saveUser({ ...user, bookmarks: updated });
  };

  const markLessonComplete = (lessonId: string) => {
    if (!user.completedLessons.includes(lessonId)) {
      saveUser({ ...user, completedLessons: [...user.completedLessons, lessonId] });
    }
  };

  return {
    user,
    setRole,
    setLevel,
    toggleBookmark,
    markLessonComplete,
    isSearchOpen,
    setIsSearchOpen,
    isLoaded,
  };
}
