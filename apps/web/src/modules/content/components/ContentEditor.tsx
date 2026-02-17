'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { saveDraft } from '../actions/save-draft';
import { analyzeSeo } from '../lib/seo-analyzer';
import { FeaturedImagePicker } from './FeaturedImagePicker';
import { PreviewPanel } from './PreviewPanel';
import { SeoPanel } from './SeoPanel';

interface ContentEditorProps {
  projectId: string;
  projectName: string;
  backHref: string;
}

export function ContentEditor({ projectId, projectName, backHref }: ContentEditorProps) {
  const [title, setTitle] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [categories, setCategories] = useState('');
  const [tags, setTags] = useState('');
  const [featuredImage, setFeaturedImage] = useState({
    mode: '',
    source: '',
    prompt: '',
  });
  const [postId, setPostId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const analysis = useMemo(
    () =>
      analyzeSeo({
        title: title || 'Untitled Post',
        metaDescription,
        focusKeyword,
        markdown,
      }),
    [title, metaDescription, focusKeyword, markdown]
  );

  const handleSave = () => {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await saveDraft({
        projectId,
        postId: postId ?? undefined,
        title: title || 'Untitled Post',
        markdown,
        excerpt: excerpt || undefined,
        focusKeyword: focusKeyword || undefined,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
        categories: categories.split(',').map((item) => item.trim()),
        tags: tags.split(',').map((item) => item.trim()),
        featuredImageMode: featuredImage.mode || undefined,
        featuredImageSource: featuredImage.source || undefined,
        featuredImagePrompt: featuredImage.prompt || undefined,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.post?.id) {
        setPostId(result.post.id);
      }

      setMessage('Draft saved successfully.');
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Post</h1>
            <p className="text-muted-foreground">Writing for {projectName}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isPending}>
          <Save className="mr-2 h-4 w-4" />
          {isPending ? 'Saving...' : 'Save Draft'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="How to build an AI-powered content pipeline"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="markdown">Markdown</Label>
                <Textarea
                  id="markdown"
                  placeholder="Write your post in markdown..."
                  value={markdown}
                  onChange={(event) => setMarkdown(event.target.value)}
                  rows={14}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Short summary shown on WordPress"
                  value={excerpt}
                  onChange={(event) => setExcerpt(event.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <PreviewPanel title={title || 'Untitled Post'} markdown={markdown} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="focus-keyword">Focus Keyword</Label>
                <Input
                  id="focus-keyword"
                  placeholder="ai autoblogging"
                  value={focusKeyword}
                  onChange={(event) => setFocusKeyword(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  placeholder="SEO title shown in search results"
                  value={metaTitle}
                  onChange={(event) => setMetaTitle(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  placeholder="Meta description for search engines"
                  value={metaDescription}
                  onChange={(event) => setMetaDescription(event.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categories">Categories</Label>
                <Input
                  id="categories"
                  placeholder="Marketing, AI, Automation"
                  value={categories}
                  onChange={(event) => setCategories(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="content, wordpress"
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <FeaturedImagePicker
            mode={featuredImage.mode}
            source={featuredImage.source}
            prompt={featuredImage.prompt}
            onChange={setFeaturedImage}
          />

          <SeoPanel
            seoScore={analysis.seoScore}
            readabilityScore={analysis.readabilityScore}
            wordCount={analysis.wordCount}
            focusKeyword={focusKeyword}
          />
        </div>
      </div>
    </div>
  );
}
