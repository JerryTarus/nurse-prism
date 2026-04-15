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
      "Clarify the next chapter that fits your values, lifestyle, strengths, and long-term professional goals.",
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
    title: "Global Nursing Pathways",
    description:
      "Map realistic options across the US, UK, Canada, Australia, the Middle East, and Europe with practical next steps.",
    outcomes: [
      "Market and pathway comparison",
      "Readiness and licensing planning",
      "Smarter international decision-making",
    ],
    idealFor:
      "Nurses considering relocation or international mobility and wanting a safer, more strategic approach.",
  },
  {
    id: "interview-offer-support",
    title: "Interview, Offer & Decision Coaching",
    description:
      "Prepare for interviews, evaluate opportunities, and make confident career decisions without rushing into the wrong move.",
    outcomes: [
      "Interview confidence and structure",
      "Offer evaluation support",
      "Stronger negotiation and decision clarity",
    ],
    idealFor:
      "Nurses actively applying, interviewing, or weighing major career transitions across multiple directions.",
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
