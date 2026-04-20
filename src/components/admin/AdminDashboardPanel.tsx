import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate, truncate } from "@/lib/utils"
import type { BlogListResponse, BlogStatus } from "@/types/blog.types"

interface AdminDashboardPanelProps {
  data?: BlogListResponse
  isLoading: boolean
  errorMessage: string | null
}

const metricCards = [
  {
    key: "all",
    label: "Total posts",
    description: "All stored articles in the admin workspace.",
  },
  {
    key: "approved",
    label: "Published",
    description: "Articles immediately visible on the public site.",
  },
  {
    key: "pending",
    label: "Pending",
    description: "Articles still waiting for editorial action.",
  },
  {
    key: "draft",
    label: "Drafts",
    description: "Posts parked before the final publish action.",
  },
] as const

const statusStyles: Record<BlogStatus, string> = {
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  draft: "bg-stone-500/15 text-stone-700 dark:text-stone-300",
}

const AdminDashboardPanel = ({ data, isLoading, errorMessage }: AdminDashboardPanelProps) => {
  if (errorMessage) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-700 dark:text-red-300">
        {errorMessage}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <Card key={card.key} className="border border-black/5 bg-white/70 dark:border-white/10 dark:bg-stone-950/70">
            <CardHeader>
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-4xl font-semibold">
                {isLoading ? <Skeleton className="h-10 w-20" /> : data?.totals[card.key] ?? 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border border-black/5 bg-white/75 dark:border-white/10 dark:bg-stone-950/75">
          <CardHeader>
            <CardDescription>Recent publishing activity</CardDescription>
            <CardTitle>Latest articles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="space-y-3 rounded-3xl border border-black/5 p-4 dark:border-white/10">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : data?.blogs.length ? (
              <div className="space-y-4">
                {data.blogs.map((blog) => (
                  <article key={blog.id} className="rounded-[1.5rem] border border-black/5 bg-stone-50/80 p-4 dark:border-white/10 dark:bg-stone-900/60">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={statusStyles[blog.status]}>{blog.status}</Badge>
                          <span className="text-xs uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">{formatDate(blog.createdAt)}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-stone-950 dark:text-stone-50">{blog.title}</h3>
                        <p className="max-w-3xl text-sm leading-7 text-stone-600 dark:text-stone-300">{truncate(blog.excerpt, 150)}</p>
                      </div>

                      <div className="text-sm text-stone-500 dark:text-stone-400">
                        <p className="font-medium text-stone-800 dark:text-stone-200">{blog.author.name}</p>
                        <p>{blog.author.email}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-black/10 p-6 text-sm leading-7 text-stone-600 dark:border-white/10 dark:text-stone-300">
                No blogs yet. Use the writer workspace to publish the first article.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-black/5 bg-white/75 dark:border-white/10 dark:bg-stone-950/75">
          <CardHeader>
            <CardDescription>Editorial actions</CardDescription>
            <CardTitle>Move faster</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-[1.75rem] bg-stone-100/80 p-5 dark:bg-stone-900/70">
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">Open the rich text writer</p>
              <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">
                Start a new article with MDXEditor, source mode, diff mode, image uploads, and automatic slug generation.
              </p>
            </div>

            <Separator />

            <div className="space-y-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
              <p>Admin-authored posts are published immediately.</p>
              <p>The dashboard data is served from markdown files stored under the repository public folder.</p>
            </div>

            <Button className="w-full" render={<Link href="/admin/blogs/write" />}>
              Go to writer
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default AdminDashboardPanel