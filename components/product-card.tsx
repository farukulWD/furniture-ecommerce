"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, BarChart2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { useComparison } from "@/context/comparison-context"
import { useTranslation } from "@/context/i18n-context"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToComparison, removeFromComparison, isInComparison } = useComparison()
  const { t } = useTranslation()

  const inWishlist = isInWishlist(product.id)
  const inComparison = isInComparison(product.id)

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleComparisonToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (inComparison) {
      removeFromComparison(product.id)
    } else {
      addToComparison(product)
    }
  }

  return (
    <div className="border dark:border-gray-700 rounded-md p-2 group bg-white dark:bg-gray-800">
      <Link href={`/products/${product.id}`} className="block relative mb-2">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={200}
          height={200}
          className="w-full aspect-square object-cover"
        />
        {product.badge && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-600 dark:bg-red-700">{product.badge}</Badge>
          </div>
        )}
        {product.oldPrice && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-600 dark:bg-red-700">
              -
              {Math.round(
                (1 -
                  Number.parseInt(product.price.replace(/[^\d]/g, "")) /
                    Number.parseInt(product.oldPrice.replace(/[^\d]/g, ""))) *
                  100,
              )}
              %
            </Badge>
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Button
            size="icon"
            variant="outline"
            className={`h-8 w-8 rounded-full bg-white dark:bg-gray-700 ${
              inWishlist ? "border-red-600 dark:border-red-500" : ""
            } opacity-0 group-hover:opacity-100 transition-opacity`}
            onClick={handleWishlistToggle}
            title={inWishlist ? t("remove_from_wishlist") : t("add_to_wishlist")}
          >
            <Heart
              className={`h-4 w-4 ${inWishlist ? "text-red-600 fill-red-600 dark:text-red-500 dark:fill-red-500" : ""}`}
            />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className={`h-8 w-8 rounded-full bg-white dark:bg-gray-700 ${
              inComparison ? "border-blue-600 dark:border-blue-500" : ""
            } opacity-0 group-hover:opacity-100 transition-opacity`}
            onClick={handleComparisonToggle}
            title={inComparison ? t("remove_from_comparison") : t("add_to_comparison")}
          >
            <BarChart2 className={`h-4 w-4 ${inComparison ? "text-blue-600 dark:text-blue-500" : ""}`} />
          </Button>
        </div>
      </Link>
      <div className="flex items-center space-x-1 mb-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
        <span className="text-xs text-gray-500 dark:text-gray-400">(5)</span>
      </div>
      <Link href={`/products/${product.id}`}>
        <h3 className="text-sm font-medium line-clamp-2 mb-1 hover:text-red-600 dark:hover:text-red-400">
          {product.name}
        </h3>
      </Link>
      <div className="flex items-center space-x-2">
        <span className="text-red-600 dark:text-red-400 font-semibold">{product.price}</span>
        {product.oldPrice && (
          <span className="text-gray-500 dark:text-gray-400 text-xs line-through">{product.oldPrice}</span>
        )}
      </div>
      <Button
        className="w-full mt-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-xs h-8"
        onClick={() => addToCart(product)}
      >
        {t("add_to_cart")}
      </Button>
    </div>
  )
}
