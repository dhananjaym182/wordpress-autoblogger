import Link from 'next/link';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const quickStart = [
  'Read the OpenAPI schema',
  'Validate health endpoint',
  'Use API routes from server-side workflows',
];

export default function ApiDocsPage() {
  return (
    <section className="container mx-auto max-w-5xl px-4">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
          <p className="text-muted-foreground">
            Integrate AutoBlogger features safely with machine-readable contracts and health checks.
          </p>
        </div>

        <Card className="border-border/70 bg-background/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle>OpenAPI Spec</CardTitle>
            <CardDescription>Canonical contract for endpoint structure and expansion.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="/api/openapi">
                Open `/api/openapi`
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/api/health">Check `/api/health`</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-background/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Minimal setup for automation and internal tooling.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {quickStart.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
