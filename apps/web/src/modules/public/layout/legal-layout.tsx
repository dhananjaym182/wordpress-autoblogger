import Link from 'next/link';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="container mx-auto px-4">
      <div className="mx-auto mb-6 max-w-3xl rounded-2xl border border-border/70 bg-background/80 p-6 backdrop-blur-md">
        <h1 className="text-2xl font-semibold tracking-tight">Legal & Compliance</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Policies and contractual terms for using AutoBlogger responsibly.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/legal/privacy" className="cursor-pointer text-primary hover:underline">Privacy</Link>
          <Link href="/legal/terms" className="cursor-pointer text-primary hover:underline">Terms</Link>
          <Link href="/legal/cookies" className="cursor-pointer text-primary hover:underline">Cookies</Link>
          <Link href="/legal/dpa" className="cursor-pointer text-primary hover:underline">DPA</Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl rounded-2xl border border-border/70 bg-background/80 p-6 backdrop-blur-md sm:p-8">
        {children}
      </div>
    </section>
  );
}
