"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"

export default function Header() {
  const { user, signOut, isAdmin } = useAuth()
  const { totalItems } = useCart()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/#products" },
    { name: "About", href: "#about" },
  ]

  if (user) {
    navItems.push({ name: "Orders", href: "/orders" })
  }

  if (isAdmin()) {
    navItems.push({ name: "Admin", href: "/admin/dashboard" })
  }

  return (
    <header className="fixed w-full bg-black border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
          MicroMart
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm text-gray-400 hover:text-white`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/cart" className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="text-sm">{user.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-4">
            {user && (
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-400 hover:text-white">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4"
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm ${
                    pathname === item.href ? "text-white font-medium" : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <User className="h-5 w-5" />
                    <span className="text-sm">{user.name}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}
