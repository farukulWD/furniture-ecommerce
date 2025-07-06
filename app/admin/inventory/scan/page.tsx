"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useInventory } from "@/context/inventory-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarcodeScanner } from "@/components/admin/barcode-scanner"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Scan, Plus, Minus, Package, History } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function InventoryScanPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { products, getProduct, updateStock } = useInventory()

  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [scannedProduct, setScannedProduct] = useState<ReturnType<typeof getProduct> | null>(null)
  const [scanHistory, setScanHistory] = useState<
    Array<{
      timestamp: Date
      barcode: string
      productId: string | null
      productName: string | null
      action: string | null
    }>
  >([])

  const [increaseAmount, setIncreaseAmount] = useState(1)
  const [decreaseAmount, setDecreaseAmount] = useState(1)
  const [adjustAmount, setAdjustAmount] = useState(0)
  const [reason, setReason] = useState("")

  const handleScan = (barcode: string) => {
    // In a real implementation, we would look up the product by barcode in the database
    // For this demo, we'll simulate by using the product ID as the barcode
    // or finding a product with a matching barcode property if it exists

    // First, try to find by exact barcode match
    const foundProduct = products.find((p) => p.barcode === barcode)

    // If not found, try to use the barcode as an ID
    const product = foundProduct || getProduct(barcode)

    // Record the scan in history
    setScanHistory((prev) => [
      {
        timestamp: new Date(),
        barcode,
        productId: product?.id || null,
        productName: product?.name || null,
        action: null,
      },
      ...prev,
    ])

    if (product) {
      setScannedProduct(product)
      setAdjustAmount(product.stock)
      toast({
        title: "Product found",
        description: `Scanned: ${product.name}`,
      })
    } else {
      setScannedProduct(null)
      toast({
        title: "Product not found",
        description: `No product found with barcode: ${barcode}`,
        variant: "destructive",
      })
    }
  }

  const handleIncreaseStock = () => {
    if (!scannedProduct) return

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

    updateStock(scannedProduct.id, increaseAmount, "increase", reason, "Admin User")

    // Update scan history
    setScanHistory((prev) => {
      const updated = [...prev]
      if (updated[0]?.productId === scannedProduct.id) {
        updated[0].action = `Increased by ${increaseAmount}`
      }
      return updated
    })

    toast({
      title: "Stock increased",
      description: `Added ${increaseAmount} units to ${scannedProduct.name}`,
    })

    // Refresh product data
    setScannedProduct(getProduct(scannedProduct.id))
    setReason("")
  }

  const handleDecreaseStock = () => {
    if (!scannedProduct) return

    if (decreaseAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a positive number",
        variant: "destructive",
      })
      return
    }

    if (decreaseAmount > scannedProduct.stock) {
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

    updateStock(scannedProduct.id, decreaseAmount, "decrease", reason, "Admin User")

    // Update scan history
    setScanHistory((prev) => {
      const updated = [...prev]
      if (updated[0]?.productId === scannedProduct.id) {
        updated[0].action = `Decreased by ${decreaseAmount}`
      }
      return updated
    })

    toast({
      title: "Stock decreased",
      description: `Removed ${decreaseAmount} units from ${scannedProduct.name}`,
    })

    // Refresh product data
    setScannedProduct(getProduct(scannedProduct.id))
    setReason("")
  }

  const handleAdjustStock = () => {
    if (!scannedProduct) return

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

    updateStock(scannedProduct.id, adjustAmount, "adjustment", reason, "Admin User")

    // Update scan history
    setScanHistory((prev) => {
      const updated = [...prev]
      if (updated[0]?.productId === scannedProduct.id) {
        updated[0].action = `Set to ${adjustAmount}`
      }
      return updated
    })

    toast({
      title: "Stock adjusted",
      description: `Set ${scannedProduct.name} stock to ${adjustAmount} units`,
    })

    // Refresh product data
    setScannedProduct(getProduct(scannedProduct.id))
    setReason("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/inventory")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Barcode Scanner</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scan Barcode</CardTitle>
            <CardDescription>Scan a product barcode to manage inventory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setIsScannerOpen(true)} className="w-full">
              <Scan className="mr-2 h-4 w-4" />
              Open Scanner
            </Button>

            {scannedProduct && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={scannedProduct.image || "/placeholder.svg"}
                    alt={scannedProduct.name}
                    className="h-24 w-24 rounded-md object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{scannedProduct.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {scannedProduct.id}</p>
                    <p className="text-sm text-muted-foreground">
                      Category:{" "}
                      {scannedProduct.category
                        .replace("-", " ")
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </p>
                    <p className="font-medium mt-1">Price: {scannedProduct.price}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Current Stock</h4>
                      <div className="text-3xl font-bold mt-1">{scannedProduct.stock}</div>
                    </div>

                    {scannedProduct.stock === 0 ? (
                      <Badge variant="destructive" className="text-sm py-1">
                        Out of Stock
                      </Badge>
                    ) : scannedProduct.stock <= scannedProduct.lowStockThreshold ? (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-sm py-1"
                      >
                        Low Stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 text-sm py-1">
                        In Stock
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/admin/inventory/product/${scannedProduct.id}`)}
                  >
                    View Full Details
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {scannedProduct ? (
          <Card>
            <CardHeader>
              <CardTitle>Stock Adjustments</CardTitle>
              <CardDescription>Update inventory for scanned product</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="increase">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="increase">
                    <Plus className="h-4 w-4 mr-2" />
                    Increase
                  </TabsTrigger>
                  <TabsTrigger value="decrease">
                    <Minus className="h-4 w-4 mr-2" />
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
                    <Plus className="h-4 w-4 mr-2" />
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
                      max={scannedProduct.stock}
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

                  <Button onClick={handleDecreaseStock} className="w-full" disabled={scannedProduct.stock === 0}>
                    <Minus className="h-4 w-4 mr-2" />
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
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2" />
                Scan History
              </CardTitle>
              <CardDescription>Recent barcode scans and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scanHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No scan history yet. Scan a barcode to get started.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scanHistory.map((scan, index) => (
                      <div key={index} className="flex justify-between border-b pb-3">
                        <div>
                          <div className="font-medium">{scan.productName || "Unknown Product"}</div>
                          <div className="text-sm text-muted-foreground">Barcode: {scan.barcode}</div>
                          <div className="text-xs text-muted-foreground">{scan.timestamp.toLocaleTimeString()}</div>
                        </div>
                        {scan.action && <Badge variant="outline">{scan.action}</Badge>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <BarcodeScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleScan} />
    </div>
  )
}
