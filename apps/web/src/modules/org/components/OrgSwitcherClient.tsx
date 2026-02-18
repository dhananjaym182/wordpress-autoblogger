'use client';

import { useTransition } from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { setActiveOrganization } from '@/modules/org/actions/set-active-organization';

interface OrganizationOption {
  id: string;
  name: string;
  slug: string;
  role: string;
}

interface OrgSwitcherClientProps {
  organizations: OrganizationOption[];
  activeOrganizationId: string;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export function OrgSwitcherClient({
  organizations,
  activeOrganizationId,
}: OrgSwitcherClientProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const activeOrganization =
    organizations.find((organization) => organization.id === activeOrganizationId) ?? organizations[0];

  if (!activeOrganization) {
    return null;
  }

  const handleSelect = (organizationId: string) => {
    startTransition(async () => {
      const result = await setActiveOrganization(organizationId);
      if (result?.error) {
        return;
      }
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[220px] justify-between" disabled={isPending}>
          <div className="flex items-center gap-2 truncate">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(activeOrganization.name)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{activeOrganization.name}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        <DropdownMenuLabel>Organization</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((organization) => (
          <DropdownMenuItem
            key={organization.id}
            onSelect={() => handleSelect(organization.id)}
            className="flex items-center gap-2"
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(organization.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{organization.name}</p>
              <p className="truncate text-xs text-muted-foreground">{organization.role}</p>
            </div>
            {organization.id === activeOrganizationId && <Building2 className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

