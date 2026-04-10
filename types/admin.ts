import type { Booking } from "@/types/booking"
import type { BlogPost } from "@/types/blog"
import type { Lead } from "@/types/lead"

export type ContactMessageStatus = "new" | "in_progress" | "replied" | "closed"

export type ContactMessage = {
  id: string
  fullName: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: ContactMessageStatus
  createdAt: string
  updatedAt: string
}

export type MediaFile = {
  id: string
  bucket: string
  path: string
  title: string
  altText: string | null
  mimeType: string | null
  sizeBytes: number | null
  publicUrl: string | null
  createdAt: string
}

export type EditablePageSection = {
  id: string
  pageKey: string
  sectionKey: string
  title: string
  content: string
  updatedAt: string
  updatedBy: string | null
}

export type PackageConfig = {
  id: string
  packageKey: string
  name: string
  category: "consultation" | "relocation" | "program"
  basePriceKes: number
  isActive: boolean
  updatedAt: string
}

export type SiteSetting = {
  key: string
  value: string
  updatedAt: string
}

export type AppearanceSetting = {
  key: string
  value: string
  updatedAt: string
}

export type DashboardSnapshot = {
  totals: {
    leads: number
    bookings: number
    messages: number
    publishedPosts: number
  }
  recentLeads: Lead[]
  upcomingBookings: Booking[]
  recentMessages: ContactMessage[]
  latestPosts: BlogPost[]
  cmsReady: boolean
}
