from fastapi import FastAPI, Request
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Service URLs from environment variables (Docker/K8s friendly)
USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://user-service")
PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://product-service")
ORDER_SERVICE_URL = os.getenv("ORDER_SERVICE_URL", "http://order-service")
print(USER_SERVICE_URL)

@app.api_route("/api/products/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy_to_product(request: Request, path: str):
    return await proxy_request(request, f"{PRODUCT_SERVICE_URL}/{path}")

@app.api_route("/api/orders/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy_to_order(request: Request, path: str):
    return await proxy_request(request, f"{ORDER_SERVICE_URL}/{path}")

@app.api_route("/api/users/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy_to_user(request: Request, path: str):
    return await proxy_request(request, f"{USER_SERVICE_URL}/{path}")

async def proxy_request(request: Request, url: str):
    async with httpx.AsyncClient() as client:
        method = request.method
        headers = dict(request.headers)
        body = await request.body()
        response = await client.request(method, url, content=body, headers=headers)
        return response.json() if "application/json" in response.headers.get("content-type", "") else response.text
