import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { AppShell } from '@/components/layout/AppShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  // Check if email is verified
  if (!session.user.emailVerifiedAt) {
    redirect('/verify-email');
  }

  return <AppShell user={session.user}>{children}</AppShell>;
}
