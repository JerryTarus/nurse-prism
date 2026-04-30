export type ServiceItem = {
  id: string
  title: string
  description: string
  outcomes: string[]
  idealFor: string
}

export const CORE_SERVICES: ServiceItem[] = [
  {
    id: "career-clarity",
    title: "Career Clarity & Nurse Pivot Strategy",
    description:
      "Clarify the next chapter that fits your values, strengths, and long-term goals.",
    outcomes: [
      "Clear next-step strategy",
      "Aligned role and market direction",
      "Confidence in your transition timeline",
    ],
    idealFor:
      "Nurses who feel stuck, overwhelmed, or unsure whether to pursue clinical progression, remote work, or a wider career pivot.",
  },
  {
    id: "linkedin-positioning",
    title: "LinkedIn Coaching & Personal Branding",
    description:
      "Strengthen how you show up online so recruiters, employers, and collaborators understand your value quickly.",
    outcomes: [
      "Optimized LinkedIn positioning",
      "Sharper professional narrative",
      "Better visibility for aligned opportunities",
    ],
    idealFor:
      "Nurses who want a stronger digital presence, career credibility, and clearer positioning for modern healthcare roles.",
  },
  {
    id: "remote-digital-health",
    title: "Remote Work & Digital Health Transition",
    description:
      "Translate bedside experience into roles across telehealth, care coordination, healthcare operations, informatics, and health tech.",
    outcomes: [
      "Transferable skills mapping",
      "Remote-friendly positioning strategy",
      "Digital health opportunity clarity",
    ],
    idealFor:
      "Nurses exploring flexible work, healthcare innovation, or a path beyond traditional bedside roles.",
  },
  {
    id: "global-opportunities",
    title: "International Career Pathway Support",
    description:
      "Get structured support for global opportunities across the US, UK, Canada, Australia, Europe, and the Middle East.",
    outcomes: [
      "Market and pathway comparison",
      "Readiness and licensing planning",
      "Smarter international decision-making",
    ],
    idealFor:
      "Nurses considering relocation or international mobility and wanting a safer, more strategic approach.",
  },
  {
    id: "career-program",
    title: "Nurse Prism Career Program",
    description:
      "Move through a guided coaching framework that builds clarity, positioning, visibility, and steady execution over time.",
    outcomes: [
      "Structured 5P transformation journey",
      "Longer-term coaching accountability",
      "Clear momentum across your pivot goals",
    ],
    idealFor:
      "Nurses who want a deeper, more supported transition plan instead of one-off advice.",
  },
]

export const FIVE_P_FRAMEWORK = [
  {
    pillar: "Purpose",
    detail:
      "Define the kind of career, flexibility, impact, and lifestyle you want next.",
  },
  {
    pillar: "Preparation",
    detail:
      "Build readiness through skills, documents, mindset, systems, and practical planning.",
  },
  {
    pillar: "Positioning",
    detail:
      "Present your value clearly across CVs, LinkedIn, interviews, and opportunity conversations.",
  },
  {
    pillar: "Placement",
    detail:
      "Navigate applications, offers, remote roles, or international pathways with strategy and confidence.",
  },
  {
    pillar: "Progression",
    detail:
      "Grow beyond the first move into long-term visibility, sustainability, and career evolution.",
  },
] as const
