import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Clock,
  ChevronRight,
  ChevronLeft,
  List,
  CheckSquare,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Menu,
  X,
} from 'lucide-react';
import { Badge, DomainBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import { studyGuides } from '@/data/studyGuides';
import type { QuestionDomain, StudyGuideSection, StudyGuideBlock } from '@/types';

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
  'AI Security Fundamentals': 'Fundamentals',
  'Securing AI Systems': 'Securing AI',
  'Adversarial Threats': 'Adversarial',
  'AI Governance & Compliance': 'Governance',
  'AI in Security Operations': 'SecOps',
  'Data Security & Model Integrity': 'Data Security',
  'Incident Response for AI Systems': 'IR',
};

// Render individual content blocks
function BlockRenderer({ block }: { block: StudyGuideBlock }) {
  switch (block.type) {
    case 'heading':
      return (
        <h3
          id={`section-${block.content.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-lg font-bold text-white mt-8 mb-3 scroll-mt-24"
        >
          {block.content}
        </h3>
      );

    case 'paragraph':
      return <p className="text-slate-300 leading-relaxed mb-4 text-sm">{block.content}</p>;

    case 'list':
      return (
        <div className="mb-4">
          {block.content && (
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">
              {block.content}
            </p>
          )}
          <ul className="space-y-2">
            {(block.items ?? []).map((item, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'code':
      return (
        <pre className="bg-navy-950 border border-white/10 rounded-xl p-4 text-xs text-cyan-300 font-mono overflow-x-auto mb-4 leading-relaxed whitespace-pre-wrap">
          {block.content}
        </pre>
      );

    case 'callout': {
      const variantStyles: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
        info: { icon: <Info className="w-4 h-4" />, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        warning: { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
        danger: { icon: <AlertCircle className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
        success: { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
      };
      const cfg = variantStyles[block.variant ?? 'info'];
      return (
        <div className={cn('rounded-xl border px-4 py-3 flex gap-3 mb-4', cfg.bg, cfg.border)}>
          <span className={cn('flex-shrink-0 mt-0.5', cfg.color)}>{cfg.icon}</span>
          <p className={cn('text-sm leading-relaxed', cfg.color)}>{block.content}</p>
        </div>
      );
    }

    case 'table':
      return (
        <div className="mb-4 overflow-x-auto">
          {block.content && (
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">
              {block.content}
            </p>
          )}
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                {(block.columns ?? []).map((col) => (
                  <th key={col} className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(block.rows ?? []).map((row, ri) => (
                <tr key={ri} className={cn('border-b border-white/5', ri % 2 === 0 ? '' : 'bg-white/2')}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="py-2 px-3 text-slate-300 text-xs leading-relaxed">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}

function GuideCard({
  guide,
  onSelect,
}: {
  guide: StudyGuideSection;
  onSelect: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className="h-full flex flex-col" onClick={onSelect}>
        <div className="flex items-start justify-between gap-2 mb-3">
          <DomainBadge domain={guide.domain} />
          <div className="flex items-center gap-1 text-slate-500 text-xs flex-shrink-0">
            <Clock className="w-3.5 h-3.5" />
            {guide.estimatedReadTime} min
          </div>
        </div>
        <h3 className="text-white font-semibold text-base mb-2 leading-snug">{guide.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed flex-1">{guide.summary}</p>
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <Badge
            variant={guide.difficulty === 'easy' ? 'green' : guide.difficulty === 'medium' ? 'amber' : 'red'}
            size="sm"
          >
            {guide.difficulty.charAt(0).toUpperCase() + guide.difficulty.slice(1)}
          </Badge>
          <span className="text-xs text-cyan-400 flex items-center gap-1 font-medium">
            Read Guide <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Card>
    </motion.div>
  );
}

function GuideContent({
  guide,
  allGuides,
  onBack,
  onSelectGuide,
}: {
  guide: StudyGuideSection;
  allGuides: StudyGuideSection[];
  onBack: () => void;
  onSelectGuide: (g: StudyGuideSection) => void;
}) {
  const headings = useMemo(
    () => guide.content.filter((b) => b.type === 'heading').map((b) => b.content),
    [guide],
  );

  const related = useMemo(
    () =>
      allGuides
        .filter((g) => g.id !== guide.id && g.domain === guide.domain)
        .slice(0, 3),
    [allGuides, guide],
  );

  const scrollToHeading = (heading: string) => {
    const id = `section-${heading.replace(/\s+/g, '-').toLowerCase()}`;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ChevronLeft className="w-4 h-4" />}
        onClick={onBack}
        className="mb-6"
      >
        All Guides
      </Button>

      {/* Guide header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <DomainBadge domain={guide.domain} />
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Clock className="w-3.5 h-3.5" />
            {guide.estimatedReadTime} min read
          </div>
          <Badge
            variant={guide.difficulty === 'easy' ? 'green' : guide.difficulty === 'medium' ? 'amber' : 'red'}
            size="sm"
          >
            {guide.difficulty.charAt(0).toUpperCase() + guide.difficulty.slice(1)}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold text-white leading-snug mb-2">{guide.title}</h1>
        <p className="text-slate-400 text-sm leading-relaxed">{guide.summary}</p>
      </div>

      {/* Table of contents */}
      {headings.length > 0 && (
        <div className="bg-navy-800/60 border border-white/5 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <List className="w-3.5 h-3.5" />
            Table of Contents
          </div>
          <ol className="space-y-1.5">
            {headings.map((h, i) => (
              <li key={i}>
                <button
                  onClick={() => scrollToHeading(h)}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors text-left"
                >
                  {i + 1}. {h}
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Content blocks */}
      <div className="mb-8">
        {guide.content.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>

      {/* Key Takeaways */}
      {guide.keyTakeaways && guide.keyTakeaways.length > 0 && (
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-cyan-300 text-sm uppercase tracking-wider">Key Takeaways</h3>
          </div>
          <ul className="space-y-2">
            {guide.keyTakeaways.map((item: string, i: number) => (
              <li key={i} className="flex gap-2.5 text-sm text-slate-200">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-[10px] font-bold mt-0.5">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Related Guides */}
      {related.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Related Guides
          </h3>
          <div className="space-y-2">
            {related.map((g) => (
              <button
                key={g.id}
                onClick={() => onSelectGuide(g)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-white/5 bg-navy-800/60 hover:bg-navy-700/60 hover:border-cyan-500/20 transition-all text-left group"
              >
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">
                    {g.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{g.summary}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0 group-hover:text-cyan-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function StudyGuides() {
  const [selectedGuide, setSelectedGuide] = useState<StudyGuideSection | null>(null);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState<QuestionDomain | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const guidesByDomain = useMemo(() => {
    const map = new Map<QuestionDomain, StudyGuideSection[]>();
    studyGuides.forEach((g) => {
      if (!map.has(g.domain)) map.set(g.domain, []);
      map.get(g.domain)!.push(g);
    });
    return map;
  }, []);

  const filteredGuides = useMemo(() => {
    let items = studyGuides;
    if (domainFilter) items = items.filter((g) => g.domain === domainFilter);
    const q = search.toLowerCase().trim();
    if (q) {
      items = items.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.summary.toLowerCase().includes(q) ||
          g.domain.toLowerCase().includes(q),
      );
    }
    return items;
  }, [domainFilter, search]);

  const handleSelectGuide = (g: StudyGuideSection) => {
    setSelectedGuide(g);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white pb-16 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 border-r border-white/5 bg-navy-900/40">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">All Guides</span>
            <Badge variant="default" size="sm">{studyGuides.length}</Badge>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {Array.from(guidesByDomain.entries()).map(([domain, guides]) => (
            <div key={domain} className="mb-1">
              <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {DOMAIN_SHORT[domain]}
              </div>
              {guides.map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleSelectGuide(g)}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-xs transition-colors group',
                    selectedGuide?.id === g.id
                      ? 'bg-cyan-500/10 text-cyan-300 border-r-2 border-cyan-500'
                      : 'text-slate-400 hover:text-white hover:bg-white/5',
                  )}
                >
                  <span className="line-clamp-2 leading-relaxed">{g.title}</span>
                  <span className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-600">
                    <Clock className="w-2.5 h-2.5" />
                    {g.estimatedReadTime} min
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-navy-900 border-r border-white/5 z-50 lg:hidden flex flex-col"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">All Guides</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                {Array.from(guidesByDomain.entries()).map(([domain, guides]) => (
                  <div key={domain} className="mb-1">
                    <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {DOMAIN_SHORT[domain]}
                    </div>
                    {guides.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => handleSelectGuide(g)}
                        className={cn(
                          'w-full text-left px-4 py-2.5 text-xs transition-colors',
                          selectedGuide?.id === g.id
                            ? 'bg-cyan-500/10 text-cyan-300'
                            : 'text-slate-400 hover:text-white hover:bg-white/5',
                        )}
                      >
                        <span className="line-clamp-2">{g.title}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-navy-950/80 backdrop-blur border-b border-white/5 px-4 lg:px-8 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <BookOpen className="w-4 h-4 text-cyan-400 hidden sm:block" />
            <h1 className="text-base font-bold text-white">Study Guides</h1>
          </div>
        </div>

        <div className="px-4 lg:px-8 py-6 max-w-4xl">
          <AnimatePresence mode="wait">
            {selectedGuide ? (
              <motion.div key={`guide-${selectedGuide.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GuideContent
                  guide={selectedGuide}
                  allGuides={studyGuides}
                  onBack={() => setSelectedGuide(null)}
                  onSelectGuide={handleSelectGuide}
                />
              </motion.div>
            ) : (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Overview header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    SecAI+ Study Guides
                  </h2>
                  <p className="text-slate-400 text-sm">
                    In-depth articles covering all exam domains. Select a guide to start reading.
                  </p>
                </div>

                {/* Search + Domain Filter */}
                <div className="space-y-3 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search guides..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-navy-800/60 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setDomainFilter(null)}
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                        !domainFilter
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20',
                      )}
                    >
                      All
                    </button>
                    {DOMAINS.map((d) => (
                      <button
                        key={d}
                        onClick={() => setDomainFilter(d)}
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                          domainFilter === d
                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20',
                        )}
                      >
                        {DOMAIN_SHORT[d]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <p className="text-xs text-slate-500 mb-4">
                  {filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''} ·{' '}
                  {filteredGuides.reduce((s, g) => s + g.estimatedReadTime, 0)} min total read time
                </p>

                {/* Grid */}
                {filteredGuides.length === 0 ? (
                  <div className="text-center py-20 text-slate-500">
                    <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>No guides match your search.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                      {filteredGuides.map((guide) => (
                        <GuideCard
                          key={guide.id}
                          guide={guide}
                          onSelect={() => handleSelectGuide(guide)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
