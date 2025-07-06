"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, CreditCard, Printer, Percent, DollarSign, ShoppingBag } from "lucide-react"
import { usePOS } from "@/context/pos-context"
import { Checkout } from "@/components/admin/pos/checkout"
import { Receipt } from "@/components/admin/pos/receipt"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function POSCart() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    tax,
    total,
    discountType,
    discountValue,
    setDiscountType,
    setDiscountValue,
    discountAmount,
  } = usePOS()

  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [completedSale, setCompletedSale] = useState<any>(null)

  const handleCheckout = (paymentDetails: any) => {
    // In a real app, this would process the payment and update inventory
    const sale = {
      id: `SALE-${Date.now()}`,
      date: new Date(),
      items: cart,
      subtotal,
      tax,
      discount: discountAmount,
      total,
      payment: paymentDetails,
    }

    setCompletedSale(sale)
    setCheckoutOpen(false)
    setReceiptOpen(true)

    // Clear the cart after successful checkout
    clearCart()
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Current Sale</h2>
        {cart.length > 0 && (
          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={clearCart}>
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
          <ShoppingBag className="h-12 w-12 mb-2 opacity-20" />
          <p>Cart is empty</p>
          <p className="text-sm">Scan or select products to add</p>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 -mx-4 px-4">
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.price} × {item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center ml-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                      className="w-12 h-7 mx-1 text-center p-0"
                    />

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 ml-1 text-red-500 hover:text-red-700"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="space-y-3 mt-4 pt-3 border-t">
            <div className="flex items-center">
              <div className="flex-1 flex items-center">
                <span className="text-sm">Discount:</span>
                <Select value={discountType} onValueChange={setDiscountType}>
                  <SelectTrigger className="w-20 h-8 ml-2 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">
                      <Percent className="h-3 w-3 mr-1 inline" />
                      Percent
                    </SelectItem>
                    <SelectItem value="fixed">
                      <DollarSign className="h-3 w-3 mr-1 inline" />
                      Fixed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Input
                type="number"
                min="0"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number.parseFloat(e.target.value) || 0)}
                className="w-20 h-8 text-right"
              />
            </div>

            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount:</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span>Tax (8%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button variant="outline" onClick={() => setReceiptOpen(true)} disabled={!completedSale}>
                <Printer className="h-4 w-4 mr-2" />
                Receipt
              </Button>

              <Button onClick={() => setCheckoutOpen(true)}>
                <CreditCard className="h-4 w-4 mr-2" />
                Checkout
              </Button>
            </div>
          </div>
        </>
      )}

      <Checkout
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onCheckout={handleCheckout}
        total={total}
      />

      <Receipt isOpen={receiptOpen} onClose={() => setReceiptOpen(false)} sale={completedSale} />
    </>
  )
}
