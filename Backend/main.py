from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import users, tasks, user_data, suggestions
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware with logging
logger.debug("Adding CORS middleware")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Wildcard for debugging
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

Base.metadata.create_all(bind=engine)

app.include_router(users.router)
app.include_router(tasks.router)
app.include_router(user_data.router)
app.include_router(suggestions.router)

@app.get("/")
def read_root():
    logger.debug("Root endpoint accessed")
    return {"message": "Task Manager Backend"}

# Optional: Catch-all route for debugging
@app.options("/{path:path}")
async def catch_all_options(path: str):
    logger.debug(f"Caught OPTIONS request for path: /{path}")
    return {"message": f"OPTIONS handled for /{path}"}