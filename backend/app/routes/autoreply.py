import json
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.services.email_service import EmailService
from app.services.processing_service import ProcessingService
import google.generativeai as genai
from app.config import settings

router = APIRouter()

class AutoReplySettings(BaseModel):
    enabled: bool = True
    response_template: str = "Thank you for your email. I've received your message and will respond within 24 hours. For urgent matters, please contact our support team directly."
    use_ai_customization: bool = True
    working_hours_only: bool = False

class AutoReplyStats(BaseModel):
    replies_sent: int
    success_rate: float
    ai_generated_count: int
    template_used_count: int

class RecentReply(BaseModel):
    email_id: str
    subject: str
    recipient: str
    reply_type: str
    timestamp: str
    status: str
    ai_generated: bool

class AutoReplyResponse(BaseModel):
    settings: AutoReplySettings
    stats: AutoReplyStats
    recent_replies: List[RecentReply]

class TestEmailRequest(BaseModel):
    test_email: str

class GenerateReplyRequest(BaseModel):
    email_content: str
    current_template: str

def get_email_service():
    return EmailService()

def get_processing_service():
    return ProcessingService()

@router.get("/autoreply", response_model=AutoReplyResponse)
async def get_autoreply_settings(
    email_service: EmailService = Depends(get_email_service)
):
    """
    Get auto-reply settings and statistics
    """
    try:
        # Default settings (in a real app, you'd store these in a database)
        settings = AutoReplySettings()
        
        # Mock statistics (in a real app, you'd calculate these from actual data)
        stats = AutoReplyStats(
            replies_sent=89,
            success_rate=0.96,
            ai_generated_count=67,
            template_used_count=22
        )
        
        # Mock recent replies
        recent_replies = [
            RecentReply(
                email_id="1",
                subject="Meeting Request",
                recipient="john@example.com",
                reply_type="Meeting Request",
                timestamp="2024-01-15T10:30:00Z",
                status="success",
                ai_generated=True
            ),
            RecentReply(
                email_id="2",
                subject="Support Inquiry",
                recipient="sarah@example.com",
                reply_type="Support Inquiry",
                timestamp="2024-01-15T09:15:00Z",
                status="success",
                ai_generated=False
            ),
            RecentReply(
                email_id="3",
                subject="Newsletter Subscription",
                recipient="mike@example.com",
                reply_type="Newsletter Subscription",
                timestamp="2024-01-14T16:45:00Z",
                status="success",
                ai_generated=True
            )
        ]
        
        return AutoReplyResponse(
            settings=settings,
            stats=stats,
            recent_replies=recent_replies
        )
        
    except Exception as e:
        print(f"Error getting auto-reply settings: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve auto-reply settings")

@router.post("/autoreply/settings")
async def update_autoreply_settings(
    settings: AutoReplySettings,
    email_service: EmailService = Depends(get_email_service)
):
    """
    Update auto-reply settings
    """
    try:
        # In a real application, you would save these settings to a database
        # For now, we'll just return the updated settings
        print(f"Auto-reply settings updated: {settings.model_dump()}")
        
        return {
            "message": "Auto-reply settings updated successfully",
            "settings": settings
        }
        
    except Exception as e:
        print(f"Error updating auto-reply settings: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update auto-reply settings")

@router.post("/autoreply/generate")
async def generate_ai_reply(
    request: GenerateReplyRequest,
    processing_service: ProcessingService = Depends(get_processing_service)
):
    """
    Generate an AI-powered auto-reply based on email content
    """
    try:
        api_key = getattr(settings, 'GEMINI_API_KEY', None) or getattr(settings, 'GOOGLE_API_KEY', None)
        if not api_key:
            return {"reply": request.current_template, "ai_generated": False}
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""
        Based on the incoming email content and the default template, generate a personalized auto-reply.
        
        INCOMING EMAIL:
        {request.email_content}
        
        DEFAULT TEMPLATE:
        {request.current_template}
        
        Please create a personalized response that:
        1. Acknowledges the specific content of the incoming email
        2. Maintains the professional tone of the default template
        3. Adds relevant personalization based on the email content
        4. Keeps the response concise and professional
        
        Personalized Auto-Reply:
        """
        
        response = model.generate_content(prompt)
        ai_reply = response.text.strip()
        
        return {
            "reply": ai_reply,
            "ai_generated": True,
            "message": "AI-generated reply created successfully"
        }
        
    except Exception as e:
        print(f"Error generating AI reply: {str(e)}")
        return {
            "reply": request.current_template,
            "ai_generated": False,
            "message": "Using default template due to AI service error"
        }

@router.post("/autoreply/test")
async def test_autoreply(
    request: TestEmailRequest,
    processing_service: ProcessingService = Depends(get_processing_service)
):
    """
    Test auto-reply functionality with a sample email
    """
    try:
        # Generate AI response for test email
        test_template = "Thank you for your email. I've received your message and will respond within 24 hours. For urgent matters, please contact our support team directly."
        
        # Use the generate_ai_reply function
        api_key = getattr(settings, 'GEMINI_API_KEY', None) or getattr(settings, 'GOOGLE_API_KEY', None)
        if not api_key:
            return {
                "test_email": request.test_email,
                "generated_reply": test_template,
                "ai_generated": False,
                "timestamp": datetime.now().isoformat()
            }
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""
        Based on the incoming email content, generate a professional auto-reply.
        
        INCOMING EMAIL:
        {request.test_email}
        
        Please create a professional response that:
        1. Acknowledges receipt of the email
        2. Sets appropriate expectations for response time
        3. Maintains a professional and helpful tone
        4. Is concise and appropriate for business communication
        
        Auto-Reply:
        """
        
        response = model.generate_content(prompt)
        ai_reply = response.text.strip()
        
        return {
            "test_email": request.test_email,
            "generated_reply": ai_reply,
            "ai_generated": True,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Error testing auto-reply: {str(e)}")
        # Fallback to default template
        return {
            "test_email": request.test_email,
            "generated_reply": "Thank you for your email. I've received your message and will respond as soon as possible.",
            "ai_generated": False,
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }