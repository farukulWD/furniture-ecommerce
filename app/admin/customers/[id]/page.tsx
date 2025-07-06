"use client"

import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { ArrowLeft, Mail } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const customerId = params.id

  // In a real app, this would fetch customer data from an API
  const customer = {
    id: customerId,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Apt 4B, New York, NY 10001, USA",
    avatar: "/placeholder.svg?height=100&width=100",
    registeredDate: "2022-03-15",
    totalOrders: 5,
    totalSpent: 2499.99,
    lastOrder: "2023-05-15",
    orders: [
      {
        id: "ORD-001",
        date: "2023-05-15",
        total: 1299.99,
        status: "delivered",
        items: 3,
      },
      {
        id: "ORD-002",
        date: "2023-04-10",
        total: 499.5,
        status: "delivered",
        items: 1,
      },
      {
        id: "ORD-003",
        date: "2023-02-22",
        total: 299.99,
        status: "delivered",
        items: 1,
      },
      {
        id: "ORD-004",
        date: "2022-12-05",
        total: 199.99,
        status: "delivered",
        items: 1,
      },
      {
        id: "ORD-005",
        date: "2022-09-18",
        total: 199.99,
        status: "delivered",
        items: 1,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.push("/admin/customers")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Customer Details</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                <AvatarFallback className="text-2xl">
                  {customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center">
                <h2 className="text-xl font-bold">{customer.name}</h2>
                <p className="text-sm text-muted-foreground">{customer.id}</p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => (window.location.href = `mailto:${customer.email}`)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="text-sm font-medium">{customer.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                <p className="text-sm font-medium">{customer.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                <p className="text-sm font-medium">{customer.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Registered</h3>
                <p className="text-sm font-medium">{new Date(customer.registeredDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium text-muted-foreground">Total Orders</div>
                  <div className="text-2xl font-bold">{customer.totalOrders}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium text-muted-foreground">Total Spent</div>
                  <div className="text-2xl font-bold">${customer.totalSpent.toFixed(2)}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium text-muted-foreground">Last Order</div>
                  <div className="text-2xl font-bold">{new Date(customer.lastOrder).toLocaleDateString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="orders" className="space-y-4">
            <TabsList>
              <TabsTrigger value="orders">Order History</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customer.orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell>{order.items} items</TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <OrderStatusBadge status={order.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Placed order #ORD-001</p>
                        <p className="text-xs text-muted-foreground">May 15, 2023 at 10:30 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Updated shipping address</p>
                        <p className="text-xs text-muted-foreground">May 14, 2023 at 2:15 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Added item to wishlist</p>
                        <p className="text-xs text-muted-foreground">May 12, 2023 at 9:45 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Placed order #ORD-002</p>
                        <p className="text-xs text-muted-foreground">April 10, 2023 at 3:20 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Account created</p>
                        <p className="text-xs text-muted-foreground">March 15, 2022 at 11:10 AM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
