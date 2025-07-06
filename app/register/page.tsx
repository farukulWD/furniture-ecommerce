"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Password must contain at least one number",
  })
  .refine((password) => /[^A-Za-z0-9]/.test(password), {
    message: "Password must contain at least one special character",
  })

// Form validation schema
const registerSchema = z
  .object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: passwordSchema,
    confirmPassword: z.string(),
    terms: z.boolean().refine((value) => value === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Initialize form with react-hook-form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    mode: "onChange",
  })

  // Password strength checks
  const password = form.watch("password")
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

  // Calculate password strength
  const getPasswordStrength = () => {
    const criteria = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar]
    const strength = criteria.filter(Boolean).length

    if (strength === 0) return { value: 0, label: "", color: "" }
    if (strength <= 2) return { value: 20, label: "Weak", color: "bg-red-500" }
    if (strength <= 3) return { value: 40, label: "Fair", color: "bg-orange-500" }
    if (strength <= 4) return { value: 60, label: "Good", color: "bg-yellow-500" }
    return { value: 100, label: "Strong", color: "bg-green-500" }
  }

  const passwordStrength = getPasswordStrength()

  // Form submission handler
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Call register function from auth context
      await register(data.firstName, data.lastName, data.email, data.password)

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      })

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-gray-600 mt-2">Join MS Furniture to start shopping!</p>
        </div>

        <div className="bg-white p-8 rounded-lg border shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} placeholder="Create a password" {...field} />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />

                    {/* Password strength meter */}
                    {password.length > 0 && (
                      <div className="mt-2">
                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.value}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Strength:</span>
                          <span className="text-xs font-medium">{passwordStrength.label}</span>
                        </div>

                        <ul className="mt-2 space-y-1 text-xs">
                          <li className="flex items-center">
                            {hasMinLength ? (
                              <Check className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <X className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span className={hasMinLength ? "text-green-700" : "text-gray-600"}>
                              At least 8 characters
                            </span>
                          </li>
                          <li className="flex items-center">
                            {hasUppercase ? (
                              <Check className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <X className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span className={hasUppercase ? "text-green-700" : "text-gray-600"}>
                              One uppercase letter
                            </span>
                          </li>
                          <li className="flex items-center">
                            {hasLowercase ? (
                              <Check className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <X className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span className={hasLowercase ? "text-green-700" : "text-gray-600"}>
                              One lowercase letter
                            </span>
                          </li>
                          <li className="flex items-center">
                            {hasNumber ? (
                              <Check className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <X className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span className={hasNumber ? "text-green-700" : "text-gray-600"}>One number</span>
                          </li>
                          <li className="flex items-center">
                            {hasSpecialChar ? (
                              <Check className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <X className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span className={hasSpecialChar ? "text-green-700" : "text-gray-600"}>
                              One special character
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} id="terms" />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="terms" className="text-sm cursor-pointer">
                        I agree to the{" "}
                        <Link href="/terms" className="text-red-600 hover:text-red-800">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-red-600 hover:text-red-800">
                          Privacy Policy
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-red-600 hover:text-red-800 font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
