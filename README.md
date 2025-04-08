# Zepto-like Grocery Delivery App

## Microservices Overview

| Service         | Port  | Responsibilities |
|-----------------|-------|------------------|
| User Service    | 5000  | Signup/Login/Profile |
| Product Service | 5001  | Product listing/details |
| Order Service   | 5002  | Placing/viewing orders |
| Delivery Service| 5003  | Assigning and tracking delivery |

---

## API Endpoints

### ✅ User Service

- `POST /signup` – Register user  
- `POST /login` – Login  
- `GET /user/:id` – Get profile

### 🛍️ Product Service

- `GET /products`  
- `GET /products/:id`  
- `POST /products` (admin)

### Order Service
- `POST /order` – Place an order
- `GET /order/:id` – Get order details
- `GET /orders` – Get all orders
- `PUT /order/:id/status` – Update order status

### Delivery Service
- `POST /assign` – Assign delivery agent
- `GET /delivery/:id` – Get delivery info
- `PUT /delivery/:id/update` – Update delivery status

---

## Data Flow Example

1. User signs in via `/login`
2. User places an order via `/order`
3. Order service confirms product availability by calling Product Service
4. Delivery Service assigns an agent

