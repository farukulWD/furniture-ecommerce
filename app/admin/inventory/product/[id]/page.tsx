"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useInventory } from "@/context/inventory-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Package, TrendingUp, TrendingDown, History, Barcode } from "lucide-react"
import { BarcodeGenerator } from "@/components/admin/barcode-generator"

export default function ProductInventoryPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { getProduct, updateStock, getProductMovements, updateLowStockThreshold } = useInventory()

  const productId = params.id as string
  const product = getProduct(productId)
  const movements = getProductMovements(productId)

  const [increaseAmount, setIncreaseAmount] = useState(1)
  const [decreaseAmount, setDecreaseAmount] = useState(1)
  const [adjustAmount, setAdjustAmount] = useState(product?.stock || 0)
  const [reason, setReason] = useState("")
  const [threshold, setThreshold] = useState(product?.lowStockThreshold || 10)
  const [isBarcodeGeneratorOpen, setIsBarcodeGeneratorOpen] = useState(false)

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button onClick={() => router.push("/admin/inventory")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Inventory
        </Button>
      </div>
    )
  }

  const handleIncreaseStock = () => {
    if (increaseAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a positive number",
        variant: "destructive",
      })
      return
    }

    if (!reason) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for this adjustment",
        variant: "destructive",
      })
      return
    }

    updateStock(productId, increaseAmount, "increase", reason, "Admin User")
    toast({
      title: "Stock increased",
      description: `Added ${increaseAmount} units to ${product.name}`,
    })
    setReason("")
  }

  const handleDecreaseStock = () => {
    if (decreaseAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a positive number",
        variant: "destructive",
      })
      return
    }

    if (decreaseAmount > product.stock) {
      toast({
        title: "Invalid amount",
        description: "Cannot decrease more than current stock",
        variant: "destructive",
      })
      return
    }

    if (!reason) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for this adjustment",
        variant: "destructive",
      })
      return
    }

    updateStock(productId, decreaseAmount, "decrease", reason, "Admin User")
    toast({
      title: "Stock decreased",
      description: `Removed ${decreaseAmount} units from ${product.name}`,
    })
    setReason("")
  }

  const handleAdjustStock = () => {
    if (adjustAmount < 0) {
      toast({
        title: "Invalid amount",
        description: "Stock cannot be negative",
        variant: "destructive",
      })
      return
    }

    if (!reason) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for this adjustment",
        variant: "destructive",
      })
      return
    }

    updateStock(productId, adjustAmount, "adjustment", reason, "Admin User")
    toast({
      title: "Stock adjusted",
      description: `Set ${product.name} stock to ${adjustAmount} units`,
    })
    setReason("")
  }

  const handleUpdateThreshold = () => {
    if (threshold < 0) {
      toast({
        title: "Invalid threshold",
        description: "Threshold cannot be negative",
        variant: "destructive",
      })
      return
    }

    updateLowStockThreshold(productId, threshold)
    toast({
      title: "Threshold updated",
      description: `Low stock threshold set to ${threshold} units`,
    })
  }

  const handleBarcodeGenerate = (barcode: string) => {
    // In a real implementation, we would update the product in the database
    // For this demo, we'll just show a toast
    toast({
      title: "Barcode generated",
      description: `Barcode ${barcode} has been assigned to ${product.name}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/inventory")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Inventory: {product.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Basic product details and current stock level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="h-24 w-24 rounded-md object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Category:{" "}
                  {product.category
                    .replace("-", " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </p>
                <p className="text-sm text-muted-foreground">
                  Subcategory:{" "}
                  {product.subcategory
                    .replace("-", " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </p>
                <p className="font-medium mt-1">Price: {product.price}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Current Stock</h4>
                  <div className="text-3xl font-bold mt-1">{product.stock}</div>
                </div>

                {product.stock === 0 ? (
                  <Badge variant="destructive" className="text-sm py-1">
                    Out of Stock
                  </Badge>
                ) : product.stock <= product.lowStockThreshold ? (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-sm py-1">
                    Low Stock
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 text-sm py-1">
                    In Stock
                  </Badge>
                )}
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Low Stock Threshold</h4>
                  <span>{product.lowStockThreshold} units</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    type="number"
                    min="0"
                    value={threshold}
                    onChange={(e) => setThreshold(Number.parseInt(e.target.value))}
                  />
                  <Button onClick={handleUpdateThreshold}>Update</Button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Barcode</h4>
                  <Button variant="outline" size="sm" onClick={() => setIsBarcodeGeneratorOpen(true)}>
                    <Barcode className="mr-2 h-4 w-4" />
                    {product.barcode ? "View Barcode" : "Generate Barcode"}
                  </Button>
                </div>
                {product.barcode && <div className="mt-2 text-sm font-mono">{product.barcode}</div>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Adjustments</CardTitle>
            <CardDescription>Increase, decrease or set exact stock levels</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="increase">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="increase">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Increase
                </TabsTrigger>
                <TabsTrigger value="decrease">
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Decrease
                </TabsTrigger>
                <TabsTrigger value="adjust">
                  <Package className="h-4 w-4 mr-2" />
                  Set Exact
                </TabsTrigger>
              </TabsList>

              <TabsContent value="increase" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="increase-amount">Amount to Add</Label>
                  <Input
                    id="increase-amount"
                    type="number"
                    min="1"
                    value={increaseAmount}
                    onChange={(e) => setIncreaseAmount(Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="increase-reason">Reason</Label>
                  <Textarea
                    id="increase-reason"
                    placeholder="e.g., New shipment received, Inventory correction"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <Button onClick={handleIncreaseStock} className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Increase Stock
                </Button>
              </TabsContent>

              <TabsContent value="decrease" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="decrease-amount">Amount to Remove</Label>
                  <Input
                    id="decrease-amount"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={decreaseAmount}
                    onChange={(e) => setDecreaseAmount(Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decrease-reason">Reason</Label>
                  <Textarea
                    id="decrease-reason"
                    placeholder="e.g., Damaged items, Manual order fulfillment"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <Button onClick={handleDecreaseStock} className="w-full" disabled={product.stock === 0}>
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Decrease Stock
                </Button>
              </TabsContent>

              <TabsContent value="adjust" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adjust-amount">Set Exact Amount</Label>
                  <Input
                    id="adjust-amount"
                    type="number"
                    min="0"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adjust-reason">Reason</Label>
                  <Textarea
                    id="adjust-reason"
                    placeholder="e.g., Inventory audit, Stock reconciliation"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <Button onClick={handleAdjustStock} className="w-full">
                  <Package className="h-4 w-4 mr-2" />
                  Set Stock Level
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            Inventory Movement History
          </CardTitle>
          <CardDescription>Track all stock changes for this product</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Previous Stock</TableHead>
                  <TableHead>New Stock</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Performed By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No movement history available.
                    </TableCell>
                  </TableRow>
                ) : (
                  movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>{new Date(movement.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        {movement.type === "increase" && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                            Increase
                          </Badge>
                        )}
                        {movement.type === "decrease" && (
                          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                            Decrease
                          </Badge>
                        )}
                        {movement.type === "adjustment" && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            Adjustment
                          </Badge>
                        )}
                        {movement.type === "order" && (
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                            Order
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{movement.quantity}</TableCell>
                      <TableCell>{movement.previousStock}</TableCell>
                      <TableCell>{movement.newStock}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{movement.reason}</TableCell>
                      <TableCell>{movement.performedBy}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <BarcodeGenerator
        isOpen={isBarcodeGeneratorOpen}
        onClose={() => setIsBarcodeGeneratorOpen(false)}
        productId={product.id}
        productName={product.name}
        currentBarcode={product.barcode}
        onGenerate={handleBarcodeGenerate}
      />
    </div>
  )
}
