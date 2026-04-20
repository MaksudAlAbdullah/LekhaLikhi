import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")

export const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date))

export const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
