"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { getProductById } from "@/lib/data"
import type { Product } from "@/types"
import Link from "next/link"

export default function ProductDetailPage() {
  const params = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const foundProduct = getProductById(params.id as string)
      if (foundProduct) {
        setProduct(foundProduct)
      }
      setLoading(false)
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/products" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-bold mb-6">${product.price.toFixed(2)}</p>

          <div className="mb-6">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm ${
                product.stock > 0 ? "bg-gray-700 text-gray-300" : "bg-gray-800 text-gray-500"
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <p className="text-gray-400 mb-8">{product.description}</p>

          <Button
            className="flex items-center justify-center gap-2 mb-8"
            size="lg"
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>

          <div className="border-t border-gray-800 pt-6">
            <h3 className="font-semibold mb-2">Product Details</h3>
            <ul className="text-gray-400 space-y-2">
              <li>Category: {product.category}</li>
              <li>ID: {product.id}</li>
              <li>Free shipping on orders over $100</li>
              <li>30-day return policy</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
