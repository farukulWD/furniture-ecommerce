"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { Search, Filter, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImportExportButtons } from "@/components/admin/import-export-buttons"
import { exportOrders } from "@/utils/import-export"

// Sample orders data
const orders = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    email: "john.doe@example.com",
    date: "2023-05-15",
    status: "delivered",
    total: 1299.99,
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    email: "jane.smith@example.com",
    date: "2023-05-14",
    status: "shipped",
    total: 499.5,
  },
  {
    id: "ORD-003",
    customerName: "Robert Johnson",
    email: "robert.johnson@example.com",
    date: "2023-05-13",
    status: "processing",
    total: 799.99,
  },
  {
    id: "ORD-004",
    customerName: "Emily Davis",
    email: "emily.davis@example.com",
    date: "2023-05-12",
    status: "cancelled",
    total: 249.99,
  },
  {
    id: "ORD-005",
    customerName: "Michael Wilson",
    email: "michael.wilson@example.com",
    date: "2023-05-11",
    status: "delivered",
    total: 1599.99,
  },
]

export default function OrdersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ordersList, setOrdersList] = useState(orders)

  // Filter orders based on search query and status
  const filteredOrders = ordersList.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleExport = () => {
    exportOrders(filteredOrders)
  }

  const handleImport = (importedOrders: any[]) => {
    // In a real app, we would validate the imported data
    const newOrders = importedOrders.map((order, index) => ({
      ...order,
      id: order.id || `imported-${Date.now()}-${index}`,
      total: Number.parseFloat(order.total) || 0,
    }))

    setOrdersList([...ordersList, ...newOrders])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <ImportExportButtons onExport={handleExport} onImport={handleImport} entityName="Orders" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/orders/${order.id}/invoice`)}
                      >
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View Invoice</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
