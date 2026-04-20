import BlogDetailScreen from "@/screens/blog/BlogDetailScreen"

const BlogDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params

  return <BlogDetailScreen slug={slug} />
}

export default BlogDetailPage