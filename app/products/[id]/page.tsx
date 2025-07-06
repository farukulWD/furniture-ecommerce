import Image from "next/image"
import { notFound } from "next/navigation"
import { Star, Truck, Shield, RefreshCw, Heart, Share2, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { products } from "@/lib/data"
import ProductCard from "@/components/product-card"

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    }
  }

  return {
    title: `${product.name} - MS Furniture`,
    description: product.description || `Buy ${product.name} at MS Furniture. Free delivery within Dhaka city.`,
  }
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  // Get related products from the same category
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <div className="border rounded-md p-4 mb-4">
            <Image
              src={product.image || "/placeholder.svg?height=400&width=400"}
              alt={product.name}
              width={400}
              height={400}
              className="w-full object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-md p-2 cursor-pointer hover:border-red-600">
                <Image
                  src={product.image || "/placeholder.svg?height=100&width=100"}
                  alt={`${product.name} view ${i}`}
                  width={100}
                  height={100}
                  className="w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center space-x-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-gray-500">(12 Reviews)</span>
          </div>

          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl font-bold text-red-600">{product.price}</span>
            {product.oldPrice && <span className="text-gray-500 line-through">{product.oldPrice}</span>}
            {product.oldPrice && (
              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                Save{" "}
                {Math.round(
                  (1 -
                    Number.parseInt(product.price.replace(/[^\d]/g, "")) /
                      Number.parseInt(product.oldPrice.replace(/[^\d]/g, ""))) *
                    100,
                )}
                %
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6">
            {product.description ||
              "Premium quality furniture for your home and office. Made with high-quality materials for durability and comfort."}
          </p>

          <div className="border-t border-b py-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">Color</span>
              <div className="flex space-x-2">
                <div className="w-6 h-6 rounded-full bg-red-700 border-2 border-gray-300 cursor-pointer"></div>
                <div className="w-6 h-6 rounded-full bg-gray-700 border-2 border-white cursor-pointer"></div>
                <div className="w-6 h-6 rounded-full bg-amber-800 border-2 border-white cursor-pointer"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Quantity</span>
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-10 text-center">1</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mb-6">
            <Button className="flex-1 bg-red-600 hover:bg-red-700">Add to Cart</Button>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
              Buy Now
            </Button>
            <Button variant="outline" size="icon" className="border-gray-300">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-gray-300">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <Truck className="h-4 w-4 text-red-600" />
              <span>Free delivery within Dhaka city</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="h-4 w-4 text-red-600" />
              <span>1 Year warranty on all products</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <RefreshCw className="h-4 w-4 text-red-600" />
              <span>7 Days return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
          >
            Reviews (12)
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="pt-4">
          <h3 className="text-lg font-semibold mb-2">Product Description</h3>
          <p className="text-gray-600 mb-4">
            {product.description ||
              `
              Experience unparalleled comfort and style with our premium ${product.name}. 
              Crafted with the finest materials, this piece combines aesthetic appeal with practical functionality.
              
              The ergonomic design ensures maximum comfort during extended use, while the premium materials guarantee longevity.
              Perfect for both home and office environments, this furniture piece will elevate any space.
            `}
          </p>
          <h4 className="font-medium mb-2">Key Features:</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Premium quality materials</li>
            <li>Ergonomic design for maximum comfort</li>
            <li>Durable construction for long-lasting use</li>
            <li>Elegant finish that complements any decor</li>
            <li>Easy assembly with included instructions</li>
          </ul>
        </TabsContent>
        <TabsContent value="specifications" className="pt-4">
          <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 font-medium">Dimensions</div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Width</span>
                  <span>80 cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Height</span>
                  <span>120 cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Depth</span>
                  <span>60 cm</span>
                </div>
              </div>
            </div>
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 font-medium">Materials</div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Frame</span>
                  <span>Solid Wood</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Upholstery</span>
                  <span>Premium Leather</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Finish</span>
                  <span>Matte</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="pt-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">Based on 12 reviews</span>
              </div>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">Write a Review</Button>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((review) => (
              <div key={review} className="border-b pb-6">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">John Doe</h4>
                  <span className="text-sm text-gray-500">2 weeks ago</span>
                </div>
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600">
                  Excellent quality and very comfortable. The delivery was prompt and the assembly was straightforward.
                  Would definitely recommend this product to anyone looking for quality furniture.
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
