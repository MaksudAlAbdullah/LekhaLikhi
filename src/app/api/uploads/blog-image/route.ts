import { writeFile } from "node:fs/promises"
import path from "node:path"

import { NextResponse, type NextRequest } from "next/server"

import { auth } from "@/lib/auth/auth"
import { BLOG_IMAGES_DIRECTORY, ensureBlogStorage } from "@/lib/content/blogs"

const getFileExtension = (file: File) => {
  const nameExtension = file.name.split(".").pop()?.toLowerCase()

  if (nameExtension) {
    return nameExtension
  }

  if (file.type === "image/png") {
    return "png"
  }

  if (file.type === "image/webp") {
    return "webp"
  }

  if (file.type === "image/gif") {
    return "gif"
  }

  return "jpg"
}

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

  const formData = await request.formData()
  const image = formData.get("image")

  if (!(image instanceof File)) {
    return NextResponse.json({ error: "Image file is required" }, { status: 422 })
  }

  if (!image.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 422 })
  }

  if (image.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be smaller than 10MB" }, { status: 422 })
  }

  await ensureBlogStorage()

  const extension = getFileExtension(image)
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`
  const filePath = path.join(BLOG_IMAGES_DIRECTORY, fileName)
  const buffer = Buffer.from(await image.arrayBuffer())

  await writeFile(filePath, buffer)

  return NextResponse.json({
    url: `/uploads/blogs/${fileName}`,
  })
}