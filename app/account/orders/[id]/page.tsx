"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Package, Truck, CheckCircle, Clock, XCircle, Download, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import OrderStatusBadge from "@/components/order-status-badge"

// Sample order data (this would come from an API in a real application)
const orders = [
  {
    id: "MS-0001",
    date: "2024-05-08T14:30:00",
    status: "delivered",
    total: 17500,
    items: [
      {
        id: "1",
        name: "Wooden Double Sofa",
        price: "৳12,000.00",
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
      },
      {
        id: "5",
        name: "Office Visitor Chair",
        price: "৳5,500.00",
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
      },
    ],
    shippingAddress: {
      name: "John Doe",
      address: "123 Main Street, Apartment 4B",
      city: "Dhaka",
      zipCode: "1000",
      country: "Bangladesh",
      phone: "+880 1234 567890",
    },
    paymentMethod: "cash",
    trackingNumber: "BD123456789",
    timeline: [
      { status: "pending", date: "2024-05-08T10:30:00", description: "Order placed" },
      { status: "processing", date: "2024-05-08T11:45:00", description: "Payment confirmed" },
      { status: "processing", date: "2024-05-08T13:15:00", description: "Order processing" },
      { status: "shipped", date: "2024-05-08T14:30:00", description: "Order shipped" },
      { status: "delivered", date: "2024-05-08T17:45:00", description: "Order delivered" },
    ],
  },
  {
    id: "MS-0002",
    date: "2024-05-01T10:15:00",
    status: "delivered",
    total: 25000,
    items: [
      {
        id: "2",
        name: "Luxurious Turkish Style Sofa",
        price: "৳25,000.00",
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
      },
    ],
    shippingAddress: {
      name: "John Doe",
      address: "123 Main Street, Apartment 4B",
      city: "Dhaka",
      zipCode: "1000",
      country: "Bangladesh",
      phone: "+880 1234 567890",
    },
    paymentMethod: "card",
    trackingNumber: "BD987654321",
    timeline: [
      { status: "pending", date: "2024-05-01T10:15:00", description: "Order placed" },
      { status: "processing", date: "2024-05-01T11:30:00", description: "Payment confirmed" },
      { status: "processing", date: "2024-05-01T14:45:00", description: "Order processing" },
      { status: "shipped", date: "2024-05-02T09:30:00", description: "Order shipped" },
      { status: "delivered", date: "2024-05-03T15:20:00", description: "Order delivered" },
    ],
  },
  {
    id: "MS-0003",
    date: "2024-05-09T16:45:00",
    status: "processing",
    total: 12000,
    items: [
      {
        id: "7",
        name: "Manager Chair Series",
        price: "৳12,000.00",
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
      },
    ],
    shippingAddress: {
      name: "John Doe",
      address: "123 Main Street, Apartment 4B",
      city: "Dhaka",
      zipCode: "1000",
      country: "Bangladesh",
      phone: "+880 1234 567890",
    },
    paymentMethod: "cash",
    trackingNumber: "BD567891234",
    timeline: [
      { status: "pending", date: "2024-05-09T16:45:00", description: "Order placed" },
      { status: "processing", date: "2024-05-09T17:30:00", description: "Payment confirmed" },
      { status: "processing", date: "2024-05-10T09:15:00", description: "Order processing" },
    ],
  },
  {
    id: "MS-0004",
    date: "2024-05-10T09:30:00",
    status: "shipped",
    total: 50000,
    items: [
      {
        id: "3",
        name: "Modern L-Shaped Sofa Set",
        price: "৳50,000.00",
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
      },
    ],
    shippingAddress: {
      name: "John Doe",
      address: "123 Main Street, Apartment 4B",
      city: "Dhaka",
      zipCode: "1000",
      country: "Bangladesh",
      phone: "+880 1234 567890",
    },
    paymentMethod: "card",
    trackingNumber: "BD678912345",
    timeline: [
      { status: "pending", date: "2024-05-10T09:30:00", description: "Order placed" },
      { status: "processing", date: "2024-05-10T10:15:00", description: "Payment confirmed" },
      { status: "processing", date: "2024-05-10T11:45:00", description: "Order processing" },
      { status: "shipped", date: "2024-05-10T14:30:00", description: "Order shipped" },
    ],
  },
  {
    id: "MS-0005",
    date: "2024-04-25T11:20:00",
    status: "cancelled",
    total: 6500,
    items: [
      {
        id: "6",
        name: "Office Visitor Chair with Armrest",
        price: "৳6,500.00",
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
      },
    ],
    shippingAddress: {
      name: "John Doe",
      address: "123 Main Street, Apartment 4B",
      city: "Dhaka",
      zipCode: "1000",
      country: "Bangladesh",
      phone: "+880 1234 567890",
    },
    paymentMethod: "cash",
    trackingNumber: "",
    timeline: [
      { status: "pending", date: "2024-04-25T11:20:00", description: "Order placed" },
      { status: "processing", date: "2024-04-25T12:45:00", description: "Payment confirmed" },
      { status: "cancelled", date: "2024-04-25T15:30:00", description: "Order cancelled by customer" },
    ],
  },
  {
    id: "MS-0006",
    date: "2024-05-10T08:15:00",
    status: "pending",
    total: 35000,
    items: [
      {
        id: "4",
        name: "P-222 Premium Sectional Sofa",
        price: "৳35,000.00",
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
      },
    ],
    shippingAddress: {
      name: "John Doe",
      address: "123 Main Street, Apartment 4B",
      city: "Dhaka",
      zipCode: "1000",
      country: "Bangladesh",
      phone: "+880 1234 567890",
    },
    paymentMethod: "cash",
    trackingNumber: "",
    timeline: [{ status: "pending", date: "2024-05-10T08:15:00", description: "Order placed" }],
  },
]

export default function OrderDetailPage({ params }) {
  const router = useRouter()
  const orderId = params.id

  // Find the order with the matching ID
  const order = orders.find((o) => o.id === orderId)

  // If order not found, show error
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-8">The order you're looking for doesn't exist or has been removed.</p>
        <Button className="bg-red-600 hover:bg-red-700" onClick={() => router.push("/account/orders")}>
          Back to Orders
        </Button>
      </div>
    )
  }

  // Calculate subtotal
  const subtotal = order.items.reduce((total, item) => {
    return total + Number.parseInt(item.price.replace(/[^\d]/g, "")) * item.quantity
  }, 0)

  // Calculate shipping cost (free for orders over 5000)
  const shipping = subtotal > 5000 ? 0 : 200

  // Calculate total
  const total = subtotal + shipping

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4 pl-0 hover:bg-transparent hover:text-red-600"
          onClick={() => router.push("/account/orders")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
            <p className="text-gray-600">
              Placed on{" "}
              {new Date(order.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <OrderStatusBadge status={order.status} />

            <Button variant="outline" className="border-gray-300">
              <Download className="mr-2 h-4 w-4" />
              Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="mb-8 border rounded-md p-6 bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Order Status</h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-200"></div>

          {/* Timeline events */}
          <div className="space-y-6">
            {order.timeline.map((event, index) => (
              <div key={index} className="flex items-start relative">
                <div className="flex-shrink-0 z-10">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                    {getStatusIcon(event.status)}
                  </div>
                </div>

                <div className="ml-4 flex-1">
                  <div className="font-medium">{event.description}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking information */}
        {order.trackingNumber && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Tracking Number</h3>
                <p className="text-gray-600">{order.trackingNumber}</p>
              </div>

              <Button className="bg-red-600 hover:bg-red-700">Track Package</Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 font-medium">Order Items</div>

            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center">
                  <div className="w-16 h-16 relative flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>

                  <div className="text-right">
                    <div className="font-medium">{item.price}</div>
                    <div className="text-sm text-gray-600">per item</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 font-medium">Order Summary</div>

            <div className="p-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `৳${shipping.toLocaleString()}`}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Payment Information</h3>
                <p className="text-gray-600 mb-4">
                  {order.paymentMethod === "cash" ? "Cash on Delivery" : "Credit/Debit Card"}
                </p>

                <h3 className="font-medium mb-2">Shipping Address</h3>
                <address className="text-gray-600 not-italic">
                  {order.shippingAddress.name}
                  <br />
                  {order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                  <br />
                  {order.shippingAddress.country}
                  <br />
                  Phone: {order.shippingAddress.phone}
                </address>
              </div>

              {order.status === "pending" && (
                <div className="mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    Cancel Order
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
