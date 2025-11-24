from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

class Database:
    client: AsyncIOMotorClient = None
    database = None

db = Database()

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.MONGODB_URI)
    db.database = db.client[settings.DATABASE_NAME]
    print("✅ Connected to MongoDB")

async def close_mongo_connection():
    if db.client:
        db.client.close()
    print("👋 Disconnected from MongoDB")

def get_database():
    if db.database is None:
        raise RuntimeError("Database not initialized. Call connect_to_mongo() first.")
    return db.database