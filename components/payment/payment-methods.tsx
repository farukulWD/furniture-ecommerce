"use client"

import { StripePayment } from "./stripe-payment"

interface PaymentMethodsProps {
  amount: number
  currency?: string
  onSuccess: (paymentDetails: any) => void
  onError: (error: string) => void
}

export function PaymentMethods({ amount, currency = "USD", onSuccess, onError }: PaymentMethodsProps) {
  const handlePaymentSuccess = (paymentDetails: any) => {
    onSuccess({
      ...paymentDetails,
      method: "stripe",
      amount,
      currency,
    })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <StripePayment
        amount={amount}
        currency={currency.toLowerCase()}
        onSuccess={handlePaymentSuccess}
        onError={onError}
      />
    </div>
  )
}
