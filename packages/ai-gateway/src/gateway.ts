import { 
  AIProvider, 
  GenerateTextOptions, 
  GenerateTextResult, 
  GenerateImageOptions, 
  GenerateImageResult,
  FallbackChain,
  RetryPolicy,
  CircuitBreakerConfig,
  AIProviderUsage,
  AIProviderError,
  AllProvidersFailedError
} from './types.js';
import { OpenAIProvider } from './providers/openai.js';
import { AnthropicProvider } from './providers/anthropic.js';
import { CircuitBreaker } from './circuit-breaker.js';

interface ProviderInstance {
  id: string;
  provider: OpenAIProvider | AnthropicProvider;
  config: AIProvider;
}

export class AIGateway {
  private providers: Map<string, ProviderInstance> = new Map();
  private circuitBreaker: CircuitBreaker;

  constructor(
    providers: AIProvider[],
    private fallbackChain: FallbackChain,
    private retryPolicy: RetryPolicy,
    circuitBreakerConfig?: CircuitBreakerConfig
  ) {
    this.circuitBreaker = new CircuitBreaker(circuitBreakerConfig || {
      enabled: true,
      failureThreshold: 5,
      cooldownMs: 60000,
    });

    // Initialize providers
    for (const config of providers) {
      const provider = this.createProvider(config);
      this.providers.set(config.id, {
        id: config.id,
        provider,
        config,
      });
    }
  }

  async generateText(options: GenerateTextOptions): Promise<GenerateTextResult> {
    const chain = this.fallbackChain.text;
    const errors: AIProviderError[] = [];

    for (const providerId of chain) {
      const instance = this.providers.get(providerId);
      
      if (!instance || !instance.config.enabled) {
        continue;
      }

      if (!this.circuitBreaker.canExecute(providerId)) {
        continue;
      }

      try {
        const result = await this.executeWithRetry(
          () => instance.provider.generateText(options),
          this.retryPolicy
        );

        this.circuitBreaker.recordSuccess(providerId);
        
        await this.logUsage({
          organizationId: options.orgId,
          providerId,
          providerName: instance.config.name,
          requestType: 'text',
          model: result.model,
          tokensUsed: result.usage.totalTokens,
          costUsd: this.calculateCost(result.usage, instance.config),
          success: true,
          latencyMs: result.latency,
        });

        return result;
      } catch (error) {
        if (error instanceof AIProviderError) {
          errors.push(error);
          if (!error.isRetryable) {
            // Don't retry permanent errors
            continue;
          }
        }
        this.circuitBreaker.recordFailure(providerId);
      }
    }

    throw new AllProvidersFailedError(
      errors,
      chain
    );
  }

  async generateImage(options: GenerateImageOptions): Promise<GenerateImageResult> {
    const chain = this.fallbackChain.image;
    const errors: AIProviderError[] = [];

    for (const providerId of chain) {
      const instance = this.providers.get(providerId);
      
      if (!instance || !instance.config.enabled) {
        continue;
      }

      if (!instance.config.capabilities.image) {
        continue;
      }

      if (!this.circuitBreaker.canExecute(providerId)) {
        continue;
      }

      try {
        // Only OpenAI supports image generation in our providers
        if (instance.provider instanceof OpenAIProvider) {
          const result = await this.executeWithRetry(
            () => instance.provider.generateImage(options),
            this.retryPolicy
          );

          this.circuitBreaker.recordSuccess(providerId);

          await this.logUsage({
            organizationId: options.orgId,
            providerId,
            providerName: instance.config.name,
            requestType: 'image',
            model: result.model,
            costUsd: 0.04, // Approximate cost per image
            success: true,
            latencyMs: result.latency,
          });

          return result;
        }
      } catch (error) {
        if (error instanceof AIProviderError) {
          errors.push(error);
        }
        this.circuitBreaker.recordFailure(providerId);
      }
    }

    throw new AllProvidersFailedError(errors, chain);
  }

  private createProvider(config: AIProvider): OpenAIProvider | AnthropicProvider {
    if (config.baseUrl.includes('anthropic')) {
      return new AnthropicProvider(config);
    }
    return new OpenAIProvider(config);
  }

  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    policy: RetryPolicy
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= policy.retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < policy.retries) {
          const delay = this.calculateBackoff(attempt, policy);
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  private calculateBackoff(attempt: number, policy: RetryPolicy): number {
    const baseDelay = policy.timeoutMs / 10;
    
    switch (policy.backoff) {
      case 'exponential':
        return Math.min(baseDelay * Math.pow(2, attempt), 30000);
      case 'linear':
        return baseDelay * (attempt + 1);
      case 'fixed':
      default:
        return baseDelay;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateCost(
    usage: { promptTokens: number; completionTokens: number },
    config: AIProvider
  ): number {
    // Default pricing (OpenAI-like)
    const promptCost = usage.promptTokens * 0.00001; // $0.01 per 1K tokens
    const completionCost = usage.completionTokens * 0.00003; // $0.03 per 1K tokens
    return promptCost + completionCost;
  }

  private async logUsage(usage: AIProviderUsage): Promise<void> {
    // This would typically write to a database
    // For now, just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('AI Usage:', usage);
    }
  }

  getProviderStatus(): Array<{ id: string; name: string; enabled: boolean; circuitState: string }> {
    return Array.from(this.providers.values()).map(instance => ({
      id: instance.id,
      name: instance.config.name,
      enabled: instance.config.enabled,
      circuitState: this.circuitBreaker.getState(instance.id).state,
    }));
  }
}
