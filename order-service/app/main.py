from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict
import httpx
import os
import json
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# File setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data/orders.json")

# Service URLs from environment variables (Docker/K8s friendly)
USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://user-service")
PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://product-service")

# Ensure file and folder exist
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
if not os.path.exists(DATA_FILE) or os.path.getsize(DATA_FILE) == 0:
    with open(DATA_FILE, "w") as f:
        f.write("[]")

# Models
class Item(BaseModel):
    productId: int
    quantity: int

class Order(BaseModel):
    id: int
    userId: int
    items: List[Item]
    status: str = "pending"

class OrderInput(BaseModel):
    userId: int
    items: List[Item]

# Helper functions
def load_orders() -> List[Order]:
    with open(DATA_FILE, "r") as f:
        return [Order(**o) for o in json.load(f)]

def save_orders(orders: List[Order]):
    with open(DATA_FILE, "w") as f:
        json.dump([o.model_dump() for o in orders], f, indent=2)

# Place an order
@app.post("/order")
async def place_order(order: OrderInput):
    # Verify user
    async with httpx.AsyncClient() as client:
        user_response = await client.get(f"{USER_SERVICE_URL}/user/{order.userId}")
        if user_response.status_code != 200:
            return {"error": "User not found"}

    # Update Product Stock
    async with httpx.AsyncClient() as client:
        for item in order.items:
            product_response = await client.put(
                f"{PRODUCT_SERVICE_URL}/products/{item.productId}/decrease_stock",
                params={"quantity": item.quantity}
            )
            print(product_response)
            if product_response.status_code != 200:
                return {"error": f"Product {item.productId} not found"}

    # Save order
    orders = load_orders()
    order_id = len(orders)
    order_status = "placed"
    new_order = Order(id=order_id, userId=order.userId, items=order.items, status=order_status)
    orders.append(new_order)
    save_orders(orders)
    return {"message": "Order placed", "order": new_order}

# Get order by ID
@app.get("/order/{order_id}")
def get_order(order_id: int):
    orders = load_orders()
    if 0 <= order_id < len(orders):
        return orders[order_id]
    return {"error": "Order not found"}

# List all orders by user_id
@app.get("/orders/{user_id}")
def list_orders_by_user(user_id: int):
    orders = load_orders()
    user_orders = [order for order in orders if order.userId == user_id]
    if user_orders:
        return user_orders
    return {"error": "No orders found for this user"}