import json
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from pydantic import BaseModel
from app.services.email_service import EmailService
from app.services.processing_service import ProcessingService
from app.config import settings  # Add this import

router = APIRouter()

class SummaryResponse(BaseModel):
    id: str
    subject: str
    sender: str
    timestamp: str
    priority: str
    summary: str
    tags: List[str]
    sentiment: str
    key_points: List[str]
    action_items: List[str]

def get_email_service():
    return EmailService()

def get_processing_service():
    return ProcessingService()

@router.get("/summaries", response_model=List[SummaryResponse])
async def get_email_summaries(
    email_service: EmailService = Depends(get_email_service),
    processing_service: ProcessingService = Depends(get_processing_service)
):
    """
    Get all processed emails with AI-generated summaries
    """
    try:
        # Get processed emails
        processed_emails = await email_service.get_processed_emails()
        
        summaries = []
        for email in processed_emails:
            # Generate summary if not already generated
            if not hasattr(email, 'summary') or not email.summary:
                # Use processing service to generate summary
                summary_data = await processing_service.generate_summary(email)
            else:
                summary_data = {
                    'summary': getattr(email, 'summary', ''),
                    'key_points': getattr(email, 'key_points', []),
                    'action_items': getattr(email, 'action_items', []),
                    'sentiment': getattr(email, 'sentiment', 'neutral'),
                    'tags': getattr(email, 'tags', [])
                }
            
            summary_response = SummaryResponse(
                id=str(email.id),
                subject=email.subject,
                sender=email.sender,
                timestamp=email.timestamp.isoformat(),
                priority=email.priority,
                summary=summary_data['summary'],
                tags=summary_data['tags'],
                sentiment=summary_data['sentiment'],
                key_points=summary_data['key_points'],
                action_items=summary_data['action_items']
            )
            summaries.append(summary_response)
        
        return summaries
        
    except Exception as e:
        print(f"Error getting summaries: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve email summaries")

@router.get("/summaries/{email_id}")
async def get_email_summary(
    email_id: str,
    email_service: EmailService = Depends(get_email_service),
    processing_service: ProcessingService = Depends(get_processing_service)
):
    """
    Get detailed summary for a specific email
    """
    try:
        email = await email_service.get_email(email_id)
        if not email:
            raise HTTPException(status_code=404, detail="Email not found")
        
        # Generate or retrieve summary
        if not hasattr(email, 'summary') or not email.summary:
            summary_data = await processing_service.generate_summary(email)
        else:
            summary_data = {
                'summary': getattr(email, 'summary', ''),
                'key_points': getattr(email, 'key_points', []),
                'action_items': getattr(email, 'action_items', []),
                'sentiment': getattr(email, 'sentiment', 'neutral'),
                'tags': getattr(email, 'tags', [])
            }
        
        return {
            "email": {
                "id": str(email.id),
                "subject": email.subject,
                "sender": email.sender,
                "timestamp": email.timestamp.isoformat(),
                "priority": email.priority,
                "body": email.body
            },
            "summary": summary_data
        }
        
    except Exception as e:
        print(f"Error getting email summary: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate email summary")