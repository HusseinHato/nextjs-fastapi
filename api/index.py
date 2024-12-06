from fastapi import FastAPI, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import motor.motor_asyncio
from dotenv import load_dotenv
import os
from os.path import join
from fastapi.middleware.cors import CORSMiddleware


path = os.getcwd()
dotenv_path = join(path, '.env')
load_dotenv(dotenv_path)

# Constants
SECRET_KEY = os.getenv("SECRET_KEY") # Replace with a strong secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# MongoDB setup
client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
db = client.coretoday  # Replace 'auth_db' with your database name
user_collection = db.users

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

# FastAPI instance
app = FastAPI()

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

@app.get("/api/py/helloFastApi")
async def root():
    return {"message": "Hello from FastAPI"}

# Routes
@app.post("/api/py/register")
async def register(user: UserRegister):
    existing_user = await user_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")

    hashed_password = get_password_hash(user.password)
    user_dict = user.model_dump()
    user_dict["hashed_password"] = hashed_password
    user_dict.pop("password")  # Remove the plain password
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

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    # Set token as HTTP-only cookie
    response.set_cookie(
        key="access_token", 
        value=f"Bearer {access_token}", 
        httponly=True, 
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=False,  # Set to True in production to enforce HTTPS
        samesite="Lax"
    )
    return {"msg": "Successfully logged in"}

@app.get("/api/py/users/me", response_model=User)
async def read_users_me(request: Request):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Get the token from the access_token cookie
    token = request.cookies.get("access_token")
    if not token:
        raise credentials_exception

    try:
        print(token)
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
