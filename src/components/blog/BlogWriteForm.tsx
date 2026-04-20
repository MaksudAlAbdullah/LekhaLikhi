"use client"

import Image from "next/image"
import { useRef } from "react"
import { Controller, type UseFormReturn } from "react-hook-form"
import type { MDXEditorMethods } from "@mdxeditor/editor"

import MDXBlogEditor from "@/components/editor/MDXBlogEditor"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CreateBlogInput, CreateBlogValues } from "@/lib/validations/blog.schema"

interface BlogWriteFormProps {
  form: UseFormReturn<CreateBlogValues, unknown, CreateBlogInput>
  onSubmit: (values: CreateBlogInput) => Promise<void>
  isPending: boolean
  isUploadingImage: boolean
  errorMessage: string | null
  initialMarkdown: string
  onImageUpload: (image: File) => Promise<string>
}

const getFrontmatterValue = (markdown: string, key: string) => {
  const match = markdown.match(new RegExp(`^${key}:\\s*(.*)$`, "m"))

  if (!match) {
    return ""
  }

  return match[1].trim().replace(/^['\"]|['\"]$/g, "")
}

const upsertFrontmatterValue = (markdown: string, key: string, value: string) => {
  const formattedValue = JSON.stringify(value)

  if (/^---[\s\S]*?---/m.test(markdown)) {
    if (new RegExp(`^${key}:`, "m").test(markdown)) {
      return markdown.replace(new RegExp(`^${key}:\\s*.*$`, "m"), `${key}: ${formattedValue}`)
    }

    return markdown.replace(/^---\n/, `---\n${key}: ${formattedValue}\n`)
  }

  return `---\n${key}: ${formattedValue}\n---\n\n${markdown}`
}

const BlogWriteForm = ({
  form,
  onSubmit,
  isPending,
  isUploadingImage,
  errorMessage,
  initialMarkdown,
  onImageUpload,
}: BlogWriteFormProps) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = form
  const editorRef = useRef<MDXEditorMethods | null>(null)
  const markdown = watch("markdown")
  const title = getFrontmatterValue(markdown, "title")
  const excerpt = getFrontmatterValue(markdown, "excerpt")
  const coverImage = getFrontmatterValue(markdown, "coverImage")

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.[0]

    if (!image) {
      return
    }

    const url = await onImageUpload(image)
    const nextMarkdown = upsertFrontmatterValue(markdown, "coverImage", url)
    setValue("markdown", nextMarkdown, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    editorRef.current?.setMarkdown(nextMarkdown)
    event.target.value = ""
  }

  return (
    <form className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]" onSubmit={handleSubmit(onSubmit)}>
      <section className="space-y-6">
        <Card className="border border-black/5 bg-white/75 dark:border-white/10 dark:bg-stone-950/75">
          <CardHeader>
            <CardDescription>MDX workspace</CardDescription>
            <CardTitle>Demo-style markdown editor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm leading-7 text-stone-600 dark:text-stone-300">
              Edit title, excerpt, and coverImage in the frontmatter block. The toolbar includes headings, lists, tables, links, image uploads, code blocks, source mode, and diff mode.
            </p>

            <Controller
              control={control}
              name="markdown"
              render={({ field }) => (
                <MDXBlogEditor
                  ref={editorRef}
                  markdown={field.value}
                  diffMarkdown={initialMarkdown}
                  onChange={field.onChange}
                  onImageUpload={onImageUpload}
                />
              )}
            />

            {errors.markdown ? <p className="text-sm text-red-600 dark:text-red-300">{errors.markdown.message}</p> : null}
          </CardContent>
        </Card>
      </section>

      <aside className="space-y-6">
        <Card className="border border-black/5 bg-white/75 dark:border-white/10 dark:bg-stone-950/75">
          <CardHeader>
            <CardDescription>Frontmatter preview</CardDescription>
            <CardTitle>{title || "Untitled article"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[1.5rem] bg-stone-100/80 p-5 dark:bg-stone-900/70">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">Excerpt</p>
              <p className="mt-3 text-sm leading-7 text-stone-700 dark:text-stone-200">
                {excerpt || "Add title and excerpt values inside the frontmatter panel."}
              </p>
            </div>

            {coverImage ? (
              <div className="overflow-hidden rounded-[1.5rem] border border-black/8 dark:border-white/10">
                <div className="relative aspect-video">
                  <Image src={coverImage} alt={title || "Cover image"} fill sizes="(min-width: 1280px) 28vw, 100vw" className="object-cover" unoptimized />
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border border-black/5 bg-white/75 dark:border-white/10 dark:bg-stone-950/75">
          <CardHeader>
            <CardDescription>Asset storage</CardDescription>
            <CardTitle>Public folder uploads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coverUpload">Cover image</Label>
              <Input id="coverUpload" type="file" accept="image/*" onChange={handleCoverUpload} />
            </div>

            <p className="text-sm leading-7 text-stone-600 dark:text-stone-300">
              Inline images dropped into the editor and this cover upload are saved in `public/uploads/blogs`, while the article markdown is written to `public/content/blogs`.
            </p>

            {errorMessage ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                {errorMessage}
              </div>
            ) : null}

            <Button className="w-full" type="submit" disabled={isPending || isUploadingImage}>
              {isPending ? "Publishing..." : isUploadingImage ? "Uploading image..." : "Publish article"}
            </Button>
          </CardContent>
        </Card>
      </aside>
    </form>
  )
}

export default BlogWriteForm