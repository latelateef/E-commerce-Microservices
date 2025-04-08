from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict

app = FastAPI()

# Mock delivery tracking
deliveries = []

class DeliveryAssign(BaseModel):
    orderId: int
    agentId: int

class StatusUpdate(BaseModel):
    status: str

@app.post("/assign")
def assign_delivery(data: DeliveryAssign):
    delivery_id = len(deliveries)
    new_delivery = {
        "id": delivery_id,
        "orderId": data.orderId,
        "agentId": data.agentId,
        "status": "assigned"
    }
    deliveries.append(new_delivery)
    return {"message": "Delivery assigned", "delivery": new_delivery}

@app.get("/delivery/{delivery_id}")
def get_delivery(delivery_id: int):
    if 0 <= delivery_id < len(deliveries):
        return deliveries[delivery_id]
    return {"error": "Delivery not found"}

@app.put("/delivery/{delivery_id}/update")
def update_delivery(delivery_id: int, data: StatusUpdate):
    if 0 <= delivery_id < len(deliveries):
        deliveries[delivery_id]["status"] = data.status
        return {"message": "Delivery status updated"}
    return {"error": "Delivery not found"}
