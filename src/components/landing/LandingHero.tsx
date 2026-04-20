import Link from "next/link"

import PublicBlogCard from "@/components/blog/PublicBlogCard"
import type { BlogSummary } from "@/types/blog.types"

interface LandingHeroProps {
  isAuthenticated: boolean
  blogs: BlogSummary[]
}

const LandingHero = ({ isAuthenticated, blogs }: LandingHeroProps) => {
  const [featuredBlog, ...remainingBlogs] = blogs

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-stone-200">
            Bengali-first publishing journal
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">Lekhalikhi</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-stone-900 dark:text-stone-50 sm:text-6xl">
              Read long-form stories published from your own markdown workflow.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-stone-600 dark:text-stone-300">
              Articles and images are stored directly in the repository public folder for now, which keeps the publishing loop transparent and easy to version.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={isAuthenticated ? "/admin/dashboard" : "/sign-up"}
              className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700 dark:bg-amber-300 dark:text-stone-950 dark:hover:bg-amber-200"
            >
              {isAuthenticated ? "Open admin" : "Create account"}
            </Link>
            <Link
              href={featuredBlog ? `/blog/${featuredBlog.slug}` : "/sign-in"}
              className="rounded-full border border-stone-300 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-950 dark:border-stone-600 dark:bg-stone-900/40 dark:text-stone-200 dark:hover:border-stone-300"
            >
              {featuredBlog ? "Read featured story" : "Sign in"}
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white/70 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">Publishing stack</p>
              <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">MDX-first blog workflow</h2>
            </div>

            <div className="grid gap-4">
              {[
                "MDXEditor with source mode, diff mode, tables, links, and code blocks",
                "Inline image uploads saved under public/uploads/blogs",
                "Markdown blog files saved under public/content/blogs",
                "Public landing and detail pages rendered from those same files",
                "Protected admin workspace for publishing new stories",
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

      <section className="mt-14 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-stone-500 dark:text-stone-400">Published stories</p>
            <h2 className="mt-2 text-3xl font-semibold text-stone-950 dark:text-stone-50">Latest reads</h2>
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">{blogs.length} article{blogs.length === 1 ? "" : "s"}</p>
        </div>

        {featuredBlog ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <PublicBlogCard blog={featuredBlog} featured />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              {remainingBlogs.slice(0, 2).map((blog) => (
                <PublicBlogCard key={blog.slug} blog={blog} />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-black/10 bg-white/55 p-10 text-center text-sm leading-7 text-stone-600 dark:border-white/10 dark:bg-white/5 dark:text-stone-300">
            No public stories yet. Publish the first article from the admin dashboard to fill this landing page.
          </div>
        )}

        {remainingBlogs.length > 2 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {remainingBlogs.slice(2).map((blog) => (
              <PublicBlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default LandingHero