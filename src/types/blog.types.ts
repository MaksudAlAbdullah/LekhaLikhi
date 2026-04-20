import type { AppRole } from "@/types/user.types"

export type BlogStatus = "draft" | "pending" | "approved"

export interface BlogAuthorSummary {
  name: string
  email: string
  role?: AppRole
}

export interface BlogSummary {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: string | null
  status: BlogStatus
  author: BlogAuthorSummary
  createdAt: string
  updatedAt: string
  readingTimeMinutes: number
}

export interface BlogDetail extends BlogSummary {
  markdown: string
}

export interface BlogTotals {
  all: number
  approved: number
  pending: number
  draft: number
}

export interface BlogListResponse {
  blogs: BlogSummary[]
  totals: BlogTotals
  storageType: "public-folder"
}