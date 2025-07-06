"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useWishlist } from "@/context/wishlist-context"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "@/context/i18n-context"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = (product) => {
    addToCart(product)
    toast({
      title: t("added_to_cart"),
      description: product.name,
    })
  }

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId)
    toast({
      title: t("removed_from_wishlist"),
      description: wishlist.find((item) => item.id === productId)?.name,
    })
  }

  const handleAddAllToCart = () => {
    setIsLoading(true)
    setTimeout(() => {
      wishlist.forEach((product) => {
        addToCart(product)
      })
      toast({
        title: t("added_to_cart"),
        description: `${wishlist.length} ${t("products")}`,
      })
      setIsLoading(false)
    }, 1000)
  }

  const handleClearWishlist = () => {
    clearWishlist()
    toast({
      title: t("wishlist"),
      description: t("your_wishlist_is_empty"),
    })
  }

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{t("my_wishlist")}</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">{t("your_wishlist_is_empty")}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {t("browse_products")} {t("add_to_wishlist")}
          </p>
          <Button asChild>
            <Link href="/products">{t("browse_products")}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("my_wishlist")}</h1>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={handleClearWishlist}
            className="text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-950"
          >
            {t("clear_wishlist")}
          </Button>
          <Button onClick={handleAddAllToCart} disabled={isLoading}>
            {isLoading ? (
              <span className="animate-pulse">{t("add_all_to_cart")}...</span>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {t("add_all_to_cart")}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
              <Link href={`/products/${product.id}`}>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={() => handleRemoveFromWishlist(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-4">
              <Link href={`/products/${product.id}`} className="hover:underline">
                <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
              </Link>
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-red-600 dark:text-red-400">{product.price}</span>
                {product.oldPrice && <span className="text-sm text-gray-500 line-through">{product.oldPrice}</span>}
              </div>
              <Button onClick={() => handleAddToCart(product)} className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                {t("add_to_cart")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
