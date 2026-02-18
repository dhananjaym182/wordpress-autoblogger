import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Data Processing Addendum | AutoBlogger',
  description: 'AutoBlogger Data Processing Addendum for GDPR-aligned data handling.',
};

export default function DpaPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Data Processing Addendum (DPA)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            This Data Processing Addendum describes how AutoBlogger processes personal data on behalf of
            customers operating in regulated jurisdictions, including GDPR contexts.
          </p>
          <p>
            AutoBlogger acts as a processor for organization-managed publishing data and as a controller
            for account and billing records required to operate the service.
          </p>
          <p>
            Security controls include encryption at rest for secrets, role-scoped access controls, audit
            logging for sensitive actions, and incident response procedures aligned with our disaster
            recovery policy.
          </p>
          <p>
            For signed DPA requests, contact <strong>privacy@autoblogger.com</strong> with your organization
            details.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

