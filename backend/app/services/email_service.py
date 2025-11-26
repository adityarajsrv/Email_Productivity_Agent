import json
from typing import List, Optional
from datetime import datetime
from app.database import get_database
from app.models.email_models import Email, EmailCreate, EmailStatus
from bson import ObjectId
import os

class EmailService:
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
            self._collection = self.db.emails
        return self._collection
    
    def _convert_objectid_to_str(self, document):
        """Convert MongoDB document ObjectId to string for Pydantic"""
        if document and '_id' in document:
            document['_id'] = str(document['_id'])
        return document
    
    async def load_mock_emails(self) -> List[Email]:
        """Load mock emails from JSON file"""
        try:
            # Clear existing emails
            await self.collection.delete_many({})
            
            # Load mock data
            mock_file_path = os.path.join(os.path.dirname(__file__), '../../app/data/mock_inbox.json')
            with open(mock_file_path, 'r') as f:
                mock_emails = json.load(f)
            
            # Convert to Email objects and insert
            email_objects = []
            for email_data in mock_emails:
                email_data['timestamp'] = datetime.fromisoformat(email_data['timestamp'])
                email_create = EmailCreate(**email_data)
                
                # Insert into database
                result = await self.collection.insert_one(email_create.model_dump())
                
                # Get the inserted document and convert ObjectId to string
                inserted_email = await self.collection.find_one({"_id": result.inserted_id})
                inserted_email = self._convert_objectid_to_str(inserted_email)
                
                email_obj = Email(**inserted_email)
                email_objects.append(email_obj)
            
            return email_objects
            
        except Exception as e:
            print(f"Error loading mock emails: {e}")
            return []
    
    async def get_emails(self) -> List[Email]:
        """Get all emails"""
        emails_cursor = self.collection.find()
        emails_list = await emails_cursor.to_list(length=100)
        
        # Convert all ObjectIds to strings
        emails_list = [self._convert_objectid_to_str(email) for email in emails_list]
        
        return [Email(**email) for email in emails_list]
    
    async def get_email(self, email_id: str) -> Optional[Email]:
        """Get specific email by ID"""
        try:
            email = await self.collection.find_one({"_id": ObjectId(email_id)})
            if email:
                email = self._convert_objectid_to_str(email)
                return Email(**email)
            return None
        except:
            return None
    
    async def get_processed_emails(self) -> List[Email]:
        """Get only processed emails"""
        emails_cursor = self.collection.find({"status": EmailStatus.PROCESSED})
        emails_list = await emails_cursor.to_list(length=100)
        
        # Convert all ObjectIds to strings
        emails_list = [self._convert_objectid_to_str(email) for email in emails_list]
        
        return [Email(**email) for email in emails_list]
    
    async def update_email(self, email_id: str, update_data: dict) -> Optional[Email]:
        """Update email with processed data"""
        try:
            update_data['processed_at'] = datetime.now()
            await self.collection.update_one(
                {"_id": ObjectId(email_id)},
                {"$set": update_data}
            )
            return await self.get_email(email_id)
        except Exception as e:
            print(f"Error updating email: {e}")
            return None
    
    async def clear_emails(self):
        """Clear all emails from database"""
        await self.collection.delete_many({})
        return {"message": "All emails cleared"}