"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Barcode, Copy, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface BarcodeGeneratorProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productName: string
  currentBarcode?: string
  onGenerate: (barcode: string) => void
}

export function BarcodeGenerator({
  isOpen,
  onClose,
  productId,
  productName,
  currentBarcode,
  onGenerate,
}: BarcodeGeneratorProps) {
  const { toast } = useToast()
  const [barcode, setBarcode] = useState(currentBarcode || "")
  const [isGenerating, setIsGenerating] = useState(false)

  // Generate a barcode based on product ID and a random number
  const generateBarcode = () => {
    setIsGenerating(true)

    // Create a barcode with format: prefix (2 digits) + product ID (without non-numeric chars) + random (4 digits)
    const prefix = "29" // Furniture department prefix
    const cleanId = productId.replace(/\D/g, "").substring(0, 6).padStart(6, "0")
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")

    // Generate the barcode
    const newBarcode = `${prefix}${cleanId}${random}`

    // Simulate API call
    setTimeout(() => {
      setBarcode(newBarcode)
      setIsGenerating(false)
    }, 500)
  }

  const handleSave = () => {
    if (barcode) {
      onGenerate(barcode)
      toast({
        title: "Barcode saved",
        description: `Barcode for ${productName} has been updated.`,
      })
      onClose()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(barcode)
    toast({
      title: "Copied to clipboard",
      description: "Barcode has been copied to clipboard.",
    })
  }

  const downloadBarcode = () => {
    // In a real implementation, this would generate a barcode image
    // For now, we'll just simulate the download
    toast({
      title: "Barcode downloaded",
      description: "Barcode image has been downloaded.",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Barcode for {productName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode</Label>
            <div className="flex space-x-2">
              <Input
                id="barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="No barcode assigned"
              />
              <Button variant="outline" size="icon" onClick={copyToClipboard} disabled={!barcode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {barcode && (
            <div className="flex flex-col items-center space-y-2 p-4 border rounded-md">
              <div className="text-2xl font-mono tracking-wider">{barcode}</div>
              <div className="h-16 flex items-center justify-center">
                {/* This would be a real barcode image in production */}
                <Barcode className="h-12 w-full" />
              </div>
              <Button variant="outline" size="sm" onClick={downloadBarcode}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={generateBarcode} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate New"}
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!barcode}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
