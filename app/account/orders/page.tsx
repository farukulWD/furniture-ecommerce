"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, ChevronRight, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  },
]

export default function OrdersPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  // Filter orders based on active tab
  const getFilteredOrders = () => {
    let filtered = [...orders]

    // Filter by status
    if (activeTab !== "all") {
      filtered = filtered.filter((order) => order.status === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) || order.items.some((item) => item.name.toLowerCase().includes(query)),
      )
    }

    // Sort orders
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()

      if (sortBy === "newest") {
        return dateB - dateA
      } else if (sortBy === "oldest") {
        return dateA - dateB
      } else if (sortBy === "highest") {
        return b.total - a.total
      } else if (sortBy === "lowest") {
        return a.total - b.total
      }
      return 0
    })

    return filtered
  }

  const filteredOrders = getFilteredOrders()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-gray-600">View and track your orders</p>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8"
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Amount</SelectItem>
              <SelectItem value="lowest">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-6 mb-4">
          <TabsTrigger value="all" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            All
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Pending
          </TabsTrigger>
          <TabsTrigger value="processing" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Processing
          </TabsTrigger>
          <TabsTrigger value="shipped" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Shipped
          </TabsTrigger>
          <TabsTrigger value="delivered" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Delivered
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Cancelled
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-md overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-gray-600">
                        Placed on{" "}
                        {new Date(order.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Total Amount</div>
                        <div className="font-semibold">৳{order.total.toLocaleString()}</div>
                      </div>

                      <Button
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        onClick={() => router.push(`/account/orders/${order.id}`)}
                      >
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <div className="w-16 h-16 relative flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              {item.price} x {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-md">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? "No orders match your search criteria."
                  : activeTab === "all"
                    ? "You haven't placed any orders yet."
                    : `You don't have any ${activeTab} orders.`}
              </p>
              <Link href="/">
                <Button className="bg-red-600 hover:bg-red-700">Continue Shopping</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
