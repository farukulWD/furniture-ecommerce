"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

// Define user type
type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "customer" | "admin"
}

// Define auth context type
type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>
  logout: () => void
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Sample user data (this would come from your backend in a real app)
const sampleUser: User = {
  id: "user-1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  role: "customer",
}

// Admin user data
const adminUser: User = {
  id: "admin-1",
  firstName: "Admin",
  lastName: "User",
  email: "admin@msfurniture.com",
  role: "admin",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true)
    try {
      // Check for admin credentials
      if (email === adminUser.email && password === "Admin123!") {
        setUser(adminUser)
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(adminUser))
        }
        return
      }

      // Check for regular user credentials
      if (email === sampleUser.email && password === "Password123!") {
        setUser(sampleUser)
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(sampleUser))
        }
        return
      }

      // If neither admin nor regular user credentials match
      throw new Error("Invalid credentials")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // In a real app, you would make an API call to your backend
      // For demo purposes, we'll just simulate a successful registration
      const newUser: User = {
        id: `user-${Date.now()}`,
        firstName,
        lastName,
        email,
        role: "customer",
      }

      // In a real app, you would typically not log the user in automatically after registration
      // but for demo purposes, we'll set the user
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
