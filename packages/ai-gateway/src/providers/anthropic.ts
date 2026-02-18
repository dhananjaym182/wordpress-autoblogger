import { AIProvider, GenerateTextOptions, GenerateTextResult, AIProviderError } from '../types.js';

interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class AnthropicProvider {
  constructor(private config: AIProvider) {}

  get id(): string {
    return this.config.id;
  }

  get name(): string {
    return this.config.name;
  }

  async generateText(options: GenerateTextOptions): Promise<GenerateTextResult> {
    const startTime = Date.now();

    try {
      const response = await fetch(`${this.config.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: options.model || this.config.defaultModelText,
          messages: [{ role: 'user', content: options.prompt }],
          max_tokens: options.maxTokens || 4096,
          temperature: options.temperature ?? 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API error: ${response.status} - ${error}`);
      }

      const data = await response.json() as AnthropicResponse;
      const latency = Date.now() - startTime;

      return {
        content: data.content[0]?.text || '',
        model: data.model,
        usage: {
          promptTokens: data.usage.input_tokens,
          completionTokens: data.usage.output_tokens,
          totalTokens: data.usage.input_tokens + data.usage.output_tokens,
        },
        latency,
        providerId: this.config.id,
        providerName: this.config.name,
      };
    } catch (error) {
      const isRetryable = this.isRetryableError(error);
      throw new AIProviderError(
        `Anthropic generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.config.id,
        isRetryable,
        error instanceof Error ? error : undefined
      );
    }
  }

  // Anthropic doesn't support image generation
  async generateImage(): Promise<never> {
    throw new AIProviderError(
      'Anthropic does not support image generation',
      this.config.id,
      false
    );
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      // Check for rate limit errors
      if (error.message.includes('529') || error.message.includes('rate limit')) {
        return true;
      }
      // Check for server errors
      if (error.message.includes('500') || error.message.includes('503')) {
        return true;
      }
      // Auth errors are not retryable
      if (error.message.includes('401')) {
        return false;
      }
    }
    return true;
  }
}
