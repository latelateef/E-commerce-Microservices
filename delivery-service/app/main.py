from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, List
import httpx
import os
import json

app = FastAPI()

# Path setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data/deliveries.json")

# Ensure data file exists
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
if not os.path.exists(DATA_FILE) or os.path.getsize(DATA_FILE) == 0:
    with open(DATA_FILE, "w") as f:
        f.write("[]")

# Models
class DeliveryAssign(BaseModel):
    id: int
    orderId: int
    agentId: int

class Delivery(BaseModel):
    id: int
    orderId: int
    agentId: int
    status: str

class StatusUpdate(BaseModel):
    status: str

# Helpers
def load_deliveries() -> List[Delivery]:
    with open(DATA_FILE, "r") as f:
        return [Delivery(**d) for d in json.load(f)]

def save_deliveries(deliveries: List[Delivery]):
    with open(DATA_FILE, "w") as f:
        json.dump([d.model_dump() for d in deliveries], f, indent=2)

# Assign delivery
@app.post("/assign")
async def assign_delivery(data: DeliveryAssign):
    # Verify order exists
    async with httpx.AsyncClient() as client:
        res = await client.get(f"http://localhost:5002/order/{data.orderId}")
        if res.status_code != 200:
            return {"error": "Order not found"}

    deliveries = load_deliveries()
    delivery_id = len(deliveries)

    new_delivery = Delivery(
        id=delivery_id,
        orderId=data.orderId,
        agentId=data.agentId,
        status="assigned"
    )

    deliveries.append(new_delivery)
    save_deliveries(deliveries)
    return {"message": "Delivery assigned", "delivery": new_delivery}

# Get delivery info
@app.get("/delivery/{delivery_id}")
def get_delivery(delivery_id: int):
    deliveries = load_deliveries()
    if 0 <= delivery_id < len(deliveries):
        return deliveries[delivery_id]
    return {"error": "Delivery not found"}

# Update delivery status
@app.put("/delivery/{delivery_id}/update")
async def update_delivery(delivery_id: int, data: StatusUpdate):
    deliveries = load_deliveries()
    if 0 <= delivery_id < len(deliveries):
        deliveries[delivery_id].status = data.status
        save_deliveries(deliveries)

        # Update order status if delivered
        if data.status == "delivered":
            async with httpx.AsyncClient() as client:
                await client.put(
                    f"http://localhost:5002/order/{deliveries[delivery_id].orderId}/status",
                    json={"status": "delivered"}
                )

        return {"message": "Delivery status updated"}
    return {"error": "Delivery not found"}
