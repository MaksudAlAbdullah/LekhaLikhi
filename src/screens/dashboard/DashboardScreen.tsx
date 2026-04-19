import { headers } from "next/headers"
import { redirect } from "next/navigation"

import DashboardPanel from "@/components/dashboard/DashboardPanel"
import { signOutAction } from "@/lib/actions/auth.actions"
import { auth } from "@/lib/auth/auth"

const DashboardScreen = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in?callbackUrl=/dashboard")
  }

  return <DashboardPanel session={session} signOutAction={signOutAction} />
}

export default DashboardScreen