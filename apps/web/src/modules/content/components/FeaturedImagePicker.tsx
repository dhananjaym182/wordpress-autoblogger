import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FeaturedImagePickerProps {
  mode: string;
  source: string;
  prompt: string;
  onChange: (value: { mode: string; source: string; prompt: string }) => void;
}

export function FeaturedImagePicker({ mode, source, prompt, onChange }: FeaturedImagePickerProps) {
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
            <option value="userurl">Image URL</option>
          </select>
        </div>
        {mode === 'ai' && (
          <div className="space-y-2">
            <Label htmlFor="featured-prompt">Image Prompt</Label>
            <Input
              id="featured-prompt"
              placeholder="Describe the image you want"
              value={prompt}
              onChange={(event) => onChange({ mode, source, prompt: event.target.value })}
            />
          </div>
        )}
        {mode === 'userurl' && (
          <div className="space-y-2">
            <Label htmlFor="featured-source">Image URL</Label>
            <Input
              id="featured-source"
              placeholder="https://example.com/image.jpg"
              value={source}
              onChange={(event) => onChange({ mode, source: event.target.value, prompt })}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
