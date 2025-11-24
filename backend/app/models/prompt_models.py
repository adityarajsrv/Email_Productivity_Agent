from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId
from typing import Dict

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

class PromptConfig(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    action_items: str
    auto_reply: str

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class PromptUpdate(BaseModel):
    prompt_type: str  # "action_items", "auto_reply"
    content: str