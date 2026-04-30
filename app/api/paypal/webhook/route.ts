import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      message:
        "PayPal webhook reconciliation is not active for launch yet. Checkout create and capture remain active.",
    },
    { status: 202 }
  )
}
