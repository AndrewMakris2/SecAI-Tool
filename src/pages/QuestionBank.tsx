import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Play,
  Filter,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, DomainBadge, DifficultyBadge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { questions } from '@/data/questions';
import { Question, QuestionDomain, Difficulty } from '@/types';

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

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const PAGE_SIZE = 20;

type TabType = 'all' | 'flagged' | 'missed';

// ── QuestionRow ──────────────────────────────────────────────────────────────

interface QuestionRowProps {
  question: Question;
  isFlagged: boolean;
  isMissed: boolean;
  onToggleFlag: (id: string) => void;
}

function QuestionRow({ question, isFlagged, isMissed, onToggleFlag }: QuestionRowProps) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handlePractice = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/quiz?questionId=${question.id}`);
    },
    [navigate, question.id],
  );

  const handleFlagClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFlag(question.id);
    },
    [onToggleFlag, question.id],
  );

  return (
    <div className="border border-white/5 rounded-xl overflow-hidden bg-navy-800/40 hover:border-white/10 transition-colors duration-200">
      {/* Row header — always visible */}
      <button
        className="w-full text-left px-4 py-4 flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-inset"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        {/* Expand icon */}
        <div className="flex-shrink-0 text-slate-500">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {/* Question text */}
        <p className="flex-1 text-sm text-slate-200 text-left line-clamp-2 leading-relaxed">
          {question.question}
        </p>

        {/* Right-side indicators */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isMissed && (
            <span title="Previously missed">
              <AlertCircle size={14} className="text-red-400" />
            </span>
          )}
          <DomainBadge domain={question.domain} />
          <DifficultyBadge difficulty={question.difficulty} />
          <button
            onClick={handleFlagClick}
            className={cn(
              'p-1.5 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500',
              isFlagged
                ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                : 'text-slate-500 hover:text-amber-400 hover:bg-amber-500/10',
            )}
            title={isFlagged ? 'Remove flag' : 'Flag question'}
          >
            {isFlagged ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
          </button>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 px-4 pb-4 pt-4 space-y-4">
              {/* Full question */}
              <p className="text-sm text-white font-medium leading-relaxed">{question.question}</p>

              {/* Choices */}
              <div className="space-y-2">
                {question.choices.map((choice, idx) => {
                  const isCorrect = idx === question.correctAnswer;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        'flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm',
                        isCorrect
                          ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                          : 'bg-white/3 border border-white/5 text-slate-400',
                      )}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {isCorrect ? (
                          <CheckCircle size={15} className="text-green-400" />
                        ) : (
                          <XCircle size={15} className="text-slate-600" />
                        )}
                      </div>
                      <span className="leading-relaxed">
                        <span className="font-medium mr-1.5 text-slate-300">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        {choice}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3">
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1.5">
                  Explanation
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">{question.explanation}</p>
              </div>

              {/* Tags + Practice button */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <div className="flex flex-wrap gap-1.5">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="outline" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Play size={13} />}
                  onClick={handlePractice}
                >
                  Practice This
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── QuestionBank Page ────────────────────────────────────────────────────────

export default function QuestionBank() {
  const { flaggedQuestions, missedQuestions, flagQuestion, unflagQuestion } = useAppStore();

  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<QuestionDomain | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showDomainDropdown, setShowDomainDropdown] = useState(false);

  const flaggedSet = useMemo(() => new Set(flaggedQuestions), [flaggedQuestions]);
  const missedSet = useMemo(() => new Set(missedQuestions), [missedQuestions]);

  const handleToggleFlag = useCallback(
    (id: string) => {
      if (flaggedSet.has(id)) {
        unflagQuestion(id);
      } else {
        flagQuestion(id);
      }
    },
    [flaggedSet, flagQuestion, unflagQuestion],
  );

  const filtered = useMemo(() => {
    let pool = questions;

    if (activeTab === 'flagged') {
      pool = pool.filter((q) => flaggedSet.has(q.id));
    } else if (activeTab === 'missed') {
      pool = pool.filter((q) => missedSet.has(q.id));
    }

    if (selectedDomain !== 'all') {
      pool = pool.filter((q) => q.domain === selectedDomain);
    }

    if (selectedDifficulty !== 'all') {
      pool = pool.filter((q) => q.difficulty === selectedDifficulty);
    }

    if (search.trim()) {
      const lower = search.toLowerCase();
      pool = pool.filter(
        (q) =>
          q.question.toLowerCase().includes(lower) ||
          q.explanation.toLowerCase().includes(lower) ||
          q.tags.some((t) => t.toLowerCase().includes(lower)),
      );
    }

    return pool;
  }, [search, selectedDomain, selectedDifficulty, activeTab, flaggedSet, missedSet]);

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setVisibleCount(PAGE_SIZE);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  // Reset page when filters change
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setVisibleCount(PAGE_SIZE);
  };

  const handleDomainChange = (val: QuestionDomain | 'all') => {
    setSelectedDomain(val);
    setVisibleCount(PAGE_SIZE);
    setShowDomainDropdown(false);
  };

  const handleDifficultyChange = (val: Difficulty | 'all') => {
    setSelectedDifficulty(val);
    setVisibleCount(PAGE_SIZE);
  };

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'all', label: 'All Questions', count: questions.length },
    { key: 'flagged', label: 'Flagged', count: flaggedQuestions.length },
    { key: 'missed', label: 'Missed', count: missedQuestions.length },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="text-cyan-400" size={24} />
            Question Bank
          </h1>
          <p className="text-sm text-slate-400 mt-1">Browse, search, and practice all exam questions</p>
        </div>
        <Badge variant="cyan" size="md">
          {questions.length} Questions
        </Badge>
      </div>

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-navy-800/60 border border-white/5 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-white">{filtered.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Showing</p>
        </div>
        <div className="bg-navy-800/60 border border-amber-500/20 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-amber-400">{flaggedQuestions.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Flagged</p>
        </div>
        <div className="bg-navy-800/60 border border-red-500/20 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-red-400">{missedQuestions.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Missed</p>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <Card padding="sm">
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search questions, explanations, tags…"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-navy-900/60 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-colors"
            />
          </div>

          {/* Domain + Difficulty row */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Domain dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDomainDropdown((prev) => !prev)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors',
                  selectedDomain !== 'all'
                    ? 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10'
                    : 'border-white/10 text-slate-400 bg-navy-900/40 hover:border-white/20 hover:text-slate-300',
                )}
              >
                <Filter size={13} />
                {selectedDomain === 'all' ? 'All Domains' : selectedDomain}
                <ChevronDown size={13} />
              </button>
              <AnimatePresence>
                {showDomainDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-1 left-0 z-20 bg-navy-800 border border-white/10 rounded-xl shadow-xl overflow-hidden min-w-max"
                  >
                    <button
                      onClick={() => handleDomainChange('all')}
                      className={cn(
                        'block w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors',
                        selectedDomain === 'all' ? 'text-cyan-400' : 'text-slate-300',
                      )}
                    >
                      All Domains
                    </button>
                    {DOMAINS.map((d) => (
                      <button
                        key={d}
                        onClick={() => handleDomainChange(d)}
                        className={cn(
                          'block w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors',
                          selectedDomain === d ? 'text-cyan-400' : 'text-slate-300',
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Difficulty pills */}
            <div className="flex gap-1.5">
              {(['all', ...DIFFICULTIES] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => handleDifficultyChange(d as Difficulty | 'all')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize',
                    selectedDifficulty === d
                      ? d === 'easy'
                        ? 'bg-green-500/20 border-green-500/40 text-green-400'
                        : d === 'medium'
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : d === 'hard'
                            ? 'bg-red-500/20 border-red-500/40 text-red-400'
                            : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                      : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300',
                  )}
                >
                  {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>

            {/* Clear filters */}
            {(selectedDomain !== 'all' || selectedDifficulty !== 'all' || search) && (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedDomain('all');
                  setSelectedDifficulty('all');
                  setVisibleCount(PAGE_SIZE);
                }}
                className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-t border-white/5 pt-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  activeTab === tab.key
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-white/5',
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    'text-xs px-1.5 py-0.5 rounded-full font-semibold',
                    activeTab === tab.key ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-500',
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Question list ── */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="inline-flex p-4 rounded-2xl bg-navy-800/60 border border-white/5 mb-4">
            <Search size={28} className="text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No questions found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            {activeTab === 'flagged'
              ? 'You have not flagged any questions yet. Bookmark questions while studying to review them here.'
              : activeTab === 'missed'
                ? 'No missed questions recorded. Complete some quizzes first.'
                : 'No questions match your current filters. Try adjusting your search or filters.'}
          </p>
          {(search || selectedDomain !== 'all' || selectedDifficulty !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearch('');
                setSelectedDomain('all');
                setSelectedDifficulty('all');
              }}
            >
              Clear all filters
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 px-1">
            Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} questions
          </p>
          <AnimatePresence initial={false}>
            {visible.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.3) }}
              >
                <QuestionRow
                  question={question}
                  isFlagged={flaggedSet.has(question.id)}
                  isMissed={missedSet.has(question.id)}
                  onToggleFlag={handleToggleFlag}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {visibleCount < filtered.length && (
            <div className="pt-4 text-center">
              <Button variant="secondary" onClick={handleLoadMore}>
                Load more ({filtered.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
