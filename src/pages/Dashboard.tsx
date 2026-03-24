import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  Zap,
  BookOpen,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
  ChevronRight,
  BarChart2,
  Flame,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, DomainBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatCard } from '@/components/ui/StatCard';
import { cn } from '@/utils/cn';
import { QuestionDomain } from '@/types';

// ── Constants ───────────────────────────────────────────────────────────────

const DOMAINS: QuestionDomain[] = [
  'AI Security Fundamentals',
  'Securing AI Systems',
  'Adversarial Threats',
  'AI Governance & Compliance',
  'AI in Security Operations',
  'Data Security & Model Integrity',
  'Incident Response for AI Systems',
];

const TOTAL_QUESTIONS = 200;

const DOMAIN_ICONS: Record<QuestionDomain, React.ReactNode> = {
  'AI Security Fundamentals': <Brain size={14} />,
  'Securing AI Systems': <Layers size={14} />,
  'Adversarial Threats': <AlertCircle size={14} />,
  'AI Governance & Compliance': <CheckCircle size={14} />,
  'AI in Security Operations': <BarChart2 size={14} />,
  'Data Security & Model Integrity': <Target size={14} />,
  'Incident Response for AI Systems': <Zap size={14} />,
};

const DOMAIN_COLORS: Record<QuestionDomain, 'cyan' | 'blue' | 'violet' | 'green' | 'amber' | 'red'> = {
  'AI Security Fundamentals': 'blue',
  'Securing AI Systems': 'cyan',
  'Adversarial Threats': 'red',
  'AI Governance & Compliance': 'violet',
  'AI in Security Operations': 'amber',
  'Data Security & Model Integrity': 'green',
  'Incident Response for AI Systems': 'amber',
};

const PROGRESS_COLORS: Record<QuestionDomain, 'cyan' | 'blue' | 'violet' | 'green' | 'amber' | 'red'> = {
  'AI Security Fundamentals': 'blue',
  'Securing AI Systems': 'cyan',
  'Adversarial Threats': 'red',
  'AI Governance & Compliance': 'violet',
  'AI in Security Operations': 'amber',
  'Data Security & Model Integrity': 'green',
  'Incident Response for AI Systems': 'amber',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatQuizDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-red-400';
}

// ── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// ── Achievement definitions ──────────────────────────────────────────────────

interface BadgeDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  check: (stats: {
    quizCount: number;
    streak: number;
    accuracy: number;
    totalAnswered: number;
    domainsAttempted: number;
  }) => boolean;
}

const BADGE_DEFS: BadgeDef[] = [
  {
    id: 'first-quiz',
    title: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🎯',
    check: ({ quizCount }) => quizCount >= 1,
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: '7-day study streak',
    icon: '🔥',
    check: ({ streak }) => streak >= 7,
  },
  {
    id: 'accuracy-80',
    title: 'Sharp Mind',
    description: 'Achieve 80%+ overall accuracy',
    icon: '⭐',
    check: ({ accuracy, totalAnswered }) => accuracy >= 80 && totalAnswered >= 10,
  },
  {
    id: 'all-domains',
    title: 'Domain Expert',
    description: 'Answer questions in all 7 domains',
    icon: '🏆',
    check: ({ domainsAttempted }) => domainsAttempted >= 7,
  },
  {
    id: 'century',
    title: 'Century Club',
    description: 'Answer 100+ questions',
    icon: '💯',
    check: ({ totalAnswered }) => totalAnswered >= 100,
  },
  {
    id: 'streak-3',
    title: 'On a Roll',
    description: '3-day study streak',
    icon: '⚡',
    check: ({ streak }) => streak >= 3,
  },
];

// ── Main Component ────────────────────────────────────────────────────────────

export function Dashboard() {
  const navigate = useNavigate();
  const { analytics, userProfile, flashcardProgress, domainReadiness, quizSessions } =
    useAppStore();

  // Derived stats
  const flashcardsMastered = useMemo(
    () => Object.values(flashcardProgress).filter((p) => p.status === 'mastered').length,
    [flashcardProgress],
  );

  const hasAnyData = analytics.totalQuestionsAnswered > 0;

  // Domain readiness lookup
  const readinessMap = useMemo(() => {
    const map: Record<string, number> = {};
    domainReadiness.forEach((r) => {
      map[r.domain] = r.readinessScore;
    });
    // Fallback from domainPerformance if no readiness calculated
    analytics.domainPerformance.forEach((dp) => {
      if (!map[dp.domain] && dp.totalAttempted > 0) {
        map[dp.domain] = dp.accuracy;
      }
    });
    return map;
  }, [domainReadiness, analytics.domainPerformance]);

  // Today's focus domain
  const focusDomain = useMemo((): QuestionDomain => {
    if (!hasAnyData) return 'AI Security Fundamentals';
    const weak = analytics.weakTopics;
    if (weak.length > 0) return weak[0].domain as QuestionDomain;
    // Domain with fewest attempts
    const byAttempts = [...analytics.domainPerformance].sort(
      (a, b) => a.totalAttempted - b.totalAttempted,
    );
    return (byAttempts[0]?.domain as QuestionDomain) ?? 'AI Security Fundamentals';
  }, [hasAnyData, analytics]);

  // Recent quiz history (last 3)
  const recentSessions = useMemo(
    () => analytics.quizSessionHistory.slice(0, 3),
    [analytics.quizSessionHistory],
  );

  // Domains attempted count
  const domainsAttempted = useMemo(
    () => analytics.domainPerformance.filter((dp) => dp.totalAttempted > 0).length,
    [analytics.domainPerformance],
  );

  // Badge unlock status
  const badgeStats = {
    quizCount: quizSessions.filter((s) => s.completedAt).length,
    streak: analytics.studyStreak,
    accuracy: analytics.overallAccuracy,
    totalAnswered: analytics.totalQuestionsAnswered,
    domainsAttempted,
  };

  const unlockedBadges = BADGE_DEFS.filter((b) => b.check(badgeStats));
  const lockedBadges = BADGE_DEFS.filter((b) => !b.check(badgeStats));

  // Mode label helper
  const getModeLabel = (mode: string): string => {
    const labels: Record<string, string> = {
      random: 'Random',
      domain: 'Domain',
      difficulty: 'Difficulty',
      'exam-pressure': 'Exam Pressure',
      missed: 'Missed',
      flagged: 'Flagged',
      review: 'Review',
      'last-minute': 'Last Minute',
    };
    return labels[mode] ?? mode;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8"
    >
      {/* ── 1. Header ── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-slate-400 text-sm mb-1">{formatDate()}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {getGreeting()},{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {userProfile?.name ?? 'there'}
            </span>{' '}
            👋
          </h1>
          {!hasAnyData && (
            <p className="text-slate-400 mt-2 text-sm max-w-lg">
              Welcome to SecAI+! Your personalized AI security certification study platform.
              Start your first quiz to unlock your performance dashboard.
            </p>
          )}
          {hasAnyData && (
            <p className="text-slate-400 mt-1 text-sm">
              {analytics.studyStreak > 0
                ? `🔥 ${analytics.studyStreak}-day streak — keep it going!`
                : 'Ready to study? Pick up where you left off.'}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Zap size={15} />}
            onClick={() => navigate('/quiz?mode=random')}
          >
            Quick Quiz
          </Button>
          <Button
            variant="secondary"
            size="md"
            leftIcon={<BarChart2 size={15} />}
            onClick={() => navigate('/analytics')}
          >
            Analytics
          </Button>
        </div>
      </motion.div>

      {/* ── 2. Stats Row ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Questions Answered"
          value={analytics.totalQuestionsAnswered.toLocaleString()}
          subtitle={`of ${TOTAL_QUESTIONS} total`}
          icon={<BookOpen size={18} />}
          color="cyan"
        />
        <StatCard
          title="Overall Accuracy"
          value={hasAnyData ? `${analytics.overallAccuracy}%` : '—'}
          subtitle={hasAnyData ? (analytics.overallAccuracy >= 80 ? 'Exam ready' : 'Keep practicing') : 'No data yet'}
          icon={<Target size={18} />}
          color={
            !hasAnyData
              ? 'cyan'
              : analytics.overallAccuracy >= 80
              ? 'green'
              : analytics.overallAccuracy >= 60
              ? 'amber'
              : 'red'
          }
        />
        <StatCard
          title="Study Streak"
          value={analytics.studyStreak > 0 ? `${analytics.studyStreak}d` : '—'}
          subtitle={analytics.studyStreak > 0 ? 'days in a row' : 'Start today!'}
          icon={<Flame size={18} />}
          color="amber"
        />
        <StatCard
          title="Flashcards Mastered"
          value={flashcardsMastered}
          subtitle="cards retained"
          icon={<Brain size={18} />}
          color="violet"
        />
      </motion.div>

      {/* ── 3. Today's Focus + Domain Readiness ── */}
      <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
        {/* Today's Focus */}
        <div className="lg:col-span-1">
          <Card
            glow
            className="h-full border-cyan-500/20 bg-gradient-to-br from-navy-800/80 to-navy-900/60"
          >
            <CardHeader
              title="Today's Focus"
              subtitle="Recommended study area"
              icon={<Target size={16} />}
            />
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <div className="flex items-center gap-2 mb-2">
                  {DOMAIN_ICONS[focusDomain]}
                  <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">
                    Priority Domain
                  </span>
                </div>
                <p className="text-white font-semibold text-sm leading-snug">{focusDomain}</p>
                {hasAnyData && readinessMap[focusDomain] !== undefined && (
                  <div className="mt-3">
                    <ProgressBar
                      value={readinessMap[focusDomain] ?? 0}
                      showValue
                      size="sm"
                      color={PROGRESS_COLORS[focusDomain]}
                      label="Readiness"
                    />
                  </div>
                )}
                {!hasAnyData && (
                  <p className="text-slate-400 text-xs mt-2">
                    Build your foundation with core AI security concepts.
                  </p>
                )}
              </div>

              {hasAnyData && analytics.weakTopics.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Weak Areas
                  </p>
                  {analytics.weakTopics.slice(0, 2).map((topic) => (
                    <div
                      key={topic.domain}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-300 truncate max-w-[160px]">{topic.domain}</span>
                      <span
                        className={cn(
                          'font-semibold ml-2 flex-shrink-0',
                          topic.accuracy < 50 ? 'text-red-400' : 'text-amber-400',
                        )}
                      >
                        {topic.accuracy}%
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() =>
                  navigate(`/quiz?mode=domain&domain=${encodeURIComponent(focusDomain)}`)
                }
              >
                Study This Domain
              </Button>
            </div>
          </Card>
        </div>

        {/* Domain Readiness Meters */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Domain Readiness"
              subtitle="Your progress across all 7 exam domains"
              icon={<BarChart2 size={16} />}
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  rightIcon={<ChevronRight size={14} />}
                  onClick={() => navigate('/analytics')}
                >
                  Details
                </Button>
              }
            />
            <div className="space-y-4">
              {DOMAINS.map((domain) => {
                const score = readinessMap[domain] ?? 0;
                const hasData = score > 0;
                return (
                  <div key={domain} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-${DOMAIN_COLORS[domain]}-400 flex-shrink-0`}>
                          {DOMAIN_ICONS[domain]}
                        </span>
                        <span className="text-xs text-slate-300 truncate">{domain}</span>
                      </div>
                      <span
                        className={cn(
                          'text-xs font-semibold flex-shrink-0',
                          !hasData
                            ? 'text-slate-500'
                            : score >= 80
                            ? 'text-green-400'
                            : score >= 60
                            ? 'text-cyan-400'
                            : score >= 40
                            ? 'text-amber-400'
                            : 'text-red-400',
                        )}
                      >
                        {hasData ? `${score}%` : 'No data'}
                      </span>
                    </div>
                    <ProgressBar
                      value={score}
                      size="sm"
                      color={
                        !hasData
                          ? 'cyan'
                          : score >= 80
                          ? 'green'
                          : score >= 60
                          ? 'cyan'
                          : score >= 40
                          ? 'amber'
                          : 'red'
                      }
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </motion.div>

      {/* ── 4. Recent Quiz History + Quick Actions ── */}
      <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-6">
        {/* Recent Quiz History */}
        <Card>
          <CardHeader
            title="Recent Activity"
            subtitle="Your last quiz sessions"
            icon={<Clock size={16} />}
            action={
              recentSessions.length > 0 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  rightIcon={<ChevronRight size={14} />}
                  onClick={() => navigate('/analytics')}
                >
                  All History
                </Button>
              ) : undefined
            }
          />
          {recentSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-navy-700/60 flex items-center justify-center mb-3">
                <BookOpen size={20} className="text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm font-medium">No quizzes yet</p>
              <p className="text-slate-500 text-xs mt-1 max-w-xs">
                Complete your first quiz to see your activity here.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => navigate('/quiz')}
              >
                Start First Quiz
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-navy-900/50 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0',
                        session.score >= 80
                          ? 'bg-green-500/15 text-green-400'
                          : session.score >= 60
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-red-500/15 text-red-400',
                      )}
                    >
                      {session.score}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="default" size="sm">
                          {getModeLabel(session.mode)}
                        </Badge>
                        {session.domain && (
                          <DomainBadge domain={session.domain} />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {session.questionCount} questions · {formatQuizDate(session.date)}
                      </p>
                    </div>
                  </div>
                  <span className={cn('text-sm font-bold flex-shrink-0 ml-2', getScoreColor(session.score))}>
                    {session.score}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader
            title="Quick Actions"
            subtitle="Jump straight into studying"
            icon={<Zap size={16} />}
          />
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: 'Start Random Quiz',
                icon: <Zap size={18} />,
                color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300 hover:border-cyan-400/50',
                action: () => navigate('/quiz?mode=random'),
              },
              {
                label: 'Practice Flashcards',
                icon: <Brain size={18} />,
                color: 'from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-300 hover:border-violet-400/50',
                action: () => navigate('/flashcards'),
              },
              {
                label: 'Open AI Tutor',
                icon: <MessageSquare size={18} />,
                color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-300 hover:border-blue-400/50',
                action: () => navigate('/ai-tutor'),
              },
              {
                label: 'View Weak Areas',
                icon: <TrendingUp size={18} />,
                color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300 hover:border-amber-400/50',
                action: () => navigate('/analytics'),
              },
            ].map(({ label, icon, color, action }) => (
              <button
                key={label}
                onClick={action}
                className={cn(
                  'flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-br border',
                  'transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer',
                  color,
                )}
              >
                {icon}
                <span className="text-xs font-medium text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ── 5. Achievements ── */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader
            title="Achievements"
            subtitle={`${unlockedBadges.length} of ${BADGE_DEFS.length} unlocked`}
            icon={<Award size={16} />}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Unlocked badges */}
            {unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-b from-cyan-500/10 to-blue-500/5 border border-cyan-500/25 group"
              >
                <span className="text-2xl">{badge.icon}</span>
                <div className="text-center">
                  <p className="text-xs font-semibold text-white leading-tight">{badge.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-tight">{badge.description}</p>
                </div>
              </div>
            ))}
            {/* Locked badges */}
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-navy-900/40 border border-white/5 opacity-50"
              >
                <span className="text-2xl grayscale">{badge.icon}</span>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-400 leading-tight">{badge.title}</p>
                  <p className="text-xs text-slate-600 mt-0.5 leading-tight">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
          {unlockedBadges.length === 0 && (
            <p className="text-center text-slate-500 text-sm mt-4">
              Complete quizzes and build streaks to unlock achievements.
            </p>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
