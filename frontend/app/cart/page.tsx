"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import toast from "react-hot-toast"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please sign in to checkout")
      router.push("/sign-in")
      return
    }

    setIsProcessing(true)

    // Simulate checkout process
    setTimeout(() => {
      clearCart()
      setIsProcessing(false)
      router.push("/checkout/success")
    }, 1500)
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-gray-500" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-400 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="divide-y divide-gray-800">
                {items.map((item) => (
                  <div key={item.product.id} className="py-6 first:pt-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative w-24 h-24 bg-gray-800 rounded">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p className="text-gray-400 text-sm mb-2">${item.product.price.toFixed(2)}</p>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-gray-700 rounded">
                            <button
                              className="px-3 py-1 text-gray-400 hover:text-white"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 py-1">{item.quantity}</span>
                            <button
                              className="px-3 py-1 text-gray-400 hover:text-white"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            className="text-gray-400 hover:text-white"
                            onClick={() => removeItem(item.product.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gray-900 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span>{totalPrice > 100 ? "Free" : "$10.00"}</span>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 mb-6">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${(totalPrice + (totalPrice > 100 ? 0 : 10)).toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full flex items-center justify-center gap-2"
                size="lg"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Checkout <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="mt-4">
                <Link href="/products" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
                  <ArrowRight className="h-3 w-3 rotate-180" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
