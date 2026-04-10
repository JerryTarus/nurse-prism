"use client"

import { useEffect, useMemo, useState } from "react"

type UseLiveCounterOptions = {
  base: number
  minIncrement?: number
  maxIncrement?: number
  tickMs?: number
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function useLiveCounter({
  base,
  minIncrement = 1,
  maxIncrement = 3,
  tickMs = 6000,
}: UseLiveCounterOptions) {
  const [value, setValue] = useState(base)

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (Math.random() > 0.45) {
        setValue((current) => current + randomBetween(minIncrement, maxIncrement))
      }
    }, tickMs)

    return () => window.clearInterval(interval)
  }, [maxIncrement, minIncrement, tickMs])

  const formatted = useMemo(
    () => new Intl.NumberFormat("en-US").format(value),
    [value]
  )

  return { value, formatted }
}
