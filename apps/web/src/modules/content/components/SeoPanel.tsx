import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SeoPanelProps {
  seoScore: number;
  readabilityScore: number;
  wordCount: number;
  focusKeyword?: string;
}

const scoreVariant = (score: number) => {
  if (score >= 80) return 'default';
  if (score >= 60) return 'secondary';
  return 'destructive';
};

export function SeoPanel({ seoScore, readabilityScore, wordCount, focusKeyword }: SeoPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO & Readability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">SEO Score</span>
          <Badge variant={scoreVariant(seoScore)}>{seoScore}</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Readability</span>
          <Badge variant={scoreVariant(readabilityScore)}>{readabilityScore}</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Word Count</span>
          <span className="font-medium">{wordCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Focus Keyword</span>
          <span className="font-medium">{focusKeyword || 'Not set'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
