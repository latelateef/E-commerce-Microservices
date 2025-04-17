import axios from "@/lib/axios"

// AUTH
export const signInAPI = async (email: string, password: string) => {
  const res = await axios.post("/api/users/login", { email, password }, {
    withCredentials: true })
  return res.data
}

export const signUpAPI = async (name: string, email: string, password: string) => {
  const res = await axios.post("/api/users/signup", { name, email, password }, {
    withCredentials: true })
  return res.data
}

// USER
export const getProfile = async () => {
  const res = await axios.get("/api/user/profile")
  return res.data
}

// PRODUCTS
export const getAllProducts = async () => {
  const res = await axios.get("/api/products/all-products")
  return res.data
}

export const createProduct = async (product: { name: string; price: number }) => {
  const res = await axios.post("/api/products", product)
  return res.data
}

// ORDERS
export const getOrders = async () => {
  const res = await axios.get("/api/orders")
  return res.data
}

export const placeOrder = async (orderData: any) => {
  const res = await axios.post("/api/orders", orderData)
  return res.data
}
