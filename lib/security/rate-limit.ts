import "server-only"

type Bucket = {
  hits: number
  resetAt: number
}

type RateLimitConfig = {
  windowMs: number
  maxHits: number
}

type RateLimitResult = {
  ok: boolean
  remaining: number
  retryAfterSeconds: number
}

const store = new Map<string, Bucket>()

function now() {
  return Date.now()
}

export function getRequestIp(headers: Headers) {
  const xForwardedFor = headers.get("x-forwarded-for")
  const xRealIp = headers.get("x-real-ip")

  if (xForwardedFor) {
    return xForwardedFor.split(",")[0]?.trim() ?? "unknown"
  }

  return xRealIp?.trim() || "unknown"
}

export function enforceRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const timestamp = now()
  const existing = store.get(key)

  if (!existing || existing.resetAt <= timestamp) {
    const resetAt = timestamp + config.windowMs
    store.set(key, { hits: 1, resetAt })
    return {
      ok: true,
      remaining: Math.max(config.maxHits - 1, 0),
      retryAfterSeconds: Math.ceil(config.windowMs / 1000),
    }
  }

  existing.hits += 1
  store.set(key, existing)

  const remaining = Math.max(config.maxHits - existing.hits, 0)
  const retryAfterSeconds = Math.max(
    Math.ceil((existing.resetAt - timestamp) / 1000),
    1
  )

  return {
    ok: existing.hits <= config.maxHits,
    remaining,
    retryAfterSeconds,
  }
}
