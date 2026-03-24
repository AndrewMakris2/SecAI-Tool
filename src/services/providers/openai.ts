/**
 * OpenAI provider implementation.
 * Uses the OpenAI Chat Completions API.
 * Supports GPT-4o, GPT-4 Turbo, and GPT-3.5 Turbo.
 */
import { AIConfig, ChatMessage } from '@/types';
import { AIProviderInterface, AIRequestOptions, AIProviderError } from '../aiProvider';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const openAIProvider: AIProviderInterface = {
  async sendMessage(
    messages: ChatMessage[],
    config: AIConfig,
    options?: AIRequestOptions,
  ): Promise<string> {
    const model = config.model || 'gpt-4o';

    const body = {
      model,
      messages: [
        ...(options?.systemPrompt
          ? [{ role: 'system', content: options.systemPrompt }]
          : []),
        ...messages
          .filter((m) => m.role !== 'system')
          .map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
    };

    let response: Response;
    try {
      response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw new AIProviderError(
        'Network error connecting to OpenAI. Check your internet connection.',
        'network-error',
      );
    }

    if (response.status === 401) {
      throw new AIProviderError(
        'Invalid OpenAI API key. Please check your key in Settings.',
        'invalid-key',
      );
    }
    if (response.status === 429) {
      throw new AIProviderError(
        'OpenAI rate limit exceeded. Please wait a moment and try again.',
        'rate-limit',
      );
    }
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new AIProviderError(
        (error as { error?: { message?: string } }).error?.message || `OpenAI API error: ${response.status}`,
        'bad-response',
      );
    }

    const data = await response.json();
    const content = (data as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0]?.message?.content;

    if (!content) {
      throw new AIProviderError('OpenAI returned an empty response.', 'bad-response');
    }

    return content;
  },

  getAvailableModels: () => ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],

  validateKey: async (key: string) => {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${key}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  },
};
