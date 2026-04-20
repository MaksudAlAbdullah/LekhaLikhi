import Image from "next/image"
import Link from "next/link"

import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import type { BlogDetail } from "@/types/blog.types"

interface BlogDetailArticleProps {
  blog: BlogDetail
}

const BlogDetailArticle = ({ blog }: BlogDetailArticleProps) => (
  <main className="mx-auto max-w-5xl px-6 py-12 lg:py-16">
    <div className="space-y-8">
      <Button variant="outline" render={<Link href="/" />}>
        Back to home
      </Button>

      <header className="space-y-6">
        <div className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-700 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-stone-200">
          {blog.readingTimeMinutes} min read
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">Lekhalikhi</p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-stone-950 dark:text-stone-50 sm:text-5xl lg:text-6xl">
            {blog.title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-stone-600 dark:text-stone-300">{blog.excerpt}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
          <span className="font-medium text-stone-800 dark:text-stone-200">{blog.author.name}</span>
          <span>{blog.author.email}</span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>
      </header>

      {blog.coverImage ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-black/8 dark:border-white/10">
          <Image src={blog.coverImage} alt={blog.title} fill sizes="(min-width: 1280px) 80vw, 100vw" className="object-cover" unoptimized />
        </div>
      ) : null}

      <article className="rounded-[2rem] border border-black/8 bg-white/72 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur lg:p-10 dark:border-white/10 dark:bg-stone-950/60">
        <div className="blog-prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {blog.markdown}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  </main>
)

export default BlogDetailArticle