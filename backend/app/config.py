import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    MONGODB_URI = os.getenv("MONGODB_URI")
    DATABASE_NAME = os.getenv("DATABASE_NAME")
    SECRET_KEY = os.getenv("SECRET_KEY")
    ENVIRONMENT = os.getenv("ENVIRONMENT")
    
    DEFAULT_PROMPTS = {
        "action_items": "Extract specific action items, deadlines, and responsibilities from this email. Format as bullet points.",
        "auto_reply": "Draft a professional auto-reply acknowledging receipt and indicating when to expect a proper response."
    }

settings = Settings()