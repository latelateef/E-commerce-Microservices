"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Package, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { getOrdersByUserId } from "@/lib/data"
import type { Order } from "@/types"
import Link from "next/link"

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/sign-in")
      return
    }

    // Fetch orders
    const userOrders = getOrdersByUserId(user.id)
    setOrders(userOrders)
    setLoading(false)
  }, [user, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-gray-500" />
          <h1 className="text-2xl font-bold mb-4">No orders yet</h1>
          <p className="text-gray-400 mb-8">You haven&apos;t placed any orders yet.</p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              className="bg-gray-900 rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order #{order.id}
                    </h2>
                    <p className="text-gray-400 text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "delivered"
                          ? "bg-green-900/30 text-green-400"
                          : order.status === "shipped"
                            ? "bg-blue-900/30 text-blue-400"
                            : "bg-yellow-900/30 text-yellow-400"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4">
                  <h3 className="font-medium mb-2">Items</h3>
                  <ul className="divide-y divide-gray-800">
                    {order.items.map((item) => (
                      <li key={item.productId} className="py-3 flex justify-between">
                        <div>
                          <p>{item.name}</p>
                          <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-800 pt-4 mt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
