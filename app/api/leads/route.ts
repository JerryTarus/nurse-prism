import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      message:
        "Lead request accepted. Database persistence and notification wiring are planned in upcoming phases.",
    },
    { status: 202 }
  )
}
