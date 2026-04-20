# Lekhalikhi

This project uses a `src/` based Next.js App Router structure with Better Auth and a public-folder blog publishing workflow.

## Stack

- Next.js 16 App Router
- Better Auth
- MDXEditor for blog writing
- File-based blog storage under `public/`
- React Hook Form + Zod
- Bun

## Run locally

```bash
bun install
bun run dev
```

## Environment variables

Copy `.env.example` to `.env.local` and set the values.

```env
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Auth routes

- `/sign-up`
- `/sign-in`
- `/dashboard`
- `/admin/dashboard`
- `/admin/blogs/write`

The auth handler is mounted at `/api/auth/[...all]`.

## Blog admin features

- Shadcn-based admin sidebar dashboard at `/admin/dashboard`
- MDXEditor-powered blog writing workspace at `/admin/blogs/write`
- Blog listing and creation API at `/api/blogs`
- Inline and cover image upload API at `/api/uploads/blog-image`
- Public landing page at `/` and blog details page at `/blog/[slug]`

Admin-authored posts are stored as markdown files in `public/content/blogs`, and uploaded images are stored in `public/uploads/blogs`.
