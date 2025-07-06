import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { products } from "@/lib/data"

export default function TopRatedProducts() {
  // Get top rated products (those with highest ratings)
  const topRatedProducts = [...products].sort((a, b) => (b.rating || 5) - (a.rating || 5)).slice(0, 4)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Top Rated Products</h2>
        <div className="flex space-x-1">
          <Button variant="outline" size="icon" className="h-6 w-6 rounded-sm border-gray-300">
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="icon" className="h-6 w-6 rounded-sm border-gray-300">
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {topRatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
