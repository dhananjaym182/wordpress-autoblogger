'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { fetchWithSSRFProtection, isValidImageUrl, validateUrl } from '@autoblogger/security';
import { buildGatewayForOrganization } from '@/modules/ai/lib/gateway';
import { saveFileToUploads, saveRemoteImageToUploads } from '@/lib/storage';
import { getActiveMembership } from '@/api/core/organization-context';

interface ProjectScopedInput {
  projectId: string;
}

type ProjectAccessResult = 
  | { error: string }
  | { membership: { organizationId: string; userId: string }; project: { id: string } };

const validateProjectAccess = async (projectId: string, userId: string): Promise<ProjectAccessResult> => {
  const { activeMembership } = await getActiveMembership(userId);

  const project = await db.project.findFirst({
    where: {
      id: projectId,
      organizationId: activeMembership.organizationId,
    },
  });

  if (!project) {
    return { error: 'Project not found' };
  }

  return { membership: { organizationId: activeMembership.organizationId, userId }, project };
};

type UploadResult = 
  | { error: string }
  | { success: true; storedImageKey: string; previewUrl: string };

export async function uploadFeaturedImage(formData: FormData): Promise<UploadResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: 'Unauthorized' };
  }

  const projectId = formData.get('projectId');
  const file = formData.get('file');

  if (typeof projectId !== 'string') {
    return { error: 'Project is required.' };
  }

  if (!(file instanceof File)) {
    return { error: 'Please upload an image file.' };
  }

  const access = await validateProjectAccess(projectId, session.user.id);
  if ('error' in access) {
    return access;
  }

  if (!file.type.startsWith('image/')) {
    return { error: 'Only image files are supported.' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: 'Image must be smaller than 5MB.' };
  }

  const stored = await saveFileToUploads(file);

  return {
    success: true,
    storedImageKey: stored.key,
    previewUrl: stored.publicUrl,
  };
}

export async function importFeaturedImageFromUrl(input: ProjectScopedInput & { imageUrl: string }): Promise<UploadResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: 'Unauthorized' };
  }

  const access = await validateProjectAccess(input.projectId, session.user.id);
  if ('error' in access) {
    return access;
  }

  if (!isValidImageUrl(input.imageUrl)) {
    return { error: 'Please provide a direct link to an image file.' };
  }

  const validation = await validateUrl(input.imageUrl, process.env.NODE_ENV ?? 'production');
  if (!validation.valid) {
    return { error: validation.reason ?? 'Image URL is not allowed.' };
  }

  const response = await fetchWithSSRFProtection(
    input.imageUrl,
    {},
    process.env.NODE_ENV ?? 'production'
  );

  if (!response.ok) {
    return { error: 'Failed to download image.' };
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const stored = await saveRemoteImageToUploads(
    input.imageUrl,
    buffer,
    response.headers.get('content-type')
  );

  return {
    success: true,
    storedImageKey: stored.key,
    previewUrl: stored.publicUrl,
  };
}

type GenerateResult = 
  | { error: string }
  | { success: true; storedImageKey: string; previewUrl: string; imageUrl: string; providerName: string };

export async function generateFeaturedImage(input: ProjectScopedInput & { prompt: string }): Promise<GenerateResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: 'Unauthorized' };
  }

  const access = await validateProjectAccess(input.projectId, session.user.id);
  if ('error' in access) {
    return access;
  }

  const gatewayBundle = await buildGatewayForOrganization(access.membership.organizationId);

  if (!gatewayBundle) {
    return { error: 'No AI providers configured. Add a provider to generate images.' };
  }

  if (!input.prompt.trim()) {
    return { error: 'Please enter an image prompt.' };
  }

  try {
    const result = await gatewayBundle.gateway.generateImage({
      prompt: input.prompt,
      size: '1024x1024',
      orgId: access.membership.organizationId,
    });

    const response = await fetchWithSSRFProtection(
      result.url,
      {},
      process.env.NODE_ENV ?? 'production'
    );
    if (!response.ok) {
      return { error: 'Failed to download generated image.' };
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const stored = await saveRemoteImageToUploads(
      result.url,
      buffer,
      response.headers.get('content-type')
    );

    await db.aiProviderUsage.create({
      data: {
        organizationId: access.membership.organizationId,
        providerId: result.providerId,
        providerName: result.providerName,
        requestType: 'image',
        model: result.model,
        costUsd: 0.04,
        success: true,
        latencyMs: result.latency,
      },
    });

    return {
      success: true,
      storedImageKey: stored.key,
      previewUrl: stored.publicUrl,
      imageUrl: result.url,
      providerName: result.providerName,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate image.';
    return { error: message };
  }
}
