"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { products as initialProducts } from "@/lib/data"

// Add stock property to products
const productsWithStock = initialProducts.map((product) => ({
  ...product,
  stock: Math.floor(Math.random() * 50) + 1, // Random stock between 1-50 for demo
  lowStockThreshold: 10,
  barcode: null, // Initialize barcode as null
}))

// Types
export type InventoryProduct = {
  id: string
  name: string
  price: string
  image: string
  stock: number
  lowStockThreshold: number
  category: string
  subcategory: string
  barcode?: string | null
}

type InventoryMovement = {
  id: string
  productId: string
  productName: string
  previousStock: number
  newStock: number
  quantity: number
  type: "increase" | "decrease" | "adjustment" | "order"
  reason: string
  timestamp: Date
  performedBy: string
}

type InventoryContextType = {
  products: InventoryProduct[]
  getProduct: (id: string) => InventoryProduct | undefined
  updateStock: (
    productId: string,
    quantity: number,
    type: "increase" | "decrease" | "adjustment" | "order",
    reason: string,
    performedBy: string,
  ) => void
  movements: InventoryMovement[]
  lowStockProducts: InventoryProduct[]
  updateLowStockThreshold: (productId: string, threshold: number) => void
  getProductMovements: (productId: string) => InventoryMovement[]
  getTotalInventoryValue: () => number
  getInventoryValueByCategory: () => Record<string, number>
  updateProductBarcode: (productId: string, barcode: string) => void
  getProductByBarcode: (barcode: string) => InventoryProduct | undefined
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [products, setProducts] = useState<InventoryProduct[]>([])
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [initialized, setInitialized] = useState(false)

  // Initialize from localStorage or default data
  useEffect(() => {
    if (typeof window !== "undefined" && !initialized) {
      const storedProducts = localStorage.getItem("inventory-products")
      const storedMovements = localStorage.getItem("inventory-movements")

      if (storedProducts) {
        setProducts(JSON.parse(storedProducts))
      } else {
        setProducts(productsWithStock)
      }

      if (storedMovements) {
        setMovements(JSON.parse(storedMovements))
      }

      setInitialized(true)
    }
  }, [initialized])

  // Save to localStorage when data changes
  useEffect(() => {
    if (initialized && typeof window !== "undefined") {
      localStorage.setItem("inventory-products", JSON.stringify(products))
      localStorage.setItem("inventory-movements", JSON.stringify(movements))
    }
  }, [products, movements, initialized])

  // Get a single product by ID
  const getProduct = (id: string) => {
    return products.find((product) => product.id === id)
  }

  // Get a product by barcode
  const getProductByBarcode = (barcode: string) => {
    return products.find((product) => product.barcode === barcode)
  }

  // Update product barcode
  const updateProductBarcode = (productId: string, barcode: string) => {
    setProducts((currentProducts) => {
      return currentProducts.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            barcode,
          }
        }
        return product
      })
    })
  }

  // Update stock levels and record movement
  const updateStock = (
    productId: string,
    quantity: number,
    type: "increase" | "decrease" | "adjustment" | "order",
    reason: string,
    performedBy: string,
  ) => {
    setProducts((currentProducts) => {
      const updatedProducts = currentProducts.map((product) => {
        if (product.id === productId) {
          const previousStock = product.stock
          let newStock = previousStock

          if (type === "increase") {
            newStock = previousStock + quantity
          } else if (type === "decrease") {
            newStock = Math.max(0, previousStock - quantity)
          } else if (type === "adjustment") {
            newStock = quantity
          }

          // Record movement
          const movement: InventoryMovement = {
            id: Date.now().toString(),
            productId,
            productName: product.name,
            previousStock,
            newStock,
            quantity: Math.abs(newStock - previousStock),
            type,
            reason,
            timestamp: new Date(),
            performedBy,
          }

          setMovements((prev) => [movement, ...prev])

          // Check if stock is low after update
          if (newStock <= product.lowStockThreshold && newStock > 0) {
            toast({
              title: "Low Stock Alert",
              description: `${product.name} is running low (${newStock} remaining)`,
              variant: "destructive",
            })
          }

          // Check if out of stock
          if (newStock === 0) {
            toast({
              title: "Out of Stock Alert",
              description: `${product.name} is now out of stock!`,
              variant: "destructive",
            })
          }

          return {
            ...product,
            stock: newStock,
          }
        }
        return product
      })

      return updatedProducts
    })
  }

  // Update low stock threshold
  const updateLowStockThreshold = (productId: string, threshold: number) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId ? { ...product, lowStockThreshold: threshold } : product,
      ),
    )
  }

  // Get products with low stock
  const lowStockProducts = products.filter((product) => product.stock <= product.lowStockThreshold && product.stock > 0)

  // Get movements for a specific product
  const getProductMovements = (productId: string) => {
    return movements.filter((movement) => movement.productId === productId)
  }

  // Calculate total inventory value
  const getTotalInventoryValue = () => {
    return products.reduce((total, product) => {
      const price = Number.parseFloat(product.price.replace(/[^\d.-]/g, ""))
      return total + price * product.stock
    }, 0)
  }

  // Get inventory value by category
  const getInventoryValueByCategory = () => {
    const categoryValues: Record<string, number> = {}

    products.forEach((product) => {
      const price = Number.parseFloat(product.price.replace(/[^\d.-]/g, ""))
      const value = price * product.stock

      if (categoryValues[product.category]) {
        categoryValues[product.category] += value
      } else {
        categoryValues[product.category] = value
      }
    })

    return categoryValues
  }

  return (
    <InventoryContext.Provider
      value={{
        products,
        getProduct,
        updateStock,
        movements,
        lowStockProducts,
        updateLowStockThreshold,
        getProductMovements,
        getTotalInventoryValue,
        getInventoryValueByCategory,
        updateProductBarcode,
        getProductByBarcode,
      }}
    >
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}
