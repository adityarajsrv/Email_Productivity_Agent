from typing import List
from app.models.email_models import Email, EmailStatus
from app.services.llm_service import LLMService
from app.services.prompt_service import PromptService
from app.services.email_service import EmailService
import asyncio
from datetime import datetime
import json
import google.generativeai as genai  # Changed from 'import genai'
from app.config import settings  # Import settings properly

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

    async def generate_summary(self, email):
        """
        Generate AI-powered summary for an email
        """
        try:
            # Check if API key is available
            api_key = getattr(settings, 'GOOGLE_API_KEY', None) or getattr(settings, 'GOOGLE_API_KEY', None)
            if not api_key:
                return self._generate_fallback_summary(email)
            
            # Configure and use Gemini
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-2.5-flash')
            
            prompt = f"""
            Analyze the following email and provide a comprehensive summary with these components:
            
            1. MAIN SUMMARY: A concise 2-3 sentence overview of the email's core message
            2. KEY POINTS: 3-5 bullet points of the most important information
            3. ACTION ITEMS: Specific tasks or follow-ups required (if any)
            4. SENTIMENT: Overall tone (positive, negative, neutral, urgent)
            5. CATEGORIES: Relevant tags/categories (e.g., business, personal, urgent, follow-up)
            
            EMAIL CONTENT:
            Subject: {email.subject}
            From: {email.sender}
            Body: {email.body}
            
            Please format your response as JSON:
            {{
                "summary": "main summary text",
                "key_points": ["point 1", "point 2", "point 3"],
                "action_items": ["action 1", "action 2"],
                "sentiment": "positive/negative/neutral/urgent",
                "tags": ["tag1", "tag2", "tag3"]
            }}
            """
            
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Extract JSON from response
            try:
                # Remove markdown code blocks if present
                if '```json' in response_text:
                    response_text = response_text.split('```json')[1].split('```')[0]
                elif '```' in response_text:
                    response_text = response_text.split('```')[1].split('```')[0]
                
                summary_data = json.loads(response_text)
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                summary_data = self._parse_text_response(response_text)
            
            return summary_data
            
        except Exception as e:
            print(f"Error generating AI summary: {str(e)}")
            return self._generate_fallback_summary(email)
    
    def _parse_text_response(self, text):
        """Parse text response when JSON parsing fails"""
        # Simple text parsing logic
        lines = text.split('\n')
        summary_data = {
            "summary": "",
            "key_points": [],
            "action_items": [],
            "sentiment": "neutral",
            "tags": []
        }
        
        current_section = None
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            if "summary:" in line.lower() or "main summary:" in line.lower():
                current_section = "summary"
                summary_data["summary"] = line.split(":", 1)[1].strip()
            elif "key points:" in line.lower():
                current_section = "key_points"
            elif "action items:" in line.lower():
                current_section = "action_items"
            elif "sentiment:" in line.lower():
                summary_data["sentiment"] = line.split(":", 1)[1].strip().lower()
            elif "categories:" in line.lower() or "tags:" in line.lower():
                current_section = "tags"
            elif line.startswith("-") or line.startswith("•"):
                point = line[1:].strip()
                if current_section == "key_points" and len(summary_data["key_points"]) < 5:
                    summary_data["key_points"].append(point)
                elif current_section == "action_items" and len(summary_data["action_items"]) < 3:
                    summary_data["action_items"].append(point)
                elif current_section == "tags" and len(summary_data["tags"]) < 5:
                    summary_data["tags"].append(point)
            elif current_section == "summary" and not summary_data["summary"]:
                summary_data["summary"] = line
        
        return summary_data
    
    def _generate_fallback_summary(self, email):
        """Generate a basic summary when AI is not available"""
        # Simple rule-based summary generation
        body_lower = email.body.lower()
        
        # Determine sentiment based on keywords
        sentiment = "neutral"
        positive_words = ['great', 'excellent', 'good', 'thanks', 'thank you', 'appreciate']
        negative_words = ['problem', 'issue', 'concern', 'urgent', 'asap', 'immediately']
        urgent_words = ['urgent', 'asap', 'immediately', 'emergency', 'important']
        
        if any(word in body_lower for word in urgent_words):
            sentiment = "urgent"
        elif any(word in body_lower for word in positive_words):
            sentiment = "positive"
        elif any(word in body_lower for word in negative_words):
            sentiment = "negative"
        
        # Generate basic summary
        words = email.body.split()[:20]  # First 20 words
        summary = " ".join(words) + ("..." if len(email.body.split()) > 20 else "")
        
        # Extract potential action items (lines with action verbs)
        action_verbs = ['please', 'need', 'required', 'should', 'must', 'action']
        action_items = []
        for line in email.body.split('.'):
            if any(verb in line.lower() for verb in action_verbs):
                action_items.append(line.strip())
                if len(action_items) >= 2:
                    break
        
        return {
            "summary": summary,
            "key_points": [f"From: {email.sender}", f"Subject: {email.subject}"],
            "action_items": action_items[:2],
            "sentiment": sentiment,
            "tags": [email.priority, "email"]  # Basic tags
        }