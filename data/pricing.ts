import type {
  CurrencyConfig,
  PricingCategory,
  SupportedCurrency,
} from "@/types/pricing"

export const CURRENCY_CONFIG: Record<SupportedCurrency, CurrencyConfig> = {
  KES: {
    code: "KES",
    label: "KES",
    locale: "en-KE",
    symbol: "Ksh",
    kesMultiplier: 1,
  },
  USD: {
    code: "USD",
    label: "USD",
    locale: "en-US",
    symbol: "$",
    kesMultiplier: 0.0076,
  },
  QAR: {
    code: "QAR",
    label: "QAR",
    locale: "en-QA",
    symbol: "QR",
    kesMultiplier: 0.0278,
  },
  AED: {
    code: "AED",
    label: "AED",
    locale: "en-AE",
    symbol: "AED",
    kesMultiplier: 0.0279,
  },
  SAR: {
    code: "SAR",
    label: "SAR",
    locale: "en-SA",
    symbol: "SAR",
    kesMultiplier: 0.0286,
  },
}

export const SUPPORTED_CURRENCIES = ["KES", "USD", "QAR", "AED", "SAR"] as const

export const PRICING_CATEGORIES: PricingCategory[] = [
  {
    id: "consultation",
    title: "Consultation",
    description:
      "Start with clarity before spending time or money in the wrong direction.",
    plans: [
      {
        id: "free-clarity-call",
        name: "Free Clarity Call",
        summary:
          "A focused conversation to understand where you are, what you want next, and the safest first move.",
        basePriceKes: 0,
        ctaLabel: "Book Free Call",
        ctaHref: "/contact?intent=free-clarity-call",
        features: [
          "20-minute introductory review",
          "Current-stage clarity check",
          "Recommended next-step direction",
        ],
      },
      {
        id: "paid-strategy-session",
        name: "Career Clarity Session",
        summary:
          "A 60-minute intensive to map your exact transition pathway.",
        basePriceKes: 12763.16, // $97
        ctaLabel: "Map My Career Pathway",
        ctaHref: "/contact?intent=strategy-session",
        features: [
          "Pinpoint your most viable career options",
          "Identify the exact skills gap holding you back",
          "Walk away with a customized 3-step action plan",
          "Gain the confidence to finally make your move",
        ],
      },
    ],
  },
  {
    id: "relocation",
    title: "Career Pivot Packages",
    description:
      "Structured support for nurses building stronger positioning, clearer applications, and more confident transitions across remote, international, and non-traditional roles.",
    plans: [
      {
        id: "starter-plan",
        name: "Starter Pivot",
        summary:
          "The essential toolkit to make your profile visible to global recruiters.",
        basePriceKes: 25921.05, // $197
        ctaLabel: "Start My Pivot",
        ctaHref: "/contact?intent=starter-plan",
        features: [
          "High-impact Resume & CV overhaul",
          "LinkedIn Profile optimization",
          "Proven outreach templates",
          "Access to global nursing pathways",
        ],
      },
      {
        id: "professional-plan",
        name: "Professional Pivot",
        summary:
          "Comprehensive coaching and end-to-end strategy to secure your new role.",
        basePriceKes: 65394.74, // $497
        ctaLabel: "Accelerate My Transition",
        ctaHref: "/contact?intent=professional-plan",
        badge: "Most Popular",
        isPopular: true,
        features: [
          "Everything in Starter",
          "3x 1-on-1 Strategic Coaching Sessions",
          "Deep-dive Interview Preparation",
          "Personal Brand Strategy",
          "Direct feedback on job applications",
        ],
      },
      {
        id: "elite-plan",
        name: "Elite Pivot",
        summary:
          "High-touch, concierge-level partnership for a seamless career transformation.",
        basePriceKes: 131184.21, // $997
        ctaLabel: "Apply for Elite Partnership",
        ctaHref: "/contact?intent=elite-plan",
        features: [
          "Everything in Professional",
          "6x 1-on-1 Intensive Coaching Sessions",
          "Priority Voxer/WhatsApp access",
          "Done-with-you application strategy",
          "Exclusive negotiation coaching",
        ],
      },
    ],
  },
  {
    id: "program",
    title: "Nurse Prism Program",
    description:
      "A guided transformation framework for nurses pursuing aligned growth beyond one narrow career path.",
    plans: [
      {
        id: "standard-program",
        name: "Core Program",
        summary:
          "The complete 6-week blueprint to launch your international or digital health career.",
        basePriceKes: 78552.63, // $597
        ctaLabel: "Enroll Now",
        ctaHref: "/contact?intent=standard-program",
        features: [
          "6 weeks of step-by-step modules",
          "Weekly group coaching calls",
          "Access to private global community",
          "Lifetime access to program updates",
        ],
      },
      {
        id: "premium-program",
        name: "Premium Program",
        summary:
          "The 6-week blueprint, amplified with private, 1-on-1 strategic coaching.",
        basePriceKes: 131184.21, // $997
        ctaLabel: "Enroll Now",
        ctaHref: "/contact?intent=premium-program",
        features: [
          "Full access to Core Program",
          "3x Private 1-on-1 Strategy Sessions",
          "Priority resume and LinkedIn reviews",
          "Accelerated placement strategy",
        ],
      },
    ],
  },
]
