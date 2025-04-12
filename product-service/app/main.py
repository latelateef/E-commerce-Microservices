from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, validator
from typing import List, Optional
from bson import ObjectId
from app.db import db
import bson.errors

app = FastAPI()

# Models
class ProductInput(BaseModel):
    name: str
    price: float
    stock: int

    @validator("price")
    def price_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Price must be a positive number")
        return v

    @validator("stock")
    def stock_must_be_non_negative(cls, v):
        if v < 0:
            raise ValueError("Stock must be a non-negative integer")
        return v

class Product(BaseModel):
    id: Optional[str]
    name: str
    price: float
    stock: int

class QuantityInput(BaseModel):
    quantity: int

    @validator("quantity")
    def quantity_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Quantity must be a positive integer")
        return v

# Helpers
def serialize_product(product) -> dict:
    """Convert a MongoDB product document to a JSON-serializable dictionary."""
    return {
        "id": str(product["_id"]),
        "name": product["name"],
        "price": product["price"],
        "stock": product["stock"]
    }

async def get_product(product_id: str):
    """Retrieve a product by ID, handling invalid IDs and not-found cases."""
    try:
        obj_id = ObjectId(product_id)
    except bson.errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid product ID format")
    product = await db.products.find_one({"_id": obj_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# Routes
@app.post("/add-product", response_model=Product)
async def add_product(product: ProductInput):
    """Add a new product to the database."""
    result = await db.products.insert_one(product.model_dump())
    new_product = await db.products.find_one({"_id": result.inserted_id})
    return serialize_product(new_product)


@app.get("/all-products", response_model=List[Product])
async def list_products():
    """Retrieve a list of all products."""
    products = []
    cursor = db.products.find()
    async for product in cursor:
        products.append(serialize_product(product))
    return products


@app.put("/{product_id}/decrease-stock", response_model=Product)
async def decrease_stock(product_id: str, data: QuantityInput):
    """Decrease the stock of a product by a specified quantity."""
    product = await get_product(product_id)
    if product["stock"] < data.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    await db.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$inc": {"stock": -data.quantity}}
    )
    updated = await get_product(product_id)
    return serialize_product(updated)


@app.put("/{product_id}/add-stock", response_model=Product)
async def add_stock(product_id: str, data: QuantityInput):
    """Increase the stock of a product by a specified quantity."""
    await get_product(product_id)  # Check if product exists
    await db.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$inc": {"stock": data.quantity}}
    )
    updated = await get_product(product_id)
    return serialize_product(updated)