import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

import { requireAdminApiSession } from "@/lib/auth/admin-api"
import { enforceRateLimit, getRequestIp } from "@/lib/security/rate-limit"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { bookingAdminUpdateSchema } from "@/lib/validations/dashboard"

const BOOKING_ADMIN_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  maxHits: 50,
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApiSession()
  if (auth.error) {
    return auth.error
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ error: "Booking id is required." }, { status: 400 })
  }

  const ip = getRequestIp(request.headers)
  const limiter = enforceRateLimit(
    `admin:bookings:update:${ip}:${auth.user?.id}`,
    BOOKING_ADMIN_RATE_LIMIT
  )
  if (!limiter.ok) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Please retry shortly.",
        retryAfterSeconds: limiter.retryAfterSeconds,
      },
      { status: 429 }
    )
  }

  const payload = await request.json().catch(() => null)
  const parsed = bookingAdminUpdateSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking update." }, { status: 400 })
  }

  const adminClient = createSupabaseAdminClient() as unknown as {
    from: (table: string) => {
      update: (value: Record<string, unknown>) => {
        eq: (column: string, value: string) => {
          select: (columns: string) => {
            single: () => Promise<{
              data: Record<string, unknown> | null
              error: { message?: string } | null
            }>
          }
        }
      }
    }
  }

  const { error } = await adminClient
    .from("bookings")
    .update({
      status: parsed.data.status,
      assigned_coach: parsed.data.assignedCoach,
      scheduled_for: parsed.data.scheduledFor ?? null,
      notes: parsed.data.notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message ?? "Unable to update booking." },
      { status: 500 }
    )
  }

  revalidatePath("/admin/bookings")

  return NextResponse.json({ success: true }, { status: 200 })
}
