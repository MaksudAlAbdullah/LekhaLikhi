import type { CreateBlogInput } from "@/lib/validations/blog.schema"
import type { BlogListResponse, BlogSummary } from "@/types/blog.types"

const parseErrorResponse = async (response: Response) => {
  const fallbackMessage = response.status >= 500 ? "Server error while processing the blog request" : "Unable to process the blog request"

  try {
    const payload = (await response.json()) as { error?: string }
    return payload.error ?? fallbackMessage
  } catch {
    return fallbackMessage
  }
}

export const blogsApi = {
  getAll: async (): Promise<BlogListResponse> => {
    const response = await fetch("/api/blogs", {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(await parseErrorResponse(response))
    }

    return response.json()
  },
  create: async (payload: CreateBlogInput): Promise<BlogSummary> => {
    const response = await fetch("/api/blogs", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(await parseErrorResponse(response))
    }

    return response.json()
  },
  uploadImage: async (image: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append("image", image)

    const response = await fetch("/api/uploads/blog-image", {
      method: "POST",
      credentials: "include",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(await parseErrorResponse(response))
    }

    return response.json()
  },
}