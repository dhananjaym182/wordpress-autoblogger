import { AutoClient } from '@autoblogger/wp-client';
import { db } from '@/lib/db';
import { decrypt } from '@/lib/crypto';
import { getActiveMembership } from '@/api/core/organization-context';
import { NotFoundError } from '@/api/core/errors';

const buildClient = (connection: {
  mode: string;
  siteUrl: string;
  keyId: string | null;
  secretEncrypted: string | null;
  wpUsername: string | null;
  appPasswordEncrypted: string | null;
}) => {
  if (connection.mode === 'plugin' && connection.keyId && connection.secretEncrypted) {
    return new AutoClient({
      mode: 'plugin',
      siteUrl: connection.siteUrl,
      keyId: connection.keyId,
      secret: decrypt(connection.secretEncrypted),
    });
  }

  if (connection.mode === 'app_password' && connection.wpUsername && connection.appPasswordEncrypted) {
    return new AutoClient({
      mode: 'app_password',
      siteUrl: connection.siteUrl,
      username: connection.wpUsername,
      appPassword: decrypt(connection.appPasswordEncrypted),
    });
  }

  throw new Error('Connection is missing required credentials.');
};

export const testWordPressConnectionForProject = async (userId: string, projectId: string) => {
  const { activeMembership } = await getActiveMembership(userId);

  const project = await db.project.findFirst({
    where: {
      id: projectId,
      organizationId: activeMembership.organizationId,
    },
    include: { wpConnection: true },
  });

  if (!project?.wpConnection) {
    throw new NotFoundError('Connection not found');
  }

  try {
    const client = buildClient(project.wpConnection);
    await client.ping();
    const siteInfo = await client.getSiteInfo();
    const diagnostics = await client.getDiagnostics();

    const connection = await db.wpSiteConnection.update({
      where: { id: project.wpConnection.id },
      data: {
        status: 'ok',
        lastError: null,
        lastCheckedAt: new Date(),
        siteName: siteInfo.name,
        capabilities: diagnostics?.capabilities ?? {
          posts: true,
          media: true,
          terms: true,
          seoMeta: true,
        },
        wpVersion: diagnostics?.wpVersion ?? null,
        activeTheme: diagnostics?.activeTheme ?? null,
        detectedPlugins: diagnostics?.detectedPlugins ?? null,
      },
    });

    return { ok: true, connection };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Connection test failed';
    const connection = await db.wpSiteConnection.update({
      where: { id: project.wpConnection.id },
      data: {
        status: 'error',
        lastError: message,
        lastCheckedAt: new Date(),
      },
    });
    return { ok: false, message, connection };
  }
};
