// ============================================================
// Core type definitions for the SecAI+ Study Platform
// ============================================================

// Question domains matching SecAI+ exam objectives
export type QuestionDomain =
  | 'AI Security Fundamentals'
  | 'Securing AI Systems'
  | 'Adversarial Threats'
  | 'AI Governance & Compliance'
  | 'AI in Security Operations'
  | 'Data Security & Model Integrity'
  | 'Incident Response for AI Systems';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ConfidenceLevel = 'guessed' | 'somewhat-sure' | 'very-sure';

// ---- Practice Questions ----
export interface Question {
  id: string;
  question: string;
  choices: string[];
  correctAnswer: number; // index into choices array
  explanation: string;
  domain: QuestionDomain;
  difficulty: Difficulty;
  tags: string[];
}

// ---- Quiz Session ----
export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number; // seconds
  confidence: ConfidenceLevel;
  flagged: boolean;
}

export interface QuizSession {
  id: string;
  startedAt: string; // ISO date
  completedAt?: string;
  mode: QuizMode;
  domain?: QuestionDomain;
  difficulty?: Difficulty;
  timed: boolean;
  timeLimitSeconds?: number;
  questionIds: string[];
  answers: QuizAnswer[];
  score?: number; // 0-100
  examPressureMode?: boolean;
}

export type QuizMode = 'random' | 'domain' | 'difficulty' | 'review' | 'missed' | 'flagged' | 'exam-pressure' | 'last-minute';

// ---- Flashcards ----
export type FlashcardStatus = 'new' | 'learning' | 'review' | 'mastered';
export type FlashcardEase = 'easy' | 'hard' | 'skip';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  domain: QuestionDomain;
  tags: string[];
}

export interface FlashcardProgress {
  cardId: string;
  status: FlashcardStatus;
  reviewCount: number;
  lastReviewed?: string;
  nextReview?: string;
  easeHistory: FlashcardEase[];
}

// ---- Study Facts ----
export interface StudyFact {
  id: string;
  content: string;
  type: 'fact' | 'myth' | 'tip' | 'term' | 'concept';
  domain: QuestionDomain;
  isMythTrue?: boolean; // for myth cards: is the myth true or false?
  tags: string[];
}

// ---- Glossary ----
export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  domain: QuestionDomain;
  related?: string[];
}

// ---- Study Guides ----
export interface StudyGuideSection {
  id: string;
  title: string;
  summary: string;
  content: StudyGuideBlock[];
  domain: QuestionDomain;
  estimatedReadTime: number; // minutes
  difficulty: Difficulty;
  keyTakeaways?: string[]; // optional summary bullets shown at end of guide
}

export interface StudyGuideBlock {
  type: 'paragraph' | 'heading' | 'list' | 'code' | 'callout' | 'table';
  content: string;
  items?: string[]; // for list type
  columns?: string[]; // for table type
  rows?: string[][]; // for table type
  variant?: 'info' | 'warning' | 'danger' | 'success'; // for callout
}

// ---- Analytics ----
export interface DomainPerformance {
  domain: QuestionDomain;
  totalAttempted: number;
  correct: number;
  accuracy: number; // 0-100
  lastAttempted?: string;
}

export interface WeakTopic {
  domain: QuestionDomain;
  accuracy: number;
  questionCount: number;
  recommendation: string;
}

export interface AnalyticsData {
  totalQuestionsAnswered: number;
  totalCorrect: number;
  overallAccuracy: number;
  quizSessionHistory: QuizSessionSummary[];
  domainPerformance: DomainPerformance[];
  weakTopics: WeakTopic[];
  confidencePatterns: ConfidencePattern;
  studyStreak: number;
  lastStudiedAt?: string;
  totalStudyTimeMinutes: number;
  flashcardsReviewed: number;
  flashcardsMastered: number;
}

export interface QuizSessionSummary {
  id: string;
  date: string;
  score: number;
  questionCount: number;
  mode: QuizMode;
  domain?: QuestionDomain;
}

export interface ConfidencePattern {
  guessedCorrect: number;
  guessedIncorrect: number;
  somewhatSureCorrect: number;
  somewhatSureIncorrect: number;
  verySureCorrect: number;
  verySureIncorrect: number;
}

// ---- Achievements / Badges ----
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt?: string;
  progress?: number; // 0-100 for unlockable ones
  unlocked: boolean;
}

// ---- User Profile ----
export type StudyGoal = 'pass-exam' | 'refresh-knowledge' | 'career-growth' | 'just-curious';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  name?: string;
  studyGoal: StudyGoal;
  experienceLevel: ExperienceLevel;
  onboardingComplete: boolean;
  createdAt: string;
  dailyGoalMinutes: number;
  targetExamDate?: string;
}

// ---- AI Tutor ----
export type AIProvider = 'openai' | 'anthropic' | 'groq' | 'openrouter' | 'gemini';

export type TutoringMode =
  | 'explain'
  | 'hint-only'
  | 'quiz-me'
  | 'challenge'
  | 'simple'
  | 'analogy'
  | 'mini-quiz'
  | 'explain-role';

export type ExplainRole = 'soc-analyst' | 'security-engineer' | 'grc-analyst' | 'cloud-engineer' | 'executive';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tutoringMode?: TutoringMode;
}

export interface ConversationSession {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
  title?: string;
  tutoringMode: TutoringMode;
}

// ---- App Settings ----
export interface AppSettings {
  theme: 'dark' | 'light';
  animationsEnabled: boolean;
  aiConfig?: AIConfig;
  quizDefaults: QuizDefaults;
  soundEnabled: boolean;
  showTimerByDefault: boolean;
  autoAdvanceQuestions: boolean;
  showExplanationsImmediately: boolean;
}

export interface QuizDefaults {
  questionCount: number;
  timed: boolean;
  timeLimitSeconds: number;
  showImmediateFeedback: boolean;
}

// ---- Domain Readiness ----
export interface DomainReadiness {
  domain: QuestionDomain;
  readinessScore: number; // 0-100
  quizWeight: number;
  flashcardWeight: number;
  tutorInteractionWeight: number;
  lastCalculated: string;
}

// ---- Threat Scenario ----
export interface ThreatScenario {
  id: string;
  title: string;
  scenario: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  controls: string[];
  domain: QuestionDomain;
  difficulty: Difficulty;
}

// ---- App State Slices ----
export interface AppState {
  // User
  userProfile: UserProfile | null;
  settings: AppSettings;

  // Progress
  analytics: AnalyticsData;
  quizSessions: QuizSession[];
  flaggedQuestions: string[]; // question IDs
  missedQuestions: string[]; // question IDs
  flashcardProgress: Record<string, FlashcardProgress>;
  achievements: Achievement[];
  domainReadiness: DomainReadiness[];
  savedConceptCards: string[]; // studyFact or flashcard IDs
  tutorInteractionsByDomain: Record<string, number>;

  // UI
  sidebarOpen: boolean;
  currentConversation: ConversationSession | null;
}
