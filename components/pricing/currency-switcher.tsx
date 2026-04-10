"use client"

import type { SupportedCurrency } from "@/types/pricing"
import { cn } from "@/lib/utils"

type CurrencySwitcherProps = {
  value: SupportedCurrency
  onChange: (value: SupportedCurrency) => void
}

const currencyOptions: SupportedCurrency[] = ["KES", "USD", "QAR", "AED", "SAR"]

export function CurrencySwitcher({ value, onChange }: CurrencySwitcherProps) {
  return (
    <div
      className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border/80 bg-card p-1 shadow-sm"
      role="tablist"
      aria-label="Select display currency"
    >
      {currencyOptions.map((currency) => (
        <button
          key={currency}
          type="button"
          role="tab"
          aria-selected={value === currency}
          onClick={() => onChange(currency)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors",
            value === currency
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {currency}
        </button>
      ))}
    </div>
  )
}
