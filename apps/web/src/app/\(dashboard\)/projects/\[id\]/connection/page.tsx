import { headers } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { WpConnectionManager } from '@/modules/wp/components/WpConnectionManager';

interface ConnectionPageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: 'WordPress Connection | AutoBlogger',
  description: 'Connect your WordPress site for publishing',
};

export default async function ConnectionPage({ params }: ConnectionPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    select: { organizationId: true },
  });

  if (!membership) {
    notFound();
  }

  const project = await db.project.findFirst({
    where: {
      id: params.id,
      organizationId: membership.organizationId,
    },
    include: { wpConnection: true },
  });

  if (!project) {
    notFound();
  }

  const connection = project.wpConnection
    ? {
        id: project.wpConnection.id,
        siteUrl: project.wpConnection.siteUrl,
        mode: project.wpConnection.mode,
        status: project.wpConnection.status,
        lastError: project.wpConnection.lastError,
        lastCheckedAt: project.wpConnection.lastCheckedAt?.toISOString() ?? null,
        keyId: project.wpConnection.keyId,
        wpUsername: project.wpConnection.wpUsername,
      }
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">WordPress Connection</h1>
        <p className="text-muted-foreground">
          Connect {project.name} to WordPress for automated publishing.
        </p>
      </div>

      <WpConnectionManager projectId={project.id} connection={connection} />
    </div>
  );
}
