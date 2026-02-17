'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProject } from '@/modules/projects/actions/create-project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'New Project | AutoBlogger',
  description: 'Create a new project',
};

export default function NewProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState('');

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    setSlug(generateSlug(name));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    const result = await createProject({
      name,
      slug,
      description: description || undefined,
    });

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    if (result.success && result.project) {
      router.push(`/projects/${result.project.id}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
          <p className="text-muted-foreground">Create a new project for your WordPress site</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Enter the details for your new project. You can connect your WordPress site after creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="My Blog"
                required
                disabled={isLoading}
                onChange={handleNameChange}
              />
              <p className="text-xs text-muted-foreground">
                A descriptive name for your project
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-blog"
                required
                disabled={isLoading}
                pattern="[a-z0-9-]+"
              />
              <p className="text-xs text-muted-foreground">
                Used in URLs. Only lowercase letters, numbers, and hyphens.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="A brief description of this project..."
                disabled={isLoading}
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </Button>
              <Button variant="outline" asChild disabled={isLoading}>
                <Link href="/projects">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
