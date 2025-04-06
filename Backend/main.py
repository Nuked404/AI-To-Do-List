# Backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import users, tasks, user_data, suggestions
import logging
import os

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

logger.debug("Adding CORS middleware")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# Create all tables (this will skip existing tables like `otp` if they match the model)
Base.metadata.create_all(bind=engine)

app.include_router(users.router)
app.include_router(tasks.router)
app.include_router(user_data.router)
app.include_router(suggestions.router)

@app.get("/")
def read_root():
    logger.debug("Root endpoint accessed")
    return {"message": "Task Manager Backend"}

@app.options("/{path:path}")
async def catch_all_options(path: str):
    logger.debug(f"Caught OPTIONS request for path: /{path}")
    return {"message": f"OPTIONS handled for /{path}"}