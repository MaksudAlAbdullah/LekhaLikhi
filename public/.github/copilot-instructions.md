# GitHub Copilot Instructions — Blog Web App (Monorepo)

> Place this file at `.github/copilot-instructions.md` in the root of your repository.
> Copilot will automatically pick it up and use it as persistent context for every suggestion.

---

## Project Overview

A full-stack blog platform with **role-based access control**, built as a **Next.js monorepo**.
Roles: `admin` | `writer` | `user` (public reader).
Writers submit posts → Admin approves → Post goes live.

---

## Tech Stack (Non-Negotiable)

| Layer | Library / Tool |
|---|---|
| Runtime / Package Manager | **Bun** (replaces Node + npm/yarn entirely) |
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Forms | React Hook Form + Zod |
| Rich Text Editor | Quill (react-quill-new) |
| State Management | Redux Toolkit |
| Data Fetching | TanStack Query v5 |
| Database | MongoDB (via Mongoose) |
| Auth | Better Auth |
| API Layer | Next.js Route Handlers (`src/app/api/`) |
| Validation | Zod (shared schemas in `src/lib/validations/`) |

---

## Bun Rules

- **Always use `bun` CLI** — never `npm`, `npx`, or `yarn`.
- Package installation → `bun add <pkg>`
- Dev dependency → `bun add -d <pkg>`
- Run scripts → `bun run dev`, `bun run build`, `bun run lint`
- One-off execution → `bunx shadcn@latest add button`
- Lock file is `bun.lockb` — never commit `package-lock.json` or `yarn.lock`
- `bun.lockb` must be committed to version control

```bash
# Project bootstrap
bunx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
bun add mongoose better-auth @tanstack/react-query redux @reduxjs/toolkit react-hook-form zod @hookform/resolvers react-quill-new
bun add -d @types/mongoose
bunx shadcn@latest init
```

---

## Arrow Function Rule (Non-Negotiable)

**Every function in this project must be an arrow function.**
The `function` keyword is **banned** everywhere — components, hooks, API handlers, utilities, callbacks.

```tsx
// ✅ CORRECT — Arrow function component (default export)
const BlogListScreen = () => {
  const { data } = useBlogs();
  return <BlogGrid blogs={data?.blogs} />;
};
export default BlogListScreen;

// ✅ CORRECT — Arrow function component (named export)
export const BlogCard = ({ blog }: BlogCardProps) => {
  return <div className="rounded-xl border p-4">{blog.title}</div>;
};

// ✅ CORRECT — Arrow function hook
export const useBlogs = (params: BlogQueryParams) =>
  useQuery({
    queryKey: blogKeys.list(params),
    queryFn: () => blogsApi.getAll(params),
  });

// ✅ CORRECT — Arrow API route handler
export const GET = async (req: NextRequest) => {
  await connectDB();
  // ...
};

// ✅ CORRECT — Arrow utility
export const generateSlug = (title: string): string =>
  title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

// ❌ BANNED — function keyword anywhere
export default function BlogListScreen() {}   // NEVER
export function BlogCard() {}                 // NEVER
export async function GET(req) {}             // NEVER
function generateSlug(title: string) {}       // NEVER
```

---

## Project Structure

```
root/
├── .github/
│   └── copilot-instructions.md              ← THIS FILE
├── src/                                     ← ALL code lives inside src/
│   ├── app/                                 ← Next.js App Router (routing only)
│   │   ├── (public)/
│   │   │   ├── page.tsx                     → <LandingScreen />
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx                 → <BlogListScreen />
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx             → <BlogDetailScreen />
│   │   │   ├── category/
│   │   │   │   └── [slug]/page.tsx          → <CategoryScreen />
│   │   │   ├── tag/
│   │   │   │   └── [slug]/page.tsx          → <TagScreen />
│   │   │   └── author/
│   │   │       └── [username]/page.tsx      → <AuthorScreen />
│   │   ├── (auth)/
│   │   │   ├── sign-in/page.tsx             → <SignInScreen />
│   │   │   └── sign-up/page.tsx             → <SignUpScreen />
│   │   ├── (protected)/
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/page.tsx       → <AdminDashboardScreen />
│   │   │   │   ├── approvals/page.tsx       → <ApprovalScreen />
│   │   │   │   ├── blogs/page.tsx           → <AdminBlogListScreen />
│   │   │   │   ├── blogs/write/page.tsx     → <BlogWriteScreen />
│   │   │   │   ├── blogs/[id]/edit/page.tsx → <BlogEditScreen />
│   │   │   │   ├── categories/page.tsx      → <AdminCategoryScreen />
│   │   │   │   └── tags/page.tsx            → <AdminTagScreen />
│   │   │   ├── writer/
│   │   │   │   ├── dashboard/page.tsx       → <WriterDashboardScreen />
│   │   │   │   ├── posts/page.tsx           → <WriterPostListScreen />
│   │   │   │   └── posts/write/page.tsx     → <BlogWriteScreen />
│   │   │   └── user/
│   │   │       └── dashboard/page.tsx       → <UserDashboardScreen />
│   │   ├── api/
│   │   │   ├── auth/[...all]/route.ts       ← Better Auth handler
│   │   │   ├── blogs/
│   │   │   │   ├── route.ts                 ← GET (list), POST (create)
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts             ← GET, PATCH, DELETE
│   │   │   │       └── approve/route.ts     ← PATCH (admin only)
│   │   │   ├── categories/route.ts
│   │   │   ├── tags/route.ts
│   │   │   ├── comments/route.ts
│   │   │   ├── bookmarks/route.ts
│   │   │   └── users/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── middleware.ts                        ← Route protection (inside src/, NOT root)
│   │
│   ├── screens/                            ← ALL business logic lives here
│   │   ├── landing/LandingScreen.tsx
│   │   ├── blog/
│   │   │   ├── BlogListScreen.tsx
│   │   │   └── BlogDetailScreen.tsx
│   │   ├── category/CategoryScreen.tsx
│   │   ├── tag/TagScreen.tsx
│   │   ├── author/AuthorScreen.tsx
│   │   ├── auth/
│   │   │   ├── SignInScreen.tsx
│   │   │   └── SignUpScreen.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboardScreen.tsx
│   │   │   ├── ApprovalScreen.tsx
│   │   │   ├── AdminBlogListScreen.tsx
│   │   │   ├── BlogWriteScreen.tsx
│   │   │   ├── AdminCategoryScreen.tsx
│   │   │   └── AdminTagScreen.tsx
│   │   ├── writer/
│   │   │   ├── WriterDashboardScreen.tsx
│   │   │   └── WriterPostListScreen.tsx
│   │   └── user/UserDashboardScreen.tsx
│   │
│   ├── components/                         ← Reusable UI (no business logic)
│   │   ├── blog/
│   │   │   ├── BlogCard.tsx
│   │   │   ├── BlogGrid.tsx
│   │   │   ├── BlogList.tsx
│   │   │   ├── BlogSearchBar.tsx
│   │   │   ├── BlogFilterPanel.tsx
│   │   │   ├── BlogViewToggle.tsx
│   │   │   └── BlogStatusBadge.tsx
│   │   ├── editor/QuillEditor.tsx          ← dynamic import, SSR disabled
│   │   ├── auth/
│   │   │   ├── SignInForm.tsx
│   │   │   ├── SignUpForm.tsx
│   │   │   └── RoleGuard.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── AdminLayout.tsx
│   │   ├── category/
│   │   │   ├── CategoryCard.tsx
│   │   │   └── CategoryForm.tsx
│   │   ├── tag/
│   │   │   ├── TagBadge.tsx
│   │   │   └── TagForm.tsx
│   │   ├── comment/
│   │   │   ├── CommentList.tsx
│   │   │   └── CommentForm.tsx
│   │   └── ui/                            ← shadcn/ui auto-generated components
│   │
│   ├── lib/
│   │   ├── db/mongoose.ts                 ← MongoDB connection singleton
│   │   ├── auth/auth.ts                   ← Better Auth config
│   │   ├── validations/
│   │   │   ├── blog.schema.ts
│   │   │   ├── auth.schema.ts
│   │   │   ├── category.schema.ts
│   │   │   └── tag.schema.ts
│   │   ├── api/
│   │   │   ├── blogs.api.ts
│   │   │   ├── categories.api.ts
│   │   │   ├── tags.api.ts
│   │   │   └── users.api.ts
│   │   └── utils.ts
│   │
│   ├── models/
│   │   ├── Blog.model.ts
│   │   ├── User.model.ts
│   │   ├── Category.model.ts
│   │   ├── Tag.model.ts
│   │   ├── Comment.model.ts
│   │   └── Bookmark.model.ts
│   │
│   ├── store/
│   │   ├── index.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   │       ├── uiSlice.ts
│   │       ├── filterSlice.ts
│   │       └── authSlice.ts
│   │
│   ├── hooks/
│   │   ├── useBlogs.ts
│   │   ├── useAuth.ts
│   │   ├── useBookmark.ts
│   │   └── useDebounce.ts
│   │
│   └── types/
│       ├── blog.types.ts
│       ├── user.types.ts
│       └── api.types.ts
│
├── public/
├── .env.local
├── bun.lockb                              ← Bun lock file (commit this)
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Strict Architectural Rules

### 1. Page Files (`src/app/**/page.tsx`)
- **Only** import and return the matching Screen component.
- Zero business logic, zero API calls, zero state.
- Must use **arrow function** as default export.

```tsx
// ✅ Correct — src/app/(public)/blog/page.tsx
import BlogListScreen from "@/screens/blog/BlogListScreen";

const BlogPage = () => <BlogListScreen />;

export default BlogPage;

// ❌ Wrong — function keyword banned
export default function BlogPage() { return <BlogListScreen />; }

// ❌ Wrong — no logic in page files
const BlogPage = () => {
  const [data, setData] = useState(...);   // NEVER
  return <div />;
};
```

### 2. Screen Files (`src/screens/**/*.tsx`)
- All business logic: TanStack Query, Redux dispatch, form state.
- Compose feature components from `src/components/`.
- **No** Tailwind classes — delegate to components.
- Must use **arrow function** as default export.

```tsx
// ✅ Correct — src/screens/blog/BlogListScreen.tsx
"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useBlogs } from "@/hooks/useBlogs";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { BlogSearchBar } from "@/components/blog/BlogSearchBar";
import { BlogFilterPanel } from "@/components/blog/BlogFilterPanel";

const BlogListScreen = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filter);
  const { data, isLoading } = useBlogs(filters);

  return (
    <div>
      <BlogSearchBar />
      <BlogFilterPanel />
      {isLoading ? <BlogSkeleton /> : <BlogGrid blogs={data?.blogs} />}
    </div>
  );
};

export default BlogListScreen;
```

### 3. Component Files (`src/components/**/*.tsx`)
- Pure presentation — props in, UI out.
- Local UI state (hover, open/close) is fine; no API calls.
- All Tailwind + shadcn classes live here.
- Must use **arrow function**.

```tsx
// ✅ Correct — src/components/blog/BlogCard.tsx
import { IBlog } from "@/types/blog.types";

interface BlogCardProps {
  blog: IBlog;
}

export const BlogCard = ({ blog }: BlogCardProps) => (
  <div className="rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow">
    <h2 className="text-lg font-semibold">{blog.title}</h2>
    <p className="text-muted-foreground text-sm">{blog.excerpt}</p>
  </div>
);
```

---

## Role-Based Access Control

### Roles & Permissions

| Feature | `user` | `writer` | `admin` |
|---|:---:|:---:|:---:|
| Read public blogs | ✅ | ✅ | ✅ |
| Bookmark / Comment | ✅ | ✅ | ✅ |
| Submit new post | ❌ | ✅ | ✅ |
| Edit own post | ❌ | ✅ | ✅ |
| Approve / Reject post | ❌ | ❌ | ✅ |
| Manage categories/tags | ❌ | ❌ | ✅ |
| Delete any post | ❌ | ❌ | ✅ |
| Access `/admin/*` | ❌ | ❌ | ✅ |
| Access `/writer/*` | ❌ | ✅ | ✅ |

### Middleware — `src/middleware.ts`

```ts
// src/middleware.ts  ← inside src/, NOT at project root
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

const ROLE_ROUTES: Record<string, string[]> = {
  "/admin": ["admin"],
  "/writer": ["admin", "writer"],
  "/user": ["admin", "writer", "user"],
};

export const middleware = async (req: NextRequest) => {
  const session = await auth.api.getSession({ headers: req.headers });
  const { pathname } = req.nextUrl;

  for (const [prefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(prefix)) {
      if (!session) return NextResponse.redirect(new URL("/sign-in", req.url));
      if (!allowedRoles.includes(session.user.role as string)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/admin/:path*", "/writer/:path*", "/user/:path*", "/api/blogs/:path*"],
};
```

### RoleGuard Component

```tsx
// src/components/auth/RoleGuard.tsx
"use client";
import { redirect } from "next/navigation";
import { useSession } from "@/hooks/useAuth";

type Role = "admin" | "writer" | "user";

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard = ({ allowedRoles, children, fallback }: RoleGuardProps) => {
  const { session, isLoading } = useSession();

  if (isLoading) return <LoadingSpinner />;
  if (!session || !allowedRoles.includes(session.user.role as Role)) {
    return fallback ?? redirect("/");
  }

  return <>{children}</>;
};
```

---

## Better Auth Configuration

```ts
// src/lib/auth/auth.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectDB } from "@/lib/db/mongoose";

export const auth = betterAuth({
  database: mongodbAdapter(await connectDB()),
  emailAndPassword: { enabled: true },
  session: { cookieCache: { enabled: true, maxAge: 60 * 5 } },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,                    // role is server-assigned only — never from client
      },
    },
  },
});
```

```ts
// src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

---

## MongoDB Connection Singleton

```ts
// src/lib/db/mongoose.ts
import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async (): Promise<typeof mongoose> => {
  if (isConnected) return mongoose;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined");
  await mongoose.connect(uri);
  isConnected = true;
  return mongoose;
};
```

---

## Mongoose Models

```ts
// src/models/Blog.model.ts
import mongoose, { Schema, Document } from "mongoose";

export type BlogStatus = "draft" | "pending" | "approved" | "rejected";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;               // Quill HTML output
  excerpt: string;
  coverImage?: string;
  author: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  status: BlogStatus;
  rejectionReason?: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    coverImage: String,
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: String,
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BlogSchema.index({ status: 1, createdAt: -1 });
BlogSchema.index({ slug: 1 });
BlogSchema.index({ category: 1, status: 1 });
BlogSchema.index({ tags: 1, status: 1 });

export const Blog =
  mongoose.models.Blog ?? mongoose.model<IBlog>("Blog", BlogSchema);
```

---

## Zod Validation Schemas

```ts
// src/lib/validations/blog.schema.ts
import { z } from "zod";

export const CreateBlogSchema = z.object({
  title: z.string().min(5).max(150),
  content: z.string().min(50),
  excerpt: z.string().min(10).max(300),
  coverImage: z.string().url().optional(),
  categoryId: z.string().min(1, "Category is required"),
  tagIds: z.array(z.string()).max(10).optional(),
});

export const ApproveBlogSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  rejectionReason: z.string().optional(),
});

export const SignUpSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type CreateBlogInput = z.infer<typeof CreateBlogSchema>;
export type ApproveBlogInput = z.infer<typeof ApproveBlogSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
```

---

## TanStack Query — API Layer & Hooks

```ts
// src/lib/api/blogs.api.ts
import type { BlogQueryParams, BlogListResponse, CreateBlogInput, ApproveBlogInput } from "@/types/blog.types";

export const blogsApi = {
  getAll: async (params: BlogQueryParams): Promise<BlogListResponse> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`/api/blogs?${query}`);
    if (!res.ok) throw new Error("Failed to fetch blogs");
    return res.json();
  },

  getBySlug: async (slug: string) => {
    const res = await fetch(`/api/blogs/${slug}`);
    if (!res.ok) throw new Error("Blog not found");
    return res.json();
  },

  create: async (data: CreateBlogInput) => {
    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create blog");
    return res.json();
  },

  approve: async ({ id, ...data }: { id: string } & ApproveBlogInput) => {
    const res = await fetch(`/api/blogs/${id}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update blog status");
    return res.json();
  },
};
```

```ts
// src/hooks/useBlogs.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogsApi } from "@/lib/api/blogs.api";
import type { BlogQueryParams, CreateBlogInput, ApproveBlogInput } from "@/types/blog.types";

export const blogKeys = {
  all: ["blogs"] as const,
  list: (params: BlogQueryParams) => [...blogKeys.all, "list", params] as const,
  detail: (slug: string) => [...blogKeys.all, "detail", slug] as const,
  pending: () => [...blogKeys.all, "pending"] as const,
};

export const useBlogs = (params: BlogQueryParams) =>
  useQuery({
    queryKey: blogKeys.list(params),
    queryFn: () => blogsApi.getAll(params),
    staleTime: 1000 * 60 * 2,
  });

export const useBlog = (slug: string) =>
  useQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: () => blogsApi.getBySlug(slug),
    enabled: !!slug,
  });

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blogsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: blogKeys.all }),
  });
};

export const useApproveBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blogsApi.approve,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: blogKeys.all }),
  });
};
```

---

## Redux Toolkit Store

```ts
// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { filterSlice } from "./slices/filterSlice";
import { uiSlice } from "./slices/uiSlice";
import { authSlice } from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    filter: filterSlice.reducer,
    ui: uiSlice.reducer,
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```ts
// src/store/hooks.ts
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
```

```ts
// src/store/slices/filterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  search: string;
  categoryId: string | null;
  tagIds: string[];
  sortBy: "newest" | "popular";
  viewMode: "grid" | "list";
}

const initialState: FilterState = {
  search: "",
  categoryId: null,
  tagIds: [],
  sortBy: "newest",
  viewMode: "grid",
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.categoryId = action.payload;
    },
    toggleTag: (state, action: PayloadAction<string>) => {
      const idx = state.tagIds.indexOf(action.payload);
      idx === -1 ? state.tagIds.push(action.payload) : state.tagIds.splice(idx, 1);
    },
    setSortBy: (state, action: PayloadAction<FilterState["sortBy"]>) => {
      state.sortBy = action.payload;
    },
    setViewMode: (state, action: PayloadAction<"grid" | "list">) => {
      state.viewMode = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const { setSearch, setCategory, toggleTag, setSortBy, setViewMode, resetFilters } =
  filterSlice.actions;
```

---

## Quill Editor Component

```tsx
// src/components/editor/QuillEditor.tsx
"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-muted rounded-md" />,
});

const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block"],
  ["link", "image"],
  [{ align: [] }],
  ["clean"],
];

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const QuillEditor = ({ value, onChange, placeholder }: QuillEditorProps) => (
  <ReactQuill
    theme="snow"
    value={value}
    onChange={onChange}
    placeholder={placeholder ?? "Write your story..."}
    modules={{ toolbar: TOOLBAR }}
    className="min-h-[400px]"
  />
);
```

---

## API Route Handlers (Arrow Functions)

```ts
// src/app/api/blogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Blog } from "@/models/Blog.model";
import { CreateBlogSchema } from "@/lib/validations/blog.schema";
import { generateSlug } from "@/lib/utils";

export const GET = async (req: NextRequest) => {
  await connectDB();
  const { searchParams } = req.nextUrl;

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 12);
  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId");
  const tagIds = searchParams.getAll("tagIds");

  const query: Record<string, unknown> = { status: "approved" };
  if (search) query.title = { $regex: search, $options: "i" };
  if (categoryId) query.category = categoryId;
  if (tagIds.length) query.tags = { $in: tagIds };

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .populate("author", "name image")
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Blog.countDocuments(query),
  ]);

  return NextResponse.json({ blogs, total, page, totalPages: Math.ceil(total / limit) });
};

export const POST = async (req: NextRequest) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["writer", "admin"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();
  const body = await req.json();
  const parsed = CreateBlogSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const slug = generateSlug(parsed.data.title);
  const blog = await Blog.create({
    ...parsed.data,
    slug,
    author: session.user.id,
    status: session.user.role === "admin" ? "approved" : "pending",
  });

  return NextResponse.json(blog, { status: 201 });
};
```

```ts
// src/app/api/blogs/[id]/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Blog } from "@/models/Blog.model";
import { ApproveBlogSchema } from "@/lib/validations/blog.schema";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();
  const body = await req.json();
  const parsed = ApproveBlogSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const blog = await Blog.findByIdAndUpdate(
    params.id,
    { status: parsed.data.status, rejectionReason: parsed.data.rejectionReason },
    { new: true }
  );

  if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  return NextResponse.json(blog);
};
```

---

## Screen Example

```tsx
// src/screens/admin/BlogWriteScreen.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateBlogSchema, CreateBlogInput } from "@/lib/validations/blog.schema";
import { useCreateBlog } from "@/hooks/useBlogs";
import { BlogWriteForm } from "@/components/blog/BlogWriteForm";

const BlogWriteScreen = () => {
  const { mutate: createBlog, isPending } = useCreateBlog();

  const form = useForm<CreateBlogInput>({
    resolver: zodResolver(CreateBlogSchema),
    defaultValues: { title: "", content: "", excerpt: "", tagIds: [] },
  });

  const onSubmit = (data: CreateBlogInput) => createBlog(data);

  return <BlogWriteForm form={form} onSubmit={onSubmit} isPending={isPending} />;
};

export default BlogWriteScreen;
```

---

## Utility Functions

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const generateSlug = (title: string): string =>
  title
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-");

export const formatDate = (date: Date | string): string =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(date));

export const truncate = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
```

---

## Environment Variables (`.env.local`)

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/blog-app

# Better Auth
BETTER_AUTH_SECRET=your-secret-here-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Code Generation Rules for Copilot

When generating **any** code in this project, enforce **all** of the following:

1. **`function` keyword is banned** — every function must be an arrow function (`const x = () => {}`).
2. **`bun` only** — never suggest `npm`, `npx`, or `yarn` commands. Use `bun` / `bunx`.
3. **`src/middleware.ts`** — middleware lives inside `src/`, not at project root.
4. **Never put business logic in `app/**/page.tsx`** — only import and return the Screen.
5. **Never put Tailwind classes in Screen files** — all styling belongs in `components/`.
6. **Always validate API inputs** with the Zod schema from `src/lib/validations/`.
7. **Always check session + role** at the top of every protected API route handler.
8. **Always call `connectDB()`** before any Mongoose operation in API routes.
9. **Use `useAppSelector` / `useAppDispatch`** from `src/store/hooks.ts` — never import directly from `react-redux`.
10. **All TanStack Query keys** must be defined in the `<entity>Keys` object in the hook file.
11. **QuillEditor** must always use `dynamic(() => import(...), { ssr: false })`.
12. **Slugs** are auto-generated server-side via `generateSlug()` — never trust client-provided slugs.
13. **Role assignment** is server-side only — `role` field has `input: false` in Better Auth config.
14. **Writer posts** → `status: "pending"`. **Admin posts** → `status: "approved"`.
15. **All shared types** live in `src/types/`. Mongoose models define their own `interface I<Model>`.
16. **API route exports** must be named arrow constants: `export const GET = async (req) => {}`.

---

## Page-to-Screen Mapping Reference

| Route | Page File | Screen Component |
|---|---|---|
| `/` | `src/app/(public)/page.tsx` | `LandingScreen` |
| `/blog` | `src/app/(public)/blog/page.tsx` | `BlogListScreen` |
| `/blog/[slug]` | `src/app/(public)/blog/[slug]/page.tsx` | `BlogDetailScreen` |
| `/category/[slug]` | `src/app/(public)/category/[slug]/page.tsx` | `CategoryScreen` |
| `/tag/[slug]` | `src/app/(public)/tag/[slug]/page.tsx` | `TagScreen` |
| `/author/[username]` | `src/app/(public)/author/[username]/page.tsx` | `AuthorScreen` |
| `/sign-in` | `src/app/(auth)/sign-in/page.tsx` | `SignInScreen` |
| `/sign-up` | `src/app/(auth)/sign-up/page.tsx` | `SignUpScreen` |
| `/admin/dashboard` | `src/app/(protected)/admin/dashboard/page.tsx` | `AdminDashboardScreen` |
| `/admin/approvals` | `src/app/(protected)/admin/approvals/page.tsx` | `ApprovalScreen` |
| `/admin/blogs` | `src/app/(protected)/admin/blogs/page.tsx` | `AdminBlogListScreen` |
| `/admin/blogs/write` | `src/app/(protected)/admin/blogs/write/page.tsx` | `BlogWriteScreen` |
| `/admin/categories` | `src/app/(protected)/admin/categories/page.tsx` | `AdminCategoryScreen` |
| `/admin/tags` | `src/app/(protected)/admin/tags/page.tsx` | `AdminTagScreen` |
| `/writer/dashboard` | `src/app/(protected)/writer/dashboard/page.tsx` | `WriterDashboardScreen` |
| `/writer/posts` | `src/app/(protected)/writer/posts/page.tsx` | `WriterPostListScreen` |
| `/writer/posts/write` | `src/app/(protected)/writer/posts/write/page.tsx` | `BlogWriteScreen` |
| `/user/dashboard` | `src/app/(protected)/user/dashboard/page.tsx` | `UserDashboardScreen` |