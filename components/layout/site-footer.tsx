import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, Twitter } from "lucide-react"

import { FOOTER_NAV_ITEMS } from "@/data/navigation"
import { SITE_CONFIG } from "@/lib/constants"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-10 border-t border-[color:var(--np-border-soft)] bg-[color:rgb(246_239_231/0.9)]">
      <div className="np-container grid gap-10 py-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Nurse Prism home"
          >
            <Image
              src="/images/logos/nurse-prism-mark.svg"
              alt="Nurse Prism mark"
              width={34}
              height={34}
              className="h-[34px] w-[34px]"
            />
            <span className="font-heading text-lg font-semibold tracking-tight text-primary">
              {SITE_CONFIG.name}
            </span>
          </Link>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            {SITE_CONFIG.tagline}. We coach nurses toward clearer, more aligned
            careers across remote work, digital health, international
            opportunities, and growth beyond traditional roles.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="inline-flex items-center gap-2 rounded-md text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Mail className="size-4" />
              {SITE_CONFIG.email}
            </a>
            <a
              href={SITE_CONFIG.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Linkedin className="size-4" />
              LinkedIn
            </a>
            <a
              href={SITE_CONFIG.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Facebook className="size-4" />
              Facebook
            </a>
            <a
              href={SITE_CONFIG.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Instagram className="size-4" />
              Instagram
            </a>
            <a
              href={SITE_CONFIG.x}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Twitter className="size-4" />
              X
            </a>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-sm font-semibold tracking-wide text-primary uppercase">
            Quick Links
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Home
              </Link>
            </li>
            {FOOTER_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-[color:var(--np-border-soft)]">
        <div className="np-container py-4 text-xs text-muted-foreground">
          (c) {currentYear} {SITE_CONFIG.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

