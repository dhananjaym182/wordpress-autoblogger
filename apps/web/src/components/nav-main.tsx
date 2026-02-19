"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  label = "Platform",
  items,
}: {
  label?: string
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  const isActive = (url: string) => pathname === url || pathname?.startsWith(`${url}/`)

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-sidebar-foreground/70">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (!item.items?.length) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive(item.url)}
                  className="h-9 cursor-pointer gap-2.5 px-3 text-[13px] font-medium leading-none transition-colors duration-200 data-[active=true]:bg-sidebar-accent/80 data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm data-[active=true]:ring-1 data-[active=true]:ring-sidebar-border"
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive ?? isActive(item.url)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                    className="h-9 cursor-pointer gap-2.5 px-3 text-[13px] font-medium leading-none transition-colors duration-200 data-[active=true]:bg-sidebar-accent/80 data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm data-[active=true]:ring-1 data-[active=true]:ring-sidebar-border"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto text-sidebar-foreground/70 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive(subItem.url)}
                          className="h-8 cursor-pointer px-2.5 text-xs font-medium transition-colors duration-200 data-[active=true]:bg-sidebar-accent/70 data-[active=true]:text-sidebar-accent-foreground"
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
