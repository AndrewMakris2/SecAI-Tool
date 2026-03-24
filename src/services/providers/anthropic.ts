/**
 * Anthropic (Claude) provider implementation.
 * Uses the Anthropic Messages API.
 * Supports Claude 3.5 Sonnet, Claude 3 Haiku, and newer models.
 *
 * Note: The Anthropic API requires the anthropic-version header and
 * uses a slightly different message format than OpenAI.
 */
import { AIConfig, ChatMessage } from '@/types';
import { AIProviderInterface, AIRequestOptions, AIProviderError } from '../aiProvider';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

export const anthropicProvider: AIProviderInterface = {
  async sendMessage(
    messages: ChatMessage[],
    config: AIConfig,
    options?: AIRequestOptions,
  ): Promise<string> {
    const model = config.model || 'claude-sonnet-4-6';

    const formattedMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const body = {
      model,
      max_tokens: options?.maxTokens ?? 1024,
      system: options?.systemPrompt,
      messages: formattedMessages,
    };

    let response: Response;
    try {
      response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': ANTHROPIC_VERSION,
          // CORS note: Direct browser calls to Anthropic API require
          // anthropic-dangerous-direct-browser-access header.
          // For production, proxy through your backend.
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw new AIProviderError(
        'Network error connecting to Anthropic API.',
        'network-error',
      );
    }

    if (response.status === 401) {
      throw new AIProviderError('Invalid Anthropic API key.', 'invalid-key');
    }
    if (response.status === 429) {
      throw new AIProviderError('Anthropic rate limit exceeded. Please wait and retry.', 'rate-limit');
    }
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new AIProviderError(
        (error as { error?: { message?: string } }).error?.message || `Anthropic API error: ${response.status}`,
        'bad-response',
      );
    }

    const data = await response.json();
    const content = (data as { content?: Array<{ text?: string }> }).content?.[0]?.text;

    if (!content) {
      throw new AIProviderError('Anthropic returned an empty response.', 'bad-response');
    }

    return content;
  },

  getAvailableModels: () => [
    'claude-sonnet-4-6',
    'claude-opus-4-6',
    'claude-haiku-4-5-20251001',
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
  ],

  validateKey: async (key: string) => {
    // Anthropic doesn't have a lightweight validation endpoint
    // We do a minimal API call to check the key
    try {
      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': ANTHROPIC_VERSION,
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'Hi' }],
        }),
      });
      return response.ok || response.status === 400; // 400 = bad request but key is valid
    } catch {
      return false;
    }
  },
};
