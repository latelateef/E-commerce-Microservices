"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/types"

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  return (
    <motion.div
      className="bg-gray-900 rounded-lg overflow-hidden"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>
      </Link>

      <div className="p-4">
        <h2 className="font-semibold text-lg mb-1">{product.name}</h2>
        <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="font-bold">${product.price.toFixed(2)}</span>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-1 rounded ${
                product.stock > 0 ? "bg-gray-700 text-gray-300" : "bg-gray-800 text-gray-500"
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>
        </div>

        <Button
          className="w-full mt-4 flex items-center justify-center gap-2"
          onClick={() => addItem(product)}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  )
}
