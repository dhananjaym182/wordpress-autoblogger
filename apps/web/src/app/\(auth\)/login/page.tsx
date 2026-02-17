import { LoginForm } from '@/modules/auth/components/LoginForm';
import Link from 'next/link';

export const metadata = {
  title: 'Sign In | AutoBlogger',
  description: 'Sign in to your AutoBlogger account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/40">
      <div className="mb-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">AutoBlogger</span>
        </Link>
      </div>
      <LoginForm />
      <p className="mt-4 text-sm text-muted-foreground">
        By signing in, you agree to our{' '}
        <Link href="/terms" className="underline hover:text-primary">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline hover:text-primary">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
