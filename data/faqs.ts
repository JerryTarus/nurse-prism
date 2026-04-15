export type FaqItem = {
  id: string
  question: string
  answer: string
  category: "Program" | "Pricing" | "Relocation" | "Coaching"
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    category: "Coaching",
    question: "Who is Nurse Prism designed for?",
    answer:
      "Nurse Prism supports nurses exploring aligned growth across remote work, digital health, LinkedIn visibility, international pathways, and career transitions beyond traditional bedside roles.",
  },
  {
    id: "faq-2",
    category: "Pricing",
    question: "Can I start with a free session first?",
    answer:
      "Yes. You can begin with a Free Clarity Call to understand your readiness and decide whether a strategy session or full package is the right next step.",
  },
  {
    id: "faq-3",
    category: "Program",
    question: "What is the Nurse Prism 5P Framework?",
    answer:
      "The 5P Framework is the core journey used in coaching: Purpose, Preparation, Positioning, Placement, and Progression. It helps you move from uncertainty to sustainable career growth.",
  },
  {
    id: "faq-4",
    category: "Relocation",
    question: "Do you guarantee placement?",
    answer:
      "No ethical coach can guarantee placement. Nurse Prism provides strategic preparation, profile positioning, and interview support to significantly strengthen your chances.",
  },
  {
    id: "faq-5",
    category: "Pricing",
    question: "Why are non-KES prices shown as estimates?",
    answer:
      "Displayed values in USD, QAR, AED, and SAR are estimate conversions based on controlled internal rates for planning convenience. Final billing remains based on configured checkout currency.",
  },
  {
    id: "faq-6",
    category: "Coaching",
    question: "How long does coaching support last?",
    answer:
      "Support duration depends on your selected plan. Strategy sessions are focused and intensive, while coaching packages and program plans include longer accountability support windows.",
  },
]
