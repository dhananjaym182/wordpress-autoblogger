"use client"

import Link from "next/link"
import { BookOpenText, Bot, FileText, Menu, ShieldCheck } from "lucide-react"
import { usePathname } from "next/navigation"

import { BrandLogo } from "@/components/brand/BrandLogo"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type PublicNavigationProps = {
  currentPath?: string
}

const productLinks = [
  {
    href: "/#features",
    title: "AI Generation",
    description: "Generate SEO-friendly drafts with multi-provider AI routing.",
    icon: Bot,
  },
  {
    href: "/dashboard/planner",
    title: "Publishing Planner",
    description: "Schedule and automate publishing windows across projects.",
    icon: BookOpenText,
  },
]

const resourceLinks = [
  {
    href: "/docs/api",
    title: "API Docs",
    description: "Integrate AutoBlogger workflows into your own stack.",
    icon: FileText,
  },
  {
    href: "/legal/privacy",
    title: "Privacy & Terms",
    description: "Review policies, terms, cookies, and compliance pages.",
    icon: ShieldCheck,
  },
]

const topLevelLinks = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
]

function getAuthActions(currentPath: string) {
  if (currentPath === "/signup") {
    return {
      primary: { href: "/login", label: "Sign In" },
      secondary: { href: "/signup", label: "Create Account" },
    }
  }

  if (currentPath === "/login") {
    return {
      primary: { href: "/signup", label: "Create Account" },
      secondary: { href: "/login", label: "Sign In" },
    }
  }

  if (currentPath === "/signout") {
    return {
      primary: { href: "/login", label: "Sign In" },
      secondary: { href: "/signup", label: "Create Account" },
    }
  }

  return {
    primary: { href: "/signup", label: "Start Free" },
    secondary: { href: "/login", label: "Sign In" },
  }
}

export function PublicNavigation({ currentPath }: PublicNavigationProps) {
  const pathname = usePathname()
  const resolvedPath = currentPath || pathname || "/"
  const authActions = getAuthActions(resolvedPath)

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <header className="sticky top-4 z-50 px-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border border-border/70 bg-background/80 px-4 py-3 shadow-lg shadow-primary/10 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70">
          <Link href="/" className="flex cursor-pointer items-center gap-2">
            <BrandLogo variant="minimal" size={32} withText label="AutoBlogger" />
          </Link>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
              {topLevelLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "h-9 cursor-pointer bg-transparent/70 text-foreground/90 backdrop-blur-sm hover:bg-accent/75 hover:text-foreground motion-reduce:transition-none"
                    )}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuItem>
              ))}

              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 bg-transparent/70 text-foreground/90 backdrop-blur-sm hover:bg-accent/75 data-[state=open]:bg-accent/75">
                  Product
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-2 p-3 md:grid-cols-2">
                    {productLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="block cursor-pointer rounded-lg border border-border/60 bg-background/85 p-3 transition-colors duration-200 hover:bg-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <link.icon className="h-4 w-4 text-primary" />
                            {link.title}
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{link.description}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 bg-transparent/70 text-foreground/90 backdrop-blur-sm hover:bg-accent/75 data-[state=open]:bg-accent/75">
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-2 p-3 md:grid-cols-2">
                    {resourceLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="block cursor-pointer rounded-lg border border-border/60 bg-background/85 p-3 transition-colors duration-200 hover:bg-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <link.icon className="h-4 w-4 text-primary" />
                            {link.title}
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{link.description}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href={authActions.secondary.href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "cursor-pointer bg-transparent/70 hover:bg-accent/75 motion-reduce:transition-none"
                )}
              >
                {authActions.secondary.label}
              </Link>
              <Button size="sm" asChild>
                <Link href={authActions.primary.href} className="cursor-pointer">
                  {authActions.primary.label}
                </Link>
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 sm:hidden">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[360px]">
                <SheetHeader>
                  <SheetTitle>Navigate</SheetTitle>
                  <SheetDescription>Quick links for product and account pages.</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-2">
                  {topLevelLinks.map((link) => (
                    <SheetClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "w-full cursor-pointer justify-start bg-transparent/70 hover:bg-accent/70"
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}

                  {[...productLinks, ...resourceLinks].map((link) => (
                    <SheetClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        className="block cursor-pointer rounded-lg border border-border/60 bg-background/90 p-3 transition-colors duration-200 hover:bg-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                      >
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <link.icon className="h-4 w-4 text-primary" />
                          {link.title}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
                      </Link>
                    </SheetClose>
                  ))}
                </div>

                <div className="mt-6 border-t pt-6">
                  <div className="flex gap-2">
                    <SheetClose asChild>
                      <Link
                        href={authActions.secondary.href}
                        className={cn(buttonVariants({ variant: "outline" }), "flex-1 cursor-pointer")}
                      >
                        {authActions.secondary.label}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href={authActions.primary.href}
                        className={cn(buttonVariants({ variant: "default" }), "flex-1 cursor-pointer")}
                      >
                        {authActions.primary.label}
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}
