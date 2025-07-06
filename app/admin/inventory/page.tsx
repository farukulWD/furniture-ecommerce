"use client"

import { useState } from "react"
import { useInventory } from "@/context/inventory-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, AlertTriangle, Package, TrendingDown, BarChart3, Scan, Barcode } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { BarcodeScanner } from "@/components/admin/barcode-scanner"
import { useToast } from "@/components/ui/use-toast"

export default function InventoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { products, lowStockProducts, getTotalInventoryValue, getInventoryValueByCategory, getProduct } = useInventory()

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [isScannerOpen, setIsScannerOpen] = useState(false)

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(products.map((product) => product.category)))

  // Filter products based on search query, category, and stock level
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && product.stock <= product.lowStockThreshold && product.stock > 0) ||
      (stockFilter === "out" && product.stock === 0) ||
      (stockFilter === "normal" && product.stock > product.lowStockThreshold)

    return matchesSearch && matchesCategory && matchesStock
  })

  // Calculate inventory statistics
  const totalProducts = products.length
  const outOfStockCount = products.filter((p) => p.stock === 0).length
  const lowStockCount = lowStockProducts.length
  const totalValue = getTotalInventoryValue().toFixed(2)
  const categoryValues = getInventoryValueByCategory()

  const handleBarcodeScan = (barcode: string) => {
    // In a real implementation, we would look up the product by barcode in the database
    // For this demo, we'll simulate by using the product ID as the barcode
    // or finding a product with a matching barcode property if it exists

    // First, try to find by exact barcode match
    const foundProduct = products.find((p) => p.barcode === barcode)

    // If not found, try to use the barcode as an ID
    const product = foundProduct || getProduct(barcode)

    if (product) {
      toast({
        title: "Product found",
        description: `Scanned: ${product.name}`,
      })
      router.push(`/admin/inventory/product/${product.id}`)
    } else {
      toast({
        title: "Product not found",
        description: `No product found with barcode: ${barcode}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsScannerOpen(true)} variant="outline">
            <Scan className="mr-2 h-4 w-4" />
            Scan Barcode
          </Button>
          <Button onClick={() => router.push("/admin/inventory/scan")}>
            <Barcode className="mr-2 h-4 w-4" />
            Barcode Scanner
          </Button>
          <Button onClick={() => router.push("/admin/inventory/adjustments")}>Inventory Adjustments</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">items in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">products below threshold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">products need reordering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue}</div>
            <p className="text-xs text-muted-foreground">total value of inventory</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-products">
        <TabsList>
          <TabsTrigger value="all-products">All Products</TabsTrigger>
          <TabsTrigger value="low-stock">
            Low Stock
            {lowStockCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {lowStockCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="out-of-stock">
            Out of Stock
            {outOfStockCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {outOfStockCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="inventory-value">Value by Category</TabsTrigger>
        </TabsList>

        <TabsContent value="all-products" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category
                        .replace("-", " ")
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Stock Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock Levels</SelectItem>
                  <SelectItem value="normal">Normal Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="flex items-center gap-3">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <span className="font-medium">{product.name}</span>
                      </TableCell>
                      <TableCell>
                        {product.category
                          .replace("-", " ")
                          .split(" ")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        {product.stock === 0 ? (
                          <Badge variant="destructive">Out of Stock</Badge>
                        ) : product.stock <= product.lowStockThreshold ? (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {product.barcode ? (
                          <span className="font-mono text-xs">{product.barcode}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/inventory/product/${product.id}`)}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="low-stock">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No low stock products.
                    </TableCell>
                  </TableRow>
                ) : (
                  lowStockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="flex items-center gap-3">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <span className="font-medium">{product.name}</span>
                      </TableCell>
                      <TableCell>
                        {product.category
                          .replace("-", " ")
                          .split(" ")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </TableCell>
                      <TableCell>
                        <span className="text-amber-600 font-medium">{product.stock}</span>
                      </TableCell>
                      <TableCell>{product.lowStockThreshold}</TableCell>
                      <TableCell>
                        {product.barcode ? (
                          <span className="font-mono text-xs">{product.barcode}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/inventory/product/${product.id}`)}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="out-of-stock">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.filter((p) => p.stock === 0).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No out of stock products.
                    </TableCell>
                  </TableRow>
                ) : (
                  products
                    .filter((p) => p.stock === 0)
                    .map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="flex items-center gap-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <span className="font-medium">{product.name}</span>
                        </TableCell>
                        <TableCell>
                          {product.category
                            .replace("-", " ")
                            .split(" ")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                        </TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>
                          {product.barcode ? (
                            <span className="font-mono text-xs">{product.barcode}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Not assigned</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/inventory/product/${product.id}`)}
                          >
                            Restock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="inventory-value">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Number of Products</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Percentage of Inventory</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(categoryValues).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No inventory data available.
                    </TableCell>
                  </TableRow>
                ) : (
                  Object.entries(categoryValues).map(([category, value]) => (
                    <TableRow key={category}>
                      <TableCell className="font-medium">
                        {category
                          .replace("-", " ")
                          .split(" ")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </TableCell>
                      <TableCell>{products.filter((p) => p.category === category).length}</TableCell>
                      <TableCell>${value.toFixed(2)}</TableCell>
                      <TableCell>{((value / Number.parseFloat(totalValue)) * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <BarcodeScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleBarcodeScan} />
    </div>
  )
}
