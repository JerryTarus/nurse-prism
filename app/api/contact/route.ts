import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      message:
        "Contact endpoint received your request. Persistent storage wiring is scheduled for a later phase.",
    },
    { status: 202 }
  )
}
