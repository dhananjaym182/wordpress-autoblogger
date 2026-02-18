'use client';

import { useMemo } from 'react';
import { marked } from 'marked';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Configure marked to use synchronous parsing
marked.setOptions({
  breaks: true,
  gfm: true,
});

interface PreviewPanelProps {
  title: string;
  markdown: string;
}

export function PreviewPanel({ title, markdown }: PreviewPanelProps) {
  const previewHtml = useMemo(() => {
    // Use synchronous parsing by calling marked.parse with a string
    const result = marked.parse(markdown || '', { async: false });
    return typeof result === 'string' ? result : '';
  }, [markdown]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none dark:prose-invert">
        <h1>{title || 'Untitled Post'}</h1>
        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </CardContent>
    </Card>
  );
}
