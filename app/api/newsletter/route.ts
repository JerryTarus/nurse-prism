import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      message:
        "Newsletter request accepted. Provider integration will be connected in a later phase.",
    },
    { status: 202 }
  )
}
