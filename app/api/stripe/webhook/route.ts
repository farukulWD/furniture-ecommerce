import { type NextRequest, NextResponse } from "next/server"
import { constructWebhookEvent } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
    }

    const event = constructWebhookEvent(body, signature)

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object
        console.log(`PaymentIntent ${paymentIntent.id} succeeded!`)

        // Here you would typically:
        // 1. Update your database with the successful payment
        // 2. Send confirmation email to customer
        // 3. Update inventory
        // 4. Create order record

        break
      case "payment_intent.payment_failed":
        const failedPayment = event.data.object
        console.log(`PaymentIntent ${failedPayment.id} failed!`)

        // Handle failed payment
        // 1. Log the failure
        // 2. Notify customer if needed
        // 3. Update order status

        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 })
  }
}
