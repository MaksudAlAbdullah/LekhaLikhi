import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { BlogSummary } from "@/types/blog.types"

interface PublicBlogCardProps {
  blog: BlogSummary
  featured?: boolean
}

const PublicBlogCard = ({ blog, featured = false }: PublicBlogCardProps) => (
  <Link
    href={`/blog/${blog.slug}`}
    className="group block overflow-hidden rounded-[2rem] border border-black/8 bg-white/72 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-stone-950/60"
  >
    {blog.coverImage ? (
      <div className={`relative ${featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
        <Image src={blog.coverImage} alt={blog.title} fill sizes={featured ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 25vw, 100vw"} className="object-cover transition duration-300 group-hover:scale-[1.03]" unoptimized />
      </div>
    ) : null}

    <div className="space-y-4 p-6">
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">
        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300">Published</Badge>
        <span>{formatDate(blog.createdAt)}</span>
        <span>{blog.readingTimeMinutes} min read</span>
      </div>

      <div className="space-y-3">
        <h3 className={`${featured ? "text-3xl" : "text-xl"} font-semibold leading-tight text-stone-950 dark:text-stone-50`}>
          {blog.title}
        </h3>
        <p className="text-sm leading-7 text-stone-600 dark:text-stone-300">{blog.excerpt}</p>
      </div>

      <div className="flex items-center justify-between text-sm text-stone-500 dark:text-stone-400">
        <span>{blog.author.name}</span>
        <span className="font-medium text-amber-700 transition group-hover:text-amber-600 dark:text-amber-300">Read article</span>
      </div>
    </div>
  </Link>
)

export default PublicBlogCard