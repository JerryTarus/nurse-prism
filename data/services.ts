export type ServiceItem = {
  id: string
  title: string
  description: string
  outcomes: string[]
  idealFor: string
}

export const CORE_SERVICES: ServiceItem[] = [
  {
    id: "career-strategy",
    title: "Career Strategy & Readiness",
    description:
      "Clarify your best-fit Gulf pathway, timeline, and required milestones before applications begin.",
    outcomes: [
      "Personalized relocation strategy",
      "Eligibility and licensing pathway mapping",
      "Confidence from a clear timeline",
    ],
    idealFor:
      "Nurses who feel overwhelmed and want expert direction before making costly mistakes.",
  },
  {
    id: "documents-positioning",
    title: "Documents, CV & Positioning",
    description:
      "Transform your profile into a compelling, employer-ready narrative aligned with Gulf hiring standards.",
    outcomes: [
      "Modernized CV and profile assets",
      "Positioning statement for your experience",
      "Targeted interview narrative preparation",
    ],
    idealFor:
      "Nurses who need their strengths communicated clearly in competitive international markets.",
  },
  {
    id: "interview-placement",
    title: "Interview & Placement Coaching",
    description:
      "Practice high-stakes interview conversations and placement decisions with practical coaching support.",
    outcomes: [
      "Mock interviews with feedback",
      "Offer evaluation and decision support",
      "Negotiation confidence and professionalism",
    ],
    idealFor:
      "Nurses approaching interviews or offers and wanting calm, strategic support.",
  },
  {
    id: "relocation-execution",
    title: "Relocation Execution Support",
    description:
      "Get practical help with timelines, checklists, and transition priorities through your move.",
    outcomes: [
      "Structured relocation checklist",
      "Risk and delay mitigation planning",
      "Post-arrival transition guidance",
    ],
    idealFor:
      "Nurses ready to move and needing reliable support during a complex transition window.",
  },
]

export const FIVE_P_FRAMEWORK = [
  {
    pillar: "Purpose",
    detail: "Define your why, your target market, and your preferred career trajectory.",
  },
  {
    pillar: "Preparation",
    detail: "Build capability, documents, and confidence through a deliberate plan.",
  },
  {
    pillar: "Positioning",
    detail: "Present your profile to stand out to Gulf employers and recruiters.",
  },
  {
    pillar: "Placement",
    detail: "Navigate interviews, offers, and placement decisions with strategic support.",
  },
  {
    pillar: "Progression",
    detail:
      "Grow beyond relocation into long-term career acceleration and professional stability.",
  },
] as const
