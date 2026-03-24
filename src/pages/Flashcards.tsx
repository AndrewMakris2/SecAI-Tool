import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  BookOpen,
  Brain,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Badge, DomainBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/utils/cn';
import { flashcards } from '@/data/flashcards';
import type { QuestionDomain, FlashcardStatus } from '@/types';

const DOMAINS: QuestionDomain[] = [
  'AI Security Fundamentals',
  'Securing AI Systems',
  'Adversarial Threats',
  'AI Governance & Compliance',
  'AI in Security Operations',
  'Data Security & Model Integrity',
  'Incident Response for AI Systems',
];

const STATUS_FILTERS = ['All', 'New', 'Learning', 'Review', 'Mastered'] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Flashcards() {
  const { flashcardProgress, updateFlashcardProgress } = useAppStore();

  const [selectedDomain, setSelectedDomain] = useState<QuestionDomain | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [shuffled, setShuffled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Compute status counts
  const statusCounts = useMemo(() => {
    const counts = { new: 0, learning: 0, review: 0, mastered: 0 };
    flashcards.forEach((card) => {
      const prog = flashcardProgress[card.id];
      const status: FlashcardStatus = prog?.status ?? 'new';
      counts[status]++;
    });
    return counts;
  }, [flashcardProgress]);

  // Filter cards
  const filteredCards = useMemo(() => {
    let cards = flashcards;
    if (selectedDomain) {
      cards = cards.filter((c) => c.domain === selectedDomain);
    }
    if (statusFilter !== 'All') {
      const statusMap: Record<Exclude<StatusFilter, 'All'>, FlashcardStatus> = {
        New: 'new',
        Learning: 'learning',
        Review: 'review',
        Mastered: 'mastered',
      };
      const targetStatus = statusMap[statusFilter as Exclude<StatusFilter, 'All'>];
      cards = cards.filter((c) => (flashcardProgress[c.id]?.status ?? 'new') === targetStatus);
    }
    return shuffled ? shuffleArray(cards) : cards;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDomain, statusFilter, flashcardProgress, shuffled]);

  const safeIndex = Math.min(currentIndex, Math.max(filteredCards.length - 1, 0));
  const currentCard = filteredCards[safeIndex] ?? null;

  const masteredCount = filteredCards.filter(
    (c) => (flashcardProgress[c.id]?.status ?? 'new') === 'mastered',
  ).length;

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setIsFlipped(false);
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setIsFlipped(false);
    setCurrentIndex((i) => Math.min(i + 1, filteredCards.length - 1));
  }, [filteredCards.length]);

  const handleRate = useCallback(
    (status: FlashcardStatus) => {
      if (!currentCard) return;
      const existing = flashcardProgress[currentCard.id];
      updateFlashcardProgress(currentCard.id, {
        cardId: currentCard.id,
        status,
        reviewCount: (existing?.reviewCount ?? 0) + 1,
        lastReviewed: new Date().toISOString(),
        easeHistory: [
          ...(existing?.easeHistory ?? []),
          status === 'mastered' ? 'easy' : status === 'review' ? 'skip' : 'hard',
        ],
      });
      // Advance automatically
      if (safeIndex < filteredCards.length - 1) {
        setDirection(1);
        setIsFlipped(false);
        setCurrentIndex((i) => i + 1);
      }
    },
    [currentCard, flashcardProgress, updateFlashcardProgress, safeIndex, filteredCards.length],
  );

  const handleShuffleToggle = () => {
    setShuffled((s) => !s);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white pb-16">
      {/* Header */}
      <div className="px-4 pt-8 pb-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Brain className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Flashcards
          </h1>
        </div>
        <p className="text-slate-400 text-sm ml-12">
          Spaced-repetition review of all SecAI+ concepts
        </p>
      </div>

      {/* Stats Bar */}
      <div className="px-4 max-w-5xl mx-auto mb-6">
        <div className="grid grid-cols-4 gap-3">
          {(
            [
              { label: 'New', count: statusCounts.new, color: 'text-slate-300', bg: 'bg-slate-500/10 border-slate-500/20' },
              { label: 'Learning', count: statusCounts.learning, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
              { label: 'Review', count: statusCounts.review, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
              { label: 'Mastered', count: statusCounts.mastered, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
            ] as const
          ).map(({ label, count, color, bg }) => (
            <div
              key={label}
              className={cn('rounded-xl border px-4 py-3 text-center', bg)}
            >
              <div className={cn('text-2xl font-bold tabular-nums', color)}>{count}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 max-w-5xl mx-auto mb-4 space-y-3">
        {/* Domain pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setSelectedDomain(null); setCurrentIndex(0); setIsFlipped(false); }}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium border transition-all',
              !selectedDomain
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20',
            )}
          >
            All Domains
          </button>
          {DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => { setSelectedDomain(d); setCurrentIndex(0); setIsFlipped(false); }}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                selectedDomain === d
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20',
              )}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Status filter + controls row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-1 bg-navy-900 rounded-xl p-1 border border-white/5">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setCurrentIndex(0); setIsFlipped(false); }}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                  statusFilter === s
                    ? 'bg-navy-700 text-white shadow'
                    : 'text-slate-400 hover:text-white',
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant={shuffled ? 'glow' : 'secondary'}
              size="sm"
              leftIcon={<Shuffle className="w-3.5 h-3.5" />}
              onClick={handleShuffleToggle}
            >
              {shuffled ? 'Shuffled' : 'Shuffle'}
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="w-3.5 h-3.5" />} onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Card Area */}
      <div className="px-4 max-w-3xl mx-auto">
        {filteredCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BookOpen className="w-12 h-12 text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg font-medium">No cards match your filters</p>
            <p className="text-slate-500 text-sm mt-1">Try adjusting the domain or status filter</p>
          </div>
        ) : (
          <>
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-4 text-sm text-slate-400">
              <span>
                Card{' '}
                <span className="font-semibold text-white">{safeIndex + 1}</span> of{' '}
                <span className="font-semibold text-white">{filteredCards.length}</span>
              </span>
              {currentCard && (
                <DomainBadge domain={currentCard.domain} />
              )}
            </div>

            {/* Flashcard */}
            <AnimatePresence mode="wait">
              {currentCard && (
                <motion.div
                  key={`${currentCard.id}-${safeIndex}`}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 40 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="mb-4"
                >
                  {/* 3D Flip container */}
                  <div
                    className="relative cursor-pointer"
                    style={{ perspective: '1200px', minHeight: '320px' }}
                    onClick={() => setIsFlipped((f) => !f)}
                  >
                    <div
                      style={{
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        transformStyle: 'preserve-3d',
                        position: 'relative',
                        width: '100%',
                        minHeight: '320px',
                      }}
                    >
                      {/* Front face */}
                      <div
                        className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-white/10 bg-navy-800/80 backdrop-blur-sm p-8 shadow-xl shadow-black/30"
                        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                      >
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                          <div className="mb-3">
                            <Badge variant="blue" size="sm">Front</Badge>
                          </div>
                          <p className="text-2xl font-bold bg-gradient-to-br from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent leading-snug">
                            {currentCard.front}
                          </p>
                          {currentCard.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-5 justify-center">
                              {currentCard.tags.slice(0, 4).map((tag) => (
                                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-center text-xs text-slate-500 mt-4 select-none">
                          Click to flip
                        </p>
                      </div>

                      {/* Back face */}
                      <div
                        className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-cyan-500/20 bg-navy-800/90 backdrop-blur-sm p-8 shadow-xl shadow-cyan-500/10"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        <div className="flex-1 overflow-y-auto">
                          <div className="mb-3">
                            <Badge variant="cyan" size="sm">Answer</Badge>
                          </div>
                          <p className="text-slate-200 text-base leading-relaxed">
                            {currentCard.back}
                          </p>
                        </div>
                        {/* Rating buttons */}
                        <div className="mt-6 pt-4 border-t border-white/5">
                          <p className="text-xs text-slate-500 text-center mb-3 select-none">
                            How did you do?
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRate('learning'); }}
                              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium"
                            >
                              <span className="text-base">😓</span>
                              Hard
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRate('review'); }}
                              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all text-sm font-medium"
                            >
                              <span className="text-base">🤔</span>
                              Okay
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRate('mastered'); }}
                              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all text-sm font-medium"
                            >
                              <span className="text-base">✅</span>
                              Easy
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4 mb-8">
              <Button
                variant="secondary"
                size="md"
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                onClick={handlePrev}
                disabled={safeIndex === 0}
              >
                Prev
              </Button>

              <div className="flex gap-1">
                {filteredCards.slice(Math.max(0, safeIndex - 2), safeIndex + 3).map((c, idx) => {
                  const realIdx = Math.max(0, safeIndex - 2) + idx;
                  return (
                    <button
                      key={c.id}
                      onClick={() => { setCurrentIndex(realIdx); setIsFlipped(false); }}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all',
                        realIdx === safeIndex ? 'bg-cyan-400 scale-125' : 'bg-white/20 hover:bg-white/40',
                      )}
                    />
                  );
                })}
              </div>

              <Button
                variant="secondary"
                size="md"
                rightIcon={<ChevronRight className="w-4 h-4" />}
                onClick={handleNext}
                disabled={safeIndex === filteredCards.length - 1}
              >
                Next
              </Button>
            </div>

            {/* Bottom progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  {masteredCount} mastered
                </span>
                <span>{Math.round((masteredCount / filteredCards.length) * 100)}% complete</span>
              </div>
              <ProgressBar
                value={masteredCount}
                max={filteredCards.length}
                color="green"
                size="md"
              />
              {/* Multi-segment status bar */}
              <div className="flex rounded-full overflow-hidden h-1.5 bg-navy-900 mt-1">
                {filteredCards.map((c) => {
                  const status = flashcardProgress[c.id]?.status ?? 'new';
                  const color =
                    status === 'mastered' ? 'bg-green-500' :
                    status === 'review' ? 'bg-blue-500' :
                    status === 'learning' ? 'bg-amber-500' :
                    'bg-white/10';
                  return (
                    <div
                      key={c.id}
                      className={cn('flex-1 transition-all', color)}
                      style={{ margin: '0 0.5px' }}
                    />
                  );
                })}
              </div>
              <div className="flex gap-4 justify-center text-xs text-slate-500 flex-wrap pt-1">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/20 inline-block" />New</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Learning</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />Review</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Mastered</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
