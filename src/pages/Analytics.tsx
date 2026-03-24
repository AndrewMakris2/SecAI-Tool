import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Legend,
} from 'recharts';
import {
  BarChart2,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Brain,
  Layers,
  AlertCircle,
  CheckCircle,
  Activity,
  BookOpen,
  Flame,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/utils/cn';
import { QuestionDomain } from '@/types';

// ── Constants ────────────────────────────────────────────────────────────────

const DOMAINS: QuestionDomain[] = [
  'AI Security Fundamentals',
  'Securing AI Systems',
  'Adversarial Threats',
  'AI Governance & Compliance',
  'AI in Security Operations',
  'Data Security & Model Integrity',
  'Incident Response for AI Systems',
];

const DOMAIN_SHORT: Record<QuestionDomain, string> = {
  'AI Security Fundamentals': 'AI Sec',
  'Securing AI Systems': 'Sec AI',
  'Adversarial Threats': 'Adversarial',
  'AI Governance & Compliance': 'Governance',
  'AI in Security Operations': 'SecOps',
  'Data Security & Model Integrity': 'Data Sec',
  'Incident Response for AI Systems': 'IR',
};

const DOMAIN_COLORS: Record<QuestionDomain, string> = {
  'AI Security Fundamentals': '#3b82f6',
  'Securing AI Systems': '#06b6d4',
  'Adversarial Threats': '#ef4444',
  'AI Governance & Compliance': '#8b5cf6',
  'AI in Security Operations': '#f59e0b',
  'Data Security & Model Integrity': '#22c55e',
  'Incident Response for AI Systems': '#f97316',
};

const PIE_COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

const CHART_AXIS_STYLE = { fill: '#94a3b8', fontSize: 11 };
const GRID_STYLE = { stroke: '#ffffff10' };

// ── Tooltip components ───────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy-800 border border-white/10 rounded-xl px-3 py-2.5 shadow-xl">
      {label && <p className="text-xs text-slate-400 mb-1">{label}</p>}
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color || '#06b6d4' }}>
          {entry.name ? `${entry.name}: ` : ''}{typeof entry.value === 'number' ? `${Math.round(entry.value)}%` : entry.value}
        </p>
      ))}
    </div>
  );
}

function LineTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy-800 border border-white/10 rounded-xl px-3 py-2.5 shadow-xl">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-cyan-400">Score: {Math.round(payload[0]?.value ?? 0)}%</p>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-red-400';
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function Analytics() {
  const navigate = useNavigate();
  const { analytics, quizSessions } = useAppStore();

  // ── Derived data ─────────────────────────────────────────────────────────

  const hasData = quizSessions.length > 0;

  const quizPerformanceData = useMemo(() => {
    return [...quizSessions]
      .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
      .map((s, i) => ({
        name: `#${i + 1}`,
        date: formatDate(s.startedAt),
        score: s.score ?? 0,
      }));
  }, [quizSessions]);

  const domainAvgScores = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    quizSessions.forEach((s) => {
      if (s.domain) {
        if (!map[s.domain]) map[s.domain] = { total: 0, count: 0 };
        map[s.domain].total += s.score ?? 0;
        map[s.domain].count += 1;
      }
    });
    return DOMAINS.map((d) => ({
      domain: d,
      short: DOMAIN_SHORT[d],
      score: map[d] ? Math.round(map[d].total / map[d].count) : 0,
      color: DOMAIN_COLORS[d],
    }));
  }, [quizSessions]);

  const radarData = useMemo(() => {
    return analytics.domainPerformance.length > 0
      ? analytics.domainPerformance.map((dp) => ({
          domain: DOMAIN_SHORT[dp.domain as QuestionDomain] ?? dp.domain,
          score: Math.round(dp.accuracy),
        }))
      : DOMAINS.map((d) => ({ domain: DOMAIN_SHORT[d], score: 0 }));
  }, [analytics.domainPerformance]);

  const difficultyData = useMemo(() => {
    const counts: Record<string, number> = { easy: 0, medium: 0, hard: 0 };
    quizSessions.forEach((s) => {
      if (s.difficulty && counts[s.difficulty] !== undefined) {
        counts[s.difficulty] += s.answers?.length ?? 0;
      }
    });
    const total = counts.easy + counts.medium + counts.hard || 1;
    return [
      { name: 'Easy', value: Math.round((counts.easy / total) * 100), count: counts.easy },
      { name: 'Medium', value: Math.round((counts.medium / total) * 100), count: counts.medium },
      { name: 'Hard', value: Math.round((counts.hard / total) * 100), count: counts.hard },
    ];
  }, [quizSessions]);

  const weakDomains = useMemo(() => {
    return analytics.domainPerformance
      .filter((dp) => dp.accuracy < 70)
      .sort((a, b) => a.accuracy - b.accuracy);
  }, [analytics.domainPerformance]);

  const recentSessions = useMemo(() => {
    return [...quizSessions]
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, 10);
  }, [quizSessions]);

  const confidencePatterns = analytics.confidencePatterns;
  const hasConfidenceData =
    confidencePatterns.guessedCorrect +
      confidencePatterns.guessedIncorrect +
      confidencePatterns.somewhatSureCorrect +
      confidencePatterns.somewhatSureIncorrect +
      confidencePatterns.verySureCorrect +
      confidencePatterns.verySureIncorrect >
    0;

  // ── Empty state ───────────────────────────────────────────────────────────

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex p-5 rounded-3xl bg-navy-800/60 border border-white/5 mb-6">
            <BarChart2 size={40} className="text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No Quiz Data Yet</h2>
          <p className="text-slate-400 max-w-sm mx-auto mb-6 text-sm leading-relaxed">
            Complete your first quiz to start seeing detailed performance analytics, domain breakdowns, and trend charts.
          </p>
          <Button onClick={() => navigate('/quiz')} leftIcon={<Target size={15} />}>
            Start a Quiz
          </Button>
        </motion.div>
      </div>
    );
  }

  // ── Full analytics view ───────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <BarChart2 className="text-cyan-400" size={24} />
          Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1">Your performance insights and study trends</p>
      </div>

      {/* ── Section 1: Top stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Questions Answered"
          value={analytics.totalQuestionsAnswered}
          icon={<BookOpen size={18} />}
          color="cyan"
          subtitle={`${analytics.totalCorrect ?? 0} correct`}
        />
        <StatCard
          title="Overall Accuracy"
          value={`${Math.round(analytics.overallAccuracy)}%`}
          icon={<Target size={18} />}
          color={analytics.overallAccuracy >= 80 ? 'green' : analytics.overallAccuracy >= 60 ? 'amber' : 'red'}
        />
        <StatCard
          title="Study Streak"
          value={`${analytics.studyStreak}d`}
          icon={<Flame size={18} />}
          color="amber"
          subtitle="consecutive days"
        />
        <StatCard
          title="Quizzes Taken"
          value={quizSessions.length}
          icon={<Activity size={18} />}
          color="violet"
          subtitle={`${analytics.totalStudyTimeMinutes}m total`}
        />
      </div>

      {/* ── Section 2: Domain Readiness ── */}
      <Card>
        <CardHeader title="Domain Readiness" subtitle="Radar view of your knowledge across all domains" icon={<Brain size={16} />} />
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Radar chart */}
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="#ffffff10" />
                <PolarAngleAxis dataKey="domain" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar
                  name="Readiness"
                  dataKey="score"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Domain bars */}
          <div className="space-y-3 py-2">
            {radarData.map((item) => (
              <div key={item.domain}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-400">{item.domain}</span>
                  <span
                    className={cn(
                      'text-xs font-semibold',
                      item.score >= 80 ? 'text-green-400' : item.score >= 60 ? 'text-amber-400' : item.score > 0 ? 'text-red-400' : 'text-slate-600',
                    )}
                  >
                    {item.score > 0 ? `${item.score}%` : '—'}
                  </span>
                </div>
                <ProgressBar
                  value={item.score}
                  size="sm"
                  color={item.score >= 80 ? 'green' : item.score >= 60 ? 'amber' : item.score > 0 ? 'red' : 'cyan'}
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Section 3: Quiz Performance Over Time ── */}
      <Card>
        <CardHeader title="Quiz Performance Over Time" subtitle="Score trend across your quiz history" icon={<TrendingUp size={16} />} />
        {quizPerformanceData.length < 2 ? (
          <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
            Complete at least 2 quizzes to see your trend line
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quizPerformanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" {...GRID_STYLE} />
                <XAxis dataKey="name" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<LineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#06b6d4' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* ── Section 4: Performance by Domain ── */}
      <Card>
        <CardHeader title="Performance by Domain" subtitle="Average score per domain across all quizzes" icon={<BarChart2 size={16} />} />
        {domainAvgScores.every((d) => d.score === 0) ? (
          <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
            Complete domain-specific quizzes to see per-domain scores
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainAvgScores} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" {...GRID_STYLE} />
                <XAxis dataKey="short" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" name="Avg Score" fill="url(#barGradient)" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* ── Section 5: Difficulty Breakdown ── */}
      <Card>
        <CardHeader title="Difficulty Breakdown" subtitle="Distribution of questions answered by difficulty" icon={<Layers size={16} />} />
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index]} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {difficultyData.map((item, i) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    <span className="text-sm text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{item.count} questions</span>
                </div>
                <ProgressBar
                  value={item.value}
                  color={i === 0 ? 'green' : i === 1 ? 'amber' : 'red'}
                  size="sm"
                  showValue
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Section 6: Confidence Analysis ── */}
      <Card>
        <CardHeader title="Confidence Analysis" subtitle="How your confidence level correlates with correctness" icon={<Brain size={16} />} />
        {!hasConfidenceData ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5 mb-3">
              <Brain size={24} className="text-slate-600" />
            </div>
            <p className="text-sm text-slate-400">Complete quizzes to see confidence patterns</p>
            <p className="text-xs text-slate-500 mt-1">Your confidence vs. accuracy trends will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: 'Just Guessing',
                correct: confidencePatterns.guessedCorrect,
                incorrect: confidencePatterns.guessedIncorrect,
                color: 'text-red-400',
                bgColor: 'bg-red-500/10',
              },
              {
                label: 'Somewhat Sure',
                correct: confidencePatterns.somewhatSureCorrect,
                incorrect: confidencePatterns.somewhatSureIncorrect,
                color: 'text-amber-400',
                bgColor: 'bg-amber-500/10',
              },
              {
                label: 'Very Sure',
                correct: confidencePatterns.verySureCorrect,
                incorrect: confidencePatterns.verySureIncorrect,
                color: 'text-green-400',
                bgColor: 'bg-green-500/10',
              },
            ].map((item) => {
              const total = item.correct + item.incorrect;
              const accuracy = total > 0 ? Math.round((item.correct / total) * 100) : 0;
              return (
                <div key={item.label} className={cn('rounded-xl p-4 border border-white/5', item.bgColor)}>
                  <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                  <p className={cn('text-2xl font-bold', item.color)}>{accuracy}%</p>
                  <p className="text-xs text-slate-500 mt-1">{total} answers</p>
                  <div className="mt-2">
                    <ProgressBar value={accuracy} size="sm" color={accuracy >= 70 ? 'green' : accuracy >= 50 ? 'amber' : 'red'} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ── Section 7: Weak Areas ── */}
      <Card>
        <CardHeader title="Weak Areas" subtitle="Domains scoring below 70% — prioritize these for study" icon={<AlertCircle size={16} />} />
        {weakDomains.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-3">
              <CheckCircle size={24} className="text-green-400" />
            </div>
            <p className="text-sm text-green-300 font-medium">All domains above 70%</p>
            <p className="text-xs text-slate-500 mt-1">Great work! Keep practicing to maintain your scores.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {weakDomains.map((dp) => {
              const trend = dp.accuracy < 50 ? 'down' : dp.accuracy < 60 ? 'flat' : 'up';
              return (
                <div
                  key={dp.domain}
                  className="flex items-center gap-4 p-3 rounded-xl bg-navy-900/40 border border-white/5"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-medium text-white truncate">{dp.domain}</span>
                      {trend === 'down' && <TrendingDown size={13} className="text-red-400 flex-shrink-0" />}
                      {trend === 'flat' && <Minus size={13} className="text-amber-400 flex-shrink-0" />}
                      {trend === 'up' && <TrendingUp size={13} className="text-green-400 flex-shrink-0" />}
                    </div>
                    <ProgressBar value={dp.accuracy} size="sm" color="red" showValue />
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/quiz?domain=${encodeURIComponent(dp.domain)}`)}
                    >
                      Practice
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ── Section 8: Recent Activity ── */}
      <Card>
        <CardHeader title="Recent Activity" subtitle="Your last 10 quiz sessions" icon={<Clock size={16} />} />
        {recentSessions.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No sessions recorded yet</div>
        ) : (
          <div className="space-y-2">
            {recentSessions.map((session) => {
              const score = session.score ?? 0;
              const correctCount = session.answers?.filter((a) => a.isCorrect).length ?? 0;
              const totalCount = session.answers?.length ?? session.questionIds.length;
              const durationSec = session.completedAt
                ? Math.round(
                    (new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()) / 1000,
                  )
                : 0;
              return (
                <div
                  key={session.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-navy-900/40 border border-white/5 hover:border-white/10 transition-colors"
                >
                  {/* Score circle */}
                  <div
                    className={cn(
                      'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2',
                      score >= 80
                        ? 'border-green-500/50 text-green-400 bg-green-500/10'
                        : score >= 60
                          ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                          : 'border-red-500/50 text-red-400 bg-red-500/10',
                    )}
                  >
                    {Math.round(score)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white capitalize">{session.mode} quiz</span>
                      {session.domain && (
                        <span className="text-xs text-slate-500 truncate">{session.domain}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-slate-500">
                        {correctCount}/{totalCount} correct
                      </span>
                      {durationSec > 0 && (
                        <span className="text-xs text-slate-600">{formatDuration(durationSec)}</span>
                      )}
                      <span className="text-xs text-slate-600">{formatDate(session.startedAt)}</span>
                    </div>
                  </div>

                  {/* Score label */}
                  <span className={cn('flex-shrink-0 text-sm font-semibold', getScoreColor(score))}>
                    {Math.round(score)}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
