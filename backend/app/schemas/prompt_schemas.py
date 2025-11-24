from pydantic import BaseModel

class PromptResponse(BaseModel):
    action_items: str
    auto_reply: str

class PromptUpdateRequest(BaseModel):
    prompt_type: str
    content: str

class PromptUpdateResponse(BaseModel):
    message: str
    updated_prompt: str