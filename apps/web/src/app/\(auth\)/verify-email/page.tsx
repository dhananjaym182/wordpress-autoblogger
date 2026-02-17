'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('No verification token provided');
      return;
    }

    // Better Auth handles verification automatically via the callback URL
    // This page is for displaying the status
    const verifyEmail = async () => {
      try {
        // The actual verification is handled by Better Auth when the user clicks the link
        // This page just shows a success message
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setError('Failed to verify email. The link may have expired.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/40">
      <div className="mb-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">AutoBlogger</span>
        </Link>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          {status === 'loading' && (
            <>
              <div className="flex items-center justify-center mb-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                Verifying your email...
              </CardTitle>
              <CardDescription className="text-center">
                Please wait while we verify your email address.
              </CardDescription>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                Email verified!
              </CardTitle>
              <CardDescription className="text-center">
                Your email has been successfully verified. You can now access your dashboard.
              </CardDescription>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="flex items-center justify-center mb-4">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                Verification failed
              </CardTitle>
              <CardDescription className="text-center">
                {error || 'The verification link is invalid or has expired.'}
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="flex justify-center">
          {status === 'success' && (
            <Button asChild>
              <Link href="/projects">Go to Dashboard</Link>
            </Button>
          )}
          {status === 'error' && (
            <Button asChild variant="outline">
              <Link href="/login">Back to Login</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
