from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends, Response, Cookie
from pydantic import BaseModel, EmailStr, validator
from app.db import db
from bson import ObjectId, errors as bson_errors
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os

app = FastAPI()
load_dotenv()

# ------------------- JWT Config -------------------

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ------------------- Utility Functions -------------------

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub"), payload.get("role")
    except JWTError:
        return None, None

def serialize_user(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
    }

async def get_current_user(token: Optional[str] = Cookie(None)):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        role = payload.get("role")
        if user_id is None or role is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    try:
        obj_id = ObjectId(user_id)
    except bson_errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")
    if role == "user":
        user = await db.users.find_one({"_id": obj_id})
    elif role == "admin":
        user = await db.admin.find_one({"_id": obj_id})
    else:
        raise HTTPException(status_code=400, detail="Invalid role")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["role"] = role  # Add role to user object
    return user
# ------------------- Models -------------------

class User(BaseModel):
    id: Optional[str]
    name: str
    email: str
    password: str

class Admin(BaseModel):
    id: Optional[str]
    name: str
    email: str
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str

class UserSignUpInput(BaseModel):
    name: str
    email: EmailStr
    password: str

    @validator("password")
    def validate_password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return v


class LoginInput(BaseModel):
    email: EmailStr
    password: str

class AdminSignUpInput(UserSignUpInput):
    name: str
    email: EmailStr
    password: str

    @validator('email')
    def validate_email(cls, v: EmailStr):
        if "admin" not in v:
            raise ValueError("Admin email must contain 'admin'")
        return v

    @validator('password')
    def validate_password_strength(cls, v: str):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return v

# ------------------- Routes -------------------

@app.post("/admin/signup", response_model=UserOut)
async def admin_signup(admin: AdminSignUpInput):
    existing = await db.admin.find_one({"email": admin.email})
    if existing:
        raise HTTPException(status_code=400, detail="Admin email already exists")

    hashed_pwd = hash_password(admin.password)
    admin_data = admin.model_dump()
    admin_data["password"] = hashed_pwd

    result = await db.admin.insert_one(admin_data)
    new_admin = await db.admin.find_one({"_id": result.inserted_id})
    return serialize_user(new_admin)


@app.post("/signup")
async def signup(user: UserSignUpInput, response: Response):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    existing = await db.admin.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_pwd = hash_password(user.password)
    user_data = user.model_dump()
    user_data["password"] = hashed_pwd

    result = await db.users.insert_one(user_data)
    token_data = {"sub": str(result.inserted_id), "role": "user"}
    access_token = create_access_token(token_data)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="Lax",
        max_age=1800
    )
    new_user = {
        "name": user.name,
        "email": user.email,
        "_id": result.inserted_id
    }

    return {
        "message": "Signup successful",
        "user": serialize_user(new_user),
        "role": "user"
    }


@app.post("/login")
async def login(data: LoginInput, response: Response):
    # First, check in admin table
    admin = await db.admin.find_one({"email": data.email})
    if admin and verify_password(data.password, admin["password"]):
        token_data = {"sub": str(admin["_id"]), "role": "admin"}
        access_token = create_access_token(token_data)
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,  # Use True in production with HTTPS
            samesite="Lax",  # Or 'Strict'/'None' based on your frontend needs
            max_age=1800  # Optional: 30 mins
        )
        return {
            "message": "Login successful",
            "user": serialize_user(admin),
            "role": "admin"
        }

    # Then, check in users table
    user = await db.users.find_one({"email": data.email})
    if user and verify_password(data.password, user["password"]):
        token_data = {"sub": str(user["_id"]), "role": "user"}
        access_token = create_access_token(token_data)
        # 🔐 Set HTTP-only cookie
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,  # Use True in production with HTTPS
            samesite="Lax",  # Or 'Strict'/'None' based on your frontend needs
            max_age=1800  # Optional: 30 mins
        )
        return {
            "message": "Login successful",
            "user": serialize_user(user),
            "role": "user"
        }

    raise HTTPException(status_code=401, detail="Invalid credentials")


@app.get("/{user_id}", response_model=UserOut)
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

@app.get("/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_user)):
    return serialize_user(current_user)
