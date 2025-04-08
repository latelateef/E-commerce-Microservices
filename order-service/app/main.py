from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI()

# Mock order storage
orders = []

class Item(BaseModel):
    productId: int
    quantity: int

class Order(BaseModel):
    userId: int
    items: List[Item]

@app.post("/order")
def place_order(order: Order):
    order_id = len(orders)
    new_order = {
        "id": order_id,
        "userId": order.userId,
        "items": order.items,
        "status": "placed"
    }
    orders.append(new_order)
    return {"message": "Order placed", "order": new_order}

@app.get("/order/{order_id}")
def get_order(order_id: int):
    if 0 <= order_id < len(orders):
        return orders[order_id]
    return {"error": "Order not found"}

@app.put("/order/{order_id}/status")
def update_order_status(order_id: int, status: Dict[str, str]):
    if 0 <= order_id < len(orders):
        orders[order_id]["status"] = status["status"]
        return {"message": "Order status updated"}
    return {"error": "Order not found"}
