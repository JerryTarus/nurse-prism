import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      message: "Calendly webhook endpoint scaffolded. Implementation is scheduled for a later phase.",
    },
    { status: 501 }
  )
}
