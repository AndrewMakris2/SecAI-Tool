/**
 * AI Provider Abstraction Layer
 *
 * This module provides a unified interface for multiple AI providers.
 * To swap providers, update the AIConfig in Settings. The rest of the app
 * uses this interface without knowing which provider is active.
 *
 * Security note: API keys are stored in localStorage for this frontend-only app.
 * In production, keys should be stored server-side and accessed via authenticated API calls.
 * Never commit API keys to version control.
 */
import { AIConfig, AIProvider, ChatMessage, TutoringMode, ExplainRole } from '@/types';
import { openAIProvider } from './providers/openai';
import { anthropicProvider } from './providers/anthropic';
import { groqProvider } from './providers/groq';
import { openRouterProvider } from './providers/openrouter';

export interface AIProviderInterface {
  sendMessage: (
    messages: ChatMessage[],
    config: AIConfig,
    options?: AIRequestOptions,
  ) => Promise<string>;
  getAvailableModels: () => string[];
  validateKey: (key: string) => Promise<boolean>;
}

export interface AIRequestOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export class AIProviderError extends Error {
  constructor(
    message: string,
    public code: 'missing-key' | 'invalid-key' | 'rate-limit' | 'bad-response' | 'network-error' | 'unsupported-provider',
  ) {
    super(message);
    this.name = 'AIProviderError';
  }
}

const providers: Record<AIProvider, AIProviderInterface> = {
  openai: openAIProvider,
  anthropic: anthropicProvider,
  groq: groqProvider,
  openrouter: openRouterProvider,
  gemini: {
    // Stub — implement when needed
    sendMessage: async () => { throw new AIProviderError('Gemini provider not yet implemented. Use OpenAI, Anthropic, Groq, or OpenRouter.', 'unsupported-provider'); },
    getAvailableModels: () => ['gemini-1.5-pro', 'gemini-1.5-flash'],
    validateKey: async () => false,
  },
};

/**
 * Sends a message to the configured AI provider.
 * Handles errors uniformly regardless of provider.
 */
export async function sendAIMessage(
  messages: ChatMessage[],
  config: AIConfig,
  options?: AIRequestOptions,
): Promise<string> {
  if (!config.apiKey || config.apiKey.trim() === '') {
    throw new AIProviderError(
      'No API key configured. Please add your API key in Settings.',
      'missing-key',
    );
  }

  const provider = providers[config.provider];
  if (!provider) {
    throw new AIProviderError(
      `Unknown provider: ${config.provider}`,
      'unsupported-provider',
    );
  }

  return provider.sendMessage(messages, config, options);
}

/**
 * Builds the system prompt for the AI tutor based on tutoring mode and settings.
 */
export function buildSystemPrompt(
  mode: TutoringMode,
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
  role?: ExplainRole,
): string {
  const basePrompt = `You are an expert SecAI+ certification study coach and AI security instructor. You help security professionals prepare for the CompTIA SecAI+ certification exam.

Your expertise covers:
- AI/ML security fundamentals and threat modeling
- Adversarial attacks (adversarial examples, data poisoning, model inversion, membership inference, model stealing)
- LLM security (prompt injection, jailbreaking, RAG security)
- AI governance, compliance, and risk management (NIST AI RMF, EU AI Act, responsible AI)
- AI in security operations (SIEM/SOAR integration, UEBA, threat detection)
- Secure MLOps and the AI/ML pipeline
- Incident response for AI-enabled systems
- Privacy-preserving ML (differential privacy, federated learning)
- The MITRE ATLAS framework for adversarial ML

Study level: ${experienceLevel}

IMPORTANT GUIDELINES:
- You teach, not just give answers. Encourage reasoning and active recall.
- Explain WHY wrong answers are wrong, not just what the right answer is.
- Adapt complexity to the stated study level.
- Be precise with technical terminology — this is certification prep.
- Do not make up specific exam questions or claim to know what's on the actual exam.
- Clearly distinguish between general best practices and cert-specific guidance.
- Keep responses focused and concise — learners have limited time.
- Avoid unsupported claims or speculation.`;

  const modeInstructions: Record<TutoringMode, string> = {
    explain: `\n\nCurrent mode: EXPLAIN CONCEPT\nProvide a clear, thorough explanation of the requested concept. Structure it with: (1) core definition, (2) why it matters for security, (3) real-world examples, (4) exam-relevant key points.`,
    'hint-only': `\n\nCurrent mode: HINT ONLY\nDo NOT give the full answer. Instead, provide Socratic hints that guide the learner to discover the answer themselves. Ask leading questions. Reveal the minimum needed to unstick them.`,
    'quiz-me': `\n\nCurrent mode: QUIZ ME\nAsk the user a challenging question on the requested topic. After they answer, evaluate it: acknowledge what's right, correct what's wrong, and explain the complete answer. Then offer another question.`,
    challenge: `\n\nCurrent mode: CHALLENGE MODE\nPresent advanced scenario-based questions that require applying multiple concepts. Don't accept surface-level answers — push for depth, nuance, and edge cases.`,
    simple: `\n\nCurrent mode: EXPLAIN SIMPLY\nExplain the concept in the simplest possible terms, avoiding jargon. Use everyday analogies. Pretend the learner has no security background.`,
    analogy: `\n\nCurrent mode: ANALOGY MODE\nExplain the concept using a creative, memorable analogy from everyday life or a different domain. Make it vivid and concrete, then connect it back to the technical concept.`,
    'mini-quiz': `\n\nCurrent mode: MINI QUIZ GENERATOR\nGenerate a 5-question mini quiz on the requested topic in the exact format:\nQ1: [question]\na) [option]\nb) [option]\nc) [option]\nd) [option]\nCorrect: [letter] - [brief explanation]\n\nMake questions certification-style and progressively harder.`,
    'explain-role': role
      ? `\n\nCurrent mode: EXPLAIN BY ROLE\nExplain this concept specifically to a ${formatRole(role)}. Tailor the framing, examples, and relevance to their day-to-day work and concerns. What does THIS concept mean for THEIR specific job function?`
      : `\n\nCurrent mode: EXPLAIN BY ROLE\nExplain this concept for the specified professional role, tailoring framing and examples to their job function.`,
  };

  return basePrompt + (modeInstructions[mode] || '');
}

function formatRole(role: ExplainRole): string {
  const roleNames: Record<ExplainRole, string> = {
    'soc-analyst': 'SOC Analyst',
    'security-engineer': 'Security Engineer',
    'grc-analyst': 'GRC Analyst',
    'cloud-engineer': 'Cloud/Infrastructure Engineer',
    'executive': 'Manager or Executive (non-technical)',
  };
  return roleNames[role] || role;
}

export const PROVIDER_DISPLAY_NAMES: Record<AIProvider, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic (Claude)',
  groq: 'Groq',
  openrouter: 'OpenRouter',
  gemini: 'Google Gemini',
};

export const PROVIDER_DEFAULT_MODELS: Record<AIProvider, string> = {
  openai: 'gpt-4o',
  anthropic: 'claude-sonnet-4-6',
  groq: 'llama-3.3-70b-versatile',
  openrouter: 'anthropic/claude-3.5-sonnet',
  gemini: 'gemini-1.5-pro',
};
