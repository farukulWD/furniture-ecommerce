"use client"

import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function OrderStatusBadge({ status }) {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          icon: <Clock className="h-3 w-3 mr-1" />,
          className: "bg-yellow-100 text-yellow-800",
        }
      case "processing":
        return {
          label: "Processing",
          icon: <Package className="h-3 w-3 mr-1" />,
          className: "bg-blue-100 text-blue-800",
        }
      case "shipped":
        return {
          label: "Shipped",
          icon: <Truck className="h-3 w-3 mr-1" />,
          className: "bg-purple-100 text-purple-800",
        }
      case "delivered":
        return {
          label: "Delivered",
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          className: "bg-green-100 text-green-800",
        }
      case "cancelled":
        return {
          label: "Cancelled",
          icon: <XCircle className="h-3 w-3 mr-1" />,
          className: "bg-red-100 text-red-800",
        }
      default:
        return {
          label: "Unknown",
          icon: null,
          className: "bg-gray-100 text-gray-800",
        }
    }
  }

  const { label, icon, className } = getStatusConfig()

  return (
    <Badge variant="outline" className={`flex items-center font-normal ${className}`}>
      {icon}
      {label}
    </Badge>
  )
}

export default OrderStatusBadge
