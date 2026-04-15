export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? ""

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

type EventParams = Record<string, string | number | boolean | null | undefined>

function isAnalyticsEnabled() {
  return Boolean(GA_MEASUREMENT_ID)
}

export function trackPageView(url: string) {
  if (!isAnalyticsEnabled() || typeof window === "undefined" || !window.gtag) {
    return
  }

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
    page_location: window.location.href,
  })
}

export function trackEvent(name: string, params: EventParams = {}) {
  if (!isAnalyticsEnabled() || typeof window === "undefined" || !window.gtag) {
    return
  }

  window.gtag("event", name, params)
}
