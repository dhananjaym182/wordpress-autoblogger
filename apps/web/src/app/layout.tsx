import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { CookieConsent } from '@/components/custom/cookie-consent';
import { ErrorBoundary } from '@/components/custom/error-boundary';

export const metadata: Metadata = {
  title: 'AutoBlogger - AI-Powered WordPress Autoblogging',
  description: 'Generate and schedule AI-powered blog posts for WordPress automatically',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            {children}
            <CookieConsent />
            <Toaster />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
