"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface PayPalPaymentProps {
  amount: number
  currency?: string
  onSuccess: (details: any) => void
  onError: (error: string) => void
}

declare global {
  interface Window {
    paypal?: any
  }
}

export function PayPalPayment({ amount, currency = "USD", onSuccess, onError }: PayPalPaymentProps) {
  const paypalRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadPayPalScript = () => {
      if (window.paypal) {
        renderPayPalButtons()
        return
      }

      const script = document.createElement("script")
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}`
      script.addEventListener("load", renderPayPalButtons)
      document.body.appendChild(script)
    }

    const renderPayPalButtons = () => {
      if (!window.paypal || !paypalRef.current) return

      window.paypal
        .Buttons({
          createOrder: async () => {
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

              const order = await response.json()
              return order.id
            } catch (error) {
              console.error("Error creating PayPal order:", error)
              onError("Failed to create PayPal order")
              throw error
            }
          },
          onApprove: async (data: any) => {
            try {
              const response = await fetch("/api/paypal/capture-payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId: data.orderID,
                }),
              })

              const details = await response.json()
              onSuccess(details)
              toast({
                title: "Payment successful",
                description: "Your PayPal payment has been processed successfully.",
              })
            } catch (error) {
              console.error("Error capturing PayPal payment:", error)
              onError("Failed to capture PayPal payment")
            }
          },
          onError: (err: any) => {
            console.error("PayPal error:", err)
            onError("PayPal payment failed")
            toast({
              title: "Payment failed",
              description: "There was an error processing your PayPal payment.",
              variant: "destructive",
            })
          },
          style: {
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
          },
        })
        .render(paypalRef.current)
    }

    loadPayPalScript()
  }, [amount, currency, onSuccess, onError, toast])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <img src="/placeholder.svg?height=24&width=24" alt="PayPal" className="mr-2 h-6 w-6" />
          Pay with PayPal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center text-sm text-gray-600">
          <span>Total Amount:</span>
          <span className="font-semibold">
            ${amount.toFixed(2)} {currency}
          </span>
        </div>
        <div ref={paypalRef} />
      </CardContent>
    </Card>
  )
}
