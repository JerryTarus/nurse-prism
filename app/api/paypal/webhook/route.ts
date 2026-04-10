import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      message: "PayPal webhook endpoint scaffolded. Implementation is scheduled for a later phase.",
    },
    { status: 501 }
  )
}
