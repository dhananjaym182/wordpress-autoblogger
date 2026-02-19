'use client';

import { useMemo, useState, useTransition } from 'react';
import { Plus, Trash2, Link2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { createProject } from '@/modules/projects/actions/create-project';
import { deleteProject } from '@/modules/projects/actions/delete-project';
import { setActiveProject } from '@/modules/projects/actions/set-active-project';
import { WpConnectionManager } from '@/modules/wp/components/WpConnectionManager';

interface ProjectWpConnection {
  id: string;
  status: string | null;
  mode: string | null;
  siteUrl: string | null;
  lastError: string | null;
  lastCheckedAt: string | null;
  keyId: string | null;
  wpUsername: string | null;
}

interface ProjectItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  wpConnection: ProjectWpConnection | null;
}

interface ProjectsPageProps {
  projects: ProjectItem[];
  activeProjectId?: string | null;
}

const statusToVariant = (status: string | null): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (status === 'ok') return 'default';
  if (status === 'error') return 'destructive';
  if (status === 'pending') return 'secondary';
  return 'outline';
};

const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\\s-]/g, '')
    .replace(/\\s+/g, '-')
    .replace(/-+/g, '-');

export function ProjectsPage({ projects, activeProjectId }: ProjectsPageProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasProjects = projects.length > 0;
  const orderedProjects = useMemo(
    () => [...projects].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [projects]
  );

  const resetCreateForm = () => {
    setName('');
    setSlug('');
    setDescription('');
  };

  const handleCreateProject = () => {
    startTransition(async () => {
      setMessage(null);
      setError(null);
      const result = await createProject({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      setMessage('Project created successfully.');
      setIsCreateOpen(false);
      resetCreateForm();
      router.refresh();
    });
  };

  const handleDeleteProject = (projectId: string) => {
    startTransition(async () => {
      setMessage(null);
      setError(null);

      const result = await deleteProject(projectId);
      if (result?.error) {
        setError(result.error);
        return;
      }

      setMessage('Project deleted successfully.');
      router.refresh();
    });
  };

  const handleSetActiveProject = (projectId: string) => {
    startTransition(async () => {
      setMessage(null);
      setError(null);

      const result = await setActiveProject(projectId);
      if (result?.error) {
        setError(result.error);
        return;
      }

      setMessage('Active project updated.');
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new project</DialogTitle>
              <DialogDescription>
                Add a project to connect your WordPress site and start producing content.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={name}
                  onChange={(event) => {
                    const nextName = event.target.value;
                    setName(nextName);
                    if (!slug) {
                      setSlug(normalizeSlug(nextName));
                    }
                  }}
                  placeholder="My WordPress Site"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-slug">Slug</Label>
                <Input
                  id="project-slug"
                  value={slug}
                  onChange={(event) => setSlug(normalizeSlug(event.target.value))}
                  placeholder="my-wordpress-site"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Editorial goals and publishing focus"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject} disabled={isPending || !name.trim() || !slug.trim()}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {hasProjects ? (
        <div className="grid gap-4">
          {orderedProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>/{project.slug}</CardDescription>
                    {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={statusToVariant(project.wpConnection?.status ?? null)}>
                      {project.wpConnection?.status ?? 'not connected'}
                    </Badge>
                    <Button
                      size="sm"
                      variant={project.id === activeProjectId ? 'default' : 'outline'}
                      onClick={() => handleSetActiveProject(project.id)}
                      disabled={isPending}
                    >
                      {project.id === activeProjectId ? 'Active Project' : 'Set Active'}
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary">
                          Connect WordPress
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>WordPress Connection</DialogTitle>
                          <DialogDescription>
                            Configure secure publishing access for <span className="font-medium text-foreground">{project.name}</span>.
                          </DialogDescription>
                        </DialogHeader>
                        <WpConnectionManager projectId={project.id} connection={project.wpConnection} />
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" aria-label={`Delete ${project.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete project?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This removes all scheduled posts and connection data for {project.name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProject(project.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  <span>{project.wpConnection?.siteUrl ?? 'WordPress not connected yet'}</span>
                </div>
                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No projects yet</CardTitle>
            <CardDescription>
              Create your first project to start connecting WordPress and publishing AI-generated drafts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
