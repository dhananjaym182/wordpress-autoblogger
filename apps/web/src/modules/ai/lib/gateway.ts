import { AIGateway, type AIProvider, type FallbackChain, type RetryPolicy } from '@autoblogger/ai-gateway';
import { db } from '@/lib/db';
import { decrypt } from '@/lib/crypto';
import { env } from '@/lib/env';

const DEFAULT_RETRY_POLICY: RetryPolicy = {
  retries: 2,
  timeoutMs: 30000,
  backoff: 'exponential',
};

const buildManagedProviders = (): AIProvider[] => {
  const providers: AIProvider[] = [];

  if (env.OPENAI_API_KEY) {
    providers.push({
      id: 'managed-openai',
      name: 'OpenAI Managed',
      baseUrl: 'https://api.openai.com/v1',
      apiKey: env.OPENAI_API_KEY,
      defaultModelText: 'gpt-4o-mini',
      defaultModelImage: 'gpt-image-1',
      capabilities: { text: true, image: true },
      enabled: true,
    });
  }

  if (env.ANTHROPIC_API_KEY) {
    providers.push({
      id: 'managed-anthropic',
      name: 'Anthropic Managed',
      baseUrl: 'https://api.anthropic.com/v1',
      apiKey: env.ANTHROPIC_API_KEY,
      defaultModelText: 'claude-3-5-sonnet-20240620',
      capabilities: { text: true, image: false },
      enabled: true,
    });
  }

  return providers;
};

const buildFallbackChain = (providers: AIProvider[], policy?: { textChain?: string[]; imageChain?: string[] }) => {
  const providerIds = providers.map((provider) => provider.id);
  const filterChain = (chain?: string[]) => (chain ?? []).filter((id) => providerIds.includes(id));

  const textChain = filterChain(policy?.textChain);
  const imageChain = filterChain(policy?.imageChain);

  return {
    text: textChain.length > 0 ? textChain : providerIds,
    image: imageChain.length > 0 ? imageChain : providerIds,
  } satisfies FallbackChain;
};

export async function buildGatewayForOrganization(organizationId: string) {
  const endpoints = await db.aiEndpoint.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'asc' },
  });

  const providers: AIProvider[] = endpoints.map((endpoint: (typeof endpoints)[number]) => {
    const capabilities = endpoint.capabilities as { text?: boolean; image?: boolean } | null;

    return {
      id: endpoint.id,
      name: endpoint.name,
      baseUrl: endpoint.baseUrl,
      apiKey: endpoint.apiKeyEncrypted ? decrypt(endpoint.apiKeyEncrypted) : undefined,
      defaultModelText: endpoint.defaultModelText,
      defaultModelImage: endpoint.defaultModelImage ?? undefined,
      capabilities: {
        text: capabilities?.text ?? true,
        image: capabilities?.image ?? false,
      },
      enabled: endpoint.enabled,
    };
  });

  if (providers.length === 0) {
    providers.push(...buildManagedProviders());
  }

  if (providers.length === 0) {
    return null;
  }

  const fallbackPolicy = await db.aiFallbackPolicy.findUnique({
    where: { organizationId },
  });

  const fallbackChain = buildFallbackChain(providers, {
    textChain: fallbackPolicy?.textChain ?? undefined,
    imageChain: fallbackPolicy?.imageChain ?? undefined,
  });

  const storedRetry = fallbackPolicy?.retryPolicy as Partial<RetryPolicy> | null;
  const retryPolicy = storedRetry
    ? { ...DEFAULT_RETRY_POLICY, ...storedRetry }
    : DEFAULT_RETRY_POLICY;

  const gateway = new AIGateway(
    providers,
    fallbackChain,
    retryPolicy,
    (fallbackPolicy?.circuitBreaker as { enabled: boolean; failureThreshold: number; cooldownMs: number } | null) ?? undefined
  );

  return { gateway, providers };
}
