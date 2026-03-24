/**
 * Domain readiness calculation.
 * Combines quiz performance, flashcard mastery, and tutor interactions
 * into a per-domain readiness score.
 */
import {
  QuizSession,
  FlashcardProgress,
  DomainReadiness,
  QuestionDomain,
} from '@/types';
import { questions } from '@/data/questions';
import { flashcards } from '@/data/flashcards';

const DOMAINS: QuestionDomain[] = [
  'AI Security Fundamentals',
  'Securing AI Systems',
  'Adversarial Threats',
  'AI Governance & Compliance',
  'AI in Security Operations',
  'Data Security & Model Integrity',
  'Incident Response for AI Systems',
];

// Weights for readiness calculation
const QUIZ_WEIGHT = 0.6;
const FLASHCARD_WEIGHT = 0.3;
const TUTOR_WEIGHT = 0.1;

/**
 * Calculates readiness score per domain based on multiple signals.
 * Returns 0-100 score per domain.
 */
export function calculateDomainReadiness(
  sessions: QuizSession[],
  flashcardProgress: Record<string, FlashcardProgress>,
  tutorInteractions: Record<string, number>,
): DomainReadiness[] {
  const questionMap = Object.fromEntries(questions.map((q) => [q.id, q]));

  return DOMAINS.map((domain) => {
    // --- Quiz signal ---
    let quizTotal = 0;
    let quizCorrect = 0;

    sessions.forEach((session) => {
      if (!session.completedAt) return;
      session.answers.forEach((answer) => {
        const q = questionMap[answer.questionId];
        if (q?.domain === domain) {
          quizTotal++;
          if (answer.isCorrect) quizCorrect++;
        }
      });
    });

    const quizScore =
      quizTotal >= 3
        ? (quizCorrect / quizTotal) * 100
        : quizTotal > 0
          ? (quizCorrect / quizTotal) * 60 // penalize low sample size
          : 0;

    // --- Flashcard signal ---
    const domainCards = flashcards.filter((f) => f.domain === domain);
    let fcScore = 0;

    if (domainCards.length > 0) {
      const fcPoints = domainCards.reduce((sum, card) => {
        const progress = flashcardProgress[card.id];
        if (!progress) return sum;
        const statusScore: Record<string, number> = {
          new: 0,
          learning: 25,
          review: 60,
          mastered: 100,
        };
        return sum + (statusScore[progress.status] || 0);
      }, 0);
      fcScore = fcPoints / domainCards.length;
    }

    // --- Tutor interaction signal ---
    const interactions = tutorInteractions[domain] || 0;
    const tutorScore = Math.min(interactions * 10, 100); // 10 pts per interaction, cap at 100

    // Weighted combination
    const readinessScore = Math.round(
      quizScore * QUIZ_WEIGHT + fcScore * FLASHCARD_WEIGHT + tutorScore * TUTOR_WEIGHT,
    );

    return {
      domain,
      readinessScore: Math.min(readinessScore, 100),
      quizWeight: Math.round(quizScore * QUIZ_WEIGHT),
      flashcardWeight: Math.round(fcScore * FLASHCARD_WEIGHT),
      tutorInteractionWeight: Math.round(tutorScore * TUTOR_WEIGHT),
      lastCalculated: new Date().toISOString(),
    };
  });
}

/**
 * Returns readiness tier label and color for a score.
 */
export function getReadinessTier(score: number): {
  label: string;
  color: string;
  bg: string;
} {
  if (score >= 85) return { label: 'Exam Ready', color: 'text-green-400', bg: 'bg-green-400/10' };
  if (score >= 70) return { label: 'Proficient', color: 'text-cyan-400', bg: 'bg-cyan-400/10' };
  if (score >= 50)
    return { label: 'Developing', color: 'text-amber-400', bg: 'bg-amber-400/10' };
  if (score >= 25)
    return { label: 'Novice', color: 'text-orange-400', bg: 'bg-orange-400/10' };
  return { label: 'Not Started', color: 'text-slate-400', bg: 'bg-slate-400/10' };
}
