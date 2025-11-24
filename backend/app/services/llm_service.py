import google.generativeai as genai
import os
import json
import asyncio
from typing import List, Dict, Any
from app.config import settings

class LLMService:
    def __init__(self):
        if not settings.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def extract_action_items(self, email_content: str, prompt: str) -> List[str]:
        """Extract action items from email using AI"""
        full_prompt = f"""
        {prompt}
        
        Email Content:
        {email_content}
        
        Return ONLY a JSON array of action items. Example: ["Review document by Friday", "Schedule team meeting"]
        """
        
        try:
            # Run in thread pool since genai is synchronous
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None, 
                lambda: self.model.generate_content(full_prompt)
            )
            
            # Try to parse JSON response
            response_text = response.text.strip()
            if response_text.startswith('[') and response_text.endswith(']'):
                items = json.loads(response_text)
                return items if isinstance(items, list) else []
            else:
                # Fallback: split by lines and clean up
                lines = [line.strip('- •').strip() for line in response_text.split('\n') if line.strip()]
                return lines[:5]  # Return max 5 items
                
        except Exception as e:
            print(f"Error extracting action items: {e}")
            return ["Review email content for action items"]
    
    async def generate_auto_reply(self, email_content: str, prompt: str) -> str:
        """Generate auto-reply draft using AI"""
        full_prompt = f"""
        {prompt}
        
        Original Email:
        {email_content}
        
        Generate a professional auto-reply draft. Keep it concise and appropriate.
        """
        
        try:
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.model.generate_content(full_prompt)
            )
            return response.text.strip()
        except Exception as e:
            print(f"Error generating auto-reply: {e}")
            return "Thank you for your email. I will review it and respond as soon as possible."
    
    async def draft_email(self, context: str, recipient: str, subject: str) -> Dict[str, Any]:
        """Draft a new email using AI"""
        prompt = f"""
        Draft a professional email with the following details:
        
        Recipient: {recipient}
        Subject: {subject}
        Context/Key Points: {context}
        
        Please generate a complete email with appropriate greeting, body, and closing.
        """
        
        try:
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.model.generate_content(prompt)
            )
            
            return {
                "body": response.text.strip(),
                "suggested_follow_ups": [
                    "Schedule a follow-up meeting",
                    "Share additional documents",
                    "Confirm receipt of this email"
                ]
            }
        except Exception as e:
            print(f"Error drafting email: {e}")
            return {
                "body": f"Dear Recipient,\n\n{context}\n\nBest regards,\n[Your Name]",
                "suggested_follow_ups": []
            }