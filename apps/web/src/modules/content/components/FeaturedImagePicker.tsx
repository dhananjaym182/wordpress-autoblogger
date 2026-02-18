import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface FeaturedImagePickerProps {
  mode: string;
  source: string;
  prompt: string;
  previewUrl?: string;
  isProcessing?: boolean;
  onChange: (value: { mode: string; source: string; prompt: string }) => void;
  onUpload?: (file: File) => Promise<void>;
  onImport?: () => Promise<void>;
  onGenerate?: () => Promise<void>;
}

export function FeaturedImagePicker({
  mode,
  source,
  prompt,
  previewUrl,
  isProcessing,
  onChange,
  onUpload,
  onImport,
  onGenerate,
}: FeaturedImagePickerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="featured-mode">Image Source</Label>
          <select
            id="featured-mode"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={mode}
            onChange={(event) => onChange({ mode: event.target.value, source, prompt })}
          >
            <option value="">Select a source</option>
            <option value="ai">AI Generated</option>
            <option value="userupload">Upload Image</option>
            <option value="userurl">Image URL</option>
          </select>
        </div>
        {mode === 'ai' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="featured-prompt">Image Prompt</Label>
              <Input
                id="featured-prompt"
                placeholder="Describe the image you want"
                value={prompt}
                onChange={(event) => onChange({ mode, source, prompt: event.target.value })}
              />
            </div>
            <Button type="button" variant="outline" onClick={onGenerate} disabled={isProcessing || !onGenerate}>
              {isProcessing ? 'Generating...' : 'Generate Image'}
            </Button>
          </div>
        )}
        {mode === 'userupload' && (
          <div className="space-y-2">
            <Label htmlFor="featured-upload">Upload Image</Label>
            <Input
              id="featured-upload"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file && onUpload) {
                  onUpload(file);
                }
              }}
            />
            {isProcessing && <p className="text-xs text-muted-foreground">Uploading...</p>}
          </div>
        )}
        {mode === 'userurl' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="featured-source">Image URL</Label>
              <Input
                id="featured-source"
                placeholder="https://example.com/image.jpg"
                value={source}
                onChange={(event) => onChange({ mode, source: event.target.value, prompt })}
              />
            </div>
            <Button type="button" variant="outline" onClick={onImport} disabled={isProcessing || !onImport || !source}>
              {isProcessing ? 'Importing...' : 'Import Image'}
            </Button>
          </div>
        )}
        {previewUrl && (
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md border">
              <Image
                src={previewUrl}
                alt="Featured preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
