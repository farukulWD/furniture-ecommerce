import { type NextRequest, NextResponse } from "next/server"
import { getPayPalAccessToken } from "@/lib/paypal"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "USD" } = await request.json()
    const accessToken = await getPayPalAccessToken()

    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
        },
      ],
    }

    const response = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      throw new Error("Failed to create PayPal order")
    }

    const order = await response.json()
    return NextResponse.json(order)
  } catch (error) {
    console.error("Error creating PayPal order:", error)
    return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 })
  }
}
