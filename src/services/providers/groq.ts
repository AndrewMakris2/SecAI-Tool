/**
 * Groq provider implementation.
 * Groq uses an OpenAI-compatible API format, making it easy to integrate.
 * Supports Llama 3, Mixtral, and Gemma models with very fast inference.
 */
import { AIConfig, ChatMessage } from '@/types';
import { AIProviderInterface, AIRequestOptions, AIProviderError } from '../aiProvider';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const groqProvider: AIProviderInterface = {
  async sendMessage(
    messages: ChatMessage[],
    config: AIConfig,
    options?: AIRequestOptions,
  ): Promise<string> {
    const model = config.model || 'llama-3.3-70b-versatile';

    const body = {
      model,
      messages: [
        ...(options?.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
        ...messages
          .filter((m) => m.role !== 'system')
          .map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
    };

    let response: Response;
    try {
      response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(body),
      });
    } catch {
      throw new AIProviderError('Network error connecting to Groq.', 'network-error');
    }

    if (response.status === 401) throw new AIProviderError('Invalid Groq API key.', 'invalid-key');
    if (response.status === 429) throw new AIProviderError('Groq rate limit hit. Try again shortly.', 'rate-limit');
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new AIProviderError(
        (error as { error?: { message?: string } }).error?.message || `Groq error: ${response.status}`,
        'bad-response',
      );
    }

    const data = await response.json();
    const content = (data as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0]?.message?.content;
    if (!content) throw new AIProviderError('Groq returned empty response.', 'bad-response');
    return content;
  },

  getAvailableModels: () => [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768',
    'gemma2-9b-it',
  ],

  validateKey: async (key: string) => {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${key}` },
      });
      return r.ok;
    } catch { return false; }
  },
};
