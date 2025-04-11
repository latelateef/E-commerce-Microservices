"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        className="flex flex-col items-center justify-center min-h-[70vh] text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6">Monochrome</h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-8">
          Minimalist essentials crafted with premium materials for the modern individual.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          {!user ? (
            <>
              <Button asChild size="lg">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sign-up">Create Account</Link>
              </Button>
            </>
          ) : (
            <Button asChild size="lg">
              <Link href="/products" className="flex items-center gap-2">
                Shop Now <ArrowRight size={16} />
              </Link>
            </Button>
          )}
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="bg-gray-900 p-8 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
          <p className="text-gray-400">Crafted with the finest materials for lasting durability.</p>
        </div>
        <div className="bg-gray-900 p-8 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Minimalist Design</h3>
          <p className="text-gray-400">Clean aesthetics that complement any style or setting.</p>
        </div>
        <div className="bg-gray-900 p-8 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Sustainable Approach</h3>
          <p className="text-gray-400">Environmentally conscious production and materials.</p>
        </div>
      </motion.div>
    </div>
  )
}
