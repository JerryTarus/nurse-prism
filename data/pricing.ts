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
        name: "Paid Strategy Session",
        summary:
          "Deep planning session for your career pivot, global options, remote ambitions, or next-step execution timeline.",
        basePriceKes: 10000,
        ctaLabel: "Book Strategy Session",
        ctaHref: "/contact?intent=strategy-session",
        features: [
          "60-minute strategy consultation",
          "Personalized roadmap document",
          "Career pathway and positioning review",
          "Priority follow-up summary",
        ],
      },
    ],
  },
  {
    id: "relocation",
    title: "Career Transition Packages",
    description:
      "Structured support for nurses building stronger positioning, clearer applications, and more confident transitions.",
    plans: [
      {
        id: "starter-plan",
        name: "Starter Plan",
        summary:
          "Essential support for nurses who need clarity, accountability, and a practical launch strategy.",
        basePriceKes: 25000,
        ctaLabel: "Choose Starter",
        ctaHref: "/contact?intent=starter-plan",
        features: [
          "CV and positioning review",
          "Target-market readiness checklist",
          "Interview preparation basics",
          "Email support for 30 days",
        ],
      },
      {
        id: "professional-plan",
        name: "Professional Plan",
        summary:
          "The most balanced package for nurses who want sharper visibility, stronger strategy, and consistent momentum.",
        basePriceKes: 60000,
        ctaLabel: "Choose Professional",
        ctaHref: "/contact?intent=professional-plan",
        badge: "Most Popular",
        isPopular: true,
        features: [
          "Everything in Starter",
          "Advanced interview simulations",
          "LinkedIn and digital presence strategy",
          "Priority mentorship for 60 days",
          "Opportunity decision support",
        ],
      },
      {
        id: "elite-plan",
        name: "Elite Plan",
        summary:
          "Premium, high-touch support for ambitious nurses navigating major transitions with speed and depth.",
        basePriceKes: 120000,
        ctaLabel: "Choose Elite",
        ctaHref: "/contact?intent=elite-plan",
        features: [
          "Everything in Professional",
          "Weekly private coaching calls",
          "High-visibility positioning support",
          "Priority communication turnaround",
          "Hands-on career decision guidance",
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
        name: "Standard Program",
        summary:
          "Comprehensive curriculum plus implementation checkpoints for steady, practical progress.",
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
          "Advanced coaching experience with direct support for deeper clarity, execution, and visibility.",
        basePriceKes: 120000,
        ctaLabel: "Join Premium",
        ctaHref: "/contact?intent=premium-program",
        features: [
          "Everything in Standard",
          "Private strategy intensives",
          "Direct positioning and visibility coaching",
          "Extended accountability support",
        ],
      },
    ],
  },
]
