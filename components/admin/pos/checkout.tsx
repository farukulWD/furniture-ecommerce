"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, DollarSign } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { PaymentMethods } from "@/components/payment/payment-methods"

interface CheckoutProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: (paymentDetails: any) => void
  total: number
}

export function Checkout({ isOpen, onClose, onCheckout, total }: CheckoutProps) {
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [cashReceived, setCashReceived] = useState(total.toFixed(2))
  const [processing, setProcessing] = useState(false)

  const handleOnlinePayment = (paymentDetails: any) => {
    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      onCheckout({
        ...paymentDetails,
        method: "card",
      })

      toast({
        title: "Payment successful",
        description: "The card transaction has been completed.",
      })
    }, 1000)
  }

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment failed",
      description: error,
      variant: "destructive",
    })
  }

  const handleCashPayment = () => {
    const cashAmount = Number.parseFloat(cashReceived)
    if (isNaN(cashAmount) || cashAmount < total) {
      toast({
        title: "Invalid amount",
        description: "Cash received must be at least the total amount.",
        variant: "destructive",
      })
      return
    }

    onCheckout({
      method: "cash",
      received: cashAmount,
      change: cashAmount - total,
    })

    toast({
      title: "Cash payment recorded",
      description: "The cash transaction has been recorded.",
    })
  }

  const change = Number.parseFloat(cashReceived) - total

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Checkout - ${total.toFixed(2)}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="cash" value={paymentMethod} onValueChange={setPaymentMethod}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="cash">
              <DollarSign className="h-4 w-4 mr-2" />
              Cash
            </TabsTrigger>
            <TabsTrigger value="card">
              <CreditCard className="h-4 w-4 mr-2" />
              Card
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cash" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cash-received">Cash Received</Label>
              <Input
                id="cash-received"
                type="number"
                min={total}
                step="0.01"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
              />
            </div>

            {Number.parseFloat(cashReceived) >= total && (
              <div className="p-3 bg-muted rounded-md">
                <div className="flex justify-between text-sm">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cash:</span>
                  <span>${Number.parseFloat(cashReceived).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold mt-1 pt-1 border-t">
                  <span>Change:</span>
                  <span>${change.toFixed(2)}</span>
                </div>
              </div>
            )}

            <Button onClick={handleCashPayment} className="w-full" size="lg">
              Record Cash Payment
            </Button>
          </TabsContent>

          <TabsContent value="card" className="space-y-4">
            <PaymentMethods
              amount={total}
              currency="USD"
              onSuccess={handleOnlinePayment}
              onError={handlePaymentError}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={processing}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
