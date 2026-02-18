"use client"

import {
  Bot,
  Calendar,
  CreditCard,
  Crown,
  FileSearch,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
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
    href: "/dashboard/content",
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
      className="border-r border-sidebar-border/60 bg-gradient-to-b from-sidebar to-sidebar/95"
      {...props}
    >
      <SidebarHeader>
        <div className="rounded-xl border border-sidebar-border/60 bg-sidebar-accent/30 p-2">
          <div className="flex items-center gap-2 px-1 py-0.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/20">
            <FileText className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold tracking-tight">AutoBlogger</span>
              <span className="truncate text-xs text-muted-foreground">AI Publishing Suite</span>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-1 group-data-[collapsible=icon]:hidden">
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-sidebar-foreground/90 transition hover:bg-sidebar-accent"
              >
                <action.icon className="size-3.5" />
                <span>{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} label="Workspace" />
        <NavMain items={data.secondary} label="Account" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userPayload} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
