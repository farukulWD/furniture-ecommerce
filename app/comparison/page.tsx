"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { X, ArrowLeft, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useComparison } from "@/context/comparison-context"
import { useCart } from "@/context/cart-context"
import { useTranslation } from "@/context/i18n-context"

export default function ComparisonPage() {
  const { comparisonItems, removeFromComparison, clearComparison, comparisonCount } = useComparison()
  const { addToCart } = useCart()
  const router = useRouter()
  const { t } = useTranslation()

  // Redirect to products page if no items to compare
  useEffect(() => {
    if (comparisonCount === 0) {
      router.push("/products")
    }
  }, [comparisonCount, router])

  if (comparisonCount === 0) {
    return null
  }

  // Define the comparison attributes
  const comparisonAttributes = [
    { key: "name", label: t("product_name") },
    { key: "price", label: t("price") },
    { key: "category", label: t("category"), transform: (value) => value.replace(/-/g, " ") },
    { key: "subcategory", label: t("subcategory"), transform: (value) => value.replace(/-/g, " ") },
    { key: "rating", label: t("rating") },
    { key: "description", label: t("description") },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("back")}
          </Button>
          <h1 className="text-2xl font-bold">{t("product_comparison")}</h1>
        </div>
        <Button variant="outline" size="sm" onClick={clearComparison} className="text-red-600">
          <X className="h-4 w-4 mr-2" />
          {t("clear_comparison")}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Product Images Row */}
          <thead>
            <tr>
              <th className="w-1/4 p-4 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800"></th>
              {comparisonItems.map((product) => (
                <th key={product.id} className="p-4 border dark:border-gray-700 bg-white dark:bg-gray-800 text-center">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                      onClick={() => removeFromComparison(product.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <div className="flex justify-center mb-2">
                      <Link href={`/products/${product.id}`}>
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={120}
                          height={120}
                          className="object-cover"
                        />
                      </Link>
                    </div>
                    <Link href={`/products/${product.id}`} className="text-sm font-medium hover:text-red-600">
                      {product.name}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Product Attributes */}
            {comparisonAttributes.map((attr) => (
              <tr key={attr.key}>
                <th className="p-4 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-left font-medium">
                  {attr.label}
                </th>
                {comparisonItems.map((product) => (
                  <td key={`${product.id}-${attr.key}`} className="p-4 border dark:border-gray-700 text-sm">
                    {attr.transform ? attr.transform(product[attr.key]) : product[attr.key]}
                  </td>
                ))}
              </tr>
            ))}
            {/* Add to Cart Row */}
            <tr>
              <th className="p-4 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-left font-medium">
                {t("actions")}
              </th>
              {comparisonItems.map((product) => (
                <td key={`${product.id}-actions`} className="p-4 border dark:border-gray-700">
                  <Button
                    onClick={() => addToCart(product)}
                    className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {t("add_to_cart")}
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile view - only visible on small screens */}
      <div className="md:hidden mt-8 space-y-8">
        {comparisonItems.map((product) => (
          <div key={product.id} className="border dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="relative p-4 bg-white dark:bg-gray-800">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                onClick={() => removeFromComparison(product.id)}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="flex justify-center mb-4">
                <Link href={`/products/${product.id}`}>
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={150}
                    height={150}
                    className="object-cover"
                  />
                </Link>
              </div>
              <Link href={`/products/${product.id}`} className="block text-center font-medium mb-4 hover:text-red-600">
                {product.name}
              </Link>
              <div className="space-y-2">
                {comparisonAttributes.slice(1).map((attr) => (
                  <div key={attr.key} className="flex justify-between">
                    <span className="text-sm font-medium">{attr.label}:</span>
                    <span className="text-sm">
                      {attr.transform ? attr.transform(product[attr.key]) : product[attr.key]}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => addToCart(product)}
                className="w-full mt-4 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t("add_to_cart")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
