"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        className="max-w-md mx-auto text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="h-20 w-20 mx-auto text-white" />
          </motion.div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-400 mb-8">
          Thank you for your purchase. We&apos;ve received your order and will process it right away. You&apos;ll
          receive a confirmation email shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              View Orders
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
