'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { markdownToGutenberg } from '@/modules/content/lib/markdown-to-gutenberg';
import { buildGatewayForOrganization } from '../lib/gateway';
import { getActiveMembership } from '@/api/core/organization-context';

interface GenerateContentInput {
  projectId: string;
  prompt?: string;
  title?: string;
  focusKeyword?: string;
  tone?: string;
  wordCount?: number;
  postId?: string;
  providerId?: string;
  model?: string;
  sourceMode?: 'app' | 'byok';
}

const buildPrompt = (input: GenerateContentInput) => {
  if (input.prompt?.trim()) {
    return input.prompt.trim();
  }

  const tone = input.tone ?? 'professional';
  const title = input.title ?? 'Untitled Post';
  const keyword = input.focusKeyword ? `Focus keyword: ${input.focusKeyword}.` : '';
  const wordCount = input.wordCount ? `Target length: ${input.wordCount} words.` : '';

  return [
    `Write a ${tone} blog post titled "${title}".`,
    keyword,
    wordCount,
    'Use markdown with clear headings, bullet points, and actionable insights.',
  ]
    .filter(Boolean)
    .join(' ');
};

const estimateCost = (promptTokens: number, completionTokens: number) => {
  const promptCost = promptTokens * 0.00001;
  const completionCost = completionTokens * 0.00003;
  return promptCost + completionCost;
};

export async function generateContent(input: GenerateContentInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: 'Unauthorized' };
  }

  const { activeMembership } = await getActiveMembership(session.user.id);

  const project = await db.project.findFirst({
    where: {
      id: input.projectId,
      organizationId: activeMembership.organizationId,
    },
  });

  if (!project) {
    return { error: 'Project not found' };
  }

  const gatewayBundle = await buildGatewayForOrganization(activeMembership.organizationId);

  if (!gatewayBundle) {
    return { error: 'No AI providers configured. Add a provider to generate content.' };
  }

  const providerSelection = input.providerId
    ? gatewayBundle.providers.find((provider) => provider.id === input.providerId)
    : null;

  if (input.providerId && !providerSelection) {
    return { error: 'Selected AI provider is unavailable or disabled.' };
  }

  if (providerSelection && !providerSelection.enabled) {
    return { error: 'Selected AI provider is disabled.' };
  }

  if (input.sourceMode === 'byok' && providerSelection?.id.startsWith('managed-')) {
    return { error: 'BYOK generation requires a custom provider from AI settings.' };
  }

  if (input.sourceMode === 'app' && providerSelection && !providerSelection.id.startsWith('managed-')) {
    return { error: 'App-managed generation requires an application provider.' };
  }

  const prompt = buildPrompt(input);

  try {
    const result = await gatewayBundle.gateway.generateText({
      prompt,
      providerId: providerSelection?.id,
      model: input.model || providerSelection?.defaultModelText,
      temperature: 0.7,
      maxTokens: input.wordCount ? Math.min(input.wordCount * 2, 2000) : 1200,
      orgId: activeMembership.organizationId,
    });

    const aiCost = estimateCost(result.usage.promptTokens, result.usage.completionTokens);

    await db.aiProviderUsage.create({
      data: {
        organizationId: activeMembership.organizationId,
        providerId: result.providerId,
        providerName: result.providerName,
        requestType: 'text',
        model: result.model,
        tokensUsed: result.usage.totalTokens,
        costUsd: aiCost,
        success: true,
        latencyMs: result.latency,
      },
    });

    if (input.postId) {
      await db.scheduledPost.update({
        where: { id: input.postId },
        data: {
          markdown: result.content,
          gutenbergHtml: markdownToGutenberg(result.content),
          aiModel: result.model,
          aiTokensUsed: result.usage.totalTokens,
          aiCostUsd: aiCost,
          generatedAt: new Date(),
        },
      });
    }

    return {
      success: true,
      content: result.content,
      model: result.model,
      usage: result.usage,
      providerName: result.providerName,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate content.';
    return { error: message };
  }
}
