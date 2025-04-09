from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import httpx
import os
from bson import ObjectId
from app.db import db
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://user-service")
PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://product-service")

# Pydantic Models
class Item(BaseModel):
    productId: str
    quantity: int

class OrderInput(BaseModel):
    userId: str
    items: List[Item]

class OrderOut(BaseModel):
    id: str
    status: str

class Order(BaseModel):
    id: str
    userId: str
    items: List[Item]
    status: str

# Helper
def serialize_order(order) -> dict:
    return {
        "id": str(order["_id"]),
        "userId": order["userId"],
        "items": order["items"],
        "status": order["status"]
    }

# Place an order
@app.post("/order", response_model=Order)
async def place_order(order: OrderInput):
    # 1. Verify user exists
    async with httpx.AsyncClient() as client:
        user_response = await client.get(f"{USER_SERVICE_URL}/user/{order.userId}")
        if user_response.status_code != 200:
            raise HTTPException(status_code=404, detail="User not found")

    # 2. Decrease stock for each item
    async with httpx.AsyncClient() as client:
        for item in order.items:
            stock_response = await client.put(
                f"{PRODUCT_SERVICE_URL}/products/{item.productId}/decrease_stock",
                json={"quantity": item.quantity}
            )
            if stock_response.status_code != 200:
                raise HTTPException(status_code=400, detail=f"Product {item.productId} not found or insufficient stock")

    # 3. Save to MongoDB
    order_dict = order.model_dump()
    order_dict["status"] = "placed"
    result = await db.orders.insert_one(order_dict)
    new_order = await db.orders.find_one({"_id": result.inserted_id})
    return serialize_order(new_order)

# Get a specific order
@app.get("/order/{order_id}", response_model=Order)
async def get_order(order_id: str):
    order = await db.orders.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return serialize_order(order)

# Get all orders for a user
@app.get("/orders/{user_id}", response_model=List[Order])
async def list_orders_by_user(user_id: str):
    orders = []
    async for order in db.orders.find({"userId": user_id}):
        orders.append(serialize_order(order))
    if not orders:
        raise HTTPException(status_code=404, detail="No orders found for this user")
    return orders
