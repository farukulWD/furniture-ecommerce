"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Printer, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { InvoiceTemplate } from "@/components/admin/invoice-template"
import { formatDate } from "@/lib/utils"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const orderId = params.id
  const [invoiceOpen, setInvoiceOpen] = useState(false)

  // In a real app, this would fetch order data from an API
  const order = {
    id: orderId,
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, Apt 4B, New York, NY 10001, USA",
    },
    date: "2023-05-15",
    status: "delivered",
    paymentMethod: "Credit Card",
    paymentStatus: "paid",
    shippingMethod: "Express Delivery",
    trackingNumber: "TRK123456789",
    subtotal: 1199.99,
    shipping: 50.0,
    tax: 50.0,
    total: 1299.99,
    items: [
      {
        id: "PROD-001",
        name: "Modern Leather Sofa",
        image: "/placeholder.svg?height=50&width=50",
        price: 899.99,
        quantity: 1,
      },
      {
        id: "PROD-002",
        name: "Accent Chair",
        image: "/placeholder.svg?height=50&width=50",
        price: 299.99,
        quantity: 1,
      },
    ],
  }

  const handleStatusChange = (value: string) => {
    // In a real app, this would call an API to update the order status
    toast({
      title: "Order status updated",
      description: `Order ${orderId} status changed to ${value}`,
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleGenerateInvoice = () => {
    setInvoiceOpen(true)
  }

  const handlePrintInvoice = () => {
    const invoiceContent = document.getElementById("invoice-template")
    if (invoiceContent) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice #${orderId}</title>
              <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; text-align: left; }
                th { border-bottom: 1px solid #ddd; }
                td { border-bottom: 1px solid #eee; }
                .text-right { text-align: right; }
                @media print {
                  body { padding: 20px; }
                  button { display: none; }
                }
              </style>
            </head>
            <body>
              ${invoiceContent.outerHTML}
              <script>
                window.onload = function() { window.print(); }
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    }
  }

  const handleDownloadInvoice = () => {
    toast({
      title: "Invoice downloaded",
      description: `Invoice for order ${orderId} has been downloaded.`,
    })
    // In a real app, this would generate a PDF and trigger a download
    setInvoiceOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push("/admin/orders")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Order {orderId}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleGenerateInvoice}>
            <FileText className="mr-2 h-4 w-4" />
            Invoice
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Order ID</dt>
                <dd className="text-sm font-semibold">{order.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Date</dt>
                <dd className="text-sm font-semibold">{formatDate(order.date)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Payment Method</dt>
                <dd className="text-sm font-semibold">{order.paymentMethod}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Payment Status</dt>
                <dd className="text-sm font-semibold capitalize">{order.paymentStatus}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Shipping Method</dt>
                <dd className="text-sm font-semibold">{order.shippingMethod}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Tracking Number</dt>
                <dd className="text-sm font-semibold">{order.trackingNumber}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="text-sm font-semibold mt-1">
                  <div className="flex items-center gap-2">
                    <OrderStatusBadge status={order.status} />
                    <Select defaultValue={order.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-sm font-semibold">{order.customer.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-sm font-semibold">{order.customer.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                <dd className="text-sm font-semibold">{order.customer.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Shipping Address</dt>
                <dd className="text-sm font-semibold">{order.customer.address}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Subtotal
                </TableCell>
                <TableCell className="text-right">${order.subtotal.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Shipping
                </TableCell>
                <TableCell className="text-right">${order.shipping.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Tax
                </TableCell>
                <TableCell className="text-right">${order.tax.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium text-lg">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold text-lg">${order.total.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Invoice #{orderId}</DialogTitle>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto">
            <InvoiceTemplate
              invoiceNumber={`INV-${orderId}`}
              date={order.date}
              dueDate={new Date(new Date(order.date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
              customerName={order.customer.name}
              customerEmail={order.customer.email}
              customerAddress={order.customer.address}
              items={order.items}
              subtotal={order.subtotal}
              tax={order.tax}
              shipping={order.shipping}
              total={order.total}
              notes="Payment is due within 30 days of invoice date. Thank you for your business!"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoiceOpen(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={handlePrintInvoice}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button onClick={handleDownloadInvoice}>
              <FileText className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
