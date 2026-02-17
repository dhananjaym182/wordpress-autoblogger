'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createId } from '@/lib/id';
import { encrypt } from '@/lib/crypto';
import { getProjectForUser } from '../lib/project-access';
import { normalizeSiteUrl } from '../lib/normalize-url';

interface ConnectPluginInput {
  projectId: string;
  siteUrl: string;
  keyId: string;
  secret: string;
}

export async function connectPlugin(input: ConnectPluginInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: 'Unauthorized' };
  }

  const normalizedUrl = normalizeSiteUrl(input.siteUrl);
  if (!normalizedUrl) {
    return { error: 'Please enter a valid site URL.' };
  }

  if (!input.keyId || !input.secret) {
    return { error: 'Key ID and secret are required.' };
  }

  const access = await getProjectForUser(input.projectId, session.user.id);
  if (!access) {
    return { error: 'Project not found' };
  }

  const connection = await db.wpSiteConnection.upsert({
    where: { projectId: access.project.id },
    update: {
      siteUrl: normalizedUrl,
      mode: 'plugin',
      keyId: input.keyId,
      secretEncrypted: encrypt(input.secret),
      status: 'pending',
      lastError: null,
      pairedAt: new Date(),
    },
    create: {
      id: createId('wp'),
      projectId: access.project.id,
      siteUrl: normalizedUrl,
      mode: 'plugin',
      status: 'pending',
      keyId: input.keyId,
      secretEncrypted: encrypt(input.secret),
      pairedAt: new Date(),
    },
  });

  await db.auditLog.create({
    data: {
      id: createId('audit'),
      organizationId: access.organizationId,
      userId: session.user.id,
      action: 'wp.connect',
      resourceType: 'wp_connection',
      resourceId: connection.id,
      metadata: { mode: 'plugin', siteUrl: normalizedUrl },
    },
  });

  revalidatePath(`/projects/${access.project.id}`);
  revalidatePath(`/projects/${access.project.id}/connection`);

  return { success: true, connection };
}
