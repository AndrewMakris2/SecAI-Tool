/**
 * OpenRouter provider implementation.
 * OpenRouter provides a unified API for 100+ models (OpenAI, Anthropic, Mistral, etc.)
 * Uses OpenAI-compatible format with additional routing headers.
 */
import { AIConfig, ChatMessage } from '@/types';
import { AIProviderInterface, AIRequestOptions, AIProviderError } from '../aiProvider';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const openRouterProvider: AIProviderInterface = {
  async sendMessage(
    messages: ChatMessage[],
    config: AIConfig,
    options?: AIRequestOptions,
  ): Promise<string> {
    const model = config.model || 'anthropic/claude-3.5-sonnet';

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
      response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'SecAI+ Study Platform',
        },
        body: JSON.stringify(body),
      });
    } catch {
      throw new AIProviderError('Network error connecting to OpenRouter.', 'network-error');
    }

    if (response.status === 401) throw new AIProviderError('Invalid OpenRouter API key.', 'invalid-key');
    if (response.status === 429) throw new AIProviderError('OpenRouter rate limit exceeded.', 'rate-limit');
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new AIProviderError(
        (error as { error?: { message?: string } }).error?.message || `OpenRouter error: ${response.status}`,
        'bad-response',
      );
    }

    const data = await response.json();
    const content = (data as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0]?.message?.content;
    if (!content) throw new AIProviderError('OpenRouter returned empty response.', 'bad-response');
    return content;
  },

  getAvailableModels: () => [
    'anthropic/claude-sonnet-4-6',
    'openai/gpt-4o',
    'meta-llama/llama-3.3-70b-instruct',
    'mistralai/mistral-large',
    'google/gemini-pro-1.5',
    'cohere/command-r-plus',
  ],

  validateKey: async (key: string) => {
    try {
      const r = await fetch('https://openrouter.ai/api/v1/models', {
        headers: { Authorization: `Bearer ${key}` },
      });
      return r.ok;
    } catch { return false; }
  },
};
