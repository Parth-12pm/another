from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://another-git-master-parth-12pms-projects.vercel.app/", "http://localhost:3000"],  # In production, replace with your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for POST requests
class Message(BaseModel):
    name: str
    message: str

@app.get("/api")
def read_root():
    return {"message": "Hello from FastAPI!", "status": "success"}

@app.get("/api/hello")
def get_hello():
    return {
        "greeting": "Hello World!", 
        "method": "GET",
        "timestamp": "2025-09-08"
    }

@app.post("/api/hello")
def post_hello(data: Message):
    return {
        "message": f"Hello {data.name}! You said: {data.message}",
        "method": "POST",
        "received_data": {
            "name": data.name,
            "message": data.message
        }
    }

@app.get("/api/test")
def test_connection():
    return {
        "status": "connected",
        "message": "FastAPI is working!",
        "data": ["item1", "item2", "item3"]
    }