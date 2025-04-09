from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from bson import ObjectId
from app.db import db
from typing import Optional

app = FastAPI()

# Models
class ProductInput(BaseModel):
    name: str
    price: float
    stock: int

class Product(BaseModel):
    id: Optional[str]
    name: str
    price: float
    stock: int

class QuantityInput(BaseModel):
    quantity: int


# Helpers
def serialize_product(product) -> dict:
    return {
        "id": str(product["_id"]),
        "name": product["name"],
        "price": product["price"],
        "stock": product["stock"]
    }

# Routes
@app.post("/product", response_model=Product)
async def add_product(product: ProductInput):
    result = await db.products.insert_one(product.model_dump())
    new_product = await db.products.find_one({"_id": result.inserted_id})
    return serialize_product(new_product)

@app.get("/products", response_model=List[Product])
async def list_products():
    products = []
    cursor = db.products.find()
    async for product in cursor:
        products.append(serialize_product(product))
    return products

@app.put("/products/{product_id}/decrease_stock", response_model=Product)
async def decrease_stock(product_id: str, data: QuantityInput):
    product = await db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product["stock"] < data.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    await db.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$inc": {"stock": -data.quantity}}
    )
    updated = await db.products.find_one({"_id": ObjectId(product_id)})
    return serialize_product(updated)

@app.put("/products/{product_id}/add_stock", response_model=Product)
async def add_stock(product_id: str, data: QuantityInput):
    product = await db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    await db.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$inc": {"stock": data.quantity}}
    )
    updated = await db.products.find_one({"_id": ObjectId(product_id)})
    return serialize_product(updated)
