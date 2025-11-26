from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId
from typing import Dict
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