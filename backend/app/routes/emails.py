from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from typing import List
from app.services.email_service import EmailService
from app.services.processing_service import ProcessingService
from app.schemas.email_schemas import EmailResponse, EmailListResponse, ProcessEmailsResponse
import asyncio

router = APIRouter()

# Create service instances as functions
def get_email_service():
    return EmailService()

def get_processing_service():
    return ProcessingService()

@router.get("/emails", response_model=EmailListResponse)
async def get_emails(email_service: EmailService = Depends(get_email_service)):
    """Get all emails"""
    emails = await email_service.get_emails()
    processed_count = len([e for e in emails if e.status.value == "processed"])
    
    return EmailListResponse(
        emails=emails,
        total=len(emails),
        processed_count=processed_count
    )

@router.post("/emails/load-mock")
async def load_mock_emails(email_service: EmailService = Depends(get_email_service)):
    """Load mock emails into database"""
    emails = await email_service.load_mock_emails()
    return {
        "message": f"Loaded {len(emails)} mock emails",
        "count": len(emails)
    }

@router.post("/emails/process", response_model=ProcessEmailsResponse)
async def process_emails(
    background_tasks: BackgroundTasks,
    email_service: EmailService = Depends(get_email_service),
    processing_service: ProcessingService = Depends(get_processing_service)
):
    """Start email processing pipeline"""
    emails = await email_service.get_emails()
    unprocessed_emails = [email for email in emails if email.status.value != "processed"]
    
    if not unprocessed_emails:
        raise HTTPException(status_code=400, detail="No unprocessed emails found")
    
    # Process in background
    background_tasks.add_task(processing_service.process_email_batch, unprocessed_emails)
    
    return ProcessEmailsResponse(
        message="Email processing started in background",
        count=len(unprocessed_emails),
        processing_id="process_1"
    )

@router.get("/emails/processed", response_model=List[EmailResponse])
async def get_processed_emails(email_service: EmailService = Depends(get_email_service)):
    """Get processed emails with AI insights"""
    return await email_service.get_processed_emails()

@router.delete("/emails")
async def clear_all_emails(email_service: EmailService = Depends(get_email_service)):
    """Clear all emails from database"""
    return await email_service.clear_emails()

@router.get("/emails/{email_id}", response_model=EmailResponse)
async def get_email(email_id: str, email_service: EmailService = Depends(get_email_service)):
    """Get specific email details"""
    email = await email_service.get_email(email_id)
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    return email