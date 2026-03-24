/**
 * Custom hook for managing quiz state and logic.
 * Handles question selection, answer tracking, scoring, and session management.
 */
import { useState, useCallback, useRef } from 'react';
import { Question, QuizSession, QuizAnswer, QuizMode, QuestionDomain, Difficulty, ConfidenceLevel } from '@/types';
import { questions as allQuestions } from '@/data/questions';
import { useAppStore } from '@/store/useAppStore';

interface UseQuizOptions {
  mode: QuizMode;
  domain?: QuestionDomain;
  difficulty?: Difficulty;
  count?: number;
  timed?: boolean;
  timeLimitPerQuestion?: number;
  questionIds?: string[]; // for review/missed/flagged modes
}

interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: QuizAnswer[];
  isComplete: boolean;
  startTime: number;
  questionStartTime: number;
}

export function useQuiz(options: UseQuizOptions) {
  const { addQuizSession, flaggedQuestions, missedQuestions } = useAppStore();

  const [state, setState] = useState<QuizState>(() => {
    const selected = selectQuestions(options);
    return {
      questions: selected,
      currentIndex: 0,
      answers: [],
      isComplete: false,
      startTime: Date.now(),
      questionStartTime: Date.now(),
    };
  });

  const sessionIdRef = useRef(crypto.randomUUID());

  const currentQuestion = state.questions[state.currentIndex];
  const currentAnswer = state.answers[state.currentIndex];
  const progress = state.questions.length > 0
    ? ((state.currentIndex) / state.questions.length) * 100
    : 0;

  const submitAnswer = useCallback((
    selectedAnswer: number,
    confidence: ConfidenceLevel = 'somewhat-sure',
  ) => {
    if (!currentQuestion) return;

    const timeSpent = Math.round((Date.now() - state.questionStartTime) / 1000);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent,
      confidence,
      flagged: flaggedQuestions.includes(currentQuestion.id),
    };

    setState((prev) => ({
      ...prev,
      answers: [...prev.answers.slice(0, prev.currentIndex), answer, ...prev.answers.slice(prev.currentIndex + 1)],
    }));

    return answer;
  }, [currentQuestion, state.questionStartTime, flaggedQuestions]);

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex >= prev.questions.length - 1) {
        return { ...prev, isComplete: true };
      }
      return {
        ...prev,
        currentIndex: prev.currentIndex + 1,
        questionStartTime: Date.now(),
      };
    });
  }, []);

  const completeQuiz = useCallback(() => {
    const answeredCount = state.answers.filter(Boolean).length;
    const correctCount = state.answers.filter((a) => a?.isCorrect).length;
    const score = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

    const session: QuizSession = {
      id: sessionIdRef.current,
      startedAt: new Date(state.startTime).toISOString(),
      completedAt: new Date().toISOString(),
      mode: options.mode,
      domain: options.domain,
      difficulty: options.difficulty,
      timed: options.timed || false,
      timeLimitSeconds: options.timeLimitPerQuestion,
      questionIds: state.questions.map((q) => q.id),
      answers: state.answers.filter(Boolean),
      score,
      examPressureMode: options.mode === 'exam-pressure',
    };

    addQuizSession(session);
    setState((prev) => ({ ...prev, isComplete: true }));

    return session;
  }, [state, options, addQuizSession]);

  const skipQuestion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + 1, prev.questions.length - 1),
      questionStartTime: Date.now(),
    }));
  }, []);

  const jumpToQuestion = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(0, Math.min(index, prev.questions.length - 1)),
      questionStartTime: Date.now(),
    }));
  }, []);

  // Suppress unused variable warning — missedQuestions is available for
  // callers that filter questions externally before passing questionIds.
  void missedQuestions;

  return {
    questions: state.questions,
    currentQuestion,
    currentIndex: state.currentIndex,
    currentAnswer,
    answers: state.answers,
    isComplete: state.isComplete,
    progress,
    totalQuestions: state.questions.length,
    submitAnswer,
    nextQuestion,
    completeQuiz,
    skipQuestion,
    jumpToQuestion,
  };
}

function selectQuestions(options: UseQuizOptions): Question[] {
  const { mode, domain, difficulty, count = 10, questionIds } = options;

  let pool = [...allQuestions];

  // Apply filters
  if (domain) pool = pool.filter((q) => q.domain === domain);
  if (difficulty) pool = pool.filter((q) => q.difficulty === difficulty);

  // Special mode filtering
  switch (mode) {
    case 'flagged':
      // Will be filtered in component
      break;
    case 'missed':
      // Will be filtered in component
      break;
    case 'review':
      if (questionIds) {
        pool = pool.filter((q) => questionIds.includes(q.id));
      }
      break;
    case 'exam-pressure':
      // Mix of hard and medium questions
      pool = allQuestions.filter((q) => q.difficulty === 'hard' || q.difficulty === 'medium');
      break;
    default:
      break;
  }

  // Shuffle and limit
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
