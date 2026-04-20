import { NextResponse, type NextRequest } from "next/server"

import matter from "gray-matter"

import { auth } from "@/lib/auth/auth"
import { getBlogListResponse, resolveUniqueBlogSlug, writeBlogFile } from "@/lib/content/blogs"
import { createBlogSchema } from "@/lib/validations/blog.schema"

export const GET = async () => NextResponse.json(await getBlogListResponse())

export const POST = async (request: NextRequest) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!["admin", "writer"].includes(String(session.user.role))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const parsed = createBlogSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid blog payload" }, { status: 422 })
  }

  const parsedMarkdown = matter(parsed.data.markdown)
  const coverImage =
    typeof parsedMarkdown.data.coverImage === "string" && parsedMarkdown.data.coverImage.trim().length
      ? parsedMarkdown.data.coverImage.trim()
      : undefined
  const slug = await resolveUniqueBlogSlug(String(parsedMarkdown.data.title ?? "untitled"))
  const blog = await writeBlogFile({
    slug,
    title: String(parsedMarkdown.data.title ?? "Untitled"),
    excerpt: String(parsedMarkdown.data.excerpt ?? ""),
    coverImage,
    content: parsedMarkdown.content,
    authorName: session.user.name,
    authorEmail: session.user.email,
  })

  if (!blog) {
    return NextResponse.json({ error: "Unable to save blog content" }, { status: 500 })
  }

  return NextResponse.json(blog, { status: 201 })
}