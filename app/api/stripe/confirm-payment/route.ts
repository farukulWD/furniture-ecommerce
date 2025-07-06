import { type NextRequest, NextResponse } from "next/server"
import { confirmPaymentIntent } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment intent ID is required" }, { status: 400 })
    }

    const paymentIntent = await confirmPaymentIntent(paymentIntentId)

    return NextResponse.json({
      status: paymentIntent.status,
      paymentIntent,
    })
  } catch (error) {
    console.error("Error confirming payment:", error)
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 })
  }
}
