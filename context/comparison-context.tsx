"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "@/context/i18n-context"

// Maximum number of products that can be compared
const MAX_COMPARISON_ITEMS = 4

type ComparisonContextType = {
  comparisonItems: any[]
  addToComparison: (product: any) => void
  removeFromComparison: (productId: string) => void
  clearComparison: () => void
  isInComparison: (productId: string) => boolean
  comparisonCount: number
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonItems, setComparisonItems] = useState<any[]>([])
  const { toast } = useToast()
  const { t } = useTranslation()

  // Load comparison items from localStorage on initial render
  useEffect(() => {
    const storedItems = localStorage.getItem("comparisonItems")
    if (storedItems) {
      try {
        setComparisonItems(JSON.parse(storedItems))
      } catch (error) {
        console.error("Failed to parse comparison items from localStorage:", error)
        localStorage.removeItem("comparisonItems")
      }
    }
  }, [])

  // Save comparison items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("comparisonItems", JSON.stringify(comparisonItems))
  }, [comparisonItems])

  // Add a product to comparison
  const addToComparison = (product: any) => {
    if (isInComparison(product.id)) {
      toast({
        title: t("product_already_in_comparison"),
        description: t("product_already_added_to_comparison"),
      })
      return
    }

    if (comparisonItems.length >= MAX_COMPARISON_ITEMS) {
      toast({
        title: t("comparison_limit_reached"),
        description: t("remove_item_to_add_new"),
        variant: "destructive",
      })
      return
    }

    setComparisonItems((prev) => [...prev, product])
    toast({
      title: t("product_added_to_comparison"),
      description: t("product_added_to_comparison_success"),
    })
  }

  // Remove a product from comparison
  const removeFromComparison = (productId: string) => {
    setComparisonItems((prev) => prev.filter((item) => item.id !== productId))
    toast({
      title: t("product_removed_from_comparison"),
      description: t("product_removed_from_comparison_success"),
    })
  }

  // Clear all products from comparison
  const clearComparison = () => {
    setComparisonItems([])
    toast({
      title: t("comparison_cleared"),
      description: t("all_products_removed_from_comparison"),
    })
  }

  // Check if a product is in comparison
  const isInComparison = (productId: string) => {
    return comparisonItems.some((item) => item.id === productId)
  }

  // Get the number of products in comparison
  const comparisonCount = comparisonItems.length

  return (
    <ComparisonContext.Provider
      value={{
        comparisonItems,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        comparisonCount,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider")
  }
  return context
}
