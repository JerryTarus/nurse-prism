export type AllowlistedRole = "admin" | "super_admin"

type AllowlistEnv = {
  AUTH_ADMIN_EMAILS?: string
  AUTH_SUPER_ADMIN_EMAILS?: string
}

const DEFAULT_ADMIN_EMAILS = ["nurseprism@gmail.com"] as const
const DEFAULT_SUPER_ADMIN_EMAILS = ["crotonnbyte@gmail.com"] as const

function parseCsv(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

export function resolveAllowlistedRole(
  email: string | null | undefined,
  env: AllowlistEnv
): AllowlistedRole | null {
  const normalizedEmail = email?.trim().toLowerCase()

  if (!normalizedEmail) {
    return null
  }

  const adminEmails = new Set([
    ...DEFAULT_ADMIN_EMAILS,
    ...parseCsv(env.AUTH_ADMIN_EMAILS),
  ])
  const superAdminEmails = new Set([
    ...DEFAULT_SUPER_ADMIN_EMAILS,
    ...parseCsv(env.AUTH_SUPER_ADMIN_EMAILS),
  ])

  if (superAdminEmails.has(normalizedEmail)) {
    return "super_admin"
  }

  if (adminEmails.has(normalizedEmail)) {
    return "admin"
  }

  return null
}
