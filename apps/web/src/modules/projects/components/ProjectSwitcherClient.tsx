'use client';

import { useTransition } from 'react';
import { Check, FolderKanban, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { setActiveProject } from '@/modules/projects/actions/set-active-project';

interface ProjectOption {
  id: string;
  name: string;
  slug: string;
}

interface ProjectSwitcherClientProps {
  projects: ProjectOption[];
  activeProjectId: string | null;
}

export function ProjectSwitcherClient({ projects, activeProjectId }: ProjectSwitcherClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const activeProject =
    projects.find((project: (typeof projects)[number]) => project.id === activeProjectId) ?? projects[0] ?? null;

  if (!activeProject) {
    return (
      <Button variant="outline" className="w-[230px] justify-start" disabled>
        <FolderKanban className="mr-2 h-4 w-4" />
        No projects yet
      </Button>
    );
  }

  const handleSelect = (projectId: string) => {
    startTransition(async () => {
      const result = await setActiveProject(projectId);
      if (result?.error) {
        return;
      }
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[230px] justify-between" disabled={isPending}>
          <span className="flex min-w-0 items-center gap-2">
            <FolderKanban className="h-4 w-4" />
            <span className="truncate">{activeProject.name}</span>
          </span>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        <DropdownMenuLabel>Active project</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {projects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onSelect={() => handleSelect(project.id)}
            className="flex items-center gap-2"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{project.name}</p>
              <p className="truncate text-xs text-muted-foreground">/{project.slug}</p>
            </div>
            {project.id === activeProject.id ? <Check className="h-4 w-4" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
