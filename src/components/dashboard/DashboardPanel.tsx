import type { AppSession } from "@/lib/auth/auth"

interface DashboardPanelProps {
  session: AppSession
  signOutAction: () => Promise<void>
}

const DashboardPanel = ({ session, signOutAction }: DashboardPanelProps) => {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
      <section className="w-full rounded-[2rem] border border-black/10 bg-white/85 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-stone-950/70">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">
              Protected route
            </p>
            <h1 className="text-4xl font-semibold text-stone-900 dark:text-stone-50">Welcome back, {session.user.name}.</h1>
            <p className="max-w-2xl text-base leading-8 text-stone-600 dark:text-stone-300">
              Better Auth is active, the route is protected, and your session is being resolved from the server.
            </p>
          </div>

          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-950 dark:border-stone-600 dark:text-stone-100 dark:hover:border-stone-300"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl bg-stone-100 p-5 dark:bg-stone-900/70">
            <p className="text-sm text-stone-500 dark:text-stone-400">Name</p>
            <p className="mt-2 text-lg font-semibold text-stone-900 dark:text-stone-50">{session.user.name}</p>
          </article>

          <article className="rounded-2xl bg-stone-100 p-5 dark:bg-stone-900/70">
            <p className="text-sm text-stone-500 dark:text-stone-400">Email</p>
            <p className="mt-2 text-lg font-semibold text-stone-900 dark:text-stone-50">{session.user.email}</p>
          </article>

          <article className="rounded-2xl bg-stone-100 p-5 dark:bg-stone-900/70">
            <p className="text-sm text-stone-500 dark:text-stone-400">Role</p>
            <p className="mt-2 text-lg font-semibold capitalize text-stone-900 dark:text-stone-50">
              {String(session.user.role ?? "user")}
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default DashboardPanel