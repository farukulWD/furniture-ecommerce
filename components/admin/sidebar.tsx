"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart,
  LogOut,
  Database,
  CreditCard,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Inventory",
    href: "/admin/inventory",
    icon: Database,
  },
  {
    title: "POS",
    href: "/admin/pos",
    icon: CreditCard,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <Package className="h-5 w-5" />
            <span className="text-sm">MS Furniture Admin</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 py-2">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start text-sm",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-transparent hover:text-primary",
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-primary/10 p-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
            </div>
            <div>
              <div className="font-medium text-sm">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-muted-foreground">Administrator</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs"
            onClick={logout}
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  )
}
