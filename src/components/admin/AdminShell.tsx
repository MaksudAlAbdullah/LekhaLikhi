"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpenText, LayoutDashboard, LogOut, PenSquare, Sparkles } from "lucide-react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import type { SessionUserSummary } from "@/types/user.types"

interface AdminShellProps {
  user: SessionUserSummary
  title: string
  description: string
  children: ReactNode
  onSignOut: () => void
  isSigningOut?: boolean
}

const navigationItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Write blog",
    href: "/admin/blogs/write",
    icon: PenSquare,
  },
]

const AdminShell = ({ user, title, description, children, onSignOut, isSigningOut = false }: AdminShellProps) => {
  const pathname = usePathname()

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader className="gap-5 border-b border-sidebar-border/70 px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-black/10">
              <Sparkles className="size-5" />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sidebar-foreground/60">Lekhalikhi</p>
              <p className="truncate text-sm font-semibold text-sidebar-foreground">Admin control room</p>
            </div>
          </div>

          <div className="group-data-[collapsible=icon]:hidden">
            <div className="rounded-3xl border border-sidebar-border/70 bg-sidebar-accent/60 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-sidebar-foreground/55">Signed in as</p>
              <p className="mt-2 truncate text-base font-semibold text-sidebar-foreground">{user.name}</p>
              <p className="truncate text-sm text-sidebar-foreground/70">{user.email}</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={pathname === item.href}
                        tooltip={item.label}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Quick links</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<Link href="/" />} tooltip="Public landing page">
                    <BookOpenText />
                    <span>Public home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="gap-4 border-t border-sidebar-border/70 px-3 py-4">
          <Button variant="outline" className="w-full justify-start group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center" onClick={onSignOut} disabled={isSigningOut}>
            <LogOut />
            <span className="group-data-[collapsible=icon]:hidden">{isSigningOut ? "Signing out..." : "Sign out"}</span>
          </Button>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-h-screen bg-transparent">
        <header className="sticky top-0 z-20 border-b border-black/5 bg-white/70 px-4 py-3 backdrop-blur xl:px-8 dark:border-white/10 dark:bg-black/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <SidebarTrigger className="mt-1 shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500 dark:text-stone-400">Admin space</p>
                <h1 className="mt-1 text-2xl font-semibold text-stone-950 dark:text-stone-50">{title}</h1>
                <p className="mt-1 max-w-3xl text-sm leading-7 text-stone-600 dark:text-stone-300">{description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" render={<Link href="/" />}>
                View site
              </Button>
              <Button render={<Link href="/admin/blogs/write" />}>
                New article
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 py-6 xl:px-8">
          <div className="rounded-[2rem] border border-black/8 bg-white/72 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur xl:p-6 dark:border-white/10 dark:bg-stone-950/55">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AdminShell