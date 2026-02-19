'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';
import { authClient } from '@/modules/auth/lib/auth-client';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const callbackURL = searchParams.get('callbackURL');
  const email = searchParams.get('email');
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkVerification = async () => {
      // If there's a token, Better Auth has already processed the verification
      // Check if the user is now logged in and verified
      try {
        const sessionResponse = await authClient.getSession();
        const session = sessionResponse?.data;
        
        if (session?.user) {
          if (session.user.emailVerified) {
            setStatus('success');
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              router.push(callbackURL || '/dashboard');
            }, 2000);
          } else {
            // User exists but email not verified yet
            setStatus('pending');
          }
        } else {
          // No session - user needs to verify
          if (token) {
            // Token present but no session - verification might have failed
            setStatus('error');
            setError('Verification failed. Please try again.');
          } else {
            setStatus('pending');
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
        setStatus('pending');
      }
    };

    checkVerification();
  }, [token, callbackURL, router]);

  const handleResendVerification = async () => {
    setResending(true);
    setResendMessage(null);
    setError(null);

    try {
      const sessionResponse = await authClient.getSession();
      const session = sessionResponse?.data;

      const targetEmail = session?.user?.email ?? email;

      if (!targetEmail) {
        setError('No email found. Please log in again and retry.');
        return;
      }

      await authClient.sendVerificationEmail({
        email: targetEmail,
        callbackURL: '/dashboard',
      });

      setResendMessage('Verification email sent. Check your inbox.');
    } catch (err) {
      if (err instanceof Error && err.message.includes('NOT_CONFIGURED')) {
        setError('Email sending is not configured in this environment. Contact an admin to verify manually.');
      } else {
        setError('Failed to send verification email. Please try again later.');
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-border/70 bg-background/80 backdrop-blur-md">
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
        
        {status === 'pending' && (
          <>
            <div className="flex items-center justify-center mb-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Verify your email
            </CardTitle>
            <CardDescription className="text-center">
              A verification email has been sent to {email ? <strong>{email}</strong> : 'your email address'}.
              Please check your inbox and follow the link to continue.
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
              Your email has been successfully verified. Redirecting to dashboard...
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
      <CardContent className="flex flex-col items-center gap-4">
        {status === 'success' && (
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        )}
        {(status === 'error' || status === 'pending') && (
          <>
            <Button 
              onClick={handleResendVerification} 
              disabled={resending}
              className="w-full"
            >
              {resending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend Verification Email'
              )}
            </Button>
            {resendMessage && (
              <p className="text-sm text-green-600 text-center">{resendMessage}</p>
            )}
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Back to Login</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function VerifyEmailFallback() {
  return (
    <Card className="w-full max-w-md border-border/70 bg-background/80 backdrop-blur-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          Loading...
        </CardTitle>
        <CardDescription className="text-center">
          Please wait while we load the verification page.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <section className="container mx-auto flex justify-center px-4">
      <Suspense fallback={<VerifyEmailFallback />}>
        <VerifyEmailContent />
      </Suspense>
    </section>
  );
}
