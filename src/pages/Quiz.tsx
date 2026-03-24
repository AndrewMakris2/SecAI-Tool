import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Flag,
  Timer,
  CheckCircle,
  XCircle,
  BarChart2,
  RefreshCw,
  Home,
  Zap,
  BookOpen,
  AlertCircle,
  Target,
  Brain,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { DomainBadge, DifficultyBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/utils/cn';
import {
  Question,
  QuestionDomain,
  Difficulty,
  QuizMode,
  QuizSession,
  QuizAnswer,
  ConfidenceLevel,
} from '@/types';
import { questions as allQuestions } from '@/data/questions';

// ── Types ────────────────────────────────────────────────────────────────────

type QuizScreen = 'setup' | 'active' | 'results';

interface QuizConfig {
  mode: QuizMode;
  domain?: QuestionDomain;
  difficulty?: Difficulty;
  questionCount: number;
  timed: boolean;
  timeLimitSeconds: number;
  immediateFeeback: boolean;
}

interface ActiveAnswer {
  selectedIndex: number | null;
  submitted: boolean;
  confidence: ConfidenceLevel | null;
  timeSpent: number;
  flagged: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DOMAINS: QuestionDomain[] = [
  'AI Security Fundamentals',
  'Securing AI Systems',
  'Adversarial Threats',
  'AI Governance & Compliance',
  'AI in Security Operations',
  'Data Security & Model Integrity',
  'Incident Response for AI Systems',
];

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

const CONFIDENCE_OPTIONS: { value: ConfidenceLevel; label: string; color: string }[] = [
  { value: 'guessed', label: 'Guessed', color: 'text-red-400 border-red-500/40 bg-red-500/10 hover:bg-red-500/20' },
  { value: 'somewhat-sure', label: 'Somewhat Sure', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20' },
  { value: 'very-sure', label: 'Very Sure', color: 'text-green-400 border-green-500/40 bg-green-500/10 hover:bg-green-500/20' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateId(): string {
  return `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildQuestions(config: QuizConfig, missedIds: string[]): Question[] {
  let pool: Question[] = [...allQuestions];

  if (config.mode === 'domain' && config.domain) {
    pool = pool.filter((q) => q.domain === config.domain);
  } else if (config.mode === 'difficulty' && config.difficulty) {
    pool = pool.filter((q) => q.difficulty === config.difficulty);
  } else if (config.mode === 'missed') {
    const idSet = new Set(missedIds);
    pool = pool.filter((q) => idSet.has(q.id));
  } else if (config.mode === 'exam-pressure') {
    pool = shuffleArray(pool).slice(0, 45);
    return pool;
  }

  pool = shuffleArray(pool);
  return pool.slice(0, config.questionCount);
}

// ── Setup Screen ──────────────────────────────────────────────────────────────

interface SetupScreenProps {
  onStart: (config: QuizConfig) => void;
  missedCount: number;
}

function SetupScreen({ onStart, missedCount }: SetupScreenProps) {
  const [mode, setMode] = useState<QuizMode>('random');
  const [domain, setDomain] = useState<QuestionDomain>('AI Security Fundamentals');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [timed, setTimed] = useState(false);
  const [immediateFeeback, setImmediateFeeback] = useState(true);

  const handleStart = () => {
    onStart({
      mode,
      domain: mode === 'domain' ? domain : undefined,
      difficulty: mode === 'difficulty' ? difficulty : undefined,
      questionCount: mode === 'exam-pressure' ? 45 : questionCount,
      timed: mode === 'exam-pressure' ? true : timed,
      timeLimitSeconds: 60,
      immediateFeeback,
    });
  };

  const modeOptions: { value: QuizMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: 'random', label: 'Random', icon: <Zap size={16} />, desc: 'Mixed questions from all domains' },
    { value: 'domain', label: 'By Domain', icon: <BookOpen size={16} />, desc: 'Focus on one domain' },
    { value: 'difficulty', label: 'By Difficulty', icon: <Target size={16} />, desc: 'Filter by question difficulty' },
    { value: 'exam-pressure', label: 'Exam Pressure', icon: <Timer size={16} />, desc: '45 questions, 60s per question' },
    { value: 'missed', label: 'Missed Questions', icon: <AlertCircle size={16} />, desc: `Practice ${missedCount} missed questions` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-10"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Quiz Setup</h1>
        <p className="text-slate-400">Configure your practice session</p>
      </div>

      <Card className="space-y-6">
        {/* Mode Selection */}
        <div>
          <p className="text-sm font-semibold text-slate-300 mb-3">Quiz Mode</p>
          <div className="grid grid-cols-1 gap-2">
            {modeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMode(opt.value)}
                disabled={opt.value === 'missed' && missedCount === 0}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150',
                  mode === opt.value
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300'
                    : 'bg-navy-900/40 border-white/5 text-slate-300 hover:border-white/15 hover:bg-navy-800/60',
                  opt.value === 'missed' && missedCount === 0 && 'opacity-40 cursor-not-allowed',
                )}
              >
                <div className={cn('flex-shrink-0', mode === opt.value ? 'text-cyan-400' : 'text-slate-500')}>
                  {opt.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-xs text-slate-500 truncate">{opt.desc}</p>
                </div>
                {mode === opt.value && (
                  <CheckCircle size={16} className="text-cyan-400 flex-shrink-0 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Domain Selector */}
        {mode === 'domain' && (
          <div>
            <p className="text-sm font-semibold text-slate-300 mb-3">Select Domain</p>
            <div className="grid grid-cols-1 gap-2">
              {DOMAINS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDomain(d)}
                  className={cn(
                    'flex items-center gap-2 p-2.5 rounded-xl border text-sm text-left transition-all',
                    domain === d
                      ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                      : 'bg-navy-900/40 border-white/5 text-slate-300 hover:border-white/10',
                  )}
                >
                  {domain === d && <CheckCircle size={14} className="text-blue-400 flex-shrink-0" />}
                  <span className="truncate">{d}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Difficulty Selector */}
        {mode === 'difficulty' && (
          <div>
            <p className="text-sm font-semibold text-slate-300 mb-3">Difficulty</p>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    'flex-1 py-2 rounded-xl border text-sm font-medium capitalize transition-all',
                    difficulty === d
                      ? d === 'easy'
                        ? 'bg-green-500/15 border-green-500/40 text-green-300'
                        : d === 'medium'
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                        : 'bg-red-500/15 border-red-500/40 text-red-300'
                      : 'bg-navy-900/40 border-white/5 text-slate-400 hover:border-white/10',
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question Count */}
        {mode !== 'exam-pressure' && mode !== 'missed' && (
          <div>
            <p className="text-sm font-semibold text-slate-300 mb-3">Number of Questions</p>
            <div className="flex gap-2">
              {[10, 25, 50].map((n) => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  className={cn(
                    'flex-1 py-2 rounded-xl border text-sm font-semibold transition-all',
                    questionCount === n
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                      : 'bg-navy-900/40 border-white/5 text-slate-400 hover:border-white/10',
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Toggles */}
        {mode !== 'exam-pressure' && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-300">Options</p>
            {[
              {
                label: 'Immediate Feedback',
                desc: 'Show correct answer after each question',
                value: immediateFeeback,
                toggle: () => setImmediateFeeback((v) => !v),
              },
              {
                label: 'Timed Mode',
                desc: '60 seconds per question',
                value: timed,
                toggle: () => setTimed((v) => !v),
              },
            ].map(({ label, desc, value, toggle }) => (
              <button
                key={label}
                onClick={toggle}
                className="flex items-center justify-between w-full p-3 rounded-xl bg-navy-900/40 border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="text-left">
                  <p className="text-sm text-slate-200 font-medium">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
                <div
                  className={cn(
                    'w-10 h-5 rounded-full relative transition-colors duration-200 flex-shrink-0 ml-4',
                    value ? 'bg-cyan-500' : 'bg-navy-700',
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
                      value ? 'translate-x-5' : 'translate-x-0.5',
                    )}
                  />
                </div>
              </button>
            ))}
          </div>
        )}

        <Button variant="primary" size="lg" className="w-full" onClick={handleStart}>
          Start Quiz
        </Button>
      </Card>
    </motion.div>
  );
}

// ── Active Quiz Screen ────────────────────────────────────────────────────────

interface ActiveQuizProps {
  questions: Question[];
  config: QuizConfig;
  onComplete: (answers: ActiveAnswer[]) => void;
  flaggedIds: string[];
  onFlag: (id: string) => void;
  onUnflag: (id: string) => void;
}

function ActiveQuiz({
  questions: quizQuestions,
  config,
  onComplete,
  flaggedIds,
  onFlag,
  onUnflag,
}: ActiveQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ActiveAnswer[]>(
    quizQuestions.map(() => ({
      selectedIndex: null,
      submitted: false,
      confidence: null,
      timeSpent: 0,
      flagged: false,
    })),
  );
  const [timeLeft, setTimeLeft] = useState(config.timeLimitSeconds);
  const questionStartTime = useRef<number>(Date.now());

  const currentQ = quizQuestions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const isFlagged = flaggedIds.includes(currentQ.id) || currentAnswer.flagged;

  // Timer
  useEffect(() => {
    if (!config.timed || currentAnswer.submitted) return;
    setTimeLeft(config.timeLimitSeconds);
    questionStartTime.current = Date.now();

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          // Auto-submit with no answer
          submitAnswer(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, config.timed]);

  const submitAnswer = useCallback(
    (selectedIndex: number | null) => {
      const timeSpent = Math.round((Date.now() - questionStartTime.current) / 1000);
      setAnswers((prev) => {
        const next = [...prev];
        next[currentIndex] = {
          ...next[currentIndex],
          selectedIndex,
          submitted: true,
          timeSpent,
        };
        return next;
      });
    },
    [currentIndex],
  );

  const selectChoice = (idx: number) => {
    if (currentAnswer.submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = { ...next[currentIndex], selectedIndex: idx };
      return next;
    });

    // If immediate feedback is off, auto-submit on selection
    if (!config.immediateFeeback) {
      const timeSpent = Math.round((Date.now() - questionStartTime.current) / 1000);
      setAnswers((prev) => {
        const next = [...prev];
        next[currentIndex] = {
          ...next[currentIndex],
          selectedIndex: idx,
          submitted: true,
          timeSpent,
        };
        return next;
      });
    }
  };

  const handleSubmit = () => {
    if (currentAnswer.selectedIndex === null) return;
    submitAnswer(currentAnswer.selectedIndex);
  };

  const setConfidence = (level: ConfidenceLevel) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = { ...next[currentIndex], confidence: level };
      return next;
    });
  };

  const toggleFlag = () => {
    const flagged = !currentAnswer.flagged;
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = { ...next[currentIndex], flagged };
      return next;
    });
    if (flagged) {
      onFlag(currentQ.id);
    } else {
      onUnflag(currentQ.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete(answers);
    }
  };

  const isCorrect =
    currentAnswer.submitted && currentAnswer.selectedIndex === currentQ.correctAnswer;
  const isLast = currentIndex === quizQuestions.length - 1;

  const timerColor =
    timeLeft > 30 ? 'text-green-400' : timeLeft > 15 ? 'text-amber-400' : 'text-red-400';
  const timerBg =
    timeLeft > 30 ? 'bg-green-500' : timeLeft > 15 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Progress Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>
              Question {currentIndex + 1} of {quizQuestions.length}
            </span>
            <span>
              {answers.filter((a) => a.submitted && a.selectedIndex === quizQuestions[answers.indexOf(a)]?.correctAnswer).length} correct
            </span>
          </div>
          <ProgressBar
            value={currentIndex + (currentAnswer.submitted ? 1 : 0)}
            max={quizQuestions.length}
            size="sm"
            color="gradient"
          />
        </div>
        {config.timed && !currentAnswer.submitted && (
          <div className={cn('flex items-center gap-1.5 text-sm font-bold flex-shrink-0', timerColor)}>
            <Timer size={14} />
            <span>{timeLeft}s</span>
          </div>
        )}
      </div>

      {/* Timer bar */}
      {config.timed && !currentAnswer.submitted && (
        <div className="h-1 w-full bg-navy-900 rounded-full overflow-hidden mb-6">
          <motion.div
            className={cn('h-full rounded-full', timerBg)}
            style={{ width: `${(timeLeft / config.timeLimitSeconds) * 100}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>
      )}

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="mb-4">
            {/* Meta badges */}
            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <DomainBadge domain={currentQ.domain} />
                <DifficultyBadge difficulty={currentQ.difficulty} />
              </div>
              <button
                onClick={toggleFlag}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all',
                  isFlagged
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300',
                )}
              >
                <Flag size={12} />
                {isFlagged ? 'Flagged' : 'Flag'}
              </button>
            </div>

            {/* Question text */}
            <p className="text-white text-lg font-medium leading-relaxed mb-6">
              {currentQ.question}
            </p>

            {/* Answer choices */}
            <div className="space-y-3">
              {currentQ.choices.map((choice, idx) => {
                const isSelected = currentAnswer.selectedIndex === idx;
                const isCorrectChoice = idx === currentQ.correctAnswer;

                let choiceStyle = 'border-white/10 bg-navy-900/50 text-slate-300 hover:border-white/20 hover:bg-navy-800/60';

                if (currentAnswer.submitted) {
                  if (isCorrectChoice) {
                    choiceStyle = 'border-green-500/60 bg-green-500/15 text-green-300';
                  } else if (isSelected && !isCorrectChoice) {
                    choiceStyle = 'border-red-500/60 bg-red-500/15 text-red-300';
                  } else {
                    choiceStyle = 'border-white/5 bg-navy-900/30 text-slate-500';
                  }
                } else if (isSelected) {
                  choiceStyle = 'border-blue-500/60 bg-blue-500/15 text-blue-300';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => selectChoice(idx)}
                    disabled={currentAnswer.submitted}
                    className={cn(
                      'w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-150',
                      choiceStyle,
                      !currentAnswer.submitted && 'cursor-pointer active:scale-[0.99]',
                    )}
                  >
                    <span
                      className={cn(
                        'flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold mt-0.5',
                        currentAnswer.submitted && isCorrectChoice
                          ? 'bg-green-500/30 border-green-500/60 text-green-300'
                          : currentAnswer.submitted && isSelected && !isCorrectChoice
                          ? 'bg-red-500/30 border-red-500/60 text-red-300'
                          : isSelected
                          ? 'bg-blue-500/30 border-blue-500/60 text-blue-300'
                          : 'border-white/20 text-slate-500',
                      )}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm leading-relaxed">{choice}</span>
                    {currentAnswer.submitted && isCorrectChoice && (
                      <CheckCircle size={16} className="text-green-400 flex-shrink-0 ml-auto mt-0.5" />
                    )}
                    {currentAnswer.submitted && isSelected && !isCorrectChoice && (
                      <XCircle size={16} className="text-red-400 flex-shrink-0 ml-auto mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Explanation */}
          {currentAnswer.submitted && config.immediateFeeback && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'mb-4 p-4 rounded-xl border',
                isCorrect
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-red-500/10 border-red-500/30',
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle size={16} className="text-green-400" />
                ) : (
                  <XCircle size={16} className="text-red-400" />
                )}
                <span className={cn('text-sm font-semibold', isCorrect ? 'text-green-400' : 'text-red-400')}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{currentQ.explanation}</p>
            </motion.div>
          )}

          {/* Confidence Rating */}
          {currentAnswer.submitted && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4"
            >
              <p className="text-xs text-slate-400 font-medium mb-2">How confident were you?</p>
              <div className="flex gap-2">
                {CONFIDENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setConfidence(opt.value)}
                    className={cn(
                      'flex-1 py-2 px-2 rounded-xl border text-xs font-medium transition-all',
                      currentAnswer.confidence === opt.value
                        ? opt.color
                        : 'border-white/10 text-slate-500 hover:border-white/20',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Submit / Next */}
          <div className="flex items-center justify-between gap-3">
            {!currentAnswer.submitted ? (
              <Button
                variant="primary"
                size="md"
                className="ml-auto"
                disabled={currentAnswer.selectedIndex === null}
                onClick={handleSubmit}
              >
                Submit Answer
              </Button>
            ) : (
              <>
                <div />
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ChevronRight size={15} />}
                  onClick={handleNext}
                >
                  {isLast ? 'See Results' : 'Next Question'}
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Results Screen ────────────────────────────────────────────────────────────

interface ResultsScreenProps {
  questions: Question[];
  answers: ActiveAnswer[];
  config: QuizConfig;
  sessionId: string;
  onRetry: () => void;
  onReviewMissed: () => void;
}

function ResultsScreen({
  questions: quizQuestions,
  answers,
  config: _config,
  onRetry,
  onReviewMissed,
}: ResultsScreenProps) {
  const navigate = useNavigate();

  const correctCount = answers.filter(
    (a, i) => a.submitted && a.selectedIndex === quizQuestions[i].correctAnswer,
  ).length;
  const incorrectCount = answers.filter(
    (a, i) => a.submitted && a.selectedIndex !== null && a.selectedIndex !== quizQuestions[i].correctAnswer,
  ).length;
  const flaggedCount = answers.filter((a) => a.flagged).length;
  const missedCount = answers.filter(
    (a, i) => a.submitted && a.selectedIndex !== quizQuestions[i].correctAnswer,
  ).length;

  const score = Math.round((correctCount / quizQuestions.length) * 100);
  const passed = score >= 70;

  // Domain breakdown
  const domainBreakdown = useMemo(() => {
    const map: Record<string, { correct: number; total: number }> = {};
    quizQuestions.forEach((q, i) => {
      if (!map[q.domain]) map[q.domain] = { correct: 0, total: 0 };
      map[q.domain].total++;
      if (answers[i].selectedIndex === q.correctAnswer) map[q.domain].correct++;
    });
    return map;
  }, [quizQuestions, answers]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-10"
    >
      {/* Score Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className={cn(
            'inline-flex items-center justify-center w-28 h-28 rounded-full text-4xl font-black mb-4 border-4',
            passed
              ? 'bg-green-500/15 border-green-500/60 text-green-400'
              : 'bg-red-500/15 border-red-500/60 text-red-400',
          )}
        >
          {score}%
        </motion.div>
        <h1 className="text-2xl font-bold text-white mb-1">
          {passed ? '🎉 Great Work!' : '📚 Keep Practicing'}
        </h1>
        <p className="text-slate-400">
          {passed
            ? 'You passed this session. Review any missed questions to sharpen your knowledge.'
            : 'You need 70% to pass. Focus on the domains below.'}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Correct', value: correctCount, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
          { label: 'Incorrect', value: incorrectCount, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
          { label: 'Flagged', value: flaggedCount, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
        ].map(({ label, value, color }) => (
          <div key={label} className={cn('rounded-xl border p-4 text-center', color)}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs font-medium mt-0.5 opacity-80">{label}</p>
          </div>
        ))}
      </div>

      {/* Domain Breakdown */}
      <Card className="mb-6">
        <CardHeader title="Domain Breakdown" icon={<BarChart2 size={16} />} />
        <div className="space-y-3">
          {Object.entries(domainBreakdown).map(([domain, { correct, total }]) => {
            const pct = Math.round((correct / total) * 100);
            return (
              <div key={domain}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 truncate max-w-[200px]">{domain}</span>
                  <span className={cn('font-semibold flex-shrink-0 ml-2', pct >= 70 ? 'text-green-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400')}>
                    {correct}/{total} ({pct}%)
                  </span>
                </div>
                <ProgressBar
                  value={pct}
                  size="sm"
                  color={pct >= 70 ? 'green' : pct >= 50 ? 'amber' : 'red'}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-1 gap-3">
        {missedCount > 0 && (
          <Button
            variant="outline"
            size="md"
            leftIcon={<Brain size={15} />}
            onClick={onReviewMissed}
            className="w-full"
          >
            Review {missedCount} Missed Questions
          </Button>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="md"
            leftIcon={<RefreshCw size={15} />}
            onClick={onRetry}
            className="w-full"
          >
            Try Again
          </Button>
          <Button
            variant="ghost"
            size="md"
            leftIcon={<Home size={15} />}
            onClick={() => navigate('/dashboard')}
            className="w-full"
          >
            Dashboard
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Quiz Component ───────────────────────────────────────────────────────

export function Quiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { flaggedQuestions, missedQuestions, flagQuestion, unflagQuestion, addQuizSession } =
    useAppStore();

  const [screen, setScreen] = useState<QuizScreen>('setup');
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [completedAnswers, setCompletedAnswers] = useState<ActiveAnswer[]>([]);
  const sessionId = useRef<string>(generateId());

  // Parse URL params for direct mode entry
  useEffect(() => {
    const mode = searchParams.get('mode') as QuizMode | null;
    const domain = searchParams.get('domain') as QuestionDomain | null;
    const difficulty = searchParams.get('difficulty') as Difficulty | null;

    if (!mode) return;

    const directConfig: QuizConfig = {
      mode,
      domain: domain ?? undefined,
      difficulty: difficulty ?? undefined,
      questionCount: mode === 'exam-pressure' ? 45 : 10,
      timed: mode === 'exam-pressure',
      timeLimitSeconds: 60,
      immediateFeeback: true,
    };

    const qs = buildQuestions(directConfig, missedQuestions);
    if (qs.length === 0) return; // fallback to setup
    setConfig(directConfig);
    setQuizQuestions(qs);
    setScreen('active');
  }, [searchParams, missedQuestions]);

  const handleSetupStart = (cfg: QuizConfig) => {
    sessionId.current = generateId();
    const qs = buildQuestions(cfg, missedQuestions);
    setConfig(cfg);
    setQuizQuestions(qs);
    setScreen('active');
  };

  const handleQuizComplete = useCallback(
    (answers: ActiveAnswer[]) => {
      setCompletedAnswers(answers);
      setScreen('results');

      // Build and save QuizSession
      if (!config) return;

      const correctCount = answers.filter(
        (a, i) => a.submitted && a.selectedIndex === quizQuestions[i].correctAnswer,
      ).length;
      const score = Math.round((correctCount / quizQuestions.length) * 100);

      const domainBreakdown: Record<string, { correct: number; total: number }> = {};
      quizQuestions.forEach((q, i) => {
        if (!domainBreakdown[q.domain]) domainBreakdown[q.domain] = { correct: 0, total: 0 };
        domainBreakdown[q.domain].total++;
        if (answers[i].selectedIndex === q.correctAnswer) domainBreakdown[q.domain].correct++;
      });

      const confidenceData: Record<string, ConfidenceLevel> = {};
      quizQuestions.forEach((q, i) => {
        if (answers[i].confidence) {
          confidenceData[q.id] = answers[i].confidence!;
        }
      });

      const quizAnswers: QuizAnswer[] = quizQuestions.map((q, i) => ({
        questionId: q.id,
        selectedAnswer: answers[i].selectedIndex ?? -1,
        isCorrect: answers[i].selectedIndex === q.correctAnswer,
        timeSpent: answers[i].timeSpent,
        confidence: answers[i].confidence ?? 'somewhat-sure',
        flagged: answers[i].flagged,
      }));

      const session: QuizSession = {
        id: sessionId.current,
        startedAt: new Date(Date.now() - quizAnswers.reduce((s, a) => s + a.timeSpent * 1000, 0)).toISOString(),
        completedAt: new Date().toISOString(),
        mode: config.mode,
        domain: config.domain,
        difficulty: config.difficulty,
        timed: config.timed,
        timeLimitSeconds: config.timed ? config.timeLimitSeconds : undefined,
        questionIds: quizQuestions.map((q) => q.id),
        answers: quizAnswers,
        score,
        examPressureMode: config.mode === 'exam-pressure',
      };

      addQuizSession(session);
    },
    [config, quizQuestions, addQuizSession],
  );

  const handleRetry = () => {
    if (!config) {
      setScreen('setup');
      return;
    }
    sessionId.current = generateId();
    const qs = buildQuestions(config, missedQuestions);
    setQuizQuestions(qs);
    setCompletedAnswers([]);
    setScreen('active');
  };

  const handleReviewMissed = () => {
    navigate('/quiz?mode=missed');
  };

  if (screen === 'setup') {
    return <SetupScreen onStart={handleSetupStart} missedCount={missedQuestions.length} />;
  }

  if (screen === 'active' && config) {
    return (
      <ActiveQuiz
        questions={quizQuestions}
        config={config}
        onComplete={handleQuizComplete}
        flaggedIds={flaggedQuestions}
        onFlag={flagQuestion}
        onUnflag={unflagQuestion}
      />
    );
  }

  if (screen === 'results' && config) {
    return (
      <ResultsScreen
        questions={quizQuestions}
        answers={completedAnswers}
        config={config}
        sessionId={sessionId.current}
        onRetry={handleRetry}
        onReviewMissed={handleReviewMissed}
      />
    );
  }

  return null;
}
