"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRight, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { PaymentMethods } from "@/components/payment/payment-methods"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { cart, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Bangladesh",
    notes: "",
  })

  // Calculate order summary
  const subtotal = cart.reduce((total, item) => {
    return total + Number.parseInt(item.price.replace(/[^\d]/g, "")) * item.quantity
  }, 0)

  const shipping = subtotal > 5000 ? 0 : 200 // Free shipping over 5000
  const discount = 0 // No discount applied yet
  const total = subtotal + shipping - discount

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      // Validate shipping information
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone ||
        !formData.address ||
        !formData.city ||
        !formData.zipCode
      ) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }
      setStep(2)
    }
  }

  // Handle payment success
  const handlePaymentSuccess = (paymentDetails: any) => {
    setLoading(true)

    // Simulate order processing
    setTimeout(() => {
      setLoading(false)
      setStep(3)
      clearCart()

      toast({
        title: "Order placed successfully",
        description: "Your payment has been processed and order confirmed.",
      })
    }, 2000)
  }

  // Handle payment error
  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment failed",
      description: error,
      variant: "destructive",
    })
  }

  // If cart is empty, redirect to cart page
  if (cart.length === 0 && step !== 3) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">You need to add products to your cart before checkout.</p>
        <Link href="/cart">
          <Button className="bg-red-600 hover:bg-red-700">Go to Cart</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      {/* Checkout Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className={`flex flex-col items-center ${step >= 1 ? "text-red-600" : "text-gray-400"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? "border-red-600 bg-red-50" : "border-gray-300"}`}
            >
              1
            </div>
            <span className="text-sm mt-1">Shipping</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? "bg-red-600" : "bg-gray-300"}`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? "text-red-600" : "text-gray-400"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? "border-red-600 bg-red-50" : "border-gray-300"}`}
            >
              2
            </div>
            <span className="text-sm mt-1">Payment</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? "bg-red-600" : "bg-gray-300"}`}></div>
          <div className={`flex flex-col items-center ${step >= 3 ? "text-red-600" : "text-gray-400"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? "border-red-600 bg-red-50" : "border-gray-300"}`}
            >
              3
            </div>
            <span className="text-sm mt-1">Confirmation</span>
          </div>
        </div>
      </div>

      {/* Step 1: Shipping Information */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border rounded-md p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="col-span-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input id="state" name="state" value={formData.state} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Postal Code *</Label>
                    <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="country">Country *</Label>
                  <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Notes about your order, e.g. special notes for delivery"
                    value={formData.notes}
                    onChange={handleChange}
                    className="h-24"
                  />
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  Continue to Payment
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          <div>
            <div className="border rounded-md p-4 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="max-h-80 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center py-2 border-b">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg?height=64&width=64"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-200 text-gray-800 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.price} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      ৳{(Number.parseInt(item.price.replace(/[^\d]/g, "")) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `৳${shipping.toLocaleString()}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount</span>
                    <span>-৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Payment Method */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border rounded-md p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

              <div className="flex justify-between mb-6">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="border-gray-300">
                  Back to Shipping
                </Button>
              </div>

              <PaymentMethods
                amount={total / 100} // Convert from cents to dollars for display
                currency="USD"
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          </div>

          <div>
            <div className="border rounded-md p-4 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="max-h-80 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center py-2 border-b">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg?height=64&width=64"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-200 text-gray-800 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.price} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      ৳{(Number.parseInt(item.price.replace(/[^\d]/g, "")) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `৳${shipping.toLocaleString()}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount</span>
                    <span>-৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <address className="text-sm text-gray-600 not-italic">
                  {formData.firstName} {formData.lastName}
                  <br />
                  {formData.address}
                  <br />
                  {formData.city}, {formData.state} {formData.zipCode}
                  <br />
                  {formData.country}
                  <br />
                  Phone: {formData.phone}
                </address>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Order Confirmation */}
      {step === 3 && (
        <div className="max-w-2xl mx-auto text-center py-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">Thank You for Your Order!</h2>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully. We've sent a confirmation email to {formData.email}.
          </p>

          <div className="bg-gray-50 rounded-md p-6 mb-6 text-left">
            <h3 className="font-semibold mb-2">Order Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order Number:</p>
                <p className="font-medium">
                  MS-
                  {Math.floor(Math.random() * 10000)
                    .toString()
                    .padStart(4, "0")}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Date:</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Method:</p>
                <p className="font-medium">Online Payment</p>
              </div>
              <div>
                <p className="text-gray-600">Total Amount:</p>
                <p className="font-medium">৳{total.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Link href="/account/orders">
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent"
              >
                Track Order
              </Button>
            </Link>
            <Link href="/">
              <Button className="bg-red-600 hover:bg-red-700">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
