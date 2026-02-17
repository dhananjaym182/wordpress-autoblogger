import { headers } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { ContentEditor } from '@/modules/content/components/ContentEditor';

interface NewPostPageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: 'New Post | AutoBlogger',
  description: 'Create a new post for your WordPress site',
};

export default async function NewPostPage({ params }: NewPostPageProps) {
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
  });

  if (!project) {
    notFound();
  }

  return (
    <ContentEditor
      projectId={project.id}
      projectName={project.name}
      backHref={`/projects/${project.id}`}
    />
  );
}
