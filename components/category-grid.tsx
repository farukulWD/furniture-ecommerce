import Image from "next/image"
import Link from "next/link"
import { categories } from "@/lib/data"

export default function CategoryGrid() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-4">Find What you need</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.slug}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{category.name}</h3>
              <Link href={`/categories/${category.slug}`} className="text-xs text-gray-500 hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory.slug}
                  href={`/categories/${category.slug}/${subcategory.slug}`}
                  className="flex flex-col items-center group"
                >
                  <div className="bg-gray-100 rounded-lg p-2 w-full aspect-square flex items-center justify-center mb-1 group-hover:bg-gray-200">
                    <Image
                      src={subcategory.image || "/placeholder.svg?height=60&width=60"}
                      alt={subcategory.name}
                      width={60}
                      height={60}
                    />
                  </div>
                  <span className="text-xs text-center group-hover:text-red-600">{subcategory.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
