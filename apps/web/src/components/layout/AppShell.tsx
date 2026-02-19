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
import { ProjectSwitcherClient } from '@/modules/projects/components/ProjectSwitcherClient';

interface AppShellProps {
  children: React.ReactNode;
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
  projectSwitcher?: {
    projects: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
    activeProjectId: string | null;
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

export function AppShell({ children, user, projectSwitcher }: AppShellProps) {
  const pathname = usePathname();
  const currentLabel = routeLabelMap[pathname ?? '/dashboard'] ?? 'Dashboard';

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="bg-gradient-to-b from-background to-muted/20">
        <header className="z-20 flex min-h-14 shrink-0 items-center gap-2 border-b border-border/70 bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-4">
          <SidebarTrigger className="h-8 w-8 rounded-md" />
          <Separator orientation="vertical" className="mr-1 hidden h-4 sm:block" />

          <Breadcrumb className="min-w-0">
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage className="text-muted-foreground">Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
              {currentLabel !== 'Dashboard' && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="truncate">{currentLabel}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="relative ml-auto hidden w-full max-w-sm xl:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-9 border-border/70 bg-background/70 pl-9"
              type="search"
              placeholder="Search dashboard"
              aria-label="Search"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 xl:ml-2">
            <div className="hidden md:block">
              <ProjectSwitcherClient
                projects={projectSwitcher?.projects ?? []}
                activeProjectId={projectSwitcher?.activeProjectId ?? null}
              />
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="p-4 pt-5 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
