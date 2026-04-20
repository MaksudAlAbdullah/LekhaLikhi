export type AppRole = "admin" | "writer" | "user"

export interface SessionUserSummary {
  id: string
  name: string
  email: string
  role: AppRole
}