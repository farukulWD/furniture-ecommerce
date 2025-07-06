"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Lock } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripePaymentProps {
  amount: number;
  currency?: string;
  onSuccess: (paymentDetails: any) => void;
  onError: (error: string) => void;
}

function CheckoutForm({
  amount,
  currency = "usd",
  onSuccess,
  onError,
}: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          onError(data.error);
        } else {
          setClientSecret(data.clientSecret);
        }
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
        onError("Failed to initialize payment");
      });
  }, [amount, currency, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      console.error("Payment failed:", error);
      onError(error.message || "Payment failed");
      toast({
        title: "Payment failed",
        description:
          error.message || "There was an error processing your payment.",
        variant: "destructive",
      });
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess({
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      });
      toast({
        title: "Payment successful",
        description: "Your payment has been processed successfully.",
      });
    }

    setProcessing(false);
  };

  const cardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Pay with Card
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4 flex justify-between items-center text-sm text-gray-600">
            <span>Total Amount:</span>
            <span className="font-semibold">
              ${amount.toFixed(2)} {currency.toUpperCase()}
            </span>
          </div>

          <div className="p-3 border rounded-md">
            <CardElement options={cardElementOptions} />
          </div>

          <div className="flex items-center text-xs text-gray-500 mb-4">
            <Lock className="mr-1 h-3 w-3" />
            Your payment information is secure and encrypted
          </div>

          <Button
            type="submit"
            disabled={!stripe || processing || !clientSecret}
            className="w-full"
            size="lg"
          >
            {processing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function StripePayment(props: StripePaymentProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
