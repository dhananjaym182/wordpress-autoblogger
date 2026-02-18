import { db } from '@/lib/db';
import { encrypt, decrypt } from '@/lib/crypto';
import { createId } from '@/lib/id';
import { NotFoundError } from '@/api/core/errors';
import { getActiveMembership } from '@/api/core/organization-context';

interface CreateAiProviderInput {
  name: string;
  mode: 'managed' | 'byok';
  baseUrl: string;
  apiKey?: string;
  defaultModelText: string;
  defaultModelImage?: string;
  supportsText: boolean;
  supportsImage: boolean;
}

export const getAiProviderSettings = async (userId: string) => {
  const { activeMembership } = await getActiveMembership(userId);
  const organizationId = activeMembership.organizationId;

  const [providers, fallbackPolicy] = await Promise.all([
    db.aiEndpoint.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'asc' },
    }),
    db.aiFallbackPolicy.findUnique({
      where: { organizationId },
    }),
  ]);

  return {
    organizationId,
    providers,
    fallbackPolicy,
  };
};

export const createAiProvider = async (userId: string, input: CreateAiProviderInput) => {
  const { activeMembership } = await getActiveMembership(userId);

  const provider = await db.aiEndpoint.create({
    data: {
      id: createId('ai'),
      organizationId: activeMembership.organizationId,
      name: input.name.trim(),
      mode: input.mode,
      baseUrl: input.baseUrl.trim().replace(/\/$/, ''),
      apiKeyEncrypted: input.apiKey?.trim() ? encrypt(input.apiKey.trim()) : null,
      defaultModelText: input.defaultModelText.trim(),
      defaultModelImage: input.defaultModelImage?.trim() || null,
      capabilities: {
        text: input.supportsText,
        image: input.supportsImage,
      },
      enabled: true,
    },
  });

  return provider;
};

export const toggleAiProvider = async (userId: string, providerId: string) => {
  const { activeMembership } = await getActiveMembership(userId);

  const provider = await db.aiEndpoint.findFirst({
    where: {
      id: providerId,
      organizationId: activeMembership.organizationId,
    },
  });

  if (!provider) {
    throw new NotFoundError('Provider not found');
  }

  return db.aiEndpoint.update({
    where: { id: provider.id },
    data: { enabled: !provider.enabled },
  });
};

export const deleteAiProvider = async (userId: string, providerId: string) => {
  const { activeMembership } = await getActiveMembership(userId);

  const provider = await db.aiEndpoint.findFirst({
    where: {
      id: providerId,
      organizationId: activeMembership.organizationId,
    },
  });

  if (!provider) {
    throw new NotFoundError('Provider not found');
  }

  await db.aiEndpoint.delete({
    where: { id: provider.id },
  });
};

const withTimeout = async (url: string, init: RequestInit, timeoutMs = 10000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
};

export const testAiProvider = async (userId: string, providerId: string) => {
  const { activeMembership } = await getActiveMembership(userId);

  const provider = await db.aiEndpoint.findFirst({
    where: {
      id: providerId,
      organizationId: activeMembership.organizationId,
    },
  });

  if (!provider) {
    throw new NotFoundError('Provider not found');
  }

  const apiKey = provider.apiKeyEncrypted ? decrypt(provider.apiKeyEncrypted) : null;
  if (provider.mode === 'byok' && !apiKey) {
    await db.aiEndpoint.update({
      where: { id: provider.id },
      data: {
        lastTestedAt: new Date(),
        lastError: 'Provider API key is missing.',
      },
    });
    return { ok: false, message: 'Provider API key is missing.' };
  }

  try {
    const modelsUrl = `${provider.baseUrl.replace(/\/$/, '')}/models`;
    const headers: Record<string, string> = provider.baseUrl.includes('anthropic')
      ? {
          'x-api-key': apiKey ?? '',
          'anthropic-version': '2023-06-01',
        }
      : apiKey
      ? {
          Authorization: `Bearer ${apiKey}`,
        }
      : {};

    const response = await withTimeout(modelsUrl, { method: 'GET', headers }, 10000);
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Provider test failed (${response.status}): ${body.slice(0, 300)}`);
    }

    await db.aiEndpoint.update({
      where: { id: provider.id },
      data: {
        lastTestedAt: new Date(),
        lastError: null,
      },
    });

    return { ok: true, message: 'Provider test succeeded.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Provider test failed.';
    await db.aiEndpoint.update({
      where: { id: provider.id },
      data: {
        lastTestedAt: new Date(),
        lastError: message,
      },
    });
    return { ok: false, message };
  }
};

export const updatePrimaryFallback = async (
  userId: string,
  input: { textPrimaryId?: string; imagePrimaryId?: string }
) => {
  const { activeMembership } = await getActiveMembership(userId);
  const organizationId = activeMembership.organizationId;

  const providers = await db.aiEndpoint.findMany({
    where: {
      organizationId,
      enabled: true,
    },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      capabilities: true,
    },
  });

  const textCapable = providers
    .filter(
      (provider: (typeof providers)[number]) =>
        (provider.capabilities as { text?: boolean })?.text !== false
    )
    .map((provider: (typeof providers)[number]) => provider.id);
  const imageCapable = providers
    .filter(
      (provider: (typeof providers)[number]) =>
        (provider.capabilities as { image?: boolean })?.image
    )
    .map((provider: (typeof providers)[number]) => provider.id);

  const textPrimary = input.textPrimaryId && textCapable.includes(input.textPrimaryId)
    ? input.textPrimaryId
    : textCapable[0];
  const imagePrimary = input.imagePrimaryId && imageCapable.includes(input.imagePrimaryId)
    ? input.imagePrimaryId
    : imageCapable[0];

  const textChain = textPrimary
    ? [textPrimary, ...textCapable.filter((id: string) => id !== textPrimary)]
    : textCapable;
  const imageChain = imagePrimary
    ? [imagePrimary, ...imageCapable.filter((id: string) => id !== imagePrimary)]
    : imageCapable;

  return db.aiFallbackPolicy.upsert({
    where: { organizationId },
    update: {
      textChain,
      imageChain,
      retryPolicy: {
        retries: 2,
        timeoutMs: 30000,
        backoff: 'exponential',
      },
    },
    create: {
      id: createId('fallback'),
      organizationId,
      textChain,
      imageChain,
      retryPolicy: {
        retries: 2,
        timeoutMs: 30000,
        backoff: 'exponential',
      },
    },
  });
};
