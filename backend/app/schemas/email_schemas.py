from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from app.models.email_models import EmailStatus

class EmailResponse(BaseModel):
    id: str
    sender: EmailStr
    subject: str
    body: str
    timestamp: datetime
    status: EmailStatus
    action_items: List[str]
    processed_at: Optional[datetime]
    ai_summary: Optional[str]
    priority: Optional[str]
    tags: List[str]

class EmailListResponse(BaseModel):
    emails: List[EmailResponse]
    total: int
    processed_count: int

class ProcessEmailsResponse(BaseModel):
    message: str
    count: int
    processing_id: str