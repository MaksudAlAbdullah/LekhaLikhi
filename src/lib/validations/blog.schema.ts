import matter from "gray-matter"
import { z } from "zod"

const optionalUrlField = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value
    }

    const normalizedValue = value.trim()
    return normalizedValue.length ? normalizedValue : undefined
  },
  z.url("Cover image must be a valid uploaded image URL").optional()
)

const editorFrontmatterSchema = z.object({
  title: z.string().trim().min(5, "Add a title in the frontmatter block").max(150),
  excerpt: z.string().trim().min(20, "Add an excerpt in the frontmatter block").max(280),
  coverImage: optionalUrlField,
})

export const storedBlogFrontmatterSchema = editorFrontmatterSchema.extend({
  slug: z.string().min(1),
  authorName: z.string().min(1),
  authorEmail: z.email(),
  publishedAt: z.string().min(1),
  updatedAt: z.string().min(1),
  status: z.enum(["approved"]),
})

const getMarkdownPlainText = (value: string) =>
  value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]+\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~|-]/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

export const createBlogSchema = z.object({
  markdown: z.string().min(1, "Write something before publishing").superRefine((value, ctx) => {
    const parsed = matter(value)
    const frontmatter = editorFrontmatterSchema.safeParse(parsed.data)

    if (!frontmatter.success) {
      frontmatter.error.issues.forEach((issue) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: issue.message,
          path: [issue.path.join(".")],
        })
      })
    }

    if (getMarkdownPlainText(parsed.content).length < 50) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Write at least 50 readable characters in the article body",
      })
    }
  }),
})

export type CreateBlogValues = z.input<typeof createBlogSchema>
export type CreateBlogInput = z.output<typeof createBlogSchema>
export type BlogEditorFrontmatterInput = z.infer<typeof editorFrontmatterSchema>