from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime
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

class DraftCreate(BaseModel):
    recipient: EmailStr
    subject: str
    context: str
    category: Optional[str] = "general"

class Draft(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    recipient: EmailStr
    subject: str
    body: str
    context: str
    category: str
    created_at: datetime
    suggested_follow_ups: List[str] = []
    metadata: Dict[str, Any] = {}

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )