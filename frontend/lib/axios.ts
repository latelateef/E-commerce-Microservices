import axios from "axios"

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL || "http://localhost:8000", 
  headers: {
    "Content-Type": "application/json",
  },
})

// Optional: Add token to every request automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosInstance
