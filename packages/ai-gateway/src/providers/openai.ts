import OpenAI from 'openai';
import { AIProvider, GenerateTextOptions, GenerateTextResult, GenerateImageOptions, GenerateImageResult, AIProviderError } from '../types.js';

export class OpenAIProvider {
  private client: OpenAI;

  constructor(private config: AIProvider) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
    });
  }

  get id(): string {
    return this.config.id;
  }

  get name(): string {
    return this.config.name;
  }

  async generateText(options: GenerateTextOptions): Promise<GenerateTextResult> {
    const startTime = Date.now();
    
    try {
      const response = await this.client.chat.completions.create({
        model: options.model || this.config.defaultModelText,
        messages: [{ role: 'user', content: options.prompt }],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens,
      });

      const latency = Date.now() - startTime;

      return {
        content: response.choices[0]?.message?.content || '',
        model: response.model,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
        latency,
      };
    } catch (error) {
      const isRetryable = this.isRetryableError(error);
      throw new AIProviderError(
        `OpenAI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.config.id,
        isRetryable,
        error instanceof Error ? error : undefined
      );
    }
  }

  async generateImage(options: GenerateImageOptions): Promise<GenerateImageResult> {
    const startTime = Date.now();

    try {
      const response = await this.client.images.generate({
        model: options.model || this.config.defaultModelImage || 'dall-e-3',
        prompt: options.prompt,
        size: options.size || '1024x1024',
        quality: options.quality || 'standard',
        n: 1,
      });

      const latency = Date.now() - startTime;
      const imageData = response.data[0];

      return {
        url: imageData.url || '',
        model: options.model || this.config.defaultModelImage || 'dall-e-3',
        revisedPrompt: imageData.revised_prompt,
        latency,
      };
    } catch (error) {
      const isRetryable = this.isRetryableError(error);
      throw new AIProviderError(
        `OpenAI image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.config.id,
        isRetryable,
        error instanceof Error ? error : undefined
      );
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof OpenAI.APIError) {
      // Retry on rate limits and server errors
      if (error.status === 429 || error.status === 500 || error.status === 503) {
        return true;
      }
      // Don't retry on auth errors or bad requests
      if (error.status === 401 || error.status === 400) {
        return false;
      }
    }
    return true;
  }
}
