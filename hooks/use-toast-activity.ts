"use client"

import { useEffect, useState } from "react"

type ActivityItem = {
  id: string
  nurse: string
  country: string
  action: string
  timeframe: string
}

export const ACTIVITY_FEED: ActivityItem[] = [
  {
    id: "activity-1",
    nurse: "Amina",
    country: "Qatar",
    action: "booked a Free Clarity Call",
    timeframe: "just now",
  },
  {
    id: "activity-2",
    nurse: "Brenda",
    country: "UAE",
    action: "started the Professional Pivot",
    timeframe: "4 minutes ago",
  },
  {
    id: "activity-3",
    nurse: "Janet",
    country: "Saudi Arabia",
    action: "scheduled a Career Clarity Session",
    timeframe: "12 minutes ago",
  },
  {
    id: "activity-4",
    nurse: "Mercy",
    country: "Qatar",
    action: "joined the Premium Program",
    timeframe: "21 minutes ago",
  },
]

export function useToastActivity(intervalMs = 8500) {
  const [index, setIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let timeoutId: number | undefined

    const interval = window.setInterval(() => {
      setIsVisible(false)

      timeoutId = window.setTimeout(() => {
        setIndex((current) => (current + 1) % ACTIVITY_FEED.length)
        setIsVisible(true)
      }, 260)
    }, intervalMs)

    return () => {
      window.clearInterval(interval)
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [intervalMs])

  return {
    activity: ACTIVITY_FEED[index],
    isVisible,
  }
}
