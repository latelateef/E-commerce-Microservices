from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Mock database
products = []

class Product(BaseModel):
    id: int
    name: str
    price: float
    stock: int

@app.post("/products")
def add_product(product: Product):
    products.append(product)
    return {"message": "Product added", "product": product}

@app.get("/products")
def list_products():
    return products

@app.get("/products/{product_id}")
def get_product(product_id: int):
    for product in products:
        if product.id == product_id:
            return product
    return {"error": "Product not found"}
