import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      message:
        "Calendly webhook event sync is not active for launch yet. Booking links and tracked click flow remain active.",
    },
    { status: 202 }
  )
}
