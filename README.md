# Lekhalikhi

This project now uses a `src/` based Next.js App Router structure with Better Auth and MongoDB.

## Stack

- Next.js 16 App Router
- Better Auth
- MongoDB via Mongoose
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

The auth handler is mounted at `/api/auth/[...all]`.
