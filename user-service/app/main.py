from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# Mock database
users = []

class User(BaseModel):
    name: str
    email: str
    password: str

@app.post("/signup")
def signup(user: User):
    users.append(user)
    return {"message": "User registered", "user": user}

@app.post("/login")
def login(data: dict):
    for user in users:
        if user.email == data["email"] and user.password == data["password"]:
            return {"message": "Login successful"}
    return {"message": "Invalid credentials"}

@app.get("/user/{user_id}")
def get_user(user_id: int):
    if 0 <= user_id < len(users):
        return users[user_id]
    return {"error": "User not found"}
