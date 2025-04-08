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

class ProductInput(BaseModel):
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
def add_product(product: ProductInput):
    products = load_products()
    product_id = len(products)
    new_product = Product(id=product_id, name=product.name, price=product.price, stock=product.stock)
    products.append(new_product)
    save_products(products)
    return {"message": "Product added", "product": new_product}

@app.get("/products")
def list_products():
    return load_products()

# Decrease stock of product
@app.put("/products/{product_id}/decrease_stock")
def decrease_stock(product_id:int, quantity: int):
    products = load_products()
    for product in products:
        if product.id == product_id:
            if product.stock >= quantity:
                product.stock -= quantity
                save_products(products)
                return {"message": "Stock decreased", "product": product}
            else:
                return {"error": "Insufficient stock"}
    return {"error": "Product not found"}

# Update product stock
@app.put("/products/{product_id}/update_stock")
def update_stock(product_id: int, new_stock: int):
    products = load_products()
    for product in products:
        if product.id == product_id:
            product.stock += new_stock
            save_products(products)
            return {"message": "Stock updated", "product": product}
    return {"error": "Product not found"}