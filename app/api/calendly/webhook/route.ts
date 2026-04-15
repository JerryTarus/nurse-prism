import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      message:
        "Calendly webhook endpoint is reserved for future event sync. Launch flow currently uses tracked Calendly links.",
    },
    { status: 202 }
  )
}
