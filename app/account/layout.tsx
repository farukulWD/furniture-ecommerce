import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { User, Package, Heart, CreditCard, LogOut } from "lucide-react"

export const metadata: Metadata = {
  title: "My Account - MS Furniture",
  description: "Manage your account, orders, and wishlist",
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-50 p-4">
              <h2 className="font-semibold">My Account</h2>
            </div>
            <nav className="p-2">
              <ul className="space-y-1">
                <li>
                  <Link href="/account" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
                    <User className="h-4 w-4 mr-3 text-gray-500" />
                    <span>Profile</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/orders"
                    className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 bg-red-50 text-red-600"
                  >
                    <Package className="h-4 w-4 mr-3 text-red-500" />
                    <span>Orders</span>
                  </Link>
                </li>
                <li>
                  <Link href="/account/wishlist" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
                    <Heart className="h-4 w-4 mr-3 text-gray-500" />
                    <span>Wishlist</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/payment-methods"
                    className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    <CreditCard className="h-4 w-4 mr-3 text-gray-500" />
                    <span>Payment Methods</span>
                  </Link>
                </li>
                <li className="border-t mt-2 pt-2">
                  <Link
                    href="/logout"
                    className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-3 text-red-500" />
                    <span>Logout</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  )
}
