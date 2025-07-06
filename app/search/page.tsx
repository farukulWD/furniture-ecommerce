"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ProductCard from "@/components/product-card"
import { products } from "@/lib/data"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    if (query) {
      const results = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(query.toLowerCase())),
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [query])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{query ? `Search Results for "${query}"` : "Search Products"}</h1>

      {query && (
        <p className="text-gray-600 mb-6">
          Found {searchResults.length} {searchResults.length === 1 ? "result" : "results"} for your search
        </p>
      )}

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-gray-600">
            We couldn't find any products matching your search. Try using different keywords or browse our categories.
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">Enter a search term to find products.</p>
        </div>
      )}
    </div>
  )
}
