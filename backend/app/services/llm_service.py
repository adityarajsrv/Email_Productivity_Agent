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
        
        # List available models to see what's accessible
        try:
            available_models = genai.list_models()
            print("🔍 Available Google Gemini Models:")
            for model in available_models:
                print(f"  - {model.name}")
        except Exception as e:
            print(f"❌ Error listing models: {e}")
        
        # Try available models in order of preference
        model_priority = [
            'gemini-2.5-flash-lite',  # Latest experimental flash model
            'gemini-2.5-flash',      # Fast model
            'gemini-1.5-flash',        # High quality model
            'gemini-1.0-flash',        # Original pro model
        ]
        
        self.model = None
        for model_name in model_priority:
            try:
                self.model = genai.GenerativeModel(model_name)
                print(f"✅ Successfully loaded model: {model_name}")
                break
            except Exception as e:
                print(f"❌ Model {model_name} not available: {e}")
                continue
        
        if not self.model:
            print("🚨 No Gemini models available. Please check your API key and model access.")
            # Try to get any available model as last resort
            try:
                available_models = genai.list_models()
                if available_models:
                    first_model_name = available_models[0].name.split('/')[-1]
                    self.model = genai.GenerativeModel(first_model_name)
                    print(f"🔄 Using fallback model: {first_model_name}")
                else:
                    raise Exception("No models available in account")
            except Exception as e:
                print(f"💥 Critical: No models available - {e}")
    
    async def extract_action_items(self, email_content: str, prompt: str) -> List[str]:
        """Extract action items from email using AI"""
        if not self.model:
            print("❌ No AI model available - returning mock data")
            return self._get_mock_action_items(email_content)
        
        full_prompt = f"""
        {prompt}
        
        EMAIL CONTENT:
        {email_content}
        
        IMPORTANT: Return ONLY a valid JSON array of action items. 
        Example: ["Review Q4 report by Friday", "Schedule team meeting for next week", "Update project documentation"]
        
        RESPONSE FORMAT:
        ["action item 1", "action item 2", "action item 3"]
        """
        
        try:
            # Run in thread pool since genai is synchronous
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None, 
                lambda: self.model.generate_content(
                    full_prompt,
                    generation_config=genai.types.GenerationConfig(
                        temperature=0.3,
                        top_p=0.8,
                        top_k=40,
                        max_output_tokens=500,
                    )
                )
            )
            
            # Try to parse JSON response
            response_text = response.text.strip()
            print(f"🤖 AI Response for action items: {response_text}")
            
            # Clean the response - remove markdown code blocks if present
            cleaned_text = response_text.replace('```json', '').replace('```', '').strip()
            
            if cleaned_text.startswith('[') and cleaned_text.endswith(']'):
                items = json.loads(cleaned_text)
                if isinstance(items, list) and len(items) > 0:
                    print(f"✅ Extracted {len(items)} action items")
                    return items
                else:
                    print("⚠️ Empty action items list from AI")
                    return self._get_mock_action_items(email_content)
            else:
                print("⚠️ AI didn't return valid JSON, using fallback extraction")
                # Fallback: try to extract action items from text
                return self._extract_from_text(cleaned_text)
                
        except Exception as e:
            print(f"❌ Error extracting action items: {e}")
            return self._get_mock_action_items(email_content)
    
    def _extract_from_text(self, text: str) -> List[str]:
        """Extract action items from free text response"""
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        action_items = []
        
        for line in lines:
            # Skip lines that are clearly not action items
            if any(skip in line.lower() for skip in ['json', 'array', 'example', 'format']):
                continue
            
            # Clean the line and add if it looks like an action item
            clean_line = line.strip('-•* ').strip()
            if clean_line and len(clean_line) > 10:  # Reasonable minimum length
                action_items.append(clean_line)
        
        return action_items[:5]  # Return max 5 items
    
    def _get_mock_action_items(self, email_content: str) -> List[str]:
        """Fallback mock action items based on email content"""
        email_lower = email_content.lower()
        action_items = []
        
        if any(word in email_lower for word in ['review', 'check', 'look at']):
            action_items.append("Review the document")
        if any(word in email_lower for word in ['schedule', 'meeting', 'call']):
            action_items.append("Schedule a meeting")
        if any(word in email_lower for word in ['update', 'progress', 'status']):
            action_items.append("Provide updates")
        if any(word in email_lower for word in ['deadline', 'friday', 'end of day']):
            action_items.append("Meet the deadline")
        if any(word in email_lower for word in ['feedback', 'comments', 'suggestions']):
            action_items.append("Provide feedback")
        
        # Add some generic items if none found
        if not action_items:
            action_items = [
                "Review the email content",
                "Identify key action items", 
                "Set appropriate deadlines"
            ]
        
        return action_items[:3]
    
    async def generate_auto_reply(self, email_content: str, prompt: str) -> str:
        """Generate auto-reply draft using AI"""
        if not self.model:
            print("❌ No AI model available - returning mock auto-reply")
            return "Thank you for your email. I have received it and will review it shortly."
        
        full_prompt = f"""
        {prompt}
        
        ORIGINAL EMAIL:
        {email_content}
        
        Generate a professional, concise auto-reply that acknowledges receipt and sets appropriate expectations.
        Keep it under 100 words.
        """
        
        try:
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.model.generate_content(
                    full_prompt,
                    generation_config=genai.types.GenerationConfig(
                        temperature=0.2,
                        top_p=0.7,
                        max_output_tokens=200,
                    )
                )
            )
            reply = response.text.strip()
            print(f"🤖 Generated auto-reply: {reply}")
            return reply
        except Exception as e:
            print(f"❌ Error generating auto-reply: {e}")
            return "Thank you for your email. I will review it and respond as soon as possible."
    
    async def draft_email(self, context: str, recipient: str, subject: str) -> Dict[str, Any]:
        """Draft a new email using AI"""
        if not self.model:
            print("❌ No AI model available - returning mock draft")
            return self._get_mock_draft(context, recipient, subject)
        
        prompt = f"""
        Draft a professional email with the following details:
        
        RECIPIENT: {recipient}
        SUBJECT: {subject}
        CONTEXT/KEY POINTS: {context}
        
        Please generate a complete, professional email with appropriate greeting, body content, and closing.
        Make it clear, concise, and actionable.
        """
        
        try:
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.model.generate_content(
                    prompt,
                    generation_config=genai.types.GenerationConfig(
                        temperature=0.4,
                        top_p=0.8,
                        max_output_tokens=800,
                    )
                )
            )
            
            return {
                "body": response.text.strip(),
                "suggested_follow_ups": [
                    "Schedule a follow-up meeting",
                    "Share additional documents if needed",
                    "Confirm receipt and understanding"
                ]
            }
        except Exception as e:
            print(f"❌ Error drafting email: {e}")
            return self._get_mock_draft(context, recipient, subject)
    
    def _get_mock_draft(self, context: str, recipient: str, subject: str) -> Dict[str, Any]:
        """Fallback mock email draft"""
        return {
            "body": f"""Dear {recipient.split('@')[0].title() if '@' in recipient else 'Recipient'},

I hope this email finds you well.

Regarding your message about "{subject}", {context.lower() if context else 'I appreciate you reaching out.'}

Thank you for bringing this to my attention. I will review the details and follow up accordingly.

Best regards,
[Your Name]""",
            "suggested_follow_ups": [
                "Schedule a discussion to review details",
                "Provide additional information as needed",
                "Coordinate next steps with relevant parties"
            ]
        }