from app.database import get_database
from app.models.prompt_models import PromptConfig, PromptUpdate
from app.config import settings
from bson import ObjectId

class PromptService:
    def __init__(self):
        self._db = None
        self._collection = None
    
    @property
    def db(self):
        if self._db is None:
            self._db = get_database()
        return self._db
    
    @property
    def collection(self):
        if self._collection is None:
            self._collection = self.db.prompts
        return self._collection
    
    def _convert_objectid_to_str(self, document):
        """Convert MongoDB document ObjectId to string for Pydantic"""
        if document and '_id' in document:
            document['_id'] = str(document['_id'])
        return document
    
    async def get_prompts(self) -> PromptConfig:
        """Get current prompt configurations"""
        prompts = await self.collection.find_one({})
        
        if not prompts:
            # Initialize with default prompts
            default_prompts_dict = {
                "action_items": settings.DEFAULT_PROMPTS["action_items"],
                "auto_reply": settings.DEFAULT_PROMPTS["auto_reply"]
            }
            result = await self.collection.insert_one(default_prompts_dict)
            
            # Get the inserted document and convert ObjectId to string
            prompts = await self.collection.find_one({"_id": result.inserted_id})
        
        # Convert ObjectId to string
        prompts = self._convert_objectid_to_str(prompts)
        
        return PromptConfig(**prompts)
    
    async def update_prompt(self, prompt_type: str, content: str) -> PromptConfig:
        """Update specific prompt"""
        valid_types = ["action_items", "auto_reply"]
        if prompt_type not in valid_types:
            raise ValueError(f"Invalid prompt type. Must be one of: {valid_types}")
        
        # Get current prompts first
        current_prompts = await self.get_prompts()
        
        # Update the specific prompt
        update_data = {prompt_type: content}
        await self.collection.update_one(
            {"_id": ObjectId(current_prompts.id)},
            {"$set": update_data}
        )
        
        return await self.get_prompts()
    
    async def reset_to_defaults(self) -> PromptConfig:
        """Reset prompts to default values"""
        default_prompts_dict = {
            "action_items": settings.DEFAULT_PROMPTS["action_items"],
            "auto_reply": settings.DEFAULT_PROMPTS["auto_reply"]
        }
        
        # Delete all and create new
        await self.collection.delete_many({})
        result = await self.collection.insert_one(default_prompts_dict)
        
        # Get the new document and convert ObjectId to string
        prompts = await self.collection.find_one({"_id": result.inserted_id})
        prompts = self._convert_objectid_to_str(prompts)
        
        return PromptConfig(**prompts)