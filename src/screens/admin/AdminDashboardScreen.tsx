"use client"

import { useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"

import AdminDashboardPanel from "@/components/admin/AdminDashboardPanel"
import AdminShell from "@/components/admin/AdminShell"
import { useBlogs } from "@/hooks/useBlogs"
import { authClient, useSession } from "@/lib/auth/auth-client"
import type { SessionUserSummary } from "@/types/user.types"

const AdminDashboardScreen = () => {
  const router = useRouter()
  const [isSigningOut, startSigningOut] = useTransition()
  const { data: session, isPending: isSessionPending } = useSession()
  const sessionUser = session?.user as
    | {
        id: string
        name: string
        email: string
        role?: string
      }
    | undefined
  const sessionRole = sessionUser?.role ?? "user"
  const { data, isLoading, error } = useBlogs({
    enabled: sessionRole === "admin",
  })

  useEffect(() => {
    if (isSessionPending) {
      return
    }

    if (!session) {
      router.replace("/sign-in?callbackUrl=/admin/dashboard")
      return
    }

    if (sessionRole !== "admin") {
      router.replace("/dashboard")
    }
  }, [isSessionPending, router, session, sessionRole])

  const handleSignOut = () => {
    startSigningOut(async () => {
      await authClient.signOut()
      router.push("/sign-in")
      router.refresh()
    })
  }

  if (!session || !sessionUser || sessionRole !== "admin") {
    return null
  }

  const user: SessionUserSummary = {
    id: sessionUser.id,
    name: sessionUser.name,
    email: sessionUser.email,
    role: "admin",
  }

  return (
    <AdminShell
      user={user}
      title="Admin dashboard"
      description="Track publishing throughput, review recent articles, and jump back into writing without leaving the control room."
      onSignOut={handleSignOut}
      isSigningOut={isSigningOut}
    >
      <AdminDashboardPanel
        data={data}
        isLoading={isLoading || isSessionPending}
        errorMessage={error instanceof Error ? error.message : null}
      />
    </AdminShell>
  )
}

export default AdminDashboardScreen