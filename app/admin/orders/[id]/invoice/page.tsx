"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { InvoiceTemplate } from "@/components/admin/invoice-template"
import { ArrowLeft, Printer, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function InvoicePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const orderId = params.id

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

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    toast({
      title: "Invoice downloaded",
      description: `Invoice for order ${orderId} has been downloaded as PDF.`,
    })
    // In a real app, this would generate a PDF and trigger a download
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push(`/admin/orders/${orderId}`)} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Order
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Invoice #{orderId}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
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
    </div>
  )
}
