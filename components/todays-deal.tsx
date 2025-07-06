import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { products } from "@/lib/data"

export default function TodaysDeal() {
  // Get the product with the biggest discount
  const todaysDeal = products
    .filter((p) => p.oldPrice)
    .sort((a, b) => {
      const discountA =
        Number.parseInt(a.oldPrice.replace(/[^\d]/g, "")) - Number.parseInt(a.price.replace(/[^\d]/g, ""))
      const discountB =
        Number.parseInt(b.oldPrice.replace(/[^\d]/g, "")) - Number.parseInt(b.price.replace(/[^\d]/g, ""))
      return discountB - discountA
    })[0]

  // Get some random products for the "Just For You" section
  const justForYou = [...products].sort(() => 0.5 - Math.random()).slice(0, 8)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Today's Best Deal</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-shrink-0">
              <Image
                src={todaysDeal.image || "/placeholder.svg?height=200&width=200"}
                alt={todaysDeal.name}
                width={200}
                height={200}
                className="w-full md:w-40 object-cover"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="font-medium mb-2">{todaysDeal.name}</h3>
                <div className="flex items-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                  <span className="text-sm text-gray-500">(5)</span>
                </div>
                <div className="text-2xl font-bold text-red-600 mb-2">{todaysDeal.price}</div>
                {todaysDeal.oldPrice && <div className="text-gray-500 line-through">{todaysDeal.oldPrice}</div>}
              </div>
              <div className="flex flex-col gap-2">
                <Button className="bg-red-600 hover:bg-red-700">Buy Now</Button>
                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Just For you</h2>
          <div className="grid grid-cols-4 gap-2">
            {justForYou.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="bg-white p-1 rounded hover:shadow-md transition-shadow"
              >
                <Image
                  src={item.image || "/placeholder.svg?height=60&width=60"}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="w-full aspect-square object-cover mb-1"
                />
                <div className="text-xs text-center text-red-600 font-semibold">{item.price}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
