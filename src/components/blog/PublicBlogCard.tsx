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
    className="group block h-full overflow-hidden rounded-[30px] border border-teal-100 bg-white transition hover:border-teal-300 hover:bg-teal-50/30"
  >
    {blog.coverImage ? (
      <div className={`relative ${featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          sizes={featured ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 25vw, 100vw"}
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
          unoptimized
        />
      </div>
    ) : null}

    <div className={`space-y-4 ${featured ? "p-7 sm:p-8" : "p-6"}`}>
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-slate-500">
        <Badge className="border border-teal-100 bg-teal-50 text-teal-700">Published</Badge>
        <span>{formatDate(blog.createdAt)}</span>
        <span>{blog.readingTimeMinutes} min read</span>
      </div>

      <div className="space-y-3">
        <h3 className={`${featured ? "text-3xl sm:text-[2rem]" : "text-xl"} font-semibold leading-tight text-slate-950`}>
          {blog.title}
        </h3>
        <p className="text-sm leading-7 text-slate-600">{blog.excerpt}</p>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{blog.author.name}</span>
        <span className="font-medium text-teal-700 transition group-hover:text-teal-800">Read article</span>
      </div>
    </div>
  </Link>
)

export default PublicBlogCard
