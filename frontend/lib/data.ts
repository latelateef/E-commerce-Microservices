import type { Product, Order } from "@/types"

// Mock products data
export const products: Product[] = [
  {
    id: "1",
    name: "Minimalist Watch",
    description: "A sleek, minimalist watch with a black leather strap and white face.",
    price: 149.99,
    image: "/placeholder.svg?height=400&width=400",
    stock: 15,
    category: "Accessories",
  },
  {
    id: "2",
    name: "Black Cotton T-Shirt",
    description: "Premium cotton t-shirt in classic black.",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=400",
    stock: 50,
    category: "Clothing",
  },
  {
    id: "3",
    name: "Leather Wallet",
    description: "Handcrafted leather wallet with multiple card slots.",
    price: 79.99,
    image: "/placeholder.svg?height=400&width=400",
    stock: 20,
    category: "Accessories",
  },
  {
    id: "4",
    name: "Wireless Earbuds",
    description: "Noise-cancelling wireless earbuds with charging case.",
    price: 129.99,
    image: "/placeholder.svg?height=400&width=400",
    stock: 8,
    category: "Electronics",
  },
  {
    id: "5",
    name: "Canvas Backpack",
    description: "Durable canvas backpack with leather accents.",
    price: 89.99,
    image: "/placeholder.svg?height=400&width=400",
    stock: 12,
    category: "Bags",
  },
  {
    id: "6",
    name: "Stainless Steel Water Bottle",
    description: "Insulated water bottle that keeps drinks cold for 24 hours.",
    price: 34.99,
    image: "/placeholder.svg?height=400&width=400",
    stock: 30,
    category: "Accessories",
  },
]

// Mock orders data
export const orders: Order[] = [
  {
    id: "order-1",
    userId: "1",
    items: [
      {
        productId: "1",
        name: "Minimalist Watch",
        price: 149.99,
        quantity: 1,
      },
      {
        productId: "3",
        name: "Leather Wallet",
        price: 79.99,
        quantity: 1,
      },
    ],
    total: 229.98,
    status: "delivered",
    createdAt: "2023-11-15T10:30:00Z",
  },
  {
    id: "order-2",
    userId: "1",
    items: [
      {
        productId: "2",
        name: "Black Cotton T-Shirt",
        price: 29.99,
        quantity: 2,
      },
    ],
    total: 59.98,
    status: "shipped",
    createdAt: "2023-12-05T14:20:00Z",
  },
]

// Function to get all products
export function getProducts(): Product[] {
  return products
}

// Function to get a product by ID
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

// Function to get orders by user ID
export function getOrdersByUserId(userId: string): Order[] {
  return orders.filter((order) => order.userId === userId)
}

// Function to get an order by ID
export function getOrderById(id: string): Order | undefined {
  return orders.find((order) => order.id === id)
}
