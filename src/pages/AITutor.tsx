import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  User,
  Send,
  Trash2,
  Key,
  Settings2,
  Loader2,
  AlertCircle,
  Sparkles,
  Copy,
  CheckCheck,
  X,
  PanelLeft,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import {
  sendAIMessage,
  buildSystemPrompt,
  PROVIDER_DISPLAY_NAMES,
  PROVIDER_DEFAULT_MODELS,
} from '@/services/aiProvider';
import type {
  AIConfig,
  AIProvider,
  TutoringMode,
  ExplainRole,
  ChatMessage,
} from '@/types';

// ── Types ────────────────────────────────────────────────────────────────────

interface LocalMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  tutoringMode?: TutoringMode;
  error?: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PROVIDERS: { value: AIProvider; label: string }[] = [
  { value: 'openai', label: 'OpenAI (GPT-4o)' },
  { value: 'anthropic', label: 'Anthropic (Claude)' },
  { value: 'groq', label: 'Groq (Llama)' },
  { value: 'openrouter', label: 'OpenRouter' },
  { value: 'gemini', label: 'Google Gemini' },
];

const TUTORING_MODES: { value: TutoringMode; label: string; desc: string }[] = [
  { value: 'explain', label: 'Explain Concept', desc: 'Deep, structured explanation' },
  { value: 'hint-only', label: 'Give Hint', desc: 'Socratic hints only' },
  { value: 'quiz-me', label: 'Quiz Me', desc: 'One question at a time' },
  { value: 'challenge', label: 'Challenge Me', desc: 'Advanced scenarios' },
  { value: 'simple', label: 'Break It Down', desc: 'Simple terms & analogies' },
  { value: 'analogy', label: 'Create Analogy', desc: 'Memorable real-world analogy' },
  { value: 'mini-quiz', label: 'Mini Practice Quiz', desc: '5-question cert-style quiz' },
];

const EXPLAIN_ROLES: { value: ExplainRole; label: string }[] = [
  { value: 'soc-analyst', label: 'SOC Analyst' },
  { value: 'security-engineer', label: 'Security Engineer' },
  { value: 'grc-analyst', label: 'GRC Analyst' },
  { value: 'cloud-engineer', label: 'Cloud Engineer' },
  { value: 'executive', label: 'Executive' },
];

const QUICK_PROMPTS = [
  'Teach me AI security governance',
  'Explain adversarial ML',
  'Quiz me on secure AI pipelines',
  'What is prompt injection?',
  'Explain data poisoning',
  'Give me 5 hard SecAI+ questions',
  'What are MITRE ATLAS tactics?',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-navy-800/80 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: LocalMessage }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex items-end gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser
            ? 'bg-gradient-to-br from-violet-500 to-blue-600'
            : 'bg-gradient-to-br from-cyan-500 to-blue-600',
        )}
      >
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>

      {/* Bubble */}
      <div className={cn('group max-w-[75%] relative', isUser ? 'items-end' : 'items-start', 'flex flex-col gap-1')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
            isUser
              ? 'bg-gradient-to-br from-cyan-600/30 to-blue-600/30 border border-cyan-500/20 text-white rounded-br-sm'
              : message.error
              ? 'bg-red-500/10 border border-red-500/20 text-red-300 rounded-bl-sm'
              : 'bg-navy-800/80 border border-white/5 text-slate-200 rounded-bl-sm',
          )}
        >
          {message.content}
        </div>
        <div
          className={cn(
            'flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity',
            isUser ? 'flex-row-reverse' : 'flex-row',
          )}
        >
          <span className="text-[10px] text-slate-600">{formatTime(message.timestamp)}</span>
          {!message.error && (
            <button
              onClick={handleCopy}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
              title="Copy"
            >
              {copied ? <CheckCheck className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── API Key Setup Screen ───────────────────────────────────────────────────────

function SetupScreen({ onSave }: { onSave: (config: AIConfig) => void }) {
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');

  const handleSave = () => {
    if (!apiKey.trim()) return;
    onSave({
      provider,
      apiKey: apiKey.trim(),
      model: model.trim() || PROVIDER_DEFAULT_MODELS[provider],
    });
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">AI Tutor Setup</h1>
          <p className="text-slate-400 text-sm">
            Connect your AI provider to start studying with a personal SecAI+ tutor.
            Your API key is stored locally and never sent anywhere except the provider.
          </p>
        </div>

        <Card className="space-y-4">
          {/* Provider */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Provider
            </label>
            <div className="grid grid-cols-1 gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setProvider(p.value)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm transition-all text-left',
                    provider === p.value
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                      : 'bg-navy-900/50 border-white/5 text-slate-400 hover:text-white hover:border-white/10',
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 flex-shrink-0',
                      provider === p.value ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600',
                    )}
                  />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              API Key
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="password"
                placeholder={`Enter your ${PROVIDER_DISPLAY_NAMES[provider]} API key`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="w-full bg-navy-900/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all"
              />
            </div>
          </div>

          {/* Optional model */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Model <span className="text-slate-600 font-normal normal-case">(optional — defaults to {PROVIDER_DEFAULT_MODELS[provider]})</span>
            </label>
            <input
              type="text"
              placeholder={PROVIDER_DEFAULT_MODELS[provider]}
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-navy-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all"
            />
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={handleSave}
            disabled={!apiKey.trim()}
          >
            Connect & Start Studying
          </Button>
        </Card>

        <p className="text-center text-[11px] text-slate-600 mt-4">
          API keys are stored in your browser's localStorage only.
        </p>
      </motion.div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function AITutor() {
  const { settings, setAIConfig } = useAppStore();
  const aiConfig = settings.aiConfig ?? null;

  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<TutoringMode>('explain');
  const [role, setRole] = useState<ExplainRole>('soc-analyst');
  const [panelOpen, setPanelOpen] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSaveConfig = (config: AIConfig) => {
    setAIConfig(config);
  };

  const buildHistory = (localMessages: LocalMessage[]): ChatMessage[] => {
    return localMessages
      .filter((m) => !m.error)
      .map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.timestamp).toISOString(),
      }));
  };

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || loading || !aiConfig) return;

      const userMsg: LocalMessage = {
        id: makeId(),
        role: 'user',
        content: userText.trim(),
        timestamp: Date.now(),
        tutoringMode: mode,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setLoading(true);
      setError(null);

      // Auto-resize textarea back
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      try {
        const history = buildHistory([...messages, userMsg]);
        const systemPrompt = buildSystemPrompt(
          mode,
          'intermediate',
          mode === 'explain-role' ? role : undefined,
        );

        const reply = await sendAIMessage(history, aiConfig, {
          systemPrompt,
          temperature: 0.7,
          maxTokens: 1500,
        });

        const assistantMsg: LocalMessage = {
          id: makeId(),
          role: 'assistant',
          content: reply,
          timestamp: Date.now(),
          tutoringMode: mode,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred.';
        setError(message);

        const errorMsg: LocalMessage = {
          id: makeId(),
          role: 'assistant',
          content: `Error: ${message}`,
          timestamp: Date.now(),
          error: true,
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setLoading(false);
      }
    },
    [loading, aiConfig, messages, mode, role],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
  };

  // Show setup if no config
  if (!aiConfig) {
    return <SetupScreen onSave={handleSaveConfig} />;
  }

  const activeModeCfg = TUTORING_MODES.find((m) => m.value === mode)!;
  const providerLabel = PROVIDER_DISPLAY_NAMES[aiConfig.provider];
  const modelLabel = aiConfig.model || PROVIDER_DEFAULT_MODELS[aiConfig.provider];

  return (
    <div className="h-screen bg-navy-950 flex overflow-hidden">
      {/* Left Panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex-shrink-0 border-r border-white/5 bg-navy-900/40 flex flex-col overflow-hidden"
            style={{ minWidth: 0 }}
          >
            <div className="p-4 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white">Study Mode</span>
              </div>
              <p className="text-[11px] text-slate-500">Configure how the AI teaches you</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Mode selector */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Tutoring Mode
                </p>
                <div className="space-y-1">
                  {TUTORING_MODES.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMode(m.value)}
                      className={cn(
                        'w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left transition-all group',
                        mode === m.value
                          ? 'bg-cyan-500/15 border border-cyan-500/30 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent',
                      )}
                    >
                      <div
                        className={cn(
                          'w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5',
                          mode === m.value ? 'bg-cyan-400' : 'bg-slate-600 group-hover:bg-slate-400',
                        )}
                      />
                      <div>
                        <p className="text-xs font-medium leading-tight">{m.label}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{m.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role selector */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Explain Like I'm a...
                </p>
                <div className="space-y-1">
                  {EXPLAIN_ROLES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => { setRole(r.value); setMode('explain-role'); }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all',
                        role === r.value && mode === 'explain-role'
                          ? 'bg-violet-500/15 border border-violet-500/30 text-violet-300'
                          : 'text-slate-400 hover:text-white hover:bg-white/5',
                      )}
                    >
                      <div
                        className={cn(
                          'w-1.5 h-1.5 rounded-full flex-shrink-0',
                          role === r.value && mode === 'explain-role' ? 'bg-violet-400' : 'bg-slate-600',
                        )}
                      />
                      <span className="text-xs font-medium">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick prompts */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Quick Prompts
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      disabled={loading}
                      className="px-2.5 py-1 rounded-full text-[11px] bg-navy-800 border border-white/5 text-slate-400 hover:text-white hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all disabled:opacity-40"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Config display */}
              <div className="pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Settings2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Connection
                  </span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Provider</span>
                    <span className="text-slate-300">{providerLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Model</span>
                    <span className="text-slate-300 truncate max-w-[120px]" title={modelLabel}>{modelLabel}</span>
                  </div>
                </div>
                <button
                  onClick={() => useAppStore.getState().clearAIConfig()}
                  className="mt-3 w-full text-[11px] text-red-400 hover:text-red-300 px-2 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-left"
                >
                  Disconnect provider
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-navy-900/30">
          <button
            onClick={() => setPanelOpen((o) => !o)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title={panelOpen ? 'Hide panel' : 'Show panel'}
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white leading-tight">AI Study Tutor</p>
              <p className="text-[10px] text-slate-500 leading-tight truncate">
                {providerLabel} · {modelLabel} · <span className="text-cyan-500">{activeModeCfg.label}</span>
              </p>
            </div>
          </div>

          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={handleClearChat}
              className="text-slate-500 hover:text-red-400 flex-shrink-0"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Ready to study SecAI+</h2>
              <p className="text-slate-400 text-sm max-w-sm mb-6">
                Ask me to explain concepts, quiz you, create analogies, or challenge you with scenarios.
                Current mode: <span className="text-cyan-400 font-medium">{activeModeCfg.label}</span>
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {QUICK_PROMPTS.slice(0, 4).map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="px-3 py-1.5 rounded-full text-xs bg-navy-800 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {loading && <TypingIndicator />}

          {error && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2.5 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError(null)} className="p-0.5 hover:text-red-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 border-t border-white/5 px-4 py-3 bg-navy-900/20">
          {/* Mode indicator pill */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan" size="sm">{activeModeCfg.label}</Badge>
            {mode === 'explain-role' && (
              <Badge variant="violet" size="sm">
                {EXPLAIN_ROLES.find((r) => r.value === role)?.label}
              </Badge>
            )}
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about SecAI+… (Enter to send, Shift+Enter for newline)"
                rows={1}
                disabled={loading}
                className="w-full bg-navy-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all resize-none overflow-y-auto disabled:opacity-50"
                style={{ minHeight: '44px', maxHeight: '160px' }}
              />
            </div>
            <Button
              variant="primary"
              size="icon"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="flex-shrink-0"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-slate-600 mt-1.5 text-center">
            AI responses may contain errors. Always verify critical security information.
          </p>
        </div>
      </div>
    </div>
  );
}
