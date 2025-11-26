from fastapi import APIRouter, Depends
from app.services.email_service import EmailService
from app.schemas.dashboard_schemas import DashboardMetrics

router = APIRouter()

def get_email_service():
    return EmailService()

@router.get("/dashboard/metrics", response_model=DashboardMetrics)
async def get_dashboard_metrics(email_service: EmailService = Depends(get_email_service)):
    """Get dashboard metrics"""
    emails = await email_service.get_emails()
    processed_count = len([e for e in emails if e.status.value == "processed"])
    
    # Calculate metrics
    total_emails = len(emails)
    auto_reply_count = len([e for e in emails if e.metadata and e.metadata.get("auto_reply_generated")])
    
    return DashboardMetrics(
        emails_processed=processed_count,
        time_saved_minutes=processed_count * 5,  # 5 minutes per email
        auto_replies_sent=auto_reply_count,
        productivity_score=min(processed_count * 20, 100)  # Cap at 100
    )