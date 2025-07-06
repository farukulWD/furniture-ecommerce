"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { InventoryProduct } from "@/context/inventory-context"

interface CartItem extends InventoryProduct {
  quantity: number
}

interface POSContextType {
  cart: CartItem[]
  addToCart: (product: InventoryProduct) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  subtotal: number
  tax: number
  total: number
  discountType: "percentage" | "fixed"
  discountValue: number
  discountAmount: number
  setDiscountType: (type: "percentage" | "fixed") => void
  setDiscountValue: (value: number) => void
}

const POSContext = createContext<POSContextType | undefined>(undefined)

export function POSProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage")
  const [discountValue, setDiscountValue] = useState(0)
  const [initialized, setInitialized] = useState(false)

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && !initialized) {
      const storedCart = localStorage.getItem("pos-cart")
      const storedDiscountType = localStorage.getItem("pos-discount-type")
      const storedDiscountValue = localStorage.getItem("pos-discount-value")

      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart))
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error)
        }
      }

      if (storedDiscountType) {
        setDiscountType(storedDiscountType as "percentage" | "fixed")
      }

      if (storedDiscountValue) {
        setDiscountValue(Number.parseFloat(storedDiscountValue))
      }

      setInitialized(true)
    }
  }, [initialized])

  // Save to localStorage when data changes
  useEffect(() => {
    if (initialized && typeof window !== "undefined") {
      localStorage.setItem("pos-cart", JSON.stringify(cart))
      localStorage.setItem("pos-discount-type", discountType)
      localStorage.setItem("pos-discount-value", discountValue.toString())
    }
  }, [cart, discountType, discountValue, initialized])

  // Add product to cart
  const addToCart = (product: InventoryProduct) => {
    setCart((prevCart) => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id)

      if (existingItemIndex >= 0) {
        // If product exists, increase quantity
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        }
        return updatedCart
      } else {
        // If product doesn't exist, add it with quantity 1
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  // Update quantity of a product in cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return

    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
    setDiscountValue(0)
  }

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => {
    const price = Number.parseFloat(item.price.replace(/[^\d.-]/g, ""))
    return total + price * item.quantity
  }, 0)

  // Calculate discount amount
  const discountAmount =
    discountType === "percentage" ? subtotal * (discountValue / 100) : Math.min(discountValue, subtotal)

  // Calculate tax (8%)
  const taxableAmount = subtotal - discountAmount
  const tax = taxableAmount * 0.08

  // Calculate total
  const total = taxableAmount + tax

  return (
    <POSContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        tax,
        total,
        discountType,
        discountValue,
        discountAmount,
        setDiscountType,
        setDiscountValue,
      }}
    >
      {children}
    </POSContext.Provider>
  )
}

export function usePOS() {
  const context = useContext(POSContext)
  if (context === undefined) {
    throw new Error("usePOS must be used within a POSProvider")
  }
  return context
}
