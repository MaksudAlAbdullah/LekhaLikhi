"use client"

import dynamic from "next/dynamic"
import { forwardRef } from "react"

import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor"

const DynamicEditor = dynamic(() => import("@/components/editor/MDXEditorInitialized"), {
  ssr: false,
})

interface MDXBlogEditorProps extends MDXEditorProps {
  diffMarkdown: string
  onImageUpload: (image: File) => Promise<string>
}

const MDXBlogEditor = forwardRef<MDXEditorMethods, MDXBlogEditorProps>((props, ref) => (
  <DynamicEditor {...props} editorRef={ref} />
))

MDXBlogEditor.displayName = "MDXBlogEditor"

export default MDXBlogEditor