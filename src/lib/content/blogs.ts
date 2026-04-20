import { mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"

import matter from "gray-matter"

import { storedBlogFrontmatterSchema } from "@/lib/validations/blog.schema"
import { generateSlug } from "@/lib/utils"
import type { BlogDetail, BlogListResponse, BlogSummary, BlogTotals } from "@/types/blog.types"

export const BLOGS_DIRECTORY = path.join(process.cwd(), "public", "content", "blogs")
export const BLOG_IMAGES_DIRECTORY = path.join(process.cwd(), "public", "uploads", "blogs")

const calculateReadingTime = (markdown: string) => {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#>*_~|-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.ceil(words / 200))
}

const buildBlogSummary = (slug: string, markdown: string): BlogDetail => {
  const parsed = matter(markdown)
  const frontmatter = storedBlogFrontmatterSchema.parse(parsed.data)

  return {
    id: slug,
    slug,
    title: frontmatter.title,
    excerpt: frontmatter.excerpt,
    coverImage: frontmatter.coverImage ?? null,
    status: "approved",
    author: {
      name: frontmatter.authorName,
      email: frontmatter.authorEmail,
    },
    createdAt: frontmatter.publishedAt,
    updatedAt: frontmatter.updatedAt,
    markdown: parsed.content.trim(),
    readingTimeMinutes: calculateReadingTime(parsed.content),
  }
}

const isMarkdownFile = (fileName: string) => /\.mdx?$/i.test(fileName)

export const ensureBlogStorage = async () => {
  await Promise.all([
    mkdir(BLOGS_DIRECTORY, { recursive: true }),
    mkdir(BLOG_IMAGES_DIRECTORY, { recursive: true }),
  ])
}

export const resolveUniqueBlogSlug = async (title: string) => {
  await ensureBlogStorage()

  const files = await readdir(BLOGS_DIRECTORY)
  const takenSlugs = new Set(files.filter(isMarkdownFile).map((fileName) => fileName.replace(/\.mdx?$/i, "")))
  const baseSlug = generateSlug(title) || `blog-${Date.now()}`

  if (!takenSlugs.has(baseSlug)) {
    return baseSlug
  }

  let suffix = 2
  let candidate = `${baseSlug}-${suffix}`

  while (takenSlugs.has(candidate)) {
    suffix += 1
    candidate = `${baseSlug}-${suffix}`
  }

  return candidate
}

export const writeBlogFile = async ({
  slug,
  title,
  excerpt,
  coverImage,
  content,
  authorName,
  authorEmail,
}: {
  slug: string
  title: string
  excerpt: string
  coverImage?: string
  content: string
  authorName: string
  authorEmail: string
}) => {
  await ensureBlogStorage()

  const timestamp = new Date().toISOString()
  const fileContent = matter.stringify(content.trim(), {
    title,
    excerpt,
    coverImage,
    slug,
    authorName,
    authorEmail,
    publishedAt: timestamp,
    updatedAt: timestamp,
    status: "approved",
  })

  const filePath = path.join(BLOGS_DIRECTORY, `${slug}.mdx`)
  await writeFile(filePath, `${fileContent.trim()}\n`, "utf8")

  return getBlogBySlug(slug)
}

export const getBlogBySlug = async (slug: string) => {
  await ensureBlogStorage()

  try {
    const filePath = path.join(BLOGS_DIRECTORY, `${slug}.mdx`)
    const markdown = await readFile(filePath, "utf8")
    return buildBlogSummary(slug, markdown)
  } catch {
    return null
  }
}

export const listBlogs = async (): Promise<BlogSummary[]> => {
  await ensureBlogStorage()

  const fileNames = (await readdir(BLOGS_DIRECTORY)).filter(isMarkdownFile)
  const blogs = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.mdx?$/i, "")
      const markdown = await readFile(path.join(BLOGS_DIRECTORY, fileName), "utf8")
      return buildBlogSummary(slug, markdown)
    })
  )

  return blogs.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
}

export const getBlogListResponse = async (): Promise<BlogListResponse> => {
  const blogs = await listBlogs()
  const totals: BlogTotals = {
    all: blogs.length,
    approved: blogs.length,
    pending: 0,
    draft: 0,
  }

  return {
    blogs,
    totals,
    storageType: "public-folder",
  }
}