"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import AdminShell from "@/components/admin/AdminShell"
import BlogWriteForm from "@/components/blog/BlogWriteForm"
import { useCreateBlog, useUploadBlogImage } from "@/hooks/useBlogs"
import { authClient, useSession } from "@/lib/auth/auth-client"
import { createBlogSchema, type CreateBlogInput, type CreateBlogValues } from "@/lib/validations/blog.schema"
import type { SessionUserSummary } from "@/types/user.types"

const initialMarkdown = `---
title: ""
excerpt: ""
coverImage: ""
---

# Start with a strong headline

Lead with a sharp opening paragraph. Then use headings, tables, code blocks, images, quotes, source mode, and diff mode to shape the article.
`

const BlogWriteScreen = () => {
  const router = useRouter()
  const [isSigningOut, startSigningOut] = useTransition()
  const { data: session, isPending: isSessionPending } = useSession()
  const sessionUser = session?.user as
    | {
        id: string
        name: string
        email: string
        role?: string
      }
    | undefined
  const sessionRole = sessionUser?.role ?? "user"
  const form = useForm<CreateBlogValues, unknown, CreateBlogInput>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      markdown: initialMarkdown,
    },
  })
  const createBlog = useCreateBlog()
  const uploadBlogImage = useUploadBlogImage()

  useEffect(() => {
    if (isSessionPending) {
      return
    }

    if (!session) {
      router.replace("/sign-in?callbackUrl=/admin/blogs/write")
      return
    }

    if (sessionRole !== "admin") {
      router.replace("/dashboard")
    }
  }, [isSessionPending, router, session, sessionRole])

  const handleSignOut = () => {
    startSigningOut(async () => {
      await authClient.signOut()
      router.push("/sign-in")
      router.refresh()
    })
  }

  const handleSubmit = async (values: CreateBlogInput) => {
    await createBlog.mutateAsync(values)
    form.reset({
      markdown: initialMarkdown,
    })
    router.push("/admin/dashboard")
    router.refresh()
  }

  const handleImageUpload = async (image: File) => {
    const response = await uploadBlogImage.mutateAsync(image)
    return response.url
  }

  if (!session || !sessionUser || sessionRole !== "admin") {
    return null
  }

  const user: SessionUserSummary = {
    id: sessionUser.id,
    name: sessionUser.name,
    email: sessionUser.email,
    role: "admin",
  }

  return (
    <AdminShell
      user={user}
      title="Write a blog post"
      description="Draft richly formatted stories, add a hero image, and publish instantly as an admin-approved article."
      onSignOut={handleSignOut}
      isSigningOut={isSigningOut}
    >
      <BlogWriteForm
        form={form}
        onSubmit={handleSubmit}
        isPending={createBlog.isPending}
        isUploadingImage={uploadBlogImage.isPending}
        errorMessage={
          createBlog.error instanceof Error
            ? createBlog.error.message
            : uploadBlogImage.error instanceof Error
              ? uploadBlogImage.error.message
              : null
        }
        initialMarkdown={initialMarkdown}
        onImageUpload={handleImageUpload}
      />
    </AdminShell>
  )
}

export default BlogWriteScreen