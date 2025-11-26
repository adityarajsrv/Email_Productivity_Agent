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
    processed_at: Optional[datetime] = None
    ai_summary: Optional[str] = None
    priority: Optional[str] = None
    tags: List[str]

    @classmethod
    def from_email_model(cls, email):
        """Convert Email model to EmailResponse"""
        return cls(
            id=str(email.id),
            sender=email.sender,
            subject=email.subject,
            body=email.body,
            timestamp=email.timestamp,
            status=email.status,
            action_items=email.action_items,
            processed_at=email.processed_at,
            ai_summary=email.ai_summary,
            priority=email.priority,
            tags=email.tags
        )

class EmailListResponse(BaseModel):
    emails: List[EmailResponse]
    total: int
    processed_count: int

class ProcessEmailsResponse(BaseModel):
    message: str
    count: int
    processing_id: str