import type { AuthAccess } from "@/lib/auth/access"

export function getPostAuthRedirect(access: AuthAccess, nextPath: string) {
  if (access.mfa.required && !access.mfa.verified) {
    return `/auth/mfa?next=${encodeURIComponent(nextPath)}`
  }

  return nextPath
}
