import { notFound } from "next/navigation"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { products, categories } from "@/lib/data"

export function generateStaticParams() {
  return [{ category: "office-furniture" }, { category: "home-furniture" }]
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const category = categories.find((c) => c.slug === params.category)

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    }
  }

  return {
    title: `${category.name} - MS Furniture`,
    description: `Shop our collection of ${category.name.toLowerCase()} at MS Furniture. Free delivery within Dhaka city.`,
  }
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = categories.find((c) => c.slug === params.category)

  if (!category) {
    notFound()
  }

  const categoryProducts = products.filter((product) => product.category === params.category)

  // Get unique subcategories for this category
  const subcategories = [...new Set(categoryProducts.map((product) => product.subcategory))]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="border rounded-md p-4 mb-4">
            <h3 className="font-semibold mb-3">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug} className={`${cat.slug === params.category ? "text-red-600 font-medium" : ""}`}>
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="border rounded-md p-4 mb-4">
            <h3 className="font-semibold mb-3">Subcategories</h3>
            <div className="space-y-2">
              {subcategories.map((subcategory) => (
                <div key={subcategory} className="flex items-center space-x-2">
                  <Checkbox id={subcategory} />
                  <label htmlFor={subcategory} className="text-sm cursor-pointer">
                    {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-md p-4 mb-4">
            <h3 className="font-semibold mb-3">Price Range</h3>
            <Slider defaultValue={[0, 100]} max={100} step={1} className="mb-4" />
            <div className="flex justify-between">
              <span className="text-sm">৳0</span>
              <span className="text-sm">৳100,000</span>
            </div>
          </div>

          <Button className="w-full bg-red-600 hover:bg-red-700">Apply Filters</Button>
        </div>

        {/* Product grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="text-sm border rounded p-1">
                <option>Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
