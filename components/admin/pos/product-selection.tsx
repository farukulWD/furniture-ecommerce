"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePOS } from "@/context/pos-context"
import { Search, QrCode } from "lucide-react"
import { QRCodeGenerator } from "@/components/admin/qr-code-generator"
import type { InventoryProduct } from "@/context/inventory-context"

interface ProductSelectionProps {
  products: InventoryProduct[]
}

export function ProductSelection({ products }: ProductSelectionProps) {
  const { addToCart } = usePOS()
  const [searchQuery, setSearchQuery] = useState("")
  const [qrProduct, setQrProduct] = useState<InventoryProduct | null>(null)

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded-md p-2 flex flex-col hover:border-primary cursor-pointer transition-colors"
            onClick={() => addToCart(product)}
          >
            <div className="relative aspect-square mb-2 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium">
                  Out of Stock
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm font-bold">{product.price}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation()
                    setQrProduct(product)
                  }}
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">Stock: {product.stock}</div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No products found. Try a different search term.
          </div>
        )}
      </div>

      {qrProduct && <QRCodeGenerator isOpen={!!qrProduct} onClose={() => setQrProduct(null)} product={qrProduct} />}
    </div>
  )
}
