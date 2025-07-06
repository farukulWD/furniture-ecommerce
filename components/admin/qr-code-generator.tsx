"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Printer, Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { QRCodeSVG } from "qrcode.react"
import type { InventoryProduct } from "@/context/inventory-context"

interface QRCodeGeneratorProps {
  isOpen: boolean
  onClose: () => void
  product: InventoryProduct
}

export function QRCodeGenerator({ isOpen, onClose, product }: QRCodeGeneratorProps) {
  const { toast } = useToast()
  const [size, setSize] = useState<"small" | "medium" | "large">("medium")

  // Generate QR code value - in a real app, this would be a unique identifier
  // Here we're using the product ID or barcode if available
  const qrValue = product.barcode || product.id

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      const qrCodeElement = document.getElementById("qr-code")
      const svgElement = qrCodeElement?.querySelector("svg")

      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement)
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
        const svgUrl = URL.createObjectURL(svgBlob)

        printWindow.document.write(`
          <html>
            <head>
              <title>QR Code - ${product.name}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .container { text-align: center; }
                .product-name { margin-bottom: 10px; font-weight: bold; }
                .product-id { margin-bottom: 20px; font-size: 12px; color: #666; }
                @media print {
                  @page { margin: 0; }
                  body { margin: 1cm; }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="product-name">${product.name}</div>
                <div class="product-id">ID: ${product.id}</div>
                <div>
                  <img src="${svgUrl}" width="${getSizeInPixels()}" height="${getSizeInPixels()}" />
                </div>
                <div style="margin-top: 10px;">${qrValue}</div>
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()

        // Clean up the URL object
        setTimeout(() => {
          URL.revokeObjectURL(svgUrl)
        }, 1000)
      }
    }

    toast({
      title: "Printing QR code",
      description: "The QR code has been sent to the printer.",
    })
  }

  const handleDownload = () => {
    const qrCodeElement = document.getElementById("qr-code")
    const svgElement = qrCodeElement?.querySelector("svg")

    if (svgElement) {
      // Convert SVG to canvas for PNG download
      const canvas = document.createElement("canvas")
      const size = getSizeInPixels()
      canvas.width = size
      canvas.height = size

      const svgData = new XMLSerializer().serializeToString(svgElement)
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
      const svgUrl = URL.createObjectURL(svgBlob)

      const img = new Image()
      img.onload = () => {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          const pngUrl = canvas.toDataURL("image/png")

          const link = document.createElement("a")
          link.href = pngUrl
          link.download = `qr-${product.id}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          URL.revokeObjectURL(svgUrl)
        }
      }
      img.src = svgUrl

      toast({
        title: "QR code downloaded",
        description: "The QR code has been downloaded as a PNG file.",
      })
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(qrValue)
    toast({
      title: "Copied to clipboard",
      description: "The QR code value has been copied to clipboard.",
    })
  }

  const getSizeInPixels = () => {
    switch (size) {
      case "small":
        return 128
      case "medium":
        return 200
      case "large":
        return 256
      default:
        return 200
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code for {product.name}</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="medium"
          value={size}
          onValueChange={(value) => setSize(value as "small" | "medium" | "large")}
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="small">Small</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="large">Large</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col items-center justify-center p-4" id="qr-code">
          <QRCodeSVG value={qrValue} size={getSizeInPixels()} level="H" includeMargin />
          <div className="mt-2 flex items-center">
            <span className="text-sm font-mono">{qrValue}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 ml-1" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button className="flex-1" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
