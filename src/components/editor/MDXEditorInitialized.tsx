"use client"

import type { ForwardedRef } from "react"
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  codeBlockPlugin,
  codeMirrorPlugin,
  ConditionalContents,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  InsertCodeBlock,
  InsertFrontmatter,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  StrikeThroughSupSubToggles,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
  type MDXEditorMethods,
  type MDXEditorProps,
} from "@mdxeditor/editor"

import "@mdxeditor/editor/style.css"

interface MDXEditorInitializedProps extends MDXEditorProps {
  editorRef: ForwardedRef<MDXEditorMethods>
  diffMarkdown: string
  onImageUpload: (image: File) => Promise<string>
}

const codeBlockLanguages = {
  bash: "Bash",
  css: "CSS",
  html: "HTML",
  js: "JavaScript",
  json: "JSON",
  md: "Markdown",
  ts: "TypeScript",
  tsx: "TypeScript React",
}

const MDXEditorInitialized = ({ editorRef, diffMarkdown, onImageUpload, ...props }: MDXEditorInitializedProps) => (
  <MDXEditor
    ref={editorRef}
    className="mdx-editor-root"
    contentEditableClassName="blog-prose"
    plugins={[
      headingsPlugin(),
      quotePlugin(),
      listsPlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      tablePlugin(),
      thematicBreakPlugin(),
      frontmatterPlugin(),
      imagePlugin({
        imageUploadHandler: async (image) => onImageUpload(image),
      }),
      codeBlockPlugin({
        defaultCodeBlockLanguage: "tsx",
      }),
      codeMirrorPlugin({
        codeBlockLanguages,
      }),
      markdownShortcutPlugin(),
      diffSourcePlugin({
        diffMarkdown,
        viewMode: "rich-text",
      }),
      toolbarPlugin({
        toolbarClassName: "mdx-editor-toolbar",
        toolbarContents: () => (
          <DiffSourceToggleWrapper>
            <ConditionalContents
              options={[
                {
                  when: (editor) => editor?.editorType === "codeblock",
                  contents: () => <ChangeCodeMirrorLanguage />,
                },
                {
                  fallback: () => (
                    <>
                      <UndoRedo />
                      <BlockTypeSelect />
                      <BoldItalicUnderlineToggles />
                      <StrikeThroughSupSubToggles />
                      <CodeToggle />
                      <ListsToggle />
                      <CreateLink />
                      <InsertImage />
                      <InsertTable />
                      <InsertCodeBlock />
                      <InsertThematicBreak />
                      <InsertFrontmatter />
                    </>
                  ),
                },
              ]}
            />
          </DiffSourceToggleWrapper>
        ),
      }),
    ]}
    {...props}
  />
)

export default MDXEditorInitialized