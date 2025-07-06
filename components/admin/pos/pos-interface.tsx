"use client"

import { useState, useEffect } from "react"
import { ProductSelection } from "@/components/admin/pos/product-selection"
import { POSCart } from "@/components/admin/pos/pos-cart"
import { useInventory } from "@/context/inventory-context"
import { usePOS } from "@/context/pos-context"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarcodeScanner } from "@/components/admin/barcode-scanner"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Scan } from "lucide-react"

export function POSInterface() {
  const { products } = useInventory()
  const { addToCart } = usePOS()
  const { toast } = useToast()
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [filteredProducts, setFilteredProducts] = useState(products)

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(products.map((product) => product.category)))]

  // Filter products by category
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((product) => product.category === activeCategory))
    }
  }, [activeCategory, products])

  const handleBarcodeScan = (barcode: string) => {
    // Find product by barcode
    const product = products.find((p) => p.barcode === barcode)

    if (product) {
      addToCart(product)
      toast({
        title: "Product added",
        description: `${product.name} has been added to the cart.`,
      })
    } else {
      toast({
        title: "Product not found",
        description: `No product found with barcode: ${barcode}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 h-full">
      <div className="lg:col-span-2 border rounded-md p-4 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="w-full overflow-x-auto flex-wrap justify-start h-auto">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-sm">
                  {category === "all"
                    ? "All Products"
                    : category
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Button variant="outline" className="ml-2 flex-shrink-0" onClick={() => setIsScannerOpen(true)}>
            <Scan className="mr-2 h-4 w-4" />
            Scan
          </Button>
        </div>

        <div className="overflow-y-auto flex-1">
          <ProductSelection products={filteredProducts} />
        </div>
      </div>

      <div className="border rounded-md p-4 flex flex-col overflow-hidden">
        <POSCart />
      </div>

      <BarcodeScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleBarcodeScan} />
    </div>
  )
}
