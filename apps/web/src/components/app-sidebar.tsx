"use client"

import Link from "next/link"
import {
  Bot,
  Calendar,
  CreditCard,
  Crown,
  FileSearch,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react"

import { BrandLogo } from "@/components/brand/BrandLogo"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

type AppSidebarUser = {
  id: string
  email: string
  name?: string | null
  image?: string | null
}

const data = {
  navMain: [
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: FolderKanban,
      items: [
        {
          title: "Project Directory",
          url: "/dashboard/projects",
        },
      ],
    },
    {
      title: "Content",
      url: "/dashboard/content",
      icon: LayoutDashboard,
      items: [
        {
          title: "Content Dashboard",
          url: "/dashboard/content",
        },
      ],
    },
    {
      title: "Planner",
      url: "/dashboard/planner",
      icon: Calendar,
      items: [
        {
          title: "Calendar",
          url: "/dashboard/planner",
        },
      ],
    },
    {
      title: "AI",
      url: "/dashboard/ai",
      icon: Bot,
      items: [
        {
          title: "Provider Settings",
          url: "/dashboard/ai",
        },
      ],
    },
    {
      title: "Jobs",
      url: "/dashboard/jobs",
      icon: FileSearch,
      items: [
        {
          title: "Job Logs",
          url: "/dashboard/jobs",
        },
      ],
    },
  ],
  secondary: [
    {
      title: "Billing",
      url: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
}

const quickActions = [
  {
    label: "New Content",
    href: "/dashboard/content/new",
    icon: Sparkles,
  },
  {
    label: "Upgrade",
    href: "/dashboard/billing",
    icon: Crown,
  },
]

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: AppSidebarUser }) {
  const displayName = user.name?.trim() || "User"
  const userPayload = {
    name: displayName,
    email: user.email,
    avatar: user.image || "",
  }

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border/60 bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95 supports-[backdrop-filter]:backdrop-blur-xl"
      {...props}
    >
      <SidebarHeader>
        <div className="rounded-xl border border-sidebar-border/60 bg-sidebar-accent/35 p-2.5 shadow-sm">
          <div className="flex items-center gap-2.5 px-1.5 py-1">
            <BrandLogo
              variant="minimal"
              size={32}
              withText
              className="group-data-[collapsible=icon]:[&>span:last-child]:hidden"
              label="AutoBlogger"
            />
          </div>

          <div className="px-1.5 pt-0.5 group-data-[collapsible=icon]:hidden">
            <span className="truncate text-xs text-muted-foreground">AI Publishing Suite</span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-1.5 group-data-[collapsible=icon]:hidden">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-sidebar-foreground/90 transition-colors duration-200 hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              >
                <action.icon className="size-3.5" />
                <span>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-1 pb-2">
        <NavMain items={data.navMain} label="Workspace" />
        <SidebarSeparator />
        <NavMain items={data.secondary} label="Account" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userPayload} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
