/**
 * Analytics calculation utilities.
 * Derives performance metrics from raw quiz session and flashcard data.
 */
import {
  QuizSession,
  FlashcardProgress,
  AnalyticsData,
  DomainPerformance,
  WeakTopic,
  QuizSessionSummary,
  QuestionDomain,
} from '@/types';
import { questions } from '@/data/questions';
import { format, parseISO } from 'date-fns';

const DOMAINS: QuestionDomain[] = [
  'AI Security Fundamentals',
  'Securing AI Systems',
  'Adversarial Threats',
  'AI Governance & Compliance',
  'AI in Security Operations',
  'Data Security & Model Integrity',
  'Incident Response for AI Systems',
];

/**
 * Calculates comprehensive analytics from all quiz sessions and flashcard data.
 */
export function calculateAnalytics(
  sessions: QuizSession[],
  flashcardProgress: Record<string, FlashcardProgress>,
): AnalyticsData {
  const completedSessions = sessions.filter((s) => s.completedAt);

  // Total questions and correct answers
  let totalAnswered = 0;
  let totalCorrect = 0;

  // Build domain performance map
  const domainMap: Record<string, { total: number; correct: number; lastAttempted: string }> = {};

  // Confidence patterns
  const confidencePatterns = {
    guessedCorrect: 0,
    guessedIncorrect: 0,
    somewhatSureCorrect: 0,
    somewhatSureIncorrect: 0,
    verySureCorrect: 0,
    verySureIncorrect: 0,
  };

  // Build question lookup
  const questionMap = Object.fromEntries(questions.map((q) => [q.id, q]));

  completedSessions.forEach((session) => {
    session.answers.forEach((answer) => {
      totalAnswered++;
      if (answer.isCorrect) totalCorrect++;

      const question = questionMap[answer.questionId];
      if (question) {
        const domain = question.domain;
        if (!domainMap[domain]) {
          domainMap[domain] = { total: 0, correct: 0, lastAttempted: session.completedAt! };
        }
        domainMap[domain].total++;
        if (answer.isCorrect) domainMap[domain].correct++;
        if (session.completedAt! > domainMap[domain].lastAttempted) {
          domainMap[domain].lastAttempted = session.completedAt!;
        }
      }

      // Confidence patterns
      if (answer.confidence === 'guessed') {
        if (answer.isCorrect) confidencePatterns.guessedCorrect++;
        else confidencePatterns.guessedIncorrect++;
      } else if (answer.confidence === 'somewhat-sure') {
        if (answer.isCorrect) confidencePatterns.somewhatSureCorrect++;
        else confidencePatterns.somewhatSureIncorrect++;
      } else {
        if (answer.isCorrect) confidencePatterns.verySureCorrect++;
        else confidencePatterns.verySureIncorrect++;
      }
    });
  });

  // Build domain performance array
  const domainPerformance: DomainPerformance[] = DOMAINS.map((domain) => {
    const data = domainMap[domain];
    return {
      domain,
      totalAttempted: data?.total || 0,
      correct: data?.correct || 0,
      accuracy: data ? Math.round((data.correct / data.total) * 100) : 0,
      lastAttempted: data?.lastAttempted,
    };
  });

  // Weak topics (accuracy < 70% with at least 3 attempts)
  const weakTopics: WeakTopic[] = domainPerformance
    .filter((d) => d.totalAttempted >= 3 && d.accuracy < 70)
    .map((d) => ({
      domain: d.domain,
      accuracy: d.accuracy,
      questionCount: d.totalAttempted,
      recommendation: getRecommendation(d.domain, d.accuracy),
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  // Quiz session history (last 20)
  const sessionHistory: QuizSessionSummary[] = completedSessions
    .slice(-20)
    .reverse()
    .map((s) => ({
      id: s.id,
      date: s.completedAt!,
      score: s.score || 0,
      questionCount: s.questionIds.length,
      mode: s.mode,
      domain: s.domain,
    }));

  // Study streak
  const streak = calculateStreak(completedSessions);

  // Total study time
  const totalStudyTime = completedSessions.reduce((sum, s) => {
    const totalTime = s.answers.reduce((t, a) => t + a.timeSpent, 0);
    return sum + Math.round(totalTime / 60);
  }, 0);

  // Flashcard stats
  const fcValues = Object.values(flashcardProgress);
  const mastered = fcValues.filter((p) => p.status === 'mastered').length;
  const reviewed = fcValues.filter((p) => p.reviewCount > 0).length;

  // Last studied
  const lastStudied =
    completedSessions.length > 0
      ? completedSessions[completedSessions.length - 1].completedAt
      : undefined;

  return {
    totalQuestionsAnswered: totalAnswered,
    totalCorrect,
    overallAccuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
    quizSessionHistory: sessionHistory,
    domainPerformance,
    weakTopics,
    confidencePatterns,
    studyStreak: streak,
    lastStudiedAt: lastStudied,
    totalStudyTimeMinutes: totalStudyTime,
    flashcardsReviewed: reviewed,
    flashcardsMastered: mastered,
  };
}

/**
 * Calculates the current study streak in days.
 */
function calculateStreak(sessions: QuizSession[]): number {
  if (sessions.length === 0) return 0;

  const studyDates = new Set(
    sessions
      .filter((s) => s.completedAt)
      .map((s) => format(parseISO(s.completedAt!), 'yyyy-MM-dd')),
  );

  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

  if (!studyDates.has(today) && !studyDates.has(yesterday)) return 0;

  let streak = 0;
  let currentDate = studyDates.has(today) ? new Date() : new Date(Date.now() - 86400000);

  while (studyDates.has(format(currentDate, 'yyyy-MM-dd'))) {
    streak++;
    currentDate = new Date(currentDate.getTime() - 86400000);
  }

  return streak;
}

/**
 * Returns a study recommendation based on domain and accuracy.
 */
function getRecommendation(domain: QuestionDomain, _accuracy: number): string {
  const recommendations: Record<QuestionDomain, string> = {
    'AI Security Fundamentals':
      'Review AI/ML threat models and attack surface concepts in the Study Guides.',
    'Securing AI Systems':
      'Focus on MLOps security practices, model hardening, and deployment security.',
    'Adversarial Threats':
      'Practice with threat scenarios on adversarial examples and data poisoning.',
    'AI Governance & Compliance':
      'Review NIST AI RMF, EU AI Act risk tiers, and responsible AI principles.',
    'AI in Security Operations':
      'Study AI-powered SIEM/SOAR integration and UEBA concepts.',
    'Data Security & Model Integrity':
      'Focus on supply chain attacks, data provenance, and differential privacy.',
    'Incident Response for AI Systems':
      'Review AI incident response procedures and forensics for ML systems.',
  };

  return recommendations[domain] || 'Review this domain with flashcards and the AI tutor.';
}

/**
 * Formats accuracy percentage with color indicator.
 */
export function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 80) return 'text-green-400';
  if (accuracy >= 60) return 'text-amber-400';
  return 'text-red-400';
}

/**
 * Returns a motivational message based on performance.
 */
export function getMotivationalMessage(accuracy: number, streak: number): string {
  if (accuracy >= 90 && streak >= 7)
    return "Outstanding! You're on fire — exam day is coming early.";
  if (accuracy >= 80) return 'Strong performance. Keep hammering the weak domains.';
  if (accuracy >= 70) return 'Good progress. Focus on your weak spots and you\'ll level up fast.';
  if (accuracy >= 60) return 'Building momentum. Consistent practice is the key — stay at it.';
  if (streak >= 3) return `${streak}-day streak! Consistency beats intensity. Keep going.`;
  return 'Every question answered is progress. Start a streak today.';
}
