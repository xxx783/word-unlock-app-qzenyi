
export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  progress: UserProgress;
  createdAt: string;
}

export interface UserProgress {
  unlockedCategories: string[];
  completedCategories: string[];
  currentStreak: number;
  totalWordsLearned: number;
  categoryProgress: { [categoryId: string]: CategoryProgress };
}

export interface CategoryProgress {
  categoryId: string;
  wordsLearned: string[];
  testsPassed: number;
  bestScore: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}

export interface WordCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  requiredCategory?: string; // Previous category that must be completed
  words: Word[];
}

export interface Word {
  id: string;
  word: string;
  definition: string;
  example: string;
  pronunciation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TestQuestion {
  id: string;
  word: Word;
  options: string[];
  correctAnswer: string;
  type: 'definition' | 'example' | 'word';
}

export interface TestResult {
  categoryId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  passed: boolean;
  completedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}
