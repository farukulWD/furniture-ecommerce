import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import CategoryGrid from "@/components/category-grid";
import FeaturedProducts from "@/components/featured-products";
import TopRatedProducts from "@/components/top-rated-products";
import TodaysDeal from "@/components/todays-deal";
import FeatureIcons from "@/components/feature-icons";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Slider */}
        <div className="container mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 grid grid-rows-2 gap-4">
            <div className="relative">
              <Image
                src="/images/banner/couch.jpg?height=300&width=600"
                alt="Red Sofa Set"
                width={600}
                height={300}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Image
                  src="/images/banner/small_couch_left.jpg?height=150&width=300"
                  alt="Gray Sofa Set"
                  width={300}
                  height={150}
                  className="w-full h-full rounded"
                />
              </div>
              <div className="relative">
                <Image
                  src="/images/banner/small_couch_right.jpg?height=150&width=300"
                  alt="Beige Sofa"
                  width={300}
                  height={150}
                  className="w-full h-full  rounded"
                />
              </div>
            </div>
          </div>
          <div className="relative bg-[#f9f5e9] rounded p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold">Office Chair</h3>
              <p className="text-sm mt-1">Find your perfect office chair</p>
            </div>
            <Image
              src="/images/banner/office_chair.jpg?height=200&width=200"
              alt="Office Chair"
              width={500}
              height={700}
              className="w-full h-full rounded-md  my-4"
            />
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            >
              Shop Now
            </Button>
          </div>
        </div>

        {/* Find What You Need */}
        <CategoryGrid />

        {/* Recommended For You */}
        <FeaturedProducts />

        {/* Top Rated Products */}
        <TopRatedProducts />

        {/* Today's Best Deal */}
        <TodaysDeal />

        {/* Office Furniture & Home Furniture */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Office Furniture</h2>
                <Link
                  href="/categories/office-furniture"
                  className="text-xs text-gray-500 hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    id: "1",
                    name: "Manager Wooden Chair",
                    price: "৳12,000.00",
                    image: "/placeholder.svg?height=200&width=200",
                    category: "office-furniture",
                    subcategory: "chairs",
                  },
                  {
                    id: "2",
                    name: "Office Visitor Chair",
                    price: "৳6,500.00",
                    image: "/placeholder.svg?height=200&width=200",
                    badge: "Hot",
                    category: "office-furniture",
                    subcategory: "chairs",
                  },
                ].map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Home Furniture</h2>
                <Link
                  href="/categories/home-furniture"
                  className="text-xs text-gray-500 hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    id: "3",
                    name: "Luxurious Turkish Style Sofa",
                    price: "৳25,000.00",
                    image: "/placeholder.svg?height=200&width=200",
                    category: "home-furniture",
                    subcategory: "sofas",
                  },
                  {
                    id: "4",
                    name: "Modern L-Shaped Sofa Set",
                    price: "৳50,000.00",
                    image: "/placeholder.svg?height=200&width=200",
                    category: "home-furniture",
                    subcategory: "sofas",
                  },
                ].map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <FeatureIcons />
      </main>
    </div>
  );
}
