"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProducts } from "@/lib/data"
import type { Product } from "@/types"
import ProductsTable from "../components/products-table"
import AddProductForm from "../components/add-product-form"

export default function AdminDashboardPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !isAdmin()) {
      router.push("/sign-in")
      return
    }

    // Fetch products
    const allProducts = getProducts()
    setProducts(allProducts)
    setLoading(false)
  }, [user, isAdmin, router])

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct])
  }

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)))
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="add-product">Add Product</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTable products={products} onUpdate={handleUpdateProduct} onDelete={handleDeleteProduct} />
          </TabsContent>

          <TabsContent value="add-product">
            <AddProductForm onAddProduct={handleAddProduct} />
          </TabsContent>

          <TabsContent value="users">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Users</h2>
              <p className="text-gray-400">User management functionality would be implemented here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
