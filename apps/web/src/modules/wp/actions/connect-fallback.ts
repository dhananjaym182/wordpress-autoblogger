'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createId } from '@/lib/id';
import { encrypt } from '@/lib/crypto';
import { getProjectForUser } from '../lib/project-access';
import { normalizeSiteUrl } from '../lib/normalize-url';
import { APP_ROUTES } from '@/api/core/routes';

interface ConnectFallbackInput {
  projectId: string;
  siteUrl: string;
  username: string;
  appPassword: string;
}

export async function connectFallback(input: ConnectFallbackInput) {
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

  if (!input.username || !input.appPassword) {
    return { error: 'Username and application password are required.' };
  }

  const access = await getProjectForUser(input.projectId, session.user.id);
  if (!access) {
    return { error: 'Project not found' };
  }

  const connection = await db.wpSiteConnection.upsert({
    where: { projectId: access.project.id },
    update: {
      siteUrl: normalizedUrl,
      mode: 'app_password',
      wpUsername: input.username,
      appPasswordEncrypted: encrypt(input.appPassword),
      status: 'pending',
      lastError: null,
    },
    create: {
      id: createId('wp'),
      projectId: access.project.id,
      siteUrl: normalizedUrl,
      mode: 'app_password',
      status: 'pending',
      wpUsername: input.username,
      appPasswordEncrypted: encrypt(input.appPassword),
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
      metadata: { mode: 'app_password', siteUrl: normalizedUrl },
    },
  });

  revalidatePath(APP_ROUTES.dashboardProjects);
  revalidatePath(APP_ROUTES.dashboardContent);
  revalidatePath(APP_ROUTES.dashboardSettings);

  return { success: true, connection };
}
