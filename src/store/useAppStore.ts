/**
 * Global application state using Zustand.
 * Persists to localStorage for offline-first behavior.
 * Split into logical slices for maintainability.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  AppState,
  AppSettings,
  UserProfile,
  QuizSession,
  FlashcardProgress,
  Achievement,
  AnalyticsData,
  ConversationSession,
  AIConfig,
  QuestionDomain,
} from '@/types';
import { calculateAnalytics } from '@/utils/analytics';
import { calculateDomainReadiness } from '@/utils/readiness';

// Default settings for new users
const defaultSettings: AppSettings = {
  theme: 'dark',
  animationsEnabled: true,
  quizDefaults: {
    questionCount: 10,
    timed: false,
    timeLimitSeconds: 60,
    showImmediateFeedback: true,
  },
  soundEnabled: false,
  showTimerByDefault: false,
  autoAdvanceQuestions: false,
  showExplanationsImmediately: true,
};

// Default analytics state for new users
const defaultAnalytics: AnalyticsData = {
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  overallAccuracy: 0,
  quizSessionHistory: [],
  domainPerformance: [],
  weakTopics: [],
  confidencePatterns: {
    guessedCorrect: 0,
    guessedIncorrect: 0,
    somewhatSureCorrect: 0,
    somewhatSureIncorrect: 0,
    verySureCorrect: 0,
    verySureIncorrect: 0,
  },
  studyStreak: 0,
  totalStudyTimeMinutes: 0,
  flashcardsReviewed: 0,
  flashcardsMastered: 0,
};

// Default achievements list
const defaultAchievements: Achievement[] = [
  {
    id: 'first-quiz',
    title: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'perfect-score',
    title: 'Perfect Score',
    description: 'Score 100% on a quiz',
    icon: '⭐',
    unlocked: false,
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day study streak',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '💎',
    unlocked: false,
  },
  {
    id: 'questions-50',
    title: 'Questioner',
    description: 'Answer 50 questions',
    icon: '❓',
    unlocked: false,
  },
  {
    id: 'questions-200',
    title: 'Century Club',
    description: 'Answer 200 questions',
    icon: '💯',
    unlocked: false,
  },
  {
    id: 'flashcards-25',
    title: 'Card Collector',
    description: 'Review 25 flashcards',
    icon: '🃏',
    unlocked: false,
  },
  {
    id: 'flashcards-mastered-10',
    title: 'Memory Pro',
    description: 'Master 10 flashcards',
    icon: '🧠',
    unlocked: false,
  },
  {
    id: 'all-domains',
    title: 'Domain Expert',
    description: 'Answer questions in all 7 domains',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'ai-tutor',
    title: 'AI Apprentice',
    description: 'Have your first AI tutor session',
    icon: '🤖',
    unlocked: false,
  },
  {
    id: 'exam-pressure',
    title: 'Under Pressure',
    description: 'Complete an exam pressure mode quiz',
    icon: '⏱️',
    unlocked: false,
  },
  {
    id: 'readiness-80',
    title: 'Exam Ready',
    description: 'Reach 80% overall readiness',
    icon: '🎓',
    unlocked: false,
  },
];

interface AppStore extends AppState {
  // User actions
  setUserProfile: (profile: UserProfile) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setAIConfig: (config: AIConfig) => void;
  clearAIConfig: () => void;

  // Quiz actions
  addQuizSession: (session: QuizSession) => void;
  flagQuestion: (questionId: string) => void;
  unflagQuestion: (questionId: string) => void;

  // Flashcard actions
  updateFlashcardProgress: (cardId: string, progress: Partial<FlashcardProgress>) => void;

  // Achievement actions
  unlockAchievement: (achievementId: string) => void;

  // Domain readiness
  recalculateDomainReadiness: () => void;
  recordTutorInteraction: (domain: QuestionDomain) => void;

  // Conversation
  setCurrentConversation: (conversation: ConversationSession | null) => void;

  // Saved cards
  toggleSavedCard: (cardId: string) => void;

  // UI
  setSidebarOpen: (open: boolean) => void;

  // Data management
  resetProgress: () => void;
  exportData: () => string;
  importData: (json: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      userProfile: null,
      settings: defaultSettings,
      analytics: defaultAnalytics,
      quizSessions: [],
      flaggedQuestions: [],
      missedQuestions: [],
      flashcardProgress: {},
      achievements: defaultAchievements,
      domainReadiness: [],
      savedConceptCards: [],
      tutorInteractionsByDomain: {},
      sidebarOpen: false,
      currentConversation: null,

      // User actions
      setUserProfile: (profile) => set({ userProfile: profile }),

      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),

      setAIConfig: (config) =>
        set((state) => ({
          settings: { ...state.settings, aiConfig: config },
        })),

      clearAIConfig: () =>
        set((state) => ({
          settings: { ...state.settings, aiConfig: undefined },
        })),

      // Quiz actions
      addQuizSession: (session) => {
        set((state) => {
          const newSessions = [...state.quizSessions, session];

          // Update missed questions
          const newMissed = new Set(state.missedQuestions);
          session.answers.forEach((answer) => {
            if (!answer.isCorrect) {
              newMissed.add(answer.questionId);
            } else {
              newMissed.delete(answer.questionId);
            }
          });

          // Recalculate analytics
          const newAnalytics = calculateAnalytics(newSessions, state.flashcardProgress);

          return {
            quizSessions: newSessions,
            missedQuestions: Array.from(newMissed),
            analytics: newAnalytics,
          };
        });

        // Check achievements
        const state = get();
        const totalAnswered = state.analytics.totalQuestionsAnswered;

        if (state.quizSessions.length === 1) get().unlockAchievement('first-quiz');
        if (session.score === 100) get().unlockAchievement('perfect-score');
        if (totalAnswered >= 50) get().unlockAchievement('questions-50');
        if (totalAnswered >= 200) get().unlockAchievement('questions-200');
        if (session.mode === 'exam-pressure') get().unlockAchievement('exam-pressure');

        // Recalculate readiness
        get().recalculateDomainReadiness();
      },

      flagQuestion: (questionId) =>
        set((state) => ({
          flaggedQuestions: state.flaggedQuestions.includes(questionId)
            ? state.flaggedQuestions
            : [...state.flaggedQuestions, questionId],
        })),

      unflagQuestion: (questionId) =>
        set((state) => ({
          flaggedQuestions: state.flaggedQuestions.filter((id) => id !== questionId),
        })),

      // Flashcard actions
      updateFlashcardProgress: (cardId, progress) => {
        set((state) => {
          const existing = state.flashcardProgress[cardId] || {
            cardId,
            status: 'new' as const,
            reviewCount: 0,
            easeHistory: [],
          };

          const updated = { ...existing, ...progress };
          const newProgress = { ...state.flashcardProgress, [cardId]: updated };

          // Update analytics
          const mastered = Object.values(newProgress).filter((p) => p.status === 'mastered').length;
          const reviewed = Object.values(newProgress).filter((p) => p.reviewCount > 0).length;

          return {
            flashcardProgress: newProgress,
            analytics: {
              ...state.analytics,
              flashcardsReviewed: reviewed,
              flashcardsMastered: mastered,
            },
          };
        });

        // Check achievements
        const state = get();
        const mastered = Object.values(state.flashcardProgress).filter(
          (p) => p.status === 'mastered',
        ).length;
        const reviewed = Object.values(state.flashcardProgress).filter(
          (p) => p.reviewCount > 0,
        ).length;

        if (reviewed >= 25) get().unlockAchievement('flashcards-25');
        if (mastered >= 10) get().unlockAchievement('flashcards-mastered-10');

        get().recalculateDomainReadiness();
      },

      // Achievement actions
      unlockAchievement: (achievementId) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === achievementId && !a.unlocked
              ? { ...a, unlocked: true, earnedAt: new Date().toISOString() }
              : a,
          ),
        })),

      // Domain readiness
      recalculateDomainReadiness: () => {
        const state = get();
        const readiness = calculateDomainReadiness(
          state.quizSessions,
          state.flashcardProgress,
          state.tutorInteractionsByDomain,
        );
        set({ domainReadiness: readiness });

        // Check readiness achievement
        const avgReadiness =
          readiness.reduce((sum, r) => sum + r.readinessScore, 0) / readiness.length;
        if (avgReadiness >= 80) get().unlockAchievement('readiness-80');
      },

      recordTutorInteraction: (domain) => {
        set((state) => {
          const existing = state.tutorInteractionsByDomain[domain] || 0;
          return {
            tutorInteractionsByDomain: {
              ...state.tutorInteractionsByDomain,
              [domain]: existing + 1,
            },
          };
        });
        get().unlockAchievement('ai-tutor');
        get().recalculateDomainReadiness();
      },

      // Conversation
      setCurrentConversation: (conversation) => set({ currentConversation: conversation }),

      // Saved cards
      toggleSavedCard: (cardId) =>
        set((state) => ({
          savedConceptCards: state.savedConceptCards.includes(cardId)
            ? state.savedConceptCards.filter((id) => id !== cardId)
            : [...state.savedConceptCards, cardId],
        })),

      // UI
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Data management
      resetProgress: () =>
        set({
          analytics: defaultAnalytics,
          quizSessions: [],
          flaggedQuestions: [],
          missedQuestions: [],
          flashcardProgress: {},
          achievements: defaultAchievements,
          domainReadiness: [],
          savedConceptCards: [],
          tutorInteractionsByDomain: {},
          currentConversation: null,
        }),

      exportData: () => {
        const state = get();
        // Back up only the study data restored below. Provider credentials belong to this device.
        return JSON.stringify(
          {
            userProfile: state.userProfile,
            analytics: state.analytics,
            quizSessions: state.quizSessions,
            flaggedQuestions: state.flaggedQuestions,
            missedQuestions: state.missedQuestions,
            flashcardProgress: state.flashcardProgress,
            achievements: state.achievements,
            savedConceptCards: state.savedConceptCards,
          },
          null,
          2,
        );
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json);
          set({
            userProfile: data.userProfile || null,
            analytics: data.analytics || defaultAnalytics,
            quizSessions: data.quizSessions || [],
            flaggedQuestions: data.flaggedQuestions || [],
            missedQuestions: data.missedQuestions || [],
            flashcardProgress: data.flashcardProgress || {},
            achievements: data.achievements || defaultAchievements,
            savedConceptCards: data.savedConceptCards || [],
          });
        } catch {
          throw new Error('Invalid import data format');
        }
      },
    }),
    {
      name: 'secai-study-store',
      storage: createJSONStorage(() => localStorage),
      // Exclude UI state from persistence
      partialize: (state) => ({
        userProfile: state.userProfile,
        settings: state.settings,
        analytics: state.analytics,
        quizSessions: state.quizSessions,
        flaggedQuestions: state.flaggedQuestions,
        missedQuestions: state.missedQuestions,
        flashcardProgress: state.flashcardProgress,
        achievements: state.achievements,
        domainReadiness: state.domainReadiness,
        savedConceptCards: state.savedConceptCards,
        tutorInteractionsByDomain: state.tutorInteractionsByDomain,
      }),
    },
  ),
);
