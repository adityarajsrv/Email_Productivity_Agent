from pydantic import BaseModel

class DashboardMetrics(BaseModel):
    emails_processed: int
    time_saved_minutes: int
    auto_replies_sent: int
    productivity_score: int