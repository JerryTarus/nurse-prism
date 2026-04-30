export type Testimonial = {
  id: string
  name: string
  role: string
  country: string
  quote: string
  result: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "faith-doha",
    name: "Faith M.",
    role: "Registered Nurse",
    country: "Qatar",
    quote:
      "I stopped second-guessing every step. Nurse Prism gave me structure, confidence, and real momentum.",
    result: "Interviewed in 6 weeks and secured an offer in Doha.",
  },
  {
    id: "janet-abu-dhabi",
    name: "Janet K.",
    role: "ICU Nurse",
    country: "UAE",
    quote:
      "The Professional Pivot helped me present my experience properly. My CV and interview story became clear and powerful.",
    result: "Moved to Abu Dhabi with a stronger compensation package.",
  },
  {
    id: "caroline-riyadh",
    name: "Caroline T.",
    role: "Pediatric Nurse",
    country: "Saudi Arabia",
    quote:
      "Every coaching call was practical. I finally understood licensing, documents, and what employers actually look for.",
    result: "Completed licensing milestones faster than planned.",
  },
]
