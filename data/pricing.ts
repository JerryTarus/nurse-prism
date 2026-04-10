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
      "Start with the right strategy before spending time or money in the wrong direction.",
    plans: [
      {
        id: "free-clarity-call",
        name: "Free Clarity Call",
        summary:
          "A focused conversation to identify your starting point and map the safest next step.",
        basePriceKes: 0,
        ctaLabel: "Book Free Call",
        ctaHref: "/contact?intent=free-clarity-call",
        features: [
          "20-minute introductory review",
          "Eligibility and readiness checkpoint",
          "Next-step action snapshot",
        ],
      },
      {
        id: "paid-strategy-session",
        name: "Paid Strategy Session",
        summary:
          "Deep planning session for your full Gulf pathway and practical execution timeline.",
        basePriceKes: 10000,
        ctaLabel: "Book Strategy Session",
        ctaHref: "/contact?intent=strategy-session",
        features: [
          "60-minute strategy consultation",
          "Personalized roadmap document",
          "Document and timeline planning",
          "Priority follow-up summary",
        ],
      },
    ],
  },
  {
    id: "relocation",
    title: "Relocation Packages",
    description:
      "End-to-end support tailored to your urgency, confidence level, and career target.",
    plans: [
      {
        id: "starter-plan",
        name: "Starter Plan",
        summary:
          "Essential support for nurses who want clear direction and accountability.",
        basePriceKes: 25000,
        ctaLabel: "Choose Starter",
        ctaHref: "/contact?intent=starter-plan",
        features: [
          "CV and profile review",
          "Target-country readiness checklist",
          "Interview preparation basics",
          "Email support for 30 days",
        ],
      },
      {
        id: "professional-plan",
        name: "Professional Plan",
        summary:
          "The most balanced package for applicants who want speed, structure, and confidence.",
        basePriceKes: 60000,
        ctaLabel: "Choose Professional",
        ctaHref: "/contact?intent=professional-plan",
        badge: "Most Popular",
        isPopular: true,
        features: [
          "Everything in Starter",
          "Advanced interview simulations",
          "Document flow and compliance support",
          "Employer-facing positioning strategy",
          "Priority mentorship for 60 days",
        ],
      },
      {
        id: "elite-plan",
        name: "Elite Plan",
        summary:
          "Premium, high-touch support for ambitious candidates pursuing accelerated placement.",
        basePriceKes: 120000,
        ctaLabel: "Choose Elite",
        ctaHref: "/contact?intent=elite-plan",
        features: [
          "Everything in Professional",
          "Weekly private coaching calls",
          "Personal brand and negotiation coaching",
          "Priority communication turnaround",
          "Placement readiness oversight",
        ],
      },
    ],
  },
  {
    id: "program",
    title: "Nurse Prism Program",
    description:
      "Guided transformation through the Nurse Prism 5P framework with practical implementation support.",
    plans: [
      {
        id: "standard-program",
        name: "Standard Program",
        summary:
          "Comprehensive curriculum plus implementation checkpoints for steady progress.",
        basePriceKes: 75000,
        ctaLabel: "Join Standard",
        ctaHref: "/contact?intent=standard-program",
        features: [
          "5P curriculum access",
          "Structured assignment reviews",
          "Group coaching touchpoints",
          "Progress tracking templates",
        ],
      },
      {
        id: "premium-program",
        name: "Premium Program",
        summary:
          "Advanced coaching experience with direct support and accelerated execution.",
        basePriceKes: 120000,
        ctaLabel: "Join Premium",
        ctaHref: "/contact?intent=premium-program",
        features: [
          "Everything in Standard",
          "Private strategy intensives",
          "Direct placement-positioning coaching",
          "Extended accountability support",
        ],
      },
    ],
  },
]
