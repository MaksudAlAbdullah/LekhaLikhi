import { ArrowRight, BookOpen, LayoutDashboard, PenTool, ShieldCheck } from "lucide-react"
import Link from "next/link"

import PublicBlogCard from "@/components/blog/PublicBlogCard"
import type { BlogSummary } from "@/types/blog.types"

interface LandingHeroProps {
  isAuthenticated: boolean
  blogs: BlogSummary[]
}

const LandingHero = ({ isAuthenticated, blogs }: LandingHeroProps) => {
  const [featuredBlog, ...remainingBlogs] = blogs
  const totalReadingMinutes = blogs.reduce((sum, blog) => sum + blog.readingTimeMinutes, 0)

  const heroStats = [
    {
      value: blogs.length.toString().padStart(2, "0"),
      label: "Published stories",
      helper: "Public articles available right now",
    },
    {
      value: `${totalReadingMinutes}m`,
      label: "Estimated reading",
      helper: "Combined reading time across the library",
    },
    {
      value: isAuthenticated ? "Ready" : "Open",
      label: "Publishing flow",
      helper: isAuthenticated ? "Jump back into your workspace anytime" : "Create an account and start publishing",
    },
  ]

  const workflowItems = [
    {
      icon: PenTool,
      title: "Draft comfortably",
      description: "Write in a clean MDX workflow with familiar tools and minimal clutter.",
    },
    {
      icon: ShieldCheck,
      title: "Review with control",
      description: "Keep publishing structured through a simple admin and moderation flow.",
    },
    {
      icon: BookOpen,
      title: "Read with focus",
      description: "Give readers a calm, legible interface built for long-form storytelling.",
    },
  ]

  return (
    <main className="min-h-screen bg-[#f4fbfa]">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8 lg:py-8">
        <header className="flex flex-col gap-4 rounded-[28px] border border-teal-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-teal-600 text-sm font-semibold text-white">
              LL
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">LekhaLikhi</p>
              <p className="text-sm text-slate-600">Minimal publishing workspace for Bengali stories.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#stories"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-teal-700"
            >
              Latest stories
            </a>
            <Link
              href={isAuthenticated ? "/dashboard" : "/sign-in"}
              className="rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-teal-800 transition hover:border-teal-300 hover:bg-teal-50"
            >
              {isAuthenticated ? "Reader dashboard" : "Sign in"}
            </Link>
            <Link
              href={isAuthenticated ? "/admin/dashboard" : "/sign-up"}
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              {isAuthenticated ? "Open admin" : "Create account"}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[32px] border border-teal-100 bg-white p-8 lg:p-10">
            <div className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
              Minimal flat design
            </div>

            <div className="mt-6 max-w-3xl space-y-5">
              <h1 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Write, review, and publish stories in a calm editorial workflow.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                LekhaLikhi keeps the public experience simple while giving authors and admins a clean path from draft to published article.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={isAuthenticated ? "/admin/dashboard" : "/sign-up"}
                className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                {isAuthenticated ? "Go to admin workspace" : "Start publishing"}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={featuredBlog ? `/blog/${featuredBlog.slug}` : "/sign-in"}
                className="rounded-full border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
              >
                {featuredBlog ? "Read featured story" : "Sign in to continue"}
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {heroStats.map((item) => (
                <div key={item.label} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-2xl font-semibold text-slate-950">{item.value}</p>
                  <p className="mt-2 text-sm font-medium text-slate-700">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{item.helper}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[32px] bg-teal-600 p-8 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-100">Editorial flow</p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight">
                    A familiar UI for readers and a simple workspace for authors.
                  </h2>
                </div>
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/12">
                  <LayoutDashboard className="size-5" />
                </div>
              </div>

              <div className="mt-8 grid gap-3">
                <div className="rounded-[24px] bg-white/10 p-4">
                  <p className="text-sm font-semibold">Public-facing reading surface</p>
                  <p className="mt-1 text-sm leading-6 text-teal-50/90">
                    Readers land on a distraction-free home page with featured and recent stories.
                  </p>
                </div>
                <div className="rounded-[24px] bg-teal-700 p-4">
                  <p className="text-sm font-semibold">Structured publishing workspace</p>
                  <p className="mt-1 text-sm leading-6 text-teal-50/90">
                    Writers can move from draft to published content without leaving the same product.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-teal-100 bg-[#eef8f7] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">How it works</p>
              <div className="mt-5 space-y-4">
                {workflowItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <div key={item.title} className="flex gap-4 rounded-[24px] bg-white p-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="stories" className="mt-12 scroll-mt-24 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">Published stories</p>
              <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Latest reads from the library</h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-600">
                Featured content appears first, followed by the newest stories in a clean, easy-to-scan layout.
              </p>
            </div>
            <div className="rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
              {blogs.length} article{blogs.length === 1 ? "" : "s"} published
            </div>
          </div>

          {featuredBlog ? (
            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <PublicBlogCard blog={featuredBlog} featured />
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
                {remainingBlogs.slice(0, 2).map((blog) => (
                  <PublicBlogCard key={blog.slug} blog={blog} />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-[32px] border border-dashed border-teal-200 bg-white px-8 py-14 text-center">
              <h3 className="text-2xl font-semibold text-slate-950">Nothing published yet</h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Publish the first article from the admin dashboard and it will appear here as the featured story.
              </p>
              <div className="mt-6">
                <Link
                  href={isAuthenticated ? "/admin/dashboard" : "/sign-up"}
                  className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  {isAuthenticated ? "Open admin dashboard" : "Create an account"}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
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
      </div>
    </main>
  )
}

export default LandingHero
