"use client"

import { motion } from "framer-motion"
import SearchBar from "@/components/search-bar"
import Products from "@/components/products"

export default function Home() {

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        className="flex flex-col items-center justify-center min-h-[70vh] text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
      <SearchBar />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div>
          <Products />
        </div>
      </motion.div>
    </div>
  )
}
