import { headers } from "next/headers"

import LandingHero from "@/components/landing/LandingHero"
import { auth } from "@/lib/auth/auth"

const LandingScreen = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return <LandingHero isAuthenticated={Boolean(session)} />
}

export default LandingScreen