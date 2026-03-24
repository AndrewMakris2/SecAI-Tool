import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Zap,
  Download,
  Upload,
  Trash2,
  Shield,
  Info,
  CheckCircle,
  XCircle,
  ChevronDown,
  Settings as SettingsIcon,
  RotateCcw,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/utils/cn';
import { AIProvider, Difficulty } from '@/types';

// ── Types ────────────────────────────────────────────────────────────────────

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const AI_PROVIDERS: { value: AIProvider; label: string }[] = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'groq', label: 'Groq' },
  { value: 'openrouter', label: 'OpenRouter' },
];

const QUESTION_COUNTS = [10, 20, 30, 50];

const DIFFICULTIES: { value: 'all' | Difficulty; label: string }[] = [
  { value: 'all', label: 'All Difficulties' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

function generateId() {
  return Math.random().toString(36).slice(2);
}

// ── InlineToast ──────────────────────────────────────────────────────────────

function InlineToasts({ toasts, onDismiss: _onDismiss }: { toasts: Toast[]; onDismiss: (_id: string) => void }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl pointer-events-auto text-sm',
            t.type === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300',
          )}
        >
          {t.type === 'success' ? <CheckCircle size={15} /> : <XCircle size={15} />}
          {t.message}
        </motion.div>
      ))}
    </div>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 flex-shrink-0',
          checked ? 'bg-cyan-500' : 'bg-navy-700 border border-white/10',
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1',
          )}
        />
      </button>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function Settings() {
  const {
    settings,
    analytics,
    quizSessions,
    flaggedQuestions,
    updateSettings,
    setAIConfig,
    clearAIConfig,
    resetProgress,
    exportData,
    importData,
  } = useAppStore();

  // ── Local state ───────────────────────────────────────────────────────────

  const [aiProvider, setAiProvider] = useState<AIProvider>(settings.aiConfig?.provider ?? 'openai');
  const [apiKey, setApiKey] = useState(settings.aiConfig?.apiKey ?? '');
  const [aiModel, setAiModel] = useState(settings.aiConfig?.model ?? '');
  const [showKey, setShowKey] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [defaultDifficulty, setDefaultDifficulty] = useState<'all' | Difficulty>('all');
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  // ── Toast helpers ─────────────────────────────────────────────────────────

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // ── AI Config ─────────────────────────────────────────────────────────────

  const handleSaveAIConfig = () => {
    if (!apiKey.trim()) {
      addToast('API key cannot be empty', 'error');
      return;
    }
    setAIConfig({
      provider: aiProvider,
      apiKey: apiKey.trim(),
      model: aiModel.trim() || undefined,
    });
    addToast('AI configuration saved', 'success');
  };

  const handleRemoveKey = () => {
    clearAIConfig();
    setApiKey('');
    setAiModel('');
    addToast('API key removed', 'success');
  };

  // ── Export ────────────────────────────────────────────────────────────────

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `secai-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Progress exported successfully', 'success');
  };

  // ── Import ────────────────────────────────────────────────────────────────

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      importData(text);
      addToast('Progress imported successfully', 'success');
    } catch {
      addToast('Failed to import: invalid file format', 'error');
    } finally {
      if (importInputRef.current) importInputRef.current.value = '';
    }
  };

  // ── Reset ─────────────────────────────────────────────────────────────────

  const handleConfirmReset = () => {
    if (resetConfirmText !== 'RESET') return;
    resetProgress();
    setResetModalOpen(false);
    setResetConfirmText('');
    addToast('All progress has been reset', 'success');
  };

  // ── Stats for display ─────────────────────────────────────────────────────

  const flashcardsMastered = analytics.flashcardsMastered ?? 0;
  const currentProvider = AI_PROVIDERS.find((p) => p.value === aiProvider);
  const currentDifficulty = DIFFICULTIES.find((d) => d.value === defaultDifficulty);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <SettingsIcon className="text-cyan-400" size={24} />
          Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">Manage your preferences, AI configuration, and data</p>
      </div>

      {/* ── Section 1: AI Configuration ── */}
      <Card>
        <CardHeader title="AI Configuration" subtitle="Connect your AI provider for the AI Tutor feature" icon={<Bot size={16} />} />

        <div className="space-y-4">
          {/* Provider dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
              Provider
            </label>
            <div className="relative">
              <button
                onClick={() => setShowProviderDropdown((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-navy-900/60 border border-white/10 text-sm text-white hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 transition-colors"
              >
                {currentProvider?.label ?? 'Select provider'}
                <ChevronDown size={14} className="text-slate-400" />
              </button>
              {showProviderDropdown && (
                <div className="absolute top-full mt-1 left-0 right-0 z-20 bg-navy-800 border border-white/10 rounded-xl shadow-xl overflow-hidden">
                  {AI_PROVIDERS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => {
                        setAiProvider(p.value);
                        setShowProviderDropdown(false);
                      }}
                      className={cn(
                        'block w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors',
                        aiProvider === p.value ? 'text-cyan-400' : 'text-slate-300',
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-…"
                className="w-full bg-navy-900/60 border border-white/10 rounded-xl px-3 py-2.5 pr-11 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-colors font-mono"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded"
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Model (optional) */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
              Model <span className="normal-case text-slate-600">(optional)</span>
            </label>
            <input
              type="text"
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              placeholder="e.g. gpt-4o, claude-3-5-sonnet-20241022"
              className="w-full bg-navy-900/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-colors"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <Button onClick={handleSaveAIConfig} leftIcon={<CheckCircle size={14} />}>
              Save Configuration
            </Button>
            {settings.aiConfig && (
              <Button variant="danger" onClick={handleRemoveKey} leftIcon={<Trash2 size={14} />}>
                Remove Key
              </Button>
            )}
          </div>

          {/* Security note */}
          <div className="flex gap-2.5 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <Shield size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Your API key is stored only in your browser's localStorage. It is sent directly to your chosen AI provider and never to any third-party server.
            </p>
          </div>
        </div>
      </Card>

      {/* ── Section 2: Appearance ── */}
      <Card>
        <CardHeader title="Appearance" subtitle="Customize how the app looks and feels" icon={<Sun size={16} />} />

        <div className="space-y-2">
          {/* Theme toggle */}
          <div className="py-3">
            <p className="text-sm font-medium text-white mb-2">Theme</p>
            <div className="flex gap-2">
              <button
                onClick={() => updateSettings({ theme: 'dark' })}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors',
                  settings.theme === 'dark'
                    ? 'bg-navy-700 border-cyan-500/40 text-white'
                    : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300',
                )}
              >
                <Moon size={14} />
                Dark
              </button>
              <button
                onClick={() => updateSettings({ theme: 'light' })}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors',
                  settings.theme === 'light'
                    ? 'bg-navy-700 border-cyan-500/40 text-white'
                    : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300',
                )}
              >
                <Sun size={14} />
                Light
              </button>
            </div>
          </div>

          <div className="border-t border-white/5" />

          <Toggle
            checked={settings.animationsEnabled}
            onChange={(v) => updateSettings({ animationsEnabled: v })}
            label="Enable smooth animations"
            description="Framer Motion transitions throughout the app"
          />
        </div>
      </Card>

      {/* ── Section 3: Quiz Defaults ── */}
      <Card>
        <CardHeader title="Quiz Defaults" subtitle="Default settings applied when starting a new quiz" icon={<Zap size={16} />} />

        <div className="space-y-2">
          {/* Question count */}
          <div className="py-3">
            <p className="text-sm font-medium text-white mb-2">Default Question Count</p>
            <div className="flex gap-2 flex-wrap">
              {QUESTION_COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() =>
                    updateSettings({
                      quizDefaults: { ...settings.quizDefaults, questionCount: n },
                    })
                  }
                  className={cn(
                    'px-4 py-2 rounded-xl border text-sm font-medium transition-colors',
                    settings.quizDefaults.questionCount === n
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                      : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300',
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Default difficulty */}
          <div className="py-3 border-t border-white/5">
            <p className="text-sm font-medium text-white mb-2">Default Difficulty</p>
            <div className="relative inline-block">
              <button
                onClick={() => setShowDifficultyDropdown((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-900/60 border border-white/10 text-sm text-white hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 transition-colors"
              >
                {currentDifficulty?.label}
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {showDifficultyDropdown && (
                <div className="absolute top-full mt-1 left-0 z-20 bg-navy-800 border border-white/10 rounded-xl shadow-xl overflow-hidden min-w-max">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => {
                        setDefaultDifficulty(d.value);
                        setShowDifficultyDropdown(false);
                      }}
                      className={cn(
                        'block w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors',
                        defaultDifficulty === d.value ? 'text-cyan-400' : 'text-slate-300',
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-white/5" />

          <Toggle
            checked={settings.quizDefaults.showImmediateFeedback}
            onChange={(v) =>
              updateSettings({
                quizDefaults: { ...settings.quizDefaults, showImmediateFeedback: v },
              })
            }
            label="Immediate feedback"
            description="Show correct answer immediately after each question"
          />

          <div className="border-t border-white/5" />

          <Toggle
            checked={settings.showTimerByDefault}
            onChange={(v) => updateSettings({ showTimerByDefault: v })}
            label="Enable timer by default"
            description="Start quizzes with the countdown timer active"
          />
        </div>
      </Card>

      {/* ── Section 4: Study Progress ── */}
      <Card>
        <CardHeader title="Study Progress" subtitle="Manage your stored progress data" icon={<Download size={16} />} />

        {/* Current stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-navy-900/40 rounded-xl p-3 text-center border border-white/5">
            <p className="text-lg font-bold text-white">{analytics.totalQuestionsAnswered}</p>
            <p className="text-xs text-slate-500 mt-0.5">Questions</p>
          </div>
          <div className="bg-navy-900/40 rounded-xl p-3 text-center border border-white/5">
            <p className="text-lg font-bold text-white">{quizSessions.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Quizzes</p>
          </div>
          <div className="bg-navy-900/40 rounded-xl p-3 text-center border border-white/5">
            <p className="text-lg font-bold text-white">{flashcardsMastered}</p>
            <p className="text-xs text-slate-500 mt-0.5">Mastered</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            leftIcon={<Download size={14} />}
            onClick={handleExport}
          >
            Export Progress
          </Button>
          <Button
            variant="secondary"
            leftIcon={<Upload size={14} />}
            onClick={handleImportClick}
          >
            Import Progress
          </Button>
          <Button
            variant="danger"
            leftIcon={<RotateCcw size={14} />}
            onClick={() => setResetModalOpen(true)}
          >
            Reset All Progress
          </Button>
        </div>

        {/* Hidden file input for import */}
        <input
          ref={importInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleImportFile}
          className="hidden"
          aria-hidden="true"
        />
      </Card>

      {/* ── Section 5: About ── */}
      <Card>
        <CardHeader title="About" icon={<Info size={16} />} />

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-sm text-slate-400">Version</span>
            <span className="text-sm font-medium text-white">SecAI+ Study Platform v1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-sm text-slate-400">Purpose</span>
            <span className="text-sm text-slate-300">SecAI+ exam preparation</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-sm text-slate-400">Flagged</span>
            <span className="text-sm text-slate-300">{flaggedQuestions.length} questions</span>
          </div>
          <div className="pt-1">
            <div className="flex gap-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <Info size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                This platform contains original practice content inspired by AI security certification topics. It does not reproduce official exam materials.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Reset Confirmation Modal ── */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => {
          setResetModalOpen(false);
          setResetConfirmText('');
        }}
        title="Reset All Progress"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <Trash2 size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300 leading-relaxed">
              This will permanently delete all quiz history, analytics, flagged questions, missed questions, and flashcard progress. This action cannot be undone.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Type <span className="font-mono font-bold text-red-400">RESET</span> to confirm
            </label>
            <input
              type="text"
              value={resetConfirmText}
              onChange={(e) => setResetConfirmText(e.target.value)}
              placeholder="RESET"
              className="w-full bg-navy-900/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/30 transition-colors font-mono"
              autoComplete="off"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              variant="danger"
              className="flex-1"
              disabled={resetConfirmText !== 'RESET'}
              onClick={handleConfirmReset}
            >
              Reset Everything
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setResetModalOpen(false);
                setResetConfirmText('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Toast notifications ── */}
      <InlineToasts toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
