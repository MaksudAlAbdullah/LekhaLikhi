import mongoose, { Schema, type Document } from "mongoose"

import type { BlogStatus } from "@/types/blog.types"
import type { AppRole } from "@/types/user.types"

interface IBlogAuthor {
  id: string
  name: string
  email: string
  role: AppRole
}

export interface IBlog extends Document {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  status: BlogStatus
  author: IBlogAuthor
  createdAt: Date
  updatedAt: Date
}

const BlogAuthorSchema = new Schema<IBlogAuthor>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "writer", "user"],
      required: true,
    },
  },
  {
    _id: false,
  }
)

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 280 },
    content: { type: String, required: true },
    coverImage: { type: String },
    status: {
      type: String,
      enum: ["draft", "pending", "approved"],
      default: "pending",
    },
    author: { type: BlogAuthorSchema, required: true },
  },
  {
    timestamps: true,
  }
)

BlogSchema.index({ slug: 1 }, { unique: true })
BlogSchema.index({ status: 1, createdAt: -1 })
BlogSchema.index({ "author.id": 1, createdAt: -1 })

export const Blog = mongoose.models.Blog ?? mongoose.model<IBlog>("Blog", BlogSchema)