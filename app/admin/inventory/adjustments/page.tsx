"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useInventory } from "@/context/inventory-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Upload, Download, RefreshCw, CheckCircle2 } from "lucide-react"

export default function InventoryAdjustmentsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { products, updateStock } = useInventory()

  const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({})
  const [adjustmentType, setAdjustmentType] = useState<"increase" | "decrease" | "percentage">("increase")
  const [adjustmentValue, setAdjustmentValue] = useState(10)
  const [reason, setReason] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter products based on search query
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSelectAll = () => {
    const allSelected = filteredProducts.every((product) => selectedProducts[product.id])

    if (allSelected) {
      // Deselect all
      setSelectedProducts({})
    } else {
      // Select all
      const newSelected: Record<string, boolean> = {}
      filteredProducts.forEach((product) => {
        newSelected[product.id] = true
      })
      setSelectedProducts(newSelected)
    }
  }

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }

  const getSelectedProductsCount = () => {
    return Object.values(selectedProducts).filter(Boolean).length
  }

  const handleBulkAdjustment = () => {
    if (getSelectedProductsCount() === 0) {
      toast({
        title: "No products selected",
        description: "Please select at least one product to adjust",
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

    if (adjustmentValue <= 0 && adjustmentType !== "decrease") {
      toast({
        title: "Invalid value",
        description: "Please enter a positive number",
        variant: "destructive",
      })
      return
    }

    // Process each selected product
    let adjustedCount = 0

    products.forEach((product) => {
      if (selectedProducts[product.id]) {
        let newStock = product.stock

        if (adjustmentType === "increase") {
          // Add fixed amount
          newStock = product.stock + adjustmentValue
        } else if (adjustmentType === "decrease") {
          // Subtract fixed amount (but not below 0)
          newStock = Math.max(0, product.stock - adjustmentValue)
        } else if (adjustmentType === "percentage") {
          // Increase by percentage
          newStock = Math.round(product.stock * (1 + adjustmentValue / 100))
        }

        // Only update if the stock would change
        if (newStock !== product.stock) {
          updateStock(product.id, newStock, "adjustment", `Bulk adjustment: ${reason}`, "Admin User")
          adjustedCount++
        }
      }
    })

    toast({
      title: "Bulk adjustment complete",
      description: `Successfully adjusted ${adjustedCount} products`,
    })

    // Reset form
    setSelectedProducts({})
    setReason("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/inventory")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Bulk Inventory Adjustments</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Adjustment Settings</CardTitle>
            <CardDescription>Configure bulk inventory adjustments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Adjustment Type</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={adjustmentType === "increase" ? "default" : "outline"}
                  onClick={() => setAdjustmentType("increase")}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Increase by Amount
                </Button>
                <Button
                  variant={adjustmentType === "decrease" ? "default" : "outline"}
                  onClick={() => setAdjustmentType("decrease")}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Decrease by Amount
                </Button>
                <Button
                  variant={adjustmentType === "percentage" ? "default" : "outline"}
                  onClick={() => setAdjustmentType("percentage")}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Increase by Percentage
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adjustment-value">
                {adjustmentType === "increase" && "Amount to Add"}
                {adjustmentType === "decrease" && "Amount to Remove"}
                {adjustmentType === "percentage" && "Percentage to Increase (%)"}
              </Label>
              <Input
                id="adjustment-value"
                type="number"
                min={adjustmentType === "decrease" ? "0" : "1"}
                value={adjustmentValue}
                onChange={(e) => setAdjustmentValue(Number.parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adjustment-reason">Reason for Adjustment</Label>
              <Textarea
                id="adjustment-reason"
                placeholder="e.g., Inventory audit, Stock reconciliation"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="pt-4">
              <Button onClick={handleBulkAdjustment} className="w-full" disabled={getSelectedProductsCount() === 0}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Apply to {getSelectedProductsCount()} Selected Products
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selected Products</CardTitle>
            <CardDescription>
              {getSelectedProductsCount()} of {filteredProducts.length} products selected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="rounded-md border max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          filteredProducts.length > 0 &&
                          filteredProducts.every((product) => selectedProducts[product.id])
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>
                      {adjustmentType === "increase" && "New Stock"}
                      {adjustmentType === "decrease" && "New Stock"}
                      {adjustmentType === "percentage" && "New Stock"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => {
                      let newStock = product.stock

                      if (adjustmentType === "increase") {
                        newStock = product.stock + adjustmentValue
                      } else if (adjustmentType === "decrease") {
                        newStock = Math.max(0, product.stock - adjustmentValue)
                      } else if (adjustmentType === "percentage") {
                        newStock = Math.round(product.stock * (1 + adjustmentValue / 100))
                      }

                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Checkbox
                              checked={!!selectedProducts[product.id]}
                              onCheckedChange={() => handleSelectProduct(product.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <span className={newStock > product.stock ? "text-green-600" : "text-red-600"}>
                              {newStock}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
