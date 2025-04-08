from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import os
import json

app = FastAPI()

# Setup paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data/products.json")

# Ensure data directory and file exist
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
if not os.path.exists(DATA_FILE) or os.path.getsize(DATA_FILE) == 0:
    with open(DATA_FILE, "w") as f:
        f.write("[]")

# Product model
class Product(BaseModel):
    id: int
    name: str
    price: float
    stock: int

# Utility functions
def load_products() -> List[Product]:
    with open(DATA_FILE, "r") as f:
        return [Product(**p) for p in json.load(f)]

def save_products(products: List[Product]):
    with open(DATA_FILE, "w") as f:
        json.dump([p.model_dump() for p in products], f, indent=2)

# Routes
@app.post("/product")
def add_product(product: Product):
    products = load_products()
    product.id = len(products)  # Auto-increment ID starting from 0
    products.append(product)
    save_products(products)
    return {"message": "Product added", "product": product}

@app.get("/products")
def list_products():
    return load_products()

@app.get("/products/{product_id}")
def get_product(product_id: int):
    products = load_products()
    for product in products:
        if product.id == product_id:
            return product
    return {"error": "Product not found"}
