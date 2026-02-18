import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ApiDocsPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-16">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
          <p className="text-muted-foreground">
            Use the OpenAPI endpoint as the canonical machine-readable source for integration tooling.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>OpenAPI Spec</CardTitle>
            <CardDescription>Initial scaffold endpoint for health and expansion.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="/api/openapi">Open `/api/openapi`</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/api/health">Check `/api/health`</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

