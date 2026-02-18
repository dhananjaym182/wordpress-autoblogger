'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { Save, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { saveDraft } from '../actions/save-draft';
import { analyzeSeo } from '../lib/seo-analyzer';
import { FeaturedImagePicker } from './FeaturedImagePicker';
import { PreviewPanel } from './PreviewPanel';
import { SeoPanel } from './SeoPanel';
import { generateContent } from '@/modules/ai/actions/generate-content';
import {
  generateFeaturedImage,
  importFeaturedImageFromUrl,
  uploadFeaturedImage,
} from '../actions/featured-image';

type GenerationSourceMode = 'app' | 'byok';

interface ContentEditorProps {
  projectId: string;
  projectName: string;
  backHref: string;
  initialPostId?: string;
  initialTitle?: string | null;
  initialMarkdown?: string | null;
  initialExcerpt?: string | null;
  initialFocusKeyword?: string | null;
  initialMetaTitle?: string | null;
  initialMetaDescription?: string | null;
  initialCategories?: string[];
  initialTags?: string[];
  initialFeaturedImage?: {
    mode?: string | null;
    source?: string | null;
    prompt?: string | null;
    storedKey?: string | null;
  };
  availableProviders?: Array<{
    id: string;
    name: string;
    mode: 'managed' | 'byok';
    defaultModelText: string;
    enabled: boolean;
  }>;
}

export function ContentEditor({
  projectId,
  projectName,
  backHref,
  initialPostId,
  initialTitle,
  initialMarkdown,
  initialExcerpt,
  initialFocusKeyword,
  initialMetaTitle,
  initialMetaDescription,
  initialCategories,
  initialTags,
  initialFeaturedImage,
  availableProviders = [],
}: ContentEditorProps) {
  const [title, setTitle] = useState(initialTitle ?? '');
  const [markdown, setMarkdown] = useState(initialMarkdown ?? '');
  const [excerpt, setExcerpt] = useState(initialExcerpt ?? '');
  const [focusKeyword, setFocusKeyword] = useState(initialFocusKeyword ?? '');
  const [metaTitle, setMetaTitle] = useState(initialMetaTitle ?? '');
  const [metaDescription, setMetaDescription] = useState(initialMetaDescription ?? '');
  const [categories, setCategories] = useState((initialCategories ?? []).join(', '));
  const [tags, setTags] = useState((initialTags ?? []).join(', '));
  const [featuredImage, setFeaturedImage] = useState({
    mode: initialFeaturedImage?.mode ?? '',
    source: initialFeaturedImage?.source ?? '',
    prompt: initialFeaturedImage?.prompt ?? '',
    storedKey: initialFeaturedImage?.storedKey ?? '',
    previewUrl: initialFeaturedImage?.source ?? '',
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState('Professional');
  const [aiWordCount, setAiWordCount] = useState(900);
  const [aiSourceMode, setAiSourceMode] = useState<GenerationSourceMode>('app');
  const [postId, setPostId] = useState<string | null>(initialPostId ?? null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isGenerating, startGenerating] = useTransition();
  const [isImageProcessing, setIsImageProcessing] = useState(false);

  const providerOptions = useMemo(
    () =>
      availableProviders.filter((provider) => {
        if (!provider.enabled) {
          return false;
        }

        if (aiSourceMode === 'app') {
          return provider.mode === 'managed';
        }

        return provider.mode === 'byok';
      }),
    [availableProviders, aiSourceMode]
  );

  const [aiProviderId, setAiProviderId] = useState<string>('');
  const selectedProvider = providerOptions.find((provider) => provider.id === aiProviderId) ?? providerOptions[0] ?? null;
  const [aiModel, setAiModel] = useState<string>('');

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
        featuredImageStoredKey: featuredImage.storedKey || undefined,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.post?.id) {
        setPostId(result.post.id);
      }

      setMessage('Draft saved successfully.');

      if (result?.post?.id) {
        const url = new URL(window.location.href);
        url.searchParams.set('projectId', projectId);
        url.searchParams.set('postId', result.post.id);
        window.history.replaceState(null, '', url.toString());
      }
    });
  };

  const handleFeaturedImageChange = (value: {
    mode: string;
    source: string;
    prompt: string;
  }) => {
    setFeaturedImage((prev) => {
      const modeChanged = prev.mode !== value.mode;
      const sourceChanged = prev.source !== value.source;
      const promptChanged = prev.prompt !== value.prompt;

      return {
        ...prev,
        ...value,
        storedKey: modeChanged || sourceChanged || promptChanged ? '' : prev.storedKey,
        previewUrl: modeChanged || sourceChanged || promptChanged ? '' : prev.previewUrl,
      };
    });
  };

  const handleGenerateContent = () => {
    setMessage(null);
    setError(null);

    startGenerating(async () => {
      const result = await generateContent({
        projectId,
        postId: postId ?? undefined,
        title: title || undefined,
        focusKeyword: focusKeyword || undefined,
        tone: aiTone,
        wordCount: aiWordCount,
        prompt: aiPrompt || undefined,
        sourceMode: aiSourceMode,
        providerId: selectedProvider?.id,
        model: aiModel || selectedProvider?.defaultModelText,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.content) {
        setMarkdown(result.content);
      }

      setMessage('AI draft generated successfully.');
    });
  };

  const handleImageUpload = async (file: File) => {
    setError(null);
    setMessage(null);
    setIsImageProcessing(true);

    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('file', file);

    const result = await uploadFeaturedImage(formData);
    setIsImageProcessing(false);

    if ('error' in result) {
      setError(result.error);
      return;
    }

    setFeaturedImage((prev) => ({
      ...prev,
      mode: 'userupload',
      source: result.previewUrl ?? '',
      storedKey: result.storedImageKey ?? '',
      previewUrl: result.previewUrl ?? '',
    }));
  };

  const handleImageImport = async () => {
    setError(null);
    setMessage(null);
    setIsImageProcessing(true);

    const result = await importFeaturedImageFromUrl({
      projectId,
      imageUrl: featuredImage.source,
    });
    setIsImageProcessing(false);

    if ('error' in result) {
      setError(result.error);
      return;
    }

    setFeaturedImage((prev) => ({
      ...prev,
      storedKey: result.storedImageKey ?? '',
      previewUrl: result.previewUrl ?? '',
    }));
  };

  const handleImageGeneration = async () => {
    setError(null);
    setMessage(null);
    setIsImageProcessing(true);

    const result = await generateFeaturedImage({
      projectId,
      prompt: featuredImage.prompt,
    });
    setIsImageProcessing(false);

    if ('error' in result) {
      setError(result.error);
      return;
    }

    setFeaturedImage((prev) => ({
      ...prev,
      source: result.imageUrl ?? prev.source,
      storedKey: result.storedImageKey ?? '',
      previewUrl: result.previewUrl ?? '',
    }));
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
            <h1 className="text-3xl font-bold tracking-tight">{postId ? 'Edit Post' : 'New Post'}</h1>
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
              <CardTitle>AI Draft Assistant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ai-source-mode">AI Source</Label>
                  <Select value={aiSourceMode} onValueChange={(value) => setAiSourceMode(value as GenerationSourceMode)}>
                    <SelectTrigger id="ai-source-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="app">Application Provider</SelectItem>
                      <SelectItem value="byok">My BYOK Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ai-provider">Provider</Label>
                  <Select value={selectedProvider?.id ?? ''} onValueChange={setAiProviderId}>
                    <SelectTrigger id="ai-provider">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providerOptions.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ai-tone">Tone</Label>
                  <Select value={aiTone} onValueChange={setAiTone}>
                    <SelectTrigger id="ai-tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Friendly">Friendly</SelectItem>
                      <SelectItem value="Conversational">Conversational</SelectItem>
                      <SelectItem value="Analytical">Analytical</SelectItem>
                      <SelectItem value="Persuasive">Persuasive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ai-word-count">Target Word Count</Label>
                  <Input
                    id="ai-word-count"
                    type="number"
                    min={300}
                    max={2000}
                    value={aiWordCount}
                    onChange={(event) => setAiWordCount(Number(event.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ai-model">Model</Label>
                <Input
                  id="ai-model"
                  value={aiModel}
                  onChange={(event) => setAiModel(event.target.value)}
                  placeholder={selectedProvider?.defaultModelText ?? 'Enter model name'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ai-prompt">Prompt (optional)</Label>
                <Textarea
                  id="ai-prompt"
                  placeholder="Describe the angle, structure, or key points you want to cover"
                  value={aiPrompt}
                  onChange={(event) => setAiPrompt(event.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleGenerateContent} disabled={isGenerating}>
                <Sparkles className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generating Draft...' : 'Generate Draft'}
              </Button>
            </CardContent>
          </Card>

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
            previewUrl={featuredImage.previewUrl}
            isProcessing={isImageProcessing}
            onChange={handleFeaturedImageChange}
            onUpload={handleImageUpload}
            onImport={handleImageImport}
            onGenerate={handleImageGeneration}
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
