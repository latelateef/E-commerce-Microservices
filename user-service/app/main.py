from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import json
import os

app = FastAPI()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data/users.json")

# Models
class User(BaseModel):
    id: int
    name: str
    email: str
    password: str

class UserInput(BaseModel):
    name: str
    email: str
    password: str

# --- Utility functions ---
def load_users() -> List[User]:
    if not os.path.exists(DATA_FILE):
        return []

    if os.path.getsize(DATA_FILE) == 0:
        with open(DATA_FILE, "w") as f:
            f.write("[]")  # Initialize with empty list

    with open(DATA_FILE, "r") as f:
        return [User(**u) for u in json.load(f)]


def save_users(users: List[User]):
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "w") as f:
        json.dump([u.model_dump() for u in users], f, indent=2)

# --- API Endpoints ---
# Create a new user
@app.post("/signup")
def signup(user: UserInput):
    users = load_users()
    if any(u.email == user.email for u in users):
        return {"error": "Email already exists"}
    user_id = len(users)
    new_user = User(id=user_id, name=user.name, email=user.email, password=user.password)
    users.append(new_user)
    save_users(users)
    return {"message": "User registered", "user": new_user}

# Login user
@app.post("/login")
def login(data: dict):
    users = load_users()
    for user in users:
        if user.email == data["email"] and user.password == data["password"]:
            return {"message": "Login successful"}
    return {"message": "Invalid credentials"}

# Return user details
@app.get("/user/{user_id}")
def get_user(user_id: int):
    users = load_users()
    for user in users:
        if user.id == user_id:
            return user
    return {"error": "User not found"}

# List all users
@app.get("/users")
def list_users():
    users = load_users()
    return users