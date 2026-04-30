import "server-only"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import {
  getCalendlyUrlForIntent,
  getCheckoutAmountUsdForIntent,
  getPricingPlanForIntent,
  isPaidConsultationIntent,
  type ConsultationIntent,
} from "@/lib/consultations"
import { getPublicPricingCategories } from "@/lib/cms/public-content"
import type {
  ContactSubmissionPayload,
  ConsultationLeadPayload,
  NewsletterPayload,
} from "@/lib/validations/public"

type QueryResponse<T> = {
  data: T | null
  error: { message?: string } | null
}

type QueryRowsResponse<T> = {
  data: T[] | null
  error: { message?: string } | null
}

type SelectQuery = {
  eq: (column: string, value: unknown) => SelectQuery
  maybeSingle: () => Promise<QueryResponse<Record<string, unknown>>>
  order: (
    column: string,
    options?: { ascending?: boolean }
  ) => Promise<QueryRowsResponse<Record<string, unknown>>>
}

type UpdateQuery = {
  eq: (column: string, value: unknown) => UpdateQuery
  select: (columns: string) => {
    single: () => Promise<QueryResponse<Record<string, unknown>>>
  }
}

type SupabaseAdminWriteClient = {
  from: (table: string) => {
    insert: (value: Record<string, unknown> | Record<string, unknown>[]) => {
      select: (columns: string) => {
        single: () => Promise<QueryResponse<Record<string, unknown>>>
      }
    }
    update: (value: Record<string, unknown>) => UpdateQuery
    select: (columns: string) => SelectQuery
  }
}

type LeadInsertResult = {
  id: string
}

type BookingInsertResult = {
  id: string
  intent: ConsultationIntent
  email: string
  full_name: string
  package_key: string | null
  payment_status: string | null
}

type PaymentInsertResult = {
  id: string
}

function getPublicWriteClient() {
  return createSupabaseAdminClient() as unknown as SupabaseAdminWriteClient
}

function getErrorMessage(error: { message?: string } | null, fallback: string) {
  return error?.message ?? fallback
}

function toNullableString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null
}

function toRequiredString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback
}

export async function createConsultationLead(input: ConsultationLeadPayload) {
  const client = getPublicWriteClient()
  const pricingCategories = await getPublicPricingCategories()
  const plan = getPricingPlanForIntent(input.intent, pricingCategories)

  if (!plan) {
    throw new Error(
      "This consultation option is not available right now. Please choose another path."
    )
  }

  const { data: lead, error: leadError } = (await client
    .from("leads")
    .insert({
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      target_country: input.targetCountry,
      intent: input.intent,
      source: input.source,
      notes: input.notes,
    })
    .select("id")
    .single()) as QueryResponse<LeadInsertResult>

  if (leadError || !lead?.id) {
    throw new Error(
      getErrorMessage(leadError, "Unable to save this consultation request.")
    )
  }

  const calendlyUrl = getCalendlyUrlForIntent(input.intent)
  const paymentRequired = isPaidConsultationIntent(input.intent, pricingCategories)

  const { data: booking, error: bookingError } = (await client
    .from("bookings")
    .insert({
      lead_id: lead.id,
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      intent: input.intent,
      target_country: input.targetCountry,
      package_key: plan?.id ?? null,
      payment_status: paymentRequired ? "pending" : "not_required",
      notes: input.notes,
    })
    .select("id,intent,email,full_name,package_key,payment_status")
    .single()) as QueryResponse<BookingInsertResult>

  if (bookingError || !booking?.id) {
    throw new Error(
      getErrorMessage(bookingError, "Unable to create your booking record.")
    )
  }

  return {
    leadId: lead.id,
    bookingId: booking.id,
    intent: booking.intent,
    plan,
    paymentRequired,
    calendlyUrl,
  }
}

export async function createContactSubmission(input: ContactSubmissionPayload) {
  const client = getPublicWriteClient()

  const { data, error } = (await client
    .from("contact_submissions")
    .insert({
      full_name: input.name,
      email: input.email,
      phone: input.phone,
      subject: input.subject,
      message: input.message,
      country: input.country,
    })
    .select("id")
    .single()) as QueryResponse<{ id: string }>

  if (error || !data?.id) {
    throw new Error(
      getErrorMessage(error, "Unable to send your message right now.")
    )
  }

  return data
}

export async function createNewsletterLead(input: NewsletterPayload) {
  const client = getPublicWriteClient()

  const { data, error } = (await client
    .from("leads")
    .insert({
      full_name: "Newsletter Subscriber",
      email: input.email,
      intent: "newsletter",
      source: "website",
      notes: `Newsletter signup source: ${input.source}`,
    })
    .select("id")
    .single()) as QueryResponse<{ id: string }>

  if (error || !data?.id) {
    throw new Error(
      getErrorMessage(error, "Unable to save your newsletter signup.")
    )
  }

  return data
}

export async function getBookingForPayment(bookingId: string) {
  const client = getPublicWriteClient()

  const { data, error } = (await client
    .from("bookings")
    .select("id,intent,email,full_name,package_key,payment_status")
    .eq("id", bookingId)
    .maybeSingle()) as QueryResponse<Record<string, unknown>>

  if (error || !data) {
    throw new Error(
      getErrorMessage(error, "Unable to locate the booking for this payment.")
    )
  }

  const intentValue = toRequiredString(data.intent)
  if (!intentValue) {
    throw new Error("Booking intent is missing.")
  }

  return {
    id: toRequiredString(data.id),
    intent: intentValue as ConsultationIntent,
    email: toRequiredString(data.email),
    fullName: toRequiredString(data.full_name),
    packageKey: toNullableString(data.package_key),
    paymentStatus: toNullableString(data.payment_status),
  }
}

export async function createPaymentRecord(input: {
  bookingId: string
  packageKey: string | null
  amountKes: number
  checkoutAmount: string
  approvalUrl: string
  providerOrderId: string
}) {
  const client = getPublicWriteClient()

  const { data, error } = (await client
    .from("payments")
    .insert({
      booking_id: input.bookingId,
      package_key: input.packageKey,
      amount_kes: input.amountKes,
      currency: "USD",
      checkout_amount: Number(input.checkoutAmount),
      status: "created",
      provider: "paypal",
      provider_order_id: input.providerOrderId,
      approval_url: input.approvalUrl,
    })
    .select("id")
    .single()) as QueryResponse<PaymentInsertResult>

  if (error || !data?.id) {
    throw new Error(
      getErrorMessage(error, "Unable to save the payment record.")
    )
  }

  await logPaymentEvent({
    paymentId: data.id,
    eventType: "paypal.order.created",
    payload: {
      orderId: input.providerOrderId,
      approvalUrl: input.approvalUrl,
      checkoutAmount: input.checkoutAmount,
      amountKes: input.amountKes,
    },
  })

  return data
}

export async function getReusablePaymentForBooking(bookingId: string) {
  const client = getPublicWriteClient()

  const { data, error } = (await client
    .from("payments")
    .select("id,status,provider_order_id,approval_url,checkout_amount")
    .eq("booking_id", bookingId)
    .order("created_at", {
      ascending: false,
    })) as QueryRowsResponse<Record<string, unknown>>

  if (error) {
    throw new Error(
      getErrorMessage(error, "Unable to review the current checkout state.")
    )
  }

  const reusablePayment = (data ?? []).find((payment) => {
    return (
      toRequiredString(payment.status) === "created" &&
      !!toNullableString(payment.provider_order_id) &&
      !!toNullableString(payment.approval_url)
    )
  })

  if (!reusablePayment) {
    return null
  }

  const checkoutAmountValue = reusablePayment.checkout_amount

  return {
    id: toRequiredString(reusablePayment.id),
    providerOrderId: toRequiredString(reusablePayment.provider_order_id),
    approvalUrl: toRequiredString(reusablePayment.approval_url),
    checkoutAmount:
      typeof checkoutAmountValue === "number" && Number.isFinite(checkoutAmountValue)
        ? checkoutAmountValue.toFixed(2)
        : typeof checkoutAmountValue === "string"
          ? checkoutAmountValue
          : null,
  }
}

export async function getPaymentByProviderOrderId(input: {
  bookingId: string
  orderId: string
}) {
  const client = getPublicWriteClient()

  const { data, error } = (await client
    .from("payments")
    .select("id,status,provider_order_id,booking_id")
    .eq("booking_id", input.bookingId)
    .eq("provider_order_id", input.orderId)
    .maybeSingle()) as QueryResponse<Record<string, unknown>>

  if (error || !data) {
    throw new Error(
      getErrorMessage(error, "Unable to locate the payment for this order.")
    )
  }

  return {
    id: toRequiredString(data.id),
    status: toNullableString(data.status),
    providerOrderId: toNullableString(data.provider_order_id),
  }
}

export async function markPaymentCaptured(input: {
  bookingId: string
  paymentId: string
  orderId: string
  captureId: string | null
  captureStatus: string | null
  capturePayload: unknown
}) {
  const client = getPublicWriteClient()

  const { error: paymentError } = (await client
    .from("payments")
    .update({
      status: "completed",
      provider_capture_id: input.captureId,
      captured_at: new Date().toISOString(),
    })
    .eq("id", input.paymentId)
    .eq("provider_order_id", input.orderId)
    .select("id")
    .single()) as QueryResponse<Record<string, unknown>>

  if (paymentError) {
    throw new Error(
      getErrorMessage(paymentError, "Unable to update the payment state.")
    )
  }

  const { error: bookingError } = (await client
    .from("bookings")
    .update({
      payment_status: "paid",
      payment_completed_at: new Date().toISOString(),
    })
    .eq("id", input.bookingId)
    .select("id")
    .single()) as QueryResponse<Record<string, unknown>>

  if (bookingError) {
    throw new Error(
      getErrorMessage(bookingError, "Unable to update the booking state.")
    )
  }

  await logPaymentEvent({
    paymentId: input.paymentId,
    eventType: "paypal.order.captured",
    payload: {
      captureId: input.captureId,
      captureStatus: input.captureStatus,
      raw: input.capturePayload,
    },
  })
}

export async function markCalendlyClick(input: { bookingId: string }) {
  const client = getPublicWriteClient()
  const booking = await getBookingForPayment(input.bookingId)
  const calendlyUrl = getCalendlyUrlForIntent(booking.intent)

  if (!calendlyUrl) {
    throw new Error("Calendly URL is not configured for this booking.")
  }

  const { error } = (await client
    .from("bookings")
    .update({
      calendly_clicked_at: new Date().toISOString(),
    })
    .eq("id", input.bookingId)
    .select("id")
    .single()) as QueryResponse<Record<string, unknown>>

  if (error) {
    throw new Error(
      getErrorMessage(error, "Unable to prepare your Calendly link.")
    )
  }

  return { redirectUrl: calendlyUrl }
}

export async function logPaymentEvent(input: {
  paymentId: string
  eventType: string
  payload: unknown
}) {
  const client = getPublicWriteClient()

  await client.from("payment_events").insert({
    payment_id: input.paymentId,
    event_type: input.eventType,
    payload: input.payload,
  })
}

export async function getCheckoutAmountForBooking(bookingId: string) {
  const booking = await getBookingForPayment(bookingId)
  const pricingCategories = await getPublicPricingCategories()
  const plan = getPricingPlanForIntent(booking.intent, pricingCategories)
  const checkoutAmount = getCheckoutAmountUsdForIntent(
    booking.intent,
    pricingCategories
  )

  if (!plan || !checkoutAmount) {
    throw new Error("This booking does not require a paid checkout.")
  }

  return {
    booking,
    plan,
    checkoutAmount,
  }
}
