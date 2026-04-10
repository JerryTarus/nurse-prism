export type LeadStatus = "new" | "qualified" | "follow_up" | "won" | "lost"

export type LeadSource =
  | "website"
  | "contact_form"
  | "pricing_page"
  | "program_page"
  | "referral"
  | "manual"

export type Lead = {
  id: string
  fullName: string
  email: string
  phone: string | null
  targetCountry: string | null
  intent: string
  status: LeadStatus
  source: LeadSource
  notes: string | null
  createdAt: string
  updatedAt: string
}
