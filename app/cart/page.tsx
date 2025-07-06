"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/cart-context"

export default function CartPage() {
  const router = useRouter()
  const { cart, updateQuantity, removeFromCart } = useCart()
  const [couponCode, setCouponCode] = useState("")

  const subtotal = cart.reduce((total, item) => {
    return total + Number.parseInt(item.price.replace(/[^\d]/g, "")) * item.quantity
  }, 0)

  const shipping = subtotal > 5000 ? 0 : 200 // Free shipping over 5000
  const discount = 0 // No discount applied yet
  const total = subtotal + shipping - discount

  const handleCheckout = () => {
    router.push("/checkout")
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Link href="/">
          <Button className="bg-red-600 hover:bg-red-700">Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 grid grid-cols-12 gap-4 text-sm font-medium">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Total</div>
            </div>

            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.id} className="px-4 py-4 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-6 flex items-center space-x-4">
                    <Image
                      src={item.image || "/placeholder.svg?height=80&width=80"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-md"
                    />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm text-red-600 flex items-center mt-1"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">{item.price}</div>

                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="col-span-2 text-center font-medium">
                    ৳{(Number.parseInt(item.price.replace(/[^\d]/g, "")) * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 gap-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Coupon Code"
                className="w-auto"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                Apply Coupon
              </Button>
            </div>

            <Link href="/">
              <Button variant="outline" className="border-gray-300">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="border rounded-md p-4">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
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

            <Button
              className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
              onClick={handleCheckout}
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="mt-4 text-xs text-gray-500 text-center">Secure checkout powered by SSL Commerz</div>
          </div>
        </div>
      </div>
    </div>
  )
}
