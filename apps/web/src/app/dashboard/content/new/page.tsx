import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requireSession } from '@/api/core/auth-context';
import { getProjectSwitcherState } from '@/api/projects/service';
import { ContentEditor } from '@/modules/content/components/ContentEditor';
import { db } from '@/lib/db';
import { getAiProviderSettings } from '@/api/ai/service';

interface NewContentPageProps {
  searchParams?: {
    projectId?: string;
    postId?: string;
  };
}

export default async function NewContentPage({ searchParams }: NewContentPageProps) {
  const session = await requireSession();
  const projectState = await getProjectSwitcherState(session.user.id);
  const projects = projectState.projects;
  const aiSettings = await getAiProviderSettings(session.user.id);

  if (projects.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Create a project first</CardTitle>
          <CardDescription>
            Content drafts are scoped to a project. Create one to start drafting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/projects">Go to Projects</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const requestedProjectId = searchParams?.projectId;
  const selectedProjectId =
    projects.find((project: (typeof projects)[number]) => project.id === requestedProjectId)?.id ??
    projectState.activeProjectId ??
    projects[0]?.id;

  const selectedProject = projects.find((project: (typeof projects)[number]) => project.id === selectedProjectId);

  if (!selectedProject) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Select a project first</CardTitle>
          <CardDescription>
            Pick an active project from the dashboard header to begin writing content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/content">Go to Content Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const requestedPostId = searchParams?.postId;
  const initialPost = requestedPostId
    ? await db.scheduledPost.findFirst({
        where: {
          id: requestedPostId,
          projectId: selectedProject.id,
        },
      })
    : null;

  return (
    <ContentEditor
      projectId={selectedProject.id}
      projectName={selectedProject.name}
      backHref="/dashboard/content"
      initialPostId={initialPost?.id}
      initialTitle={initialPost?.title}
      initialMarkdown={initialPost?.markdown}
      initialExcerpt={initialPost?.excerpt}
      initialFocusKeyword={initialPost?.focusKeyword}
      initialMetaTitle={initialPost?.metaTitle}
      initialMetaDescription={initialPost?.metaDescription}
      initialCategories={initialPost?.categories ?? []}
      initialTags={initialPost?.tags ?? []}
      initialFeaturedImage={{
        mode: initialPost?.featuredImageMode,
        source: initialPost?.featuredImageSource,
        prompt: initialPost?.featuredImagePrompt,
        storedKey: initialPost?.storedImageKey,
      }}
      availableProviders={aiSettings.providers.map((provider: (typeof aiSettings.providers)[number]) => ({
        id: provider.id,
        name: provider.name,
        mode: provider.mode as 'managed' | 'byok',
        defaultModelText: provider.defaultModelText,
        enabled: provider.enabled,
      }))}
    />
  );
}
