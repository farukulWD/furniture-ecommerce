"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

// Store settings form schema
const storeFormSchema = z.object({
  storeName: z.string().min(2, {
    message: "Store name must be at least 2 characters.",
  }),
  storeEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  storePhone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  storeAddress: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
  storeCurrency: z.string().min(1, {
    message: "Please select a currency.",
  }),
  storeDescription: z.string().optional(),
})

// Notification settings form schema
const notificationFormSchema = z.object({
  orderConfirmation: z.boolean().default(true),
  orderShipped: z.boolean().default(true),
  orderDelivered: z.boolean().default(true),
  lowStock: z.boolean().default(true),
  newCustomer: z.boolean().default(true),
  productReviews: z.boolean().default(true),
})

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Initialize store form
  const storeForm = useForm<z.infer<typeof storeFormSchema>>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      storeName: "MS Furniture",
      storeEmail: "info@msfurniture.com",
      storePhone: "+1 (555) 123-4567",
      storeAddress: "123 Commerce St, Suite 100, New York, NY 10001, USA",
      storeCurrency: "USD",
      storeDescription: "Premium furniture for modern homes.",
    },
  })

  // Initialize notification form
  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      orderConfirmation: true,
      orderShipped: true,
      orderDelivered: true,
      lowStock: true,
      newCustomer: true,
      productReviews: false,
    },
  })

  // Store form submission
  function onStoreSubmit(values: z.infer<typeof storeFormSchema>) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log(values)
      setIsLoading(false)
      toast({
        title: "Settings updated",
        description: "Your store settings have been updated successfully.",
      })
    }, 1000)
  }

  // Notification form submission
  function onNotificationSubmit(values: z.infer<typeof notificationFormSchema>) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log(values)
      setIsLoading(false)
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been updated successfully.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your store settings and preferences.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Update your store details and contact information.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...storeForm}>
                <form onSubmit={storeForm.handleSubmit(onStoreSubmit)} className="space-y-6">
                  <FormField
                    control={storeForm.control}
                    name="storeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>This is the name that will be displayed to your customers.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={storeForm.control}
                      name="storeEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={storeForm.control}
                      name="storePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={storeForm.control}
                    name="storeAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={storeForm.control}
                    name="storeCurrency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>The currency used for all transactions.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={storeForm.control}
                    name="storeDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>A brief description of your store.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure which notifications you want to receive.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={notificationForm.control}
                      name="orderConfirmation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Order Confirmation</FormLabel>
                            <FormDescription>Receive notifications when a new order is placed.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="orderShipped"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Order Shipped</FormLabel>
                            <FormDescription>Receive notifications when an order is shipped.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="orderDelivered"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Order Delivered</FormLabel>
                            <FormDescription>Receive notifications when an order is delivered.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="lowStock"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Low Stock Alerts</FormLabel>
                            <FormDescription>Receive notifications when product stock is low.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="newCustomer"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">New Customer Registration</FormLabel>
                            <FormDescription>Receive notifications when a new customer registers.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="productReviews"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Product Reviews</FormLabel>
                            <FormDescription>
                              Receive notifications when a product receives a new review.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your store.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Theme</h3>
                <p className="text-sm text-muted-foreground">Choose a theme for your store.</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-md border-2 border-primary p-2 text-center">
                    <div className="mb-2 h-20 rounded-md bg-primary"></div>
                    <p className="text-sm font-medium">Default</p>
                  </div>
                  <div className="rounded-md border-2 border-muted p-2 text-center">
                    <div className="mb-2 h-20 rounded-md bg-[#1e293b]"></div>
                    <p className="text-sm font-medium">Dark</p>
                  </div>
                  <div className="rounded-md border-2 border-muted p-2 text-center">
                    <div className="mb-2 h-20 rounded-md bg-[#0ea5e9]"></div>
                    <p className="text-sm font-medium">Blue</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Logo</h3>
                <p className="text-sm text-muted-foreground">Upload your store logo.</p>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md border flex items-center justify-center">
                    <span className="text-2xl font-bold">MS</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Logo
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced settings for your store.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Maintenance Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Put your store in maintenance mode to prevent customers from accessing it while you make changes.
                </p>
                <div className="flex items-center space-x-2">
                  <Switch id="maintenance-mode" />
                  <label htmlFor="maintenance-mode">Enable Maintenance Mode</label>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Database Backup</h3>
                <p className="text-sm text-muted-foreground">Create a backup of your store data.</p>
                <Button variant="outline">Create Backup</Button>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Clear Cache</h3>
                <p className="text-sm text-muted-foreground">Clear the cache to refresh your store data.</p>
                <Button variant="outline">Clear Cache</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
