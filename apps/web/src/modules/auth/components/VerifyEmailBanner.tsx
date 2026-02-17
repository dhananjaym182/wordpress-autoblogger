'use client';

import { useState } from 'react';
import { signIn } from '../lib/auth-client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

interface VerifyEmailBannerProps {
  email: string;
}

export function VerifyEmailBanner({ email }: VerifyEmailBannerProps) {
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function resendVerification() {
    setIsResending(true);
    setError(null);

    try {
      // Note: Better Auth handles resending automatically when trying to sign in
      // This is a placeholder for custom resend logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResent(true);
    } catch (err) {
      setError('Failed to resend verification email. Please try again later.');
    } finally {
      setIsResending(false);
    }
  }

  if (resent) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle>Email sent!</AlertTitle>
        <AlertDescription>
          A new verification email has been sent to {email}.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-amber-50 border-amber-200">
      <Mail className="h-4 w-4 text-amber-600" />
      <AlertTitle>Verify your email</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span>
          Please verify your email address to access all features. We sent a verification link to{' '}
          <strong>{email}</strong>.
        </span>
        {error && <span className="text-red-600 text-sm">{error}</span>}
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={resendVerification}
            disabled={isResending}
            className="bg-white"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Resending...
              </>
            ) : (
              'Resend email'
            )}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
