import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
  typescript: true,
});

// Create payment intent
export async function createPaymentIntent(amount: number, currency = "usd") {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
}

// Confirm payment intent
export async function confirmPaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error("Error confirming payment intent:", error);
    throw error;
  }
}

// Construct webhook event
export function constructWebhookEvent(body: string, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error(
      "STRIPE_WEBHOOK_SECRET is not set in environment variables"
    );
  }

  try {
    return stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Error constructing webhook event:", error);
    throw error;
  }
}
