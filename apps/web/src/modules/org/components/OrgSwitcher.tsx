"use client"

import { useState } from "react"
import { Building2, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Organization {
  id: string
  name: string
  slug: string
}

export function OrgSwitcher() {
  const [organizations] = useState<Organization[]>([
    {
      id: "1",
      name: "My Personal Blog",
      slug: "my-personal-blog",
    },
    {
      id: "2",
      name: "Company Blog",
      slug: "company-blog",
    },
    {
      id: "3",
      name: "Side Project",
      slug: "side-project",
    },
  ])

  const [currentOrg, setCurrentOrg] = useState<Organization>(organizations[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {currentOrg.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{currentOrg.name}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => setCurrentOrg(org)}
            className={currentOrg.id === org.id ? "bg-accent" : ""}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {org.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="truncate flex-1">{org.name}</span>
              {currentOrg.id === org.id && <Building2 className="ml-auto h-4 w-4" />}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus className="mr-2 h-4 w-4" />
          Create Organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
