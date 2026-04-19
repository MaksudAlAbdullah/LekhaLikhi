import Link from "next/link"

interface LandingHeroProps {
  isAuthenticated: boolean
}

const LandingHero = ({ isAuthenticated }: LandingHeroProps) => {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
      <section className="grid w-full gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-stone-200">
            Bengali-first publishing workspace
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">
              Lekhalikhi
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-stone-900 dark:text-stone-50 sm:text-6xl">
              Auth-ready blog foundation, now structured under src.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-stone-600 dark:text-stone-300">
              The project is now aligned to a screen-based App Router structure with Better Auth, MongoDB,
              and a protected dashboard flow.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={isAuthenticated ? "/dashboard" : "/sign-up"}
              className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700 dark:bg-amber-300 dark:text-stone-950 dark:hover:bg-amber-200"
            >
              {isAuthenticated ? "Open dashboard" : "Create account"}
            </Link>
            <Link
              href="/sign-in"
              className="rounded-full border border-stone-300 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-950 dark:border-stone-600 dark:bg-stone-900/40 dark:text-stone-200 dark:hover:border-stone-300"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white/70 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                Included now
              </p>
              <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
                Base auth workflow
              </h2>
            </div>

            <div className="grid gap-4">
              {[
                "src-based app, component, lib, hook layout",
                "Better Auth route mounted at /api/auth/[...all]",
                "MongoDB connection via Mongoose",
                "Protected /dashboard route with proxy redirect",
                "Validated sign-in and sign-up forms",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-stone-200/80 bg-stone-50/80 px-4 py-4 text-sm text-stone-700 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LandingHero