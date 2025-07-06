import { type NextRequest, NextResponse } from "next/server"
import { getPayPalAccessToken } from "@/lib/paypal"

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()
    const accessToken = await getPayPalAccessToken()

    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to capture PayPal payment")
    }

    const captureData = await response.json()
    return NextResponse.json(captureData)
  } catch (error) {
    console.error("Error capturing PayPal payment:", error)
    return NextResponse.json({ error: "Failed to capture PayPal payment" }, { status: 500 })
  }
}
