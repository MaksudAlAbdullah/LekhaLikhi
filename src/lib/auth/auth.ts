import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"

import { getMongoDb, hasUsableMongoUri } from "@/lib/db/mongoose"

const database = hasUsableMongoUri() ? mongodbAdapter(await getMongoDb()) : undefined

export const auth = betterAuth({
  appName: "Lekhalikhi",
  baseURL:
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET ?? "change-me-in-production",
  ...(database ? { database } : {}),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
    },
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.BETTER_AUTH_URL,
  ].filter((origin): origin is string => Boolean(origin)),
  plugins: [nextCookies()],
})

export type AppSession = typeof auth.$Infer.Session