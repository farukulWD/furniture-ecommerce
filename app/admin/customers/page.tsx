"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ImportExportButtons } from "@/components/admin/import-export-buttons"
import { exportCustomers } from "@/utils/import-export"

// Sample customers data
const customers = [
  {
    id: "CUST-001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    orders: 5,
    totalSpent: 2499.95,
  },
  {
    id: "CUST-002",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    orders: 3,
    totalSpent: 1299.97,
  },
  {
    id: "CUST-003",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.johnson@example.com",
    phone: "+1 (555) 456-7890",
    orders: 2,
    totalSpent: 799.98,
  },
  {
    id: "CUST-004",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 234-5678",
    orders: 1,
    totalSpent: 249.99,
  },
  {
    id: "CUST-005",
    firstName: "Michael",
    lastName: "Wilson",
    email: "michael.wilson@example.com",
    phone: "+1 (555) 876-5432",
    orders: 4,
    totalSpent: 1899.96,
  },
]

export default function CustomersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [customersList, setCustomersList] = useState(customers)

  // Filter customers based on search query
  const filteredCustomers = customersList.filter((customer) => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase()
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    )
  })

  const handleExport = () => {
    exportCustomers(filteredCustomers)
  }

  const handleImport = (importedCustomers: any[]) => {
    // In a real app, we would validate the imported data
    const newCustomers = importedCustomers.map((customer, index) => ({
      ...customer,
      id: customer.id || `imported-${Date.now()}-${index}`,
      orders: Number.parseInt(customer.orders) || 0,
      totalSpent: Number.parseFloat(customer.totalSpent) || 0,
    }))

    setCustomersList([...customersList, ...newCustomers])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <ImportExportButtons onExport={handleExport} onImport={handleImport} entityName="Customers" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/customers/${customer.id}`)}>
                      View
                    </Button>
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
