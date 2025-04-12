"use client"

import type React from "react"
import axios from "axios"

import { createContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { signInAPI } from "@/lib/api"
import { signUpAPI } from "@/lib/api"

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
      try {

        const user = await signInAPI(email, password)
    
        // Save user to state / storage
        setUser(user)
        localStorage.setItem("user", JSON.stringify(user))
  
        toast.success("Signed in successfully")
  
        // Optional: redirect based on role
        if (user.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/products")
        }
  
      } catch (error: any) {
        const message = error.response?.data?.message || "Sign in failed"
        toast.error(message)
        throw new Error(message)
      }
    }
  

  const signUp = async (email: string, name: string, password: string) => {
    try{
      // Check if email already exists
      // const user = await 
      const newUser = await signUpAPI(name, email, password)
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      toast.success("Account created successfully")
      router.push("/products")
    }catch(error: any){
      const message = error.response?.data?.message || "Sign up failed"
      toast.error(message)
      throw new Error(message)
    }

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
