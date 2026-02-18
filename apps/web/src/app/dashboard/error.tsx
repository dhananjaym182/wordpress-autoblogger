'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardErrorPage({ error, reset }: DashboardErrorPageProps) {
  return (
    <div className="mx-auto max-w-2xl py-10">
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Something went wrong in this dashboard view
          </CardTitle>
          <CardDescription>
            The application stayed online, but this section failed to load. Retry or return to another page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">{error.message}</p>
          <div className="flex items-center gap-2">
            <Button onClick={reset}>Retry</Button>
            <Button variant="outline" asChild>
              <a href="/dashboard/content">Go to Content Dashboard</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
