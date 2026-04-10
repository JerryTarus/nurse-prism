const allowedPathPrefix = /^\/[A-Za-z0-9\-._~!$&'()*+,;=:@\/]*$/

export function sanitizeRedirectPath(
  value: string | null | undefined,
  fallback = "/admin"
) {
  if (!value) {
    return fallback
  }

  if (!allowedPathPrefix.test(value)) {
    return fallback
  }

  if (value.startsWith("//")) {
    return fallback
  }

  return value
}
