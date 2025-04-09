from typing import Optional, List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.db import db
from bson import ObjectId
import bcrypt

app = FastAPI()

# ------------------- Utility Functions -------------------

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def serialize_user(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
    }

# ------------------- Models -------------------

class User(BaseModel):
    id: Optional[str]
    name: str
    email: str
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str

class SignUpInput(BaseModel):
    name: str
    email: str
    password: str

class LoginInput(BaseModel):
    email: str
    password: str

# ------------------- Routes -------------------

@app.post("/signup", response_model=UserOut)
async def signup(user: SignUpInput):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_pwd = hash_password(user.password)
    user_data = user.model_dump()
    user_data["password"] = hashed_pwd

    result = await db.users.insert_one(user_data)
    new_user = await db.users.find_one({"_id": result.inserted_id})
    return serialize_user(new_user)

@app.post("/login")
async def login(data: LoginInput):
    user = await db.users.find_one({"email": data.email})
    if user and verify_password(data.password, user["password"]):
        return {"message": "Login successful", "user": serialize_user(user)}
    raise HTTPException(status_code=401, detail="Invalid credentials")

from bson import ObjectId, errors as bson_errors

@app.get("/user/{user_id}", response_model=UserOut)
async def get_user(user_id: str):
    try:
        obj_id = ObjectId(user_id)
    except bson_errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    user = await db.users.find_one({"_id": obj_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return serialize_user(user)


@app.get("/users", response_model=List[UserOut])
async def list_users():
    users = []
    async for user in db.users.find():
        users.append(serialize_user(user))
    return users
