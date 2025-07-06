"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { products } from "@/lib/data"

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("featured")

  const getProducts = () => {
    switch (activeTab) {
      case "featured":
        return products.filter((p) => p.featured).slice(0, 4)
      case "bestselling":
        return products.filter((p) => p.bestselling).slice(0, 4)
      case "latest":
        return products.filter((p) => p.latest).slice(0, 4)
      default:
        return products.slice(0, 4)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recommended For You</h2>
        <div className="flex space-x-1">
          <Button variant="outline" size="icon" className="h-6 w-6 rounded-sm border-gray-300">
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="icon" className="h-6 w-6 rounded-sm border-gray-300">
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex space-x-2 mb-4 text-sm overflow-x-auto pb-2">
        <Button
          variant={activeTab === "featured" ? "default" : "outline"}
          className={`rounded-full px-4 py-1 h-auto ${activeTab === "featured" ? "bg-red-600 hover:bg-red-700" : "border-gray-300 bg-white"}`}
          onClick={() => setActiveTab("featured")}
        >
          Featured Products
        </Button>
        <Button
          variant={activeTab === "bestselling" ? "default" : "outline"}
          className={`rounded-full px-4 py-1 h-auto ${activeTab === "bestselling" ? "bg-red-600 hover:bg-red-700" : "border-gray-300 bg-white"}`}
          onClick={() => setActiveTab("bestselling")}
        >
          Best Selling
        </Button>
        <Button
          variant={activeTab === "latest" ? "default" : "outline"}
          className={`rounded-full px-4 py-1 h-auto ${activeTab === "latest" ? "bg-red-600 hover:bg-red-700" : "border-gray-300 bg-white"}`}
          onClick={() => setActiveTab("latest")}
        >
          Latest Products
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {getProducts().map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
