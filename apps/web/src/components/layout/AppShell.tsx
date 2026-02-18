'use client';

import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

interface AppShellProps {
  children: React.ReactNode;
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
}

const routeLabelMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/projects': 'Projects',
  '/dashboard/content': 'Content',
  '/dashboard/content/new': 'Content',
  '/dashboard/planner': 'Planner',
  '/dashboard/ai': 'AI',
  '/dashboard/jobs': 'Jobs',
  '/dashboard/billing': 'Billing',
  '/dashboard/settings': 'Settings',
};

export function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname();
  const currentLabel = routeLabelMap[pathname ?? '/dashboard'] ?? 'Dashboard';

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
              {currentLabel !== 'Dashboard' && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="relative ml-auto hidden w-full max-w-md sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" type="search" placeholder="Search dashboard" aria-label="Search" />
          </div>

          <div className="ml-2 flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="p-4 pt-5 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
