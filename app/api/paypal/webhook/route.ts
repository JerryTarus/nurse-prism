import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      message:
        "PayPal webhook endpoint is reserved for verified production reconciliation. Checkout create and capture are already active.",
    },
    { status: 202 }
  )
}
