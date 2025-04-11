export type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  stock: number
  category: string
}

export type Order = {
  id: string
  userId: string
  items: {
    productId: string
    name: string
    price: number
    quantity: number
  }[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered"
  createdAt: string
}
