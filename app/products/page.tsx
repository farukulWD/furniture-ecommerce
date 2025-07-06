"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import ProductCard from "@/components/product-card"
import { products, categories } from "@/lib/data"

// Get all unique subcategories
const allSubcategories = Array.from(
  new Set(products.flatMap((product) => (product.subcategory ? [product.subcategory] : []))),
)

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get filter values from URL params
  const categoryParam = searchParams.get("category")
  const subcategoryParam = searchParams.get("subcategory")
  const minPriceParam = searchParams.get("minPrice")
  const maxPriceParam = searchParams.get("maxPrice")
  const sortParam = searchParams.get("sort") || "featured"
  const pageParam = searchParams.get("page") || "1"

  // State for filters
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "")
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    subcategoryParam ? subcategoryParam.split(",") : [],
  )
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPriceParam ? Number.parseInt(minPriceParam) : 0,
    maxPriceParam ? Number.parseInt(maxPriceParam) : 100000,
  ])
  const [sortBy, setSortBy] = useState(sortParam)
  const [currentPage, setCurrentPage] = useState(Number.parseInt(pageParam))
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Products per page
  const productsPerPage = 12

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products]

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Filter by subcategories
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter(
        (product) => product.subcategory && selectedSubcategories.includes(product.subcategory),
      )
    }

    // Filter by price range
    filtered = filtered.filter((product) => {
      const price = Number.parseInt(product.price.replace(/[^\d]/g, ""))
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) => Number.parseInt(a.price.replace(/[^\d]/g, "")) - Number.parseInt(b.price.replace(/[^\d]/g, "")),
        )
        break
      case "price-high":
        filtered.sort(
          (a, b) => Number.parseInt(b.price.replace(/[^\d]/g, "")) - Number.parseInt(a.price.replace(/[^\d]/g, "")),
        )
        break
      case "newest":
        filtered = filtered.filter((product) => product.latest).concat(filtered.filter((product) => !product.latest))
        break
      case "bestselling":
        filtered = filtered
          .filter((product) => product.bestselling)
          .concat(filtered.filter((product) => !product.bestselling))
        break
      case "featured":
      default:
        filtered = filtered
          .filter((product) => product.featured)
          .concat(filtered.filter((product) => !product.featured))
        break
    }

    setFilteredProducts(filtered)

    // Update URL with filters
    const params = new URLSearchParams()
    if (selectedCategory) params.set("category", selectedCategory)
    if (selectedSubcategories.length > 0) params.set("subcategory", selectedSubcategories.join(","))
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString())
    if (priceRange[1] < 100000) params.set("maxPrice", priceRange[1].toString())
    params.set("sort", sortBy)
    params.set("page", currentPage.toString())

    const url = `/products?${params.toString()}`
    router.push(url, { scroll: false })
  }, [selectedCategory, selectedSubcategories, priceRange, sortBy, currentPage, router])

  // Calculate pagination
  const totalProducts = filteredProducts.length
  const totalPages = Math.ceil(totalProducts / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("")
    setSelectedSubcategories([])
    setPriceRange([0, 100000])
    setSortBy("featured")
    setCurrentPage(1)
  }

  // Get subcategories for selected category
  const availableSubcategories = selectedCategory
    ? categories.find((c) => c.slug === selectedCategory)?.subcategories.map((s) => s.slug) || []
    : allSubcategories

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">All Products</h1>
      <p className="text-gray-600 mb-6">Browse our collection of premium furniture for your home and office</p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile filter button */}
        <div className="md:hidden w-full mb-4">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-center">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filter & Sort
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
              <SheetHeader className="mb-4">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>

              {/* Mobile filters */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Category</h3>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.slug} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Subcategories</h3>
                    {selectedSubcategories.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs text-red-600"
                        onClick={() => setSelectedSubcategories([])}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {availableSubcategories.map((subcategory) => (
                      <div key={subcategory} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-${subcategory}`}
                          checked={selectedSubcategories.includes(subcategory)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSubcategories([...selectedSubcategories, subcategory])
                            } else {
                              setSelectedSubcategories(selectedSubcategories.filter((item) => item !== subcategory))
                            }
                          }}
                        />
                        <label htmlFor={`mobile-${subcategory}`} className="text-sm cursor-pointer">
                          {subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace(/-/g, " ")}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Price Range</h3>
                    <span className="text-sm">
                      ৳{priceRange[0].toLocaleString()} - ৳{priceRange[1].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    value={priceRange}
                    min={0}
                    max={100000}
                    step={1000}
                    onValueChange={setPriceRange}
                    className="mb-4"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Sort By</h3>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          sortBy === "featured"
                            ? "Featured"
                            : sortBy === "price-low"
                              ? "Price: Low to High"
                              : sortBy === "price-high"
                                ? "Price: High to Low"
                                : sortBy === "newest"
                                  ? "Newest First"
                                  : sortBy === "bestselling"
                                    ? "Best Selling"
                                    : "Featured"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="bestselling">Best Selling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 space-y-2">
                  <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => setIsFilterOpen(false)}>
                    Apply Filters
                  </Button>
                  <Button variant="outline" className="w-full" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop sidebar filters */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="border rounded-md p-4 mb-4 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Filters</h2>
              {(selectedCategory ||
                selectedSubcategories.length > 0 ||
                priceRange[0] > 0 ||
                priceRange[1] < 100000) && (
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-red-600" onClick={clearFilters}>
                  Clear All
                </Button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Category</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="all-categories"
                      checked={selectedCategory === ""}
                      onCheckedChange={() => setSelectedCategory("")}
                    />
                    <label htmlFor="all-categories" className="text-sm cursor-pointer">
                      All Categories
                    </label>
                  </div>
                  {categories.map((category) => (
                    <div key={category.slug} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.slug}
                        checked={selectedCategory === category.slug}
                        onCheckedChange={() => {
                          setSelectedCategory(category.slug)
                          setSelectedSubcategories([])
                        }}
                      />
                      <label htmlFor={category.slug} className="text-sm cursor-pointer">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Subcategories</h3>
                  {selectedSubcategories.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-red-600"
                      onClick={() => setSelectedSubcategories([])}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {availableSubcategories.map((subcategory) => (
                    <div key={subcategory} className="flex items-center space-x-2">
                      <Checkbox
                        id={subcategory}
                        checked={selectedSubcategories.includes(subcategory)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSubcategories([...selectedSubcategories, subcategory])
                          } else {
                            setSelectedSubcategories(selectedSubcategories.filter((item) => item !== subcategory))
                          }
                        }}
                      />
                      <label htmlFor={subcategory} className="text-sm cursor-pointer">
                        {subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace(/-/g, " ")}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Price Range</h3>
                  <span className="text-xs">
                    ৳{priceRange[0].toLocaleString()} - ৳{priceRange[1].toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  min={0}
                  max={100000}
                  step={1000}
                  onValueChange={setPriceRange}
                  className="mb-4"
                />
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])}
                    className="h-8"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 100000])}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1">
          {/* Sort and results count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <p className="text-sm text-gray-600 mb-2 sm:mb-0">
              Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} products
            </p>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy} className="w-[180px]">
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      sortBy === "featured"
                        ? "Featured"
                        : sortBy === "price-low"
                          ? "Price: Low to High"
                          : sortBy === "price-high"
                            ? "Price: High to Low"
                            : sortBy === "newest"
                              ? "Newest First"
                              : sortBy === "bestselling"
                                ? "Best Selling"
                                : "Featured"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="bestselling">Best Selling</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filters */}
          {(selectedCategory || selectedSubcategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 100000) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategory && (
                <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                  <span>Category: {categories.find((c) => c.slug === selectedCategory)?.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-1"
                    onClick={() => setSelectedCategory("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {selectedSubcategories.map((subcategory) => (
                <div key={subcategory} className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                  <span>{subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace(/-/g, " ")}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-1"
                    onClick={() => {
                      setSelectedSubcategories(selectedSubcategories.filter((item) => item !== subcategory))
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}

              {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                  <span>
                    Price: ৳{priceRange[0].toLocaleString()} - ৳{priceRange[1].toLocaleString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-1"
                    onClick={() => setPriceRange([0, 100000])}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <Button variant="ghost" size="sm" className="text-red-600 text-sm h-7" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          )}

          {/* Products grid */}
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-md">
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or browse our categories.</p>
              <Button className="bg-red-600 hover:bg-red-700" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current page
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        className={currentPage === page ? "bg-red-600 hover:bg-red-700" : ""}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    )
                  } else if (
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return <span key={page}>...</span>
                  }
                  return null
                })}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
