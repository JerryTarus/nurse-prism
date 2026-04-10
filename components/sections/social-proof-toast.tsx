"use client"

import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

import { useToastActivity } from "@/hooks/use-toast-activity"

export function SocialProofToast() {
  const { activity, isVisible } = useToastActivity()

  return (
    <div className="pointer-events-none fixed bottom-5 left-4 z-40 hidden md:block">
      <AnimatePresence mode="wait">
        {isVisible ? (
          <motion.aside
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-72 rounded-xl border border-border/90 bg-card/95 p-3 shadow-[0_20px_45px_-30px_rgba(15,10,12,0.82)] backdrop-blur"
            aria-live="polite"
          >
            <p className="text-xs font-semibold tracking-wide text-primary uppercase">
              Recent activity
            </p>
            <p className="mt-1.5 text-sm leading-5 text-foreground">
              <span className="font-semibold">{activity.nurse}</span> from{" "}
              <span className="font-semibold">{activity.country}</span>{" "}
              {activity.action}.
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="size-3.5 text-[color:var(--np-success)]" />
              {activity.timeframe}
            </p>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
