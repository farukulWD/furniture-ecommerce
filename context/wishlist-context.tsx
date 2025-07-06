"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "./i18n-context"

type Product = {
  id: string
  name: string
  price: number
  image: string
  category: string
  slug: string
}

type WishlistContextType = {
  wishlist: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const { toast } = useToast()
  const { t } = useTranslation()

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem("ms-furniture-wishlist")
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist))
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error)
        setWishlist([])
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("ms-furniture-wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      setWishlist((prev) => [...prev, product])
      toast({
        title: t("added_to_wishlist"),
        description: product.name,
      })
    }
  }

  const removeFromWishlist = (productId: string) => {
    const product = wishlist.find((item) => item.id === productId)
    setWishlist((prev) => prev.filter((item) => item.id !== productId))
    if (product) {
      toast({
        title: t("removed_from_wishlist"),
        description: product.name,
      })
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId)
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
