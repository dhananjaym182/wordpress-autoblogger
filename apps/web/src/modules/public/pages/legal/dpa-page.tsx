import type { Metadata } from 'next';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Data Processing Addendum | AutoBlogger',
  description: 'AutoBlogger Data Processing Addendum for GDPR-aligned data handling.',
};

export default function DpaPage() {
  return (
    <article className="space-y-6">
      <Card className="border-border/70 bg-background/75 backdrop-blur-sm">
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

      <Card className="border-border/70 bg-background/75 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Processing Scope</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
              <span>Data categories: account profile, publishing metadata, and content payloads.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
              <span>Purpose: service delivery, job execution, and platform security operations.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
              <span>Retention: limited to contractual need, legal obligation, or deletion request windows.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </article>
  );
}
