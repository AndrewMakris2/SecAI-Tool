import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Star,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  BookMarked,
  AlertTriangle,
  Zap,
  Tag,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Badge, DomainBadge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { studyFacts } from '@/data/facts';
import { glossaryTerms } from '@/data/glossary';
import type { StudyFact, GlossaryTerm } from '@/types';

type TabType = 'All Facts' | 'Myths' | 'Tips' | 'Terms' | 'Concepts' | 'Glossary';
const TABS: TabType[] = ['All Facts', 'Myths', 'Tips', 'Terms', 'Concepts', 'Glossary'];

const TYPE_CONFIG: Record<
  StudyFact['type'],
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ReactNode;
    badgeVariant: 'blue' | 'red' | 'amber' | 'cyan' | 'violet';
  }
> = {
  fact: {
    label: 'Fact',
    color: 'text-blue-400',
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/20',
    icon: <Lightbulb className="w-4 h-4" />,
    badgeVariant: 'blue',
  },
  myth: {
    label: 'Myth',
    color: 'text-red-400',
    bg: 'bg-red-500/5',
    border: 'border-red-500/20',
    icon: <AlertTriangle className="w-4 h-4" />,
    badgeVariant: 'red',
  },
  tip: {
    label: 'Tip',
    color: 'text-amber-400',
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/20',
    icon: <Zap className="w-4 h-4" />,
    badgeVariant: 'amber',
  },
  term: {
    label: 'Term',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/5',
    border: 'border-cyan-500/20',
    icon: <Tag className="w-4 h-4" />,
    badgeVariant: 'cyan',
  },
  concept: {
    label: 'Concept',
    color: 'text-violet-400',
    bg: 'bg-violet-500/5',
    border: 'border-violet-500/20',
    icon: <BookMarked className="w-4 h-4" />,
    badgeVariant: 'violet',
  },
};

function FactCard({
  fact,
  isFavorite,
  onToggleFavorite,
}: {
  fact: StudyFact;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  const [mythRevealed, setMythRevealed] = useState(false);
  const cfg = TYPE_CONFIG[fact.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={cn(
          'relative rounded-2xl border p-5 flex flex-col gap-3 transition-colors duration-200',
          cfg.bg,
          cfg.border,
        )}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={cn('flex-shrink-0', cfg.color)}>{cfg.icon}</span>
            <Badge variant={cfg.badgeVariant} size="sm">{cfg.label}</Badge>
            {fact.type === 'myth' && (
              <Badge variant="red" size="sm" className="uppercase tracking-widest font-bold text-[10px]">
                MYTH
              </Badge>
            )}
          </div>
          <button
            onClick={() => onToggleFavorite(fact.id)}
            className={cn(
              'p-1.5 rounded-lg transition-colors flex-shrink-0',
              isFavorite ? 'text-amber-400 hover:text-amber-300' : 'text-slate-500 hover:text-amber-400',
            )}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={cn('w-4 h-4', isFavorite && 'fill-current')} />
          </button>
        </div>

        {/* Content */}
        <p className="text-slate-200 text-sm leading-relaxed">{fact.content}</p>

        {/* Myth reveal */}
        {fact.type === 'myth' && (
          <div>
            <button
              onClick={() => setMythRevealed((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {mythRevealed ? 'Hide verdict' : 'Reveal: True or False?'}
              {mythRevealed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <AnimatePresence>
              {mythRevealed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div
                    className={cn(
                      'mt-2 px-3 py-2 rounded-xl text-sm font-semibold border',
                      fact.isMythTrue
                        ? 'bg-red-500/15 border-red-500/30 text-red-300'
                        : 'bg-green-500/15 border-green-500/30 text-green-300',
                    )}
                  >
                    {fact.isMythTrue
                      ? '⚠️ This myth is TRUE — it reflects a real misconception.'
                      : '✓ This myth is FALSE — the opposite is correct.'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <DomainBadge domain={fact.domain} />
          <div className="flex flex-wrap gap-1">
            {fact.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] text-slate-500 px-1.5 py-0.5 rounded-full bg-white/5">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GlossaryList({
  terms,
  search,
}: {
  terms: GlossaryTerm[];
  search: string;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return terms;
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q),
    );
  }, [terms, search]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => a.term.localeCompare(b.term)),
    [filtered],
  );

  const groups = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    sorted.forEach((t) => {
      const letter = t.term[0].toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(t);
    });
    return map;
  }, [sorted]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (sorted.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        No glossary terms match your search.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Array.from(groups.entries()).map(([letter, items]) => (
        <div key={letter}>
          <div className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2 px-1">
            {letter}
          </div>
          <div className="space-y-2">
            {items.map((term) => {
              const isOpen = expanded.has(term.id);
              return (
                <div
                  key={term.id}
                  className="rounded-xl border border-white/5 bg-navy-800/60 overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpand(term.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-white text-sm">{term.term}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <DomainBadge domain={term.domain} />
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-white/5 pt-3">
                          <p className="text-slate-300 text-sm leading-relaxed">{term.definition}</p>
                          {term.related && term.related.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              <span className="text-xs text-slate-500 mr-1">Related:</span>
                              {term.related.map((r) => (
                                <span key={r} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                                  {r}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Facts() {
  const [activeTab, setActiveTab] = useState<TabType>('All Facts');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const conceptOfDay = useMemo(() => {
    const seed = new Date().toDateString();
    const hash = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return studyFacts[hash % studyFacts.length];
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredFacts = useMemo(() => {
    let items = studyFacts;
    const q = search.toLowerCase().trim();

    if (activeTab !== 'All Facts' && activeTab !== 'Glossary') {
      const typeMap: Record<string, StudyFact['type']> = {
        Myths: 'myth',
        Tips: 'tip',
        Terms: 'term',
        Concepts: 'concept',
      };
      const targetType = typeMap[activeTab];
      if (targetType) items = items.filter((f) => f.type === targetType);
    }

    if (q) {
      items = items.filter(
        (f) =>
          f.content.toLowerCase().includes(q) ||
          f.domain.toLowerCase().includes(q) ||
          f.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return items;
  }, [activeTab, search]);

  const codCfg = TYPE_CONFIG[conceptOfDay.type];

  return (
    <div className="min-h-screen bg-navy-950 text-white pb-16">
      {/* Header */}
      <div className="px-4 pt-8 pb-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Facts & Knowledge
          </h1>
        </div>
        <p className="text-slate-400 text-sm ml-12">Key concepts, myths, tips, and the SecAI+ glossary</p>
      </div>

      <div className="px-4 max-w-6xl mx-auto space-y-6">
        {/* Concept of the Day */}
        <div
          className={cn(
            'rounded-2xl border p-6 relative overflow-hidden',
            codCfg.border,
            codCfg.bg,
          )}
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-violet-500/5 blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">
                Concept of the Day
              </span>
            </div>
            <Badge variant={codCfg.badgeVariant} size="sm" className="mb-3">
              {codCfg.label}
            </Badge>
            <p className="text-white text-base leading-relaxed font-medium max-w-3xl">
              {conceptOfDay.content}
            </p>
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <DomainBadge domain={conceptOfDay.domain} />
              {conceptOfDay.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-slate-500 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search facts, myths, tips, terms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-navy-800/60 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-navy-900 rounded-xl p-1 border border-white/5 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 min-w-max px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                activeTab === tab
                  ? 'bg-navy-700 text-white shadow'
                  : 'text-slate-400 hover:text-white',
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'Glossary' ? (
            <motion.div
              key="glossary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <GlossaryList terms={glossaryTerms} search={search} />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {filteredFacts.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                  <BookMarked className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p>No items match your search.</p>
                </div>
              ) : (
                <>
                  <div className="text-xs text-slate-500 mb-3">
                    {filteredFacts.length} item{filteredFacts.length !== 1 ? 's' : ''}
                    {favorites.size > 0 && (
                      <span className="ml-2 text-amber-400">
                        · {favorites.size} starred
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {filteredFacts.map((fact) => (
                        <FactCard
                          key={fact.id}
                          fact={fact}
                          isFavorite={favorites.has(fact.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
