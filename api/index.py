import asyncio
import base64
from bson import ObjectId
from fastapi import FastAPI, Depends, File, Form, HTTPException, UploadFile, status, Response, Request
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import motor.motor_asyncio
from dotenv import load_dotenv
import os
from os.path import join
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image

path = os.getcwd()
dotenv_path = join(path, '.env')
load_dotenv(dotenv_path)

# Constants
SECRET_KEY = os.getenv("SECRET_KEY") # Replace with a strong secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 3600
REFRESH_TOKEN_EXPIRE_DAYS = 30 

# MongoDB setup
client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
db = client.coretoday  # Replace 'coretoday' with your database name
user_collection = db.users
token_collection = db.tokens 
toys_collection = db.toys

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Pydantic models
class User(BaseModel):
    username: str
    fullname: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserRegister(BaseModel):
    username: str
    fullname: Optional[str] = None
    password: str


class Item(BaseModel):
    id: str
    title: str
    expected_result: str
    actual_result: str
    weight: float
    contributor: str
    image: Optional[str] 

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_tokens(username: str):
    # Access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": username}, expires_delta=access_token_expires)

    # Refresh token
    refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    refresh_token = create_access_token(data={"sub": username}, expires_delta=refresh_token_expires)

    return access_token, refresh_token

async def get_user(username: str):
    user = await user_collection.find_one({"username": username})
    if user:
        return UserInDB(**user)
    return None

async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

async def store_refresh_token(username: str, refresh_token: str):
    """Store refresh token in the database."""
    await token_collection.insert_one({"username": username, "refresh_token": refresh_token, "created_at": datetime.now()})

async def revoke_refresh_token(refresh_token: str):
    """Revoke a specific refresh token."""
    await token_collection.delete_one({"refresh_token": refresh_token})

async def revoke_user_tokens(username: str):
    """Revoke all refresh tokens for a specific user."""
    await token_collection.delete_many({"username": username})

async def validate_refresh_token(refresh_token: str):
    """Check if a refresh token is valid."""
    token = await token_collection.find_one({"refresh_token": refresh_token})
    return token is not None

def serialize_doc(doc):
    return {
        "id": str(doc["_id"]),
        "title": doc.get("title", ""),
        "expected_result": doc.get("expected_result", ""),
        "actual_result": doc.get("actual_result", ""),
        "weight": doc.get("weight", 0),
        "contributor": doc.get("contributor", ""),
        "image": doc.get("image", ""),
    }

def serialize_users(user):
    return {
        "username": user["username"],
        "fullname": user.get("fullname", ""),
        "disabled": user.get("disabled", False),
    }

def tareScale(channels):
    """Kalibrasi (tare) untuk setiap channel."""
    global offsets, calibrated
    num_samples = 16

    for i, ch in enumerate(channels):
        offsets[i] = 0
        for _ in range(num_samples):
            offsets[i] += ch.getVoltageRatio()
            time.sleep(ch.getDataInterval() / 1000.0)
        offsets[i] /= num_samples
        calibrated[i] = True
        print(f"Taring complete for channel {i}, Offset: {offsets[i]}")

# FastAPI instance
app = FastAPI()

security = HTTPBearer()

# Load the model

current_dir = os.path.dirname(__file__)
MODEL_PATH = os.path.join(current_dir, "final_small.pt")

model = YOLO(MODEL_PATH)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Server Running"}

# Routes
@app.get("/api/py/helloFastApi")
async def root():
    return {"message": "Hello from FastAPI"}

@app.post("/api/py/register")
async def register(user: UserRegister):
    existing_user = await user_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")

    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    user_dict.pop("password")  # Remove plain password
    user_dict["disabled"] = False

    await user_collection.insert_one(user_dict)
    return {"msg": "User registered successfully"}

@app.post("/api/py/token")
async def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token, refresh_token = create_tokens(user.username)
    await store_refresh_token(user.username, refresh_token)

    # Set tokens as HTTP-only cookies
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=False,
        samesite="Lax",
    )
    response.set_cookie(
        key="refresh_token",
        value=f"Bearer {refresh_token}",
        httponly=True,
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        secure=False,
        samesite="Lax",
    )
    return {"msg": "Successfully logged in"}

@app.get("/api/py/users/me", response_model=User)
async def read_users_me(request: Request):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = request.cookies.get("access_token")
    if not token:
        raise credentials_exception

    try:
        payload = jwt.decode(token[7:], SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await get_user(username)
    if user is None:
        raise credentials_exception

    return user

@app.post("/api/py/refresh")
async def refresh_token(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not await validate_refresh_token(refresh_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or revoked refresh token",
        )

    try:
        payload = jwt.decode(refresh_token[7:], SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

        access_token, new_refresh_token = create_tokens(username)
        await revoke_refresh_token(refresh_token)  # Revoke the old refresh token
        await store_refresh_token(username, new_refresh_token)

        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            httponly=True,
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            secure=False,
            samesite="Lax",
        )
        response.set_cookie(
            key="refresh_token",
            value=f"Bearer {new_refresh_token}",
            httponly=True,
            max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
            secure=False,
            samesite="Lax",
        )

        return {"msg": "Access token refreshed"}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.post("/api/py/logout")
async def logout(response: Response, request: Request):
    refresh_token = request.cookies.get("refresh_token")
    if refresh_token:
        await revoke_refresh_token(refresh_token)

    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"msg": "Successfully logged out"}

# Create
@app.post("/api/py/items", status_code=201)
async def create_item(
    title: str = Form(...),
    expected_result: str = Form(...),
    actual_result: str = Form(...),
    weight: float = Form(...),
    contributor: str = Form(...),
    image: UploadFile = File(...),
):
    try:
        image_data = await image.read()
        encoded_image = base64.b64encode(image_data).decode("utf-8")

        item = {
            "title": title,
            "expected_result": expected_result,
            "actual_result": actual_result,
            "weight": weight,
            "contributor": contributor,
            "image": encoded_image,
        }
        result = await toys_collection.insert_one(item)
        return {"message": "Item created successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating item: {e}")

# Read all
@app.get("/api/py/items", response_model=List[Item])
async def get_all_items():
    try:
        items = await toys_collection.find().to_list(100)
        return [serialize_doc(item) for item in items]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching items: {e}")
    
@app.get("/api/py/metrics")
async def get_total_count():
    try:
        # Count all documents in the toys collection
        total_toys = await toys_collection.count_documents({})
        total_users = await user_collection.count_documents({})
        return {"total_toys_count": total_toys, "total_users_count": total_users}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching total toys count: {e}")
    
@app.get("/api/py/toys-by-category")
async def get_toys_by_category():
    try:
        # Aggregate to count toys in each category
        pipeline = [
            {"$group": {"_id": "$actual_result", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}  # Sort categories by count in descending order
        ]
        result = await toys_collection.aggregate(pipeline).to_list(None)

        # Map categories to desired names and colors
        category_map = {
            "vehicle": {"name": "Vehicle", "color": "#93c5fd"},
            "animal": {"name": "Animal", "color": "#2563eb"},
            "robot": {"name": "Robot", "color": "#60a5fa"},
            "misc": {"name": "Misc", "color": "#dbeafe"},
        }

        # Format the response
        categories_data = [
            {
                "name": category_map.get(item["_id"], {"name": "Unknown", "color": "#cccccc"})["name"],
                "value": item["count"],
                "color": category_map.get(item["_id"], {"name": "Unknown", "color": "#cccccc"})["color"],
            }
            for item in result
        ]

        return categories_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching toys by category: {e}")

    
@app.get("/api/py/users-with-toy-count", response_model=List[dict])
async def get_all_users_with_toy_count():
    try:
        # Fetch all users
        users = await user_collection.find().to_list(100)
        
        # Prepare result with toy count
        users_with_toy_count = []
        for user in users:
            username = user.get("username")  # Assuming "username" is the field in user_collection
            if username:
                # Count toys related to the user
                toy_count = await toys_collection.count_documents({"contributor": username})
                
                # Append the user with their toy count
                users_with_toy_count.append({
                    "user": serialize_users(user),
                    "toy_count": toy_count
                })
        
        return users_with_toy_count
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users with toy counts: {e}")
    
@app.get("/api/py/users-chart", response_model=List[dict])
async def get_all_users_with_toy_count():
    try:
        # Fetch all users
        users = await user_collection.find().to_list(100)
        
        # Prepare result with toy count
        contributors_data = []
        for user in users:
            username = user.get("username")  # Assuming "username" is the field in user_collection
            fullname = user.get("fullname")  # Fallback if fullname is missing
            if username:
                # Count toys related to the user
                toy_count = await toys_collection.count_documents({"contributor": username})
                
                # Append the user data in the required format
                contributors_data.append({
                    "name": fullname,
                    "value": toy_count
                })
        
        return contributors_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching contributors data: {e}")

# Read single item
@app.get("/api/py/items/{item_id}", response_model=Item)
async def get_item(item_id: str):
    try:
        item = await toys_collection.find_one({"_id": ObjectId(item_id)})
        if item:
            return serialize_doc(item)
        else:
            raise HTTPException(status_code=404, detail="Item not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching item: {e}")

# Update
@app.put("/api/py/items/{item_id}")
async def update_item(
    item_id: str,
    title: Optional[str] = Form(None),
    expected_result: Optional[str] = Form(None),
    weight: Optional[float] = Form(None),
):
    try:
        update_data = {}

        if title is not None:
            update_data["title"] = title

        if title is not None:
            update_data["expected_result"] = expected_result

        if weight is not None:
            update_data["weight"] = weight

        if update_data:
            result = await toys_collection.update_one(
                {"_id": ObjectId(item_id)}, {"$set": update_data}
            )

            if result.modified_count:
                return {"message": "Item updated successfully"}

        raise HTTPException(status_code=404, detail="Item not found or no changes made")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating item: {e}")

# Delete
@app.delete("/api/py/items/{item_id}")
async def delete_item(item_id: str):
    try:
        result = await toys_collection.delete_one({"_id": ObjectId(item_id)})

        if result.deleted_count:
            return {"message": "Item deleted successfully"}

        raise HTTPException(status_code=404, detail="Item not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting item: {e}")
    
@app.post("/api/py/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Load the image
        image = Image.open(file.file).convert("RGB")

        # Perform prediction
        results = model.predict(image, conf=0.68, verbose=True)

        result = results[0]

        predictions = []
        if result.boxes:  # Check if boxes exist
            for box in result.boxes.data:  # Access the bounding box data tensor
                class_idx = int(box[5])  # Class index is usually the 6th element in YOLO output
                class_name = result.names[class_idx]  # Get the class name using the index
                predictions.append(class_name)

        if predictions:
            return {"predictions": predictions}
        else:
            return {"predictions": []}
            
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)