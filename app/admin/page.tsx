"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentOrders } from "@/components/admin/recent-orders"
import { RecentCustomers } from "@/components/admin/recent-customers"
import { SalesChart } from "@/components/admin/sales-chart"
import { useInventory } from "@/context/inventory-context"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const router = useRouter()
  const { lowStockProducts } = useInventory()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        {lowStockProducts.length > 0 && (
          <Button
            variant="outline"
            className="flex items-center gap-2 text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:text-amber-700"
            onClick={() => router.push("/admin/inventory")}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>{lowStockProducts.length} products with low stock</span>
          </Button>
        )}
      </div>

      <DashboardStats />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>View your sales performance over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <SalesChart />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Customers</CardTitle>
                <CardDescription>Latest customer registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentCustomers />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders placed on your store</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentOrders />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Detailed performance metrics and insights</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
              Advanced analytics dashboard coming soon
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and download detailed reports</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
              Reports dashboard coming soon
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
