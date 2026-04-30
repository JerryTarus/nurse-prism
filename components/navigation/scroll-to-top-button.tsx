"use client"

import { useEffect, useState } from "react"
import { ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"

const SCROLL_VISIBILITY_THRESHOLD = 480

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let frameId = 0

    const updateVisibility = () => {
      frameId = 0
      const shouldShow = window.scrollY > SCROLL_VISIBILITY_THRESHOLD
      setIsVisible((current) => (current === shouldShow ? current : shouldShow))
    }

    const onScroll = () => {
      if (frameId !== 0) {
        return
      }

      frameId = window.requestAnimationFrame(updateVisibility)
    }

    updateVisibility()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)

      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <Button
      type="button"
      size="icon-lg"
      className="fixed right-4 bottom-20 z-40 rounded-full border border-white/14 bg-[color:var(--np-deep-burgundy)] text-white shadow-[0_18px_36px_-18px_rgba(40,8,22,0.9)] hover:bg-[color:var(--np-rich-wine)] md:right-5 md:bottom-5"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
    >
      <ChevronUp className="size-5" />
    </Button>
  )
}
