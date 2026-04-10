export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show"

export type BookingIntent =
  | "free-clarity-call"
  | "strategy-session"
  | "starter-plan"
  | "professional-plan"
  | "elite-plan"
  | "standard-program"
  | "premium-program"

export type Booking = {
  id: string
  fullName: string
  email: string
  phone: string | null
  intent: BookingIntent | string
  status: BookingStatus
  scheduledFor: string | null
  assignedCoach: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}
