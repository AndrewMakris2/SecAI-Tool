import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronRight, ChevronLeft, Check, Key, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';

// Steps: 0=welcome, 1=name, 2=level, 3=goal, 4=apikey
const TOTAL_STEPS = 5;

const levelOptions = [
  {
    id: 'beginner',
    label: 'New to AI Security',
    description: 'Fresh to the field, building foundational knowledge',
    emoji: '🌱',
  },
  {
    id: 'some-experience',
    label: 'Some Experience',
    description: 'Familiar with security, exploring AI security concepts',
    emoji: '📘',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description: 'Hands-on experience with AI or security operations',
    emoji: '⚡',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: 'Deep expertise, looking to validate and sharpen skills',
    emoji: '🏆',
  },
];

const goalOptions = [
  {
    id: 'pass-exam',
    label: 'Pass the Exam ASAP',
    description: 'Focused, efficient prep to get certified quickly',
    emoji: '🎯',
  },
  {
    id: 'deep-learning',
    label: 'Deep Learning',
    description: 'Thorough understanding of every topic and domain',
    emoji: '🧠',
  },
  {
    id: 'career-pivot',
    label: 'Career Pivot',
    description: 'Transitioning into AI security from another field',
    emoji: '🚀',
  },
  {
    id: 'brush-up',
    label: 'Brush Up Skills',
    description: 'Refreshing knowledge and filling in any gaps',
    emoji: '✨',
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  }),
};

interface SelectionCardProps {
  emoji: string;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

function SelectionCard({ emoji, label, description, selected, onClick }: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-4 rounded-xl border transition-all duration-200 flex items-start gap-3 group ${
        selected
          ? 'border-cyan-500/60 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
          : 'border-white/10 bg-navy-800/60 hover:border-white/25 hover:bg-navy-800'
      }`}
    >
      <span className="text-2xl flex-shrink-0 mt-0.5">{emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`font-medium text-sm ${selected ? 'text-white' : 'text-slate-200'}`}>
            {label}
          </span>
          <span
            className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${
              selected
                ? 'bg-cyan-500 border-cyan-500'
                : 'border-white/20 group-hover:border-white/40'
            }`}
          >
            {selected && <Check className="w-3 h-3 text-white" />}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5 leading-snug">{description}</p>
      </div>
    </button>
  );
}

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const navigate = useNavigate();
  const { setUserProfile, setAIConfig } = useAppStore();

  const progress = ((step) / (TOTAL_STEPS - 1)) * 100;

  function goNext() {
    setDirection(1);
    setStep((s) => s + 1);
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => s - 1);
  }

  function canProceed(): boolean {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return level.length > 0;
    if (step === 3) return goal.length > 0;
    return true;
  }

  function handleFinish() {
    // Map internal level IDs to UserProfile experienceLevel
    const experienceLevelMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
      beginner: 'beginner',
      'some-experience': 'beginner',
      intermediate: 'intermediate',
      advanced: 'advanced',
    };

    // Map internal goal IDs to UserProfile studyGoal
    const studyGoalMap: Record<string, 'pass-exam' | 'refresh-knowledge' | 'career-growth' | 'just-curious'> = {
      'pass-exam': 'pass-exam',
      'deep-learning': 'just-curious',
      'career-pivot': 'career-growth',
      'brush-up': 'refresh-knowledge',
    };

    setUserProfile({
      name: name.trim() || undefined,
      experienceLevel: experienceLevelMap[level] ?? 'beginner',
      studyGoal: studyGoalMap[goal] ?? 'pass-exam',
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
      dailyGoalMinutes: 30,
    });

    if (apiKey.trim()) {
      setAIConfig({
        provider: 'openai',
        apiKey: apiKey.trim(),
      });
    }

    navigate('/dashboard', { replace: true });
  }

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center px-4 py-12">
      {/* Background orbs */}
      <div className="pointer-events-none fixed top-0 -left-40 w-[500px] h-[500px] rounded-full bg-cyan-500/8 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 -right-40 w-[500px] h-[500px] rounded-full bg-violet-500/8 blur-[120px]" />

      {/* Card */}
      <div className="relative w-full max-w-lg">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <span className="text-xs text-slate-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Step card */}
        <div className="relative rounded-2xl border border-white/8 bg-navy-900/80 backdrop-blur-sm shadow-2xl shadow-black/40 overflow-hidden min-h-[420px] flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex-1 flex flex-col p-8"
            >
              {/* ── Step 0: Welcome ── */}
              {step === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <motion.div
                    animate={{ rotate: [0, -8, 8, -4, 4, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.4, delay: 0.3, ease: 'easeInOut' }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30 mb-6"
                  >
                    <Shield className="w-10 h-10 text-white" />
                  </motion.div>

                  <h1 className="text-2xl font-extrabold text-white mb-3">
                    Welcome to SecAI+ Study Platform
                  </h1>
                  <p className="text-slate-400 leading-relaxed max-w-sm text-sm">
                    Your AI-powered prep tool for the CompTIA SecAI+ certification. We'll help you
                    study smarter with 200 practice questions, smart flashcards, domain analytics,
                    and an AI tutor that explains everything in plain English.
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-xs">
                    {[
                      { icon: '📝', label: '200 Questions' },
                      { icon: '🃏', label: 'Smart Flashcards' },
                      { icon: '🤖', label: 'AI Tutor' },
                      { icon: '📊', label: 'Domain Analytics' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 bg-navy-800/60 border border-white/8 rounded-lg px-3 py-2.5"
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="text-xs text-slate-300 font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 1: Name ── */}
              {step === 1 && (
                <div className="flex-1 flex flex-col justify-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/25 rounded-full px-3 py-1 text-xs text-cyan-400 font-medium mb-4">
                      <Sparkles className="w-3 h-3" />
                      Getting started
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">What's your name?</h2>
                    <p className="text-slate-400 text-sm">
                      We'll use this to personalize your study experience.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="name-input" className="text-sm font-medium text-slate-300">
                      Your name
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && canProceed() && goNext()}
                      placeholder="e.g. Alex Chen"
                      autoFocus
                      className="w-full bg-navy-800 border border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm outline-none transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              {/* ── Step 2: Level ── */}
              {step === 2 && (
                <div className="flex-1 flex flex-col">
                  <div className="mb-5">
                    <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 rounded-full px-3 py-1 text-xs text-violet-400 font-medium mb-4">
                      <Sparkles className="w-3 h-3" />
                      Your background
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      What's your experience level?
                    </h2>
                    <p className="text-slate-400 text-sm">
                      This helps us tailor question difficulty and study recommendations.
                    </p>
                  </div>

                  <div className="space-y-2.5 flex-1">
                    {levelOptions.map((option) => (
                      <SelectionCard
                        key={option.id}
                        emoji={option.emoji}
                        label={option.label}
                        description={option.description}
                        selected={level === option.id}
                        onClick={() => setLevel(option.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 3: Goal ── */}
              {step === 3 && (
                <div className="flex-1 flex flex-col">
                  <div className="mb-5">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 rounded-full px-3 py-1 text-xs text-blue-400 font-medium mb-4">
                      <Sparkles className="w-3 h-3" />
                      Your goal
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">What's your study goal?</h2>
                    <p className="text-slate-400 text-sm">
                      We'll shape your study plan and recommendations around this.
                    </p>
                  </div>

                  <div className="space-y-2.5 flex-1">
                    {goalOptions.map((option) => (
                      <SelectionCard
                        key={option.id}
                        emoji={option.emoji}
                        label={option.label}
                        description={option.description}
                        selected={goal === option.id}
                        onClick={() => setGoal(option.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 4: API Key ── */}
              {step === 4 && (
                <div className="flex-1 flex flex-col justify-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-3 py-1 text-xs text-emerald-400 font-medium mb-4">
                      <Key className="w-3 h-3" />
                      Optional
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Connect an AI provider</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Add an API key to unlock the AI Tutor feature. This is entirely optional — all
                      other study tools work without it.
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <label htmlFor="api-key-input" className="text-sm font-medium text-slate-300">
                      API Key{' '}
                      <span className="text-slate-500 font-normal">(OpenAI, Anthropic, etc.)</span>
                    </label>
                    <div className="relative">
                      <input
                        id="api-key-input"
                        type={showKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        autoComplete="off"
                        className="w-full bg-navy-800 border border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 rounded-xl px-4 py-3 pr-11 text-white placeholder-slate-500 text-sm outline-none transition-all duration-200 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-navy-800/50 border border-white/8 rounded-xl p-3.5">
                    <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Your key is stored locally in your browser and is{' '}
                      <span className="text-slate-300 font-medium">never sent to our servers</span>.
                      It's sent directly to your chosen AI provider only when you use the AI Tutor.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation footer */}
          <div className="border-t border-white/5 px-8 py-5 flex items-center justify-between gap-3">
            {step > 0 ? (
              <Button
                variant="ghost"
                size="md"
                onClick={goBack}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              {/* Skip on API key step */}
              {step === 4 && (
                <Button variant="secondary" size="md" onClick={handleFinish}>
                  Skip for now
                </Button>
              )}

              {step < TOTAL_STEPS - 1 ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={goNext}
                  disabled={!canProceed()}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  {step === 0 ? "Let's go" : 'Continue'}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleFinish}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Start Studying
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-5 h-1.5 bg-cyan-500'
                  : i < step
                  ? 'w-1.5 h-1.5 bg-cyan-500/40'
                  : 'w-1.5 h-1.5 bg-navy-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
