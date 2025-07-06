import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "@/components/order-status-badge"

// Sample data for recent orders
const recentOrders = [
  {
    id: "ORD-7652",
    customer: "John Smith",
    date: "2023-05-16T08:30:00",
    status: "processing",
    total: "$125.99",
    items: 3,
  },
  {
    id: "ORD-7651",
    customer: "Sarah Johnson",
    date: "2023-05-15T14:20:00",
    status: "shipped",
    total: "$243.50",
    items: 5,
  },
  {
    id: "ORD-7650",
    customer: "Michael Brown",
    date: "2023-05-15T09:45:00",
    status: "delivered",
    total: "$89.99",
    items: 2,
  },
  {
    id: "ORD-7649",
    customer: "Emily Davis",
    date: "2023-05-14T16:10:00",
    status: "processing",
    total: "$175.25",
    items: 4,
  },
  {
    id: "ORD-7648",
    customer: "Robert Wilson",
    date: "2023-05-14T11:30:00",
    status: "cancelled",
    total: "$62.50",
    items: 1,
  },
]

export function RecentOrders() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{new Date(order.date).toLocaleString()}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
