import { headers } from "next/headers"

import LandingHero from "@/components/landing/LandingHero"
import { auth } from "@/lib/auth/auth"
import { listBlogs } from "@/lib/content/blogs"

const LandingScreen = async () => {
  const [session, blogs] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    listBlogs(),
  ])

  return <LandingHero isAuthenticated={Boolean(session)} blogs={blogs} />
}

export default LandingScreen