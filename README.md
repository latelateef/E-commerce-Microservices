# 🛒 E-commerce Microservices Web App

## Architecture Overview

This is a modular e-commerce application built using microservices. Each service is independently developed, can be deployed, and scaled. Services communicate via REST, and are containerized using Docker and orchestrated using Kubernetes.

### Microservices Overview

| Service         | Port  | Responsibilities |
|-----------------|-------|------------------|
| User Service    | 5001  | Signup/Login/Profile |
| Product Service | 5002  | Product listing and stock management |
| Order Service   | 5003  | Placing and tracking orders |
| API Gateway     | 8000  | Routing requests to backend services |

---

## 🚀 Technologies Used

- **FastAPI** – High-performance API framework
- **MongoDB** – NoSQL database for flexible document storage
- **Docker** – Containerization of services
- **Kubernetes** – Orchestration and service discovery
- **httpx** – Async service communication in FastAPI
- **dotenv** – Environment variable management

---

## 📡 API Gateway Routes

The API Gateway exposes all internal service routes under a single unified prefix.

| Route Prefix      | Maps to             |
|-------------------|---------------------|
| `/api/users/*`    | User Service        |
| `/api/products/*` | Product Service     |
| `/api/orders/*`   | Order Service       |

---

## 🔐 User Service Endpoints

- `POST /signup` – Register user  
- `POST /login` – User login  
- `GET /user/{email}` – Get user by email  
- `GET /users` – List all users  

---

## 🛍️ Product Service Endpoints

- `GET /products` – List all products  
- `POST /product` – Add a product  
- `PUT /products/{product_id}/decrease_stock` – Decrease stock after order  
- `PUT /products/{product_id}/update_stock` – Refill product stock  

---

## 📦 Order Service Endpoints

- `POST /order` – Place a new order  
- `GET /order/{order_id}` – Get order details by ID  
- `GET /orders/{user_id}` – List orders for a specific user  

---

## 🔁 Data Flow Example

1. User logs in via `POST /api/users/login`
2. Frontend sends `POST /api/orders/order` to place an order
3. Order Service:
   - Verifies user via User Service
   - Decreases product stock via Product Service
4. Order is saved in the database and returned to the user

---

## 🧪 Running Locally (Docker Compose)

```bash
docker-compose up --build
