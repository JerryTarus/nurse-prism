import { CURRENCY_CONFIG } from "@/data/pricing"
import type { SupportedCurrency } from "@/types/pricing"

const localeCurrencyMap: Record<string, SupportedCurrency> = {
  QA: "QAR",
  AE: "AED",
  SA: "SAR",
  US: "USD",
  KE: "KES",
}

export function convertKesToCurrency(
  amountKes: number,
  currency: SupportedCurrency
) {
  const config = CURRENCY_CONFIG[currency]
  return amountKes * config.kesMultiplier
}

export function formatCurrencyAmount(
  amountKes: number,
  currency: SupportedCurrency,
  withEstimatePrefix = false
) {
  if (currency === "KES") {
    const value = new Intl.NumberFormat("en-KE", {
      maximumFractionDigits: 0,
    }).format(amountKes)
    return `Ksh ${value}`
  }

  const converted = convertKesToCurrency(amountKes, currency)
  const formatted = new Intl.NumberFormat(CURRENCY_CONFIG[currency].locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(converted)

  return withEstimatePrefix ? `Approx. ${formatted}` : formatted
}

export function detectPreferredCurrency(locale?: string): SupportedCurrency {
  if (!locale) {
    return "KES"
  }

  const region = locale.split("-").at(-1)?.toUpperCase() ?? "KE"
  return localeCurrencyMap[region] ?? "KES"
}
