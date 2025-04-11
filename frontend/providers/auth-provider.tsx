"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export type User = {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, name: string, password: string) => Promise<void>
  signOut: () => void
  isAdmin: () => boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  isAdmin: () => false,
})

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    email: "user@example.com",
    name: "Demo User",
    password: "password",
    role: "user" as const,
  },
  {
    id: "2",
    email: "admin@example.com",
    name: "Admin User",
    password: "password",
    role: "admin" as const,
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Simulate API call
    const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      toast.success("Signed in successfully")

      if (foundUser.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/products")
      }
    } else {
      toast.error("Invalid email or password")
      throw new Error("Invalid email or password")
    }
  }

  const signUp = async (email: string, name: string, password: string) => {
    // Check if user already exists
    if (MOCK_USERS.some((u) => u.email === email)) {
      toast.error("User already exists")
      throw new Error("User already exists")
    }

    // In a real app, you would make an API call to create the user
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      email,
      name,
      role: "user" as const,
    }

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    toast.success("Account created successfully")
    router.push("/products")
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
    toast.success("Signed out successfully")
    router.push("/")
  }

  const isAdmin = () => {
    return user?.role === "admin"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
