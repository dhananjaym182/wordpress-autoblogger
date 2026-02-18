import { PublicNavigation } from "@/components/layout/public-navigation"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-gradient-to-b from-background via-background to-muted/35">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[-180px] z-0 mx-auto h-[360px] w-[780px] rounded-full bg-primary/15 blur-3xl dark:bg-primary/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 top-40 z-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15"
      />

      <PublicNavigation />

      <main id="main-content" className="relative z-10 pb-16 pt-28">
        {children}
      </main>
    </div>
  )
}
