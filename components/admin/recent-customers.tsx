import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample data for recent customers
const recentCustomers = [
  {
    id: "CUST-1234",
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    date: "2023-05-16T10:30:00",
    spent: "$299.99",
    initials: "OM",
  },
  {
    id: "CUST-1233",
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    date: "2023-05-15T14:20:00",
    spent: "$175.25",
    initials: "JL",
  },
  {
    id: "CUST-1232",
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    date: "2023-05-15T09:45:00",
    spent: "$89.99",
    initials: "IN",
  },
  {
    id: "CUST-1231",
    name: "William Kim",
    email: "william.kim@email.com",
    date: "2023-05-14T16:10:00",
    spent: "$143.50",
    initials: "WK",
  },
]

export function RecentCustomers() {
  return (
    <div className="space-y-8">
      {recentCustomers.map((customer) => (
        <div key={customer.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={customer.name} />
            <AvatarFallback>{customer.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
          <div className="ml-auto font-medium">{customer.spent}</div>
        </div>
      ))}
    </div>
  )
}
