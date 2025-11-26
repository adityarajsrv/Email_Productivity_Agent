from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import emails, prompts, dashboard, rewrite, summaries, autoreply
from app.database import connect_to_mongo, close_mongo_connection
from app.config import settings

app = FastAPI(
    title="Email Productivity Agent API",
    description="AI-powered email processing and drafting system",
    version="1.0.0"
)

# CORS middleware - UPDATED CONFIGURATION
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default port
        "http://localhost:3000",  # Create React App default port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(emails.router, prefix="/api/v1", tags=["emails"])
app.include_router(prompts.router, prefix="/api/v1", tags=["prompts"])
app.include_router(dashboard.router, prefix="/api/v1", tags=["dashboard"])
app.include_router(rewrite.router, prefix="/api/v1", tags=["rewrite"])
app.include_router(summaries.router, prefix="/api/v1", tags=["summaries"]) 
app.include_router(autoreply.router, prefix="/api/v1", tags=["autoreply"])  

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    print("🚀 Email Productivity Agent API Started")

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()
    print("👋 Email Productivity Agent API Stopped")

@app.get("/")
async def root():
    return {
        "message": "Email Productivity Agent API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2024-01-15T10:30:00Z"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True if settings.ENVIRONMENT == "development" else False
    )