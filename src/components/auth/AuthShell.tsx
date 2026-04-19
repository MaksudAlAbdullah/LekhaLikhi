import Link from "next/link"
import type { ReactNode } from "react"

interface AuthShellProps {
  title: string
  description: string
  alternateHref: string
  alternateLabel: string
  alternateText: string
  children: ReactNode
}

const AuthShell = ({
  title,
  description,
  alternateHref,
  alternateLabel,
  alternateText,
  children,
}: AuthShellProps) => {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] bg-stone-900 p-8 text-stone-50 shadow-[0_24px_80px_rgba(15,23,42,0.25)] dark:bg-stone-100 dark:text-stone-950">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300 dark:text-amber-700">
              Lekhalikhi Auth
            </p>
            <h1 className="text-4xl font-semibold leading-tight">{title}</h1>
            <p className="text-base leading-8 text-stone-300 dark:text-stone-700">{description}</p>
            <p className="text-sm text-stone-300 dark:text-stone-700">
              {alternateText}{" "}
              <Link href={alternateHref} className="font-semibold text-amber-300 dark:text-amber-700">
                {alternateLabel}
              </Link>
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/10 bg-white/85 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-stone-950/70">
          {children}
        </section>
      </div>
    </main>
  )
}

export default AuthShell