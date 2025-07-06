"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Printer, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

interface ReceiptProps {
  isOpen: boolean
  onClose: () => void
  sale: any
}

export function Receipt({ isOpen, onClose, sale }: ReceiptProps) {
  const { toast } = useToast()
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .receipt { width: 300px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 20px; }
                .items { margin-bottom: 20px; }
                .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
                .totals { border-top: 1px dashed #ccc; padding-top: 10px; }
                .total-row { display: flex; justify-content: space-between; }
                .grand-total { font-weight: bold; margin-top: 5px; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; }
              </style>
            </head>
            <body>
              ${receiptRef.current.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }

    toast({
      title: "Printing receipt",
      description: "The receipt has been sent to the printer.",
    })
  }

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    toast({
      title: "Receipt downloaded",
      description: "The receipt has been downloaded as a PDF.",
    })
  }

  if (!sale) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
        </DialogHeader>

        <div className="bg-white p-4 rounded-md border" ref={receiptRef}>
          <div className="receipt">
            <div className="header">
              <h2 className="text-lg font-bold">MS Furniture</h2>
              <p className="text-sm text-muted-foreground">123 Main Street, City</p>
              <p className="text-sm text-muted-foreground">Tel: (123) 456-7890</p>
              <div className="mt-2">
                <p className="text-sm">Receipt #: {sale.id}</p>
                <p className="text-sm">Date: {format(new Date(sale.date), "MMM dd, yyyy HH:mm")}</p>
              </div>
            </div>

            <div className="items">
              <div className="text-sm font-semibold mb-2 pb-1 border-b">Items</div>
              {sale.items.map((item: any) => (
                <div key={item.id} className="item text-sm">
                  <div>
                    <span>{item.quantity} × </span>
                    <span>{item.name}</span>
                  </div>
                  <span>${(Number.parseFloat(item.price.replace(/[^\d.-]/g, "")) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="totals">
              <div className="total-row text-sm">
                <span>Subtotal:</span>
                <span>${sale.subtotal.toFixed(2)}</span>
              </div>

              {sale.discount > 0 && (
                <div className="total-row text-sm text-green-600">
                  <span>Discount:</span>
                  <span>-${sale.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="total-row text-sm">
                <span>Tax (8%):</span>
                <span>${sale.tax.toFixed(2)}</span>
              </div>

              <div className="grand-total total-row">
                <span>Total:</span>
                <span>${sale.total.toFixed(2)}</span>
              </div>

              <div className="mt-2 pt-1 border-t text-sm">
                <div className="total-row">
                  <span>Payment Method:</span>
                  <span>
                    {sale.payment.method === "cash" && "Cash"}
                    {sale.payment.method === "card" && `Card **** ${sale.payment.last4}`}
                    {sale.payment.method === "mobile" && "Mobile Payment"}
                  </span>
                </div>

                {sale.payment.method === "cash" && (
                  <>
                    <div className="total-row">
                      <span>Cash Received:</span>
                      <span>${sale.payment.received.toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                      <span>Change:</span>
                      <span>${sale.payment.change.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="footer mt-4 pt-4 border-t text-center">
              <p className="text-xs">Thank you for your purchase!</p>
              <p className="text-xs">www.msfurniture.com</p>
            </div>
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
