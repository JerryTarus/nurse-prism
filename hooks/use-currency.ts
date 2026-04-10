"use client"

import { useState } from "react"

import { detectPreferredCurrency } from "@/lib/currency"
import type { SupportedCurrency } from "@/types/pricing"

export function useCurrency(initialCurrency: SupportedCurrency = "KES") {
  const [currency, setCurrency] = useState<SupportedCurrency>(() => {
    if (typeof window === "undefined") {
      return initialCurrency
    }

    return detectPreferredCurrency(window.navigator.language)
  })

  return { currency, setCurrency }
}
