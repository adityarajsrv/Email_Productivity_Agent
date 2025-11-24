from typing import List
from app.models.email_models import Email, EmailStatus
from app.services.llm_service import LLMService
from app.services.prompt_service import PromptService
from app.services.email_service import EmailService
import asyncio
from datetime import datetime

class ProcessingService:
    def __init__(self):
        self._llm_service = None
        self._prompt_service = None
        self._email_service = None
    
    @property
    def llm_service(self):
        if self._llm_service is None:
            self._llm_service = LLMService()
        return self._llm_service
    
    @property
    def prompt_service(self):
        if self._prompt_service is None:
            self._prompt_service = PromptService()
        return self._prompt_service
    
    @property
    def email_service(self):
        if self._email_service is None:
            self._email_service = EmailService()
        return self._email_service
    
    async def process_single_email(self, email: Email) -> Email:
        """Process a single email through the AI pipeline"""
        try:
            prompts = await self.prompt_service.get_prompts()
            
            # Extract action items
            action_items = await self.llm_service.extract_action_items(
                email.body, prompts.action_items
            )
            
            # Generate auto-reply (store for potential use)
            auto_reply = await self.llm_service.generate_auto_reply(
                email.body, prompts.auto_reply
            )
            
            # Update email with processed data
            update_data = {
                "action_items": action_items,
                "status": EmailStatus.PROCESSED,
                "processed_at": datetime.now(),
                "metadata": {
                    "auto_reply_generated": auto_reply,
                    "processed_with_prompts": {
                        "action_items_prompt": prompts.action_items[:100] + "...",
                        "auto_reply_prompt": prompts.auto_reply[:100] + "..."
                    }
                }
            }
            
            # Determine priority based on action items and content
            if any(urgent in email.body.lower() for urgent in ['urgent', 'asap', 'immediately']):
                update_data["priority"] = "high"
            elif action_items:
                update_data["priority"] = "medium"
            else:
                update_data["priority"] = "low"
            
            # Add tags based on content
            tags = []
            if any(word in email.body.lower() for word in ['meeting', 'schedule', 'calendar']):
                tags.append("meeting")
            if any(word in email.body.lower() for word in ['project', 'timeline', 'deadline']):
                tags.append("project")
            if action_items:
                tags.append("action-required")
            
            update_data["tags"] = tags
            
            return await self.email_service.update_email(str(email.id), update_data)
            
        except Exception as e:
            print(f"Error processing email {email.id}: {e}")
            # Mark as processed even if failed to avoid reprocessing
            await self.email_service.update_email(str(email.id), {
                "status": EmailStatus.PROCESSED,
                "processed_at": datetime.now(),
                "action_items": ["Error processing email"]
            })
            return email
    
    async def process_email_batch(self, emails: List[Email]) -> List[Email]:
        """Process multiple emails with progress tracking"""
        processed_emails = []
        
        for i, email in enumerate(emails):
            if email.status != EmailStatus.PROCESSED:
                processed_email = await self.process_single_email(email)
                processed_emails.append(processed_email)
            
            # Optional: Add small delay to avoid rate limiting
            await asyncio.sleep(0.5)
        
        return processed_emails