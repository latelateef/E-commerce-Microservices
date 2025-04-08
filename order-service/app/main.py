from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict
import httpx
import os
import json

app = FastAPI()

# File setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data/orders.json")

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

# Helper functions
def load_orders() -> List[Order]:
    with open(DATA_FILE, "r") as f:
        return [Order(**o) for o in json.load(f)]

def save_orders(orders: List[Order]):
    with open(DATA_FILE, "w") as f:
        json.dump([o.model_dump() for o in orders], f, indent=2)

# Place an order
@app.post("/order")
async def place_order(order: Order):
    # Verify user
    async with httpx.AsyncClient() as client:
        user_response = await client.get(f"http://localhost:5000/user/{order.userId}")
        if user_response.status_code != 200:
            return {"error": "User not found"}

    # Verify products
    async with httpx.AsyncClient() as client:
        for item in order.items:
            product_response = await client.get(f"http://localhost:5001/products/{item.productId}")
            if product_response.status_code != 200:
                return {"error": f"Product {item.productId} not found"}

    # Save order
    orders = load_orders()
    order.id = len(orders)
    order.status = "placed"
    orders.append(order)
    save_orders(orders)
    return {"message": "Order placed", "order": order}

# Get order by ID
@app.get("/order/{order_id}")
def get_order(order_id: int):
    orders = load_orders()
    if 0 <= order_id < len(orders):
        return orders[order_id]
    return {"error": "Order not found"}

# Update order status
@app.put("/order/{order_id}/status")
def update_order_status(order_id: int, status: Dict[str, str]):
    orders = load_orders()
    if 0 <= order_id < len(orders):
        orders[order_id].status = status["status"]
        save_orders(orders)
        return {"message": "Order status updated"}
    return {"error": "Order not found"}
