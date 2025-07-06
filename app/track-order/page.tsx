"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "@/context/i18n-context"

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)
  const { toast } = useToast()
  const { t } = useTranslation()

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (orderNumber === "MS12345" || orderNumber === "MS67890") {
        setOrderDetails({
          id: orderNumber,
          date: "2024-05-10",
          status: orderNumber === "MS12345" ? "shipped" : "processing",
          items: [
            {
              id: 1,
              name: "Modern Sofa",
              price: "৳25,000.00",
              quantity: 1,
            },
            {
              id: 2,
              name: "Coffee Table",
              price: "৳8,500.00",
              quantity: 1,
            },
          ],
          total: "৳33,500.00",
          shipping: "৳0.00",
          trackingNumber: orderNumber === "MS12345" ? "BD123456789" : null,
        })
      } else {
        toast({
          title: t("error"),
          description: t("no_order_found"),
          variant: "destructive",
        })
        setOrderDetails(null)
      }
      setIsLoading(false)
    }, 1500)
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t("track_your_order")}</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("track_order")}</CardTitle>
            <CardDescription>{t("enter_order_details")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">{t("order_number")}</Label>
                <Input
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. MS12345"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email_address")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? `${t("searching")}...` : t("track_order")}
              </Button>
            </form>
          </CardContent>
        </Card>

        {orderDetails && (
          <Card>
            <CardHeader>
              <CardTitle>{t("order_details")}</CardTitle>
              <CardDescription>
                {t("order_number")}: {orderDetails.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("order_date")}</p>
                  <p>{new Date(orderDetails.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("order_status")}</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(
                      orderDetails.status,
                    )}`}
                  >
                    {t(orderDetails.status)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t("order_summary")}</h3>
                <div className="border rounded-md divide-y">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t("quantity")}: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">{item.price}</p>
                    </div>
                  ))}
                  <div className="p-3 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                    <p className="font-medium">{t("total")}</p>
                    <p className="font-bold">{orderDetails.total}</p>
                  </div>
                </div>
              </div>

              {orderDetails.status === "shipped" && (
                <div>
                  <h3 className="font-medium mb-2">{t("shipping_information")}</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <p className="mb-2">
                      <span className="font-medium">{t("tracking_number")}: </span>
                      {orderDetails.trackingNumber}
                    </p>
                    <Button variant="outline" size="sm">
                      {t("track_package")}
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-medium">{t("order_status")}</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="space-y-8">
                    <div className="relative pl-10">
                      <div
                        className={`absolute left-3 -translate-x-1/2 h-6 w-6 rounded-full border-2 ${
                          ["pending", "processing", "shipped", "delivered"].includes(orderDetails.status)
                            ? "bg-green-500 border-green-500"
                            : "bg-gray-200 dark:bg-gray-700 border-gray-200 dark:border-gray-700"
                        }`}
                      ></div>
                      <h4 className="font-medium">{t("order_placed")}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(orderDetails.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="relative pl-10">
                      <div
                        className={`absolute left-3 -translate-x-1/2 h-6 w-6 rounded-full border-2 ${
                          ["processing", "shipped", "delivered"].includes(orderDetails.status)
                            ? "bg-green-500 border-green-500"
                            : "bg-gray-200 dark:bg-gray-700 border-gray-200 dark:border-gray-700"
                        }`}
                      ></div>
                      <h4 className="font-medium">{t("payment_confirmed")}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(orderDetails.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="relative pl-10">
                      <div
                        className={`absolute left-3 -translate-x-1/2 h-6 w-6 rounded-full border-2 ${
                          ["processing", "shipped", "delivered"].includes(orderDetails.status)
                            ? "bg-green-500 border-green-500"
                            : "bg-gray-200 dark:bg-gray-700 border-gray-200 dark:border-gray-700"
                        }`}
                      ></div>
                      <h4 className="font-medium">{t("order_processing")}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {orderDetails.status === "processing"
                          ? t("in_progress")
                          : new Date(orderDetails.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="relative pl-10">
                      <div
                        className={`absolute left-3 -translate-x-1/2 h-6 w-6 rounded-full border-2 ${
                          ["shipped", "delivered"].includes(orderDetails.status)
                            ? "bg-green-500 border-green-500"
                            : "bg-gray-200 dark:bg-gray-700 border-gray-200 dark:border-gray-700"
                        }`}
                      ></div>
                      <h4 className="font-medium">{t("order_shipped")}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {orderDetails.status === "shipped" ? t("in_transit") : "-"}
                      </p>
                    </div>
                    <div className="relative pl-10">
                      <div
                        className={`absolute left-3 -translate-x-1/2 h-6 w-6 rounded-full border-2 ${
                          ["delivered"].includes(orderDetails.status)
                            ? "bg-green-500 border-green-500"
                            : "bg-gray-200 dark:bg-gray-700 border-gray-200 dark:border-gray-700"
                        }`}
                      ></div>
                      <h4 className="font-medium">{t("order_delivered")}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">-</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
