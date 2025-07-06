// PayPal configuration
export const paypalConfig = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
}

// Create PayPal order
export async function createPayPalOrder(amount: number, currency = "USD") {
  try {
    const response = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount.toFixed(2),
        currency,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create PayPal order")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating PayPal order:", error)
    throw error
  }
}

// Capture PayPal payment
export async function capturePayPalPayment(orderId: string) {
  try {
    const response = await fetch("/api/paypal/capture-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to capture PayPal payment")
    }

    return await response.json()
  } catch (error) {
    console.error("Error capturing PayPal payment:", error)
    throw error
  }
}

// Get PayPal access token
export async function getPayPalAccessToken() {
  const auth = Buffer.from(`${paypalConfig.clientId}:${paypalConfig.clientSecret}`).toString("base64")

  const response = await fetch(`https://api-m.${paypalConfig.environment}.paypal.com/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  if (!response.ok) {
    throw new Error("Failed to get PayPal access token")
  }

  const data = await response.json()
  return data.access_token
}
