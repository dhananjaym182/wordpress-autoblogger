export interface AIProvider {
  id: string;
  name: string;
  baseUrl: string;
  apiKey?: string;
  defaultModelText: string;
  defaultModelImage?: string;
  capabilities: {
    text: boolean;
    image: boolean;
  };
  enabled: boolean;
}

export interface GenerateTextOptions {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  orgId: string;
}

export interface GenerateImageOptions {
  prompt: string;
  model?: string;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  orgId: string;
}

export interface GenerateTextResult {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latency: number;
}

export interface GenerateImageResult {
  url: string;
  model: string;
  revisedPrompt?: string;
  latency: number;
}

export interface FallbackChain {
  text: string[]; // Provider IDs in order of preference
  image: string[];
}

export interface RetryPolicy {
  retries: number;
  timeoutMs: number;
  backoff: 'exponential' | 'linear' | 'fixed';
}

export interface CircuitBreakerConfig {
  enabled: boolean;
  failureThreshold: number;
  cooldownMs: number;
}

export interface AIProviderUsage {
  organizationId: string;
  providerId: string;
  providerName: string;
  requestType: 'text' | 'image';
  model: string;
  tokensUsed?: number;
  costUsd?: number;
  success: boolean;
  latencyMs?: number;
  errorMessage?: string;
}

export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly providerId: string,
    public readonly isRetryable: boolean = true,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'AIProviderError';
  }
}

export class AllProvidersFailedError extends Error {
  constructor(
    public readonly errors: AIProviderError[],
    public readonly attemptedProviders: string[]
  ) {
    super('All AI providers failed to respond');
    this.name = 'AllProvidersFailedError';
  }
}
