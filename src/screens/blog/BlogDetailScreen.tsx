import { notFound } from "next/navigation"

import BlogDetailArticle from "@/components/blog/BlogDetailArticle"
import { getBlogBySlug } from "@/lib/content/blogs"

interface BlogDetailScreenProps {
  slug: string
}

const BlogDetailScreen = async ({ slug }: BlogDetailScreenProps) => {
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  return <BlogDetailArticle blog={blog} />
}

export default BlogDetailScreen