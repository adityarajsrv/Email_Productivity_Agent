from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
from bson import ObjectId
from pydantic_core import core_schema

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        return core_schema.chain_schema([
            core_schema.str_schema(),
            core_schema.no_info_plain_validator_function(cls.validate),
        ])

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

class EmailStatus(str, Enum):
    UNREAD = "unread"
    PROCESSED = "processed"
    DRAFTED = "drafted"
    REPLIED = "replied"

class EmailBase(BaseModel):
    sender: EmailStr
    subject: str
    body: str
    timestamp: datetime
    status: EmailStatus = EmailStatus.UNREAD

class EmailCreate(EmailBase):
    pass

class Email(EmailBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    action_items: List[str] = []
    processed_at: Optional[datetime] = None
    ai_summary: Optional[str] = None
    priority: Optional[str] = None
    tags: List[str] = []
    metadata: Dict[str, Any] = {}

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class ProcessedEmail(Email):
    pass