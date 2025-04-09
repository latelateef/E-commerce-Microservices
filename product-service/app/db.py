import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://admin:admin123@mongodb:27017")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client["product_db"]  # each microservice uses a separate DB
collection = db["products"]