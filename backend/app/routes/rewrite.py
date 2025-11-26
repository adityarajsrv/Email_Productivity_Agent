from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from app.config import settings
import os

router = APIRouter()

# Configure Gemini
if settings.GOOGLE_API_KEY:
    genai.configure(api_key=settings.GOOGLE_API_KEY)

class RewriteRequest(BaseModel):
    email: str
    tone: str

class RewriteResponse(BaseModel):
    rewritten_email: str
    tone: str
    success: bool

@router.post("/rewrite-email", response_model=RewriteResponse)
async def rewrite_email(request: RewriteRequest):
    """
    Rewrite an email in the specified tone using Gemini AI
    """
    try:
        if not settings.GOOGLE_API_KEY:
            # Fallback if no API key is configured
            rewritten_email = fallback_rewrite(request.email, request.tone)
            return RewriteResponse(
                rewritten_email=rewritten_email,
                tone=request.tone,
                success=True
            )
        
        # Use Gemini AI for rewriting
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
        TASK: Completely rewrite the following email in a {request.tone.lower()} tone. 
        
        IMPORTANT INSTRUCTIONS:
        1. UNDERSTAND the core message, intent, and key information from the original email
        2. DO NOT simply copy-paste or lightly edit the original text
        3. CREATE a completely new version with fresh wording and phrasing
        4. PRESERVE all factual information: names, dates, numbers, registration numbers, specific details
        5. MAINTAIN the original purpose and intent of the email
        6. ADAPT the style completely to match the {request.tone} tone
        7. USE appropriate formatting, greetings, and closings for the {request.tone} tone
        8. KEEP the same length and level of detail as the original
        
        TONE GUIDELINES for {request.tone}:
        {get_tone_guidelines(request.tone)}
        
        Original Email:
        "{request.email}"
        
        Your completely rewritten version in {request.tone} tone:
        """
        
        response = model.generate_content(prompt)
        rewritten_email = response.text.strip()
        
        # Clean up any potential quotes or formatting artifacts
        rewritten_email = cleaned_response(rewritten_email)
        
        return RewriteResponse(
            rewritten_email=rewritten_email,
            tone=request.tone,
            success=True
        )
        
    except Exception as e:
        print(f"Error rewriting email: {str(e)}")
        # Fallback to simple rewrite
        rewritten_email = fallback_rewrite(request.email, request.tone)
        return RewriteResponse(
            rewritten_email=rewritten_email,
            tone=request.tone,
            success=False
        )

def get_tone_guidelines(tone: str) -> str:
    """
    Returns specific guidelines for each tone
    """
    guidelines = {
        'Professional': """
        - Formal business language
        - Clear, concise, and respectful
        - Proper grammar and structure
        - Professional greetings and closings
        - Focus on clarity and professionalism
        - Avoid slang and casual expressions
        """,
        
        'Casual': """
        - Relaxed, informal language
        - Can use contractions and everyday expressions
        - Friendly, conversational tone
        - Simple, direct communication
        - Can use emojis if appropriate
        - Like talking to a colleague or friend
        """,
        
        'Friendly': """
        - Warm and approachable
        - Positive and encouraging
        - Shows empathy and understanding
        - Uses welcoming language
        - Maintains professionalism with warmth
        - Builds rapport and connection
        """,
        
        'Formal': """
        - Very structured and official
        - Traditional business language
        - Complete sentences, no contractions
        - Formal salutations and closings
        - Precise and detailed
        - Suitable for official communications
        """,
        
        'Urgent': """
        - Direct and to the point
        - Clear action-oriented language
        - Emphasizes time sensitivity
        - Uses attention-grabbing elements if needed
        - Focuses on immediate action
        - Concise and impactful
        """,
        
        'Persuasive': """
        - Convincing and motivational
        - Highlights benefits and positive outcomes
        - Uses compelling language
        - Builds enthusiasm and buy-in
        - Focuses on value proposition
        - Encourages action and agreement
        """
    }
    return guidelines.get(tone, guidelines['Professional'])

def cleaned_response(text: str) -> str:
    """
    Clean up the AI response by removing common artifacts
    """
    # Remove potential quotes around the response
    text = text.strip('"\'')
    
    # Remove any introductory phrases the AI might add
    remove_phrases = [
        "Here is the rewritten email:",
        "Rewritten email:",
        "Here's the email rewritten in",
        "Certainly! Here's the email rewritten",
        "Of course! Here is the email"
    ]
    
    for phrase in remove_phrases:
        if text.startswith(phrase):
            text = text[len(phrase):].strip()
    
    return text

def fallback_rewrite(email: str, tone: str) -> str:
    """
    Simple fallback rewrite function when Gemini is not available
    """
    # This is just a basic fallback - the AI should handle most cases
    tone_templates = {
        'Professional': f"""Dear Recipient,

I am writing regarding the matter outlined below.

{email}

Thank you for your attention to this issue.

Best regards,
[Your Name]""",

        'Casual': f"""Hey!

Just wanted to follow up on this:

{email}

Let me know what you think!

Thanks!""",

        'Friendly': f"""Hello! 😊

Hope you're having a good day! I wanted to touch base about this:

{email}

Looking forward to hearing from you!

Best,""",

        'Formal': f"""To Whom It May Concern,

This communication serves to formally address the following matter:

{email}

Your prompt attention to this issue would be greatly appreciated.

Respectfully yours,
[Your Name]""",

        'Urgent': f"""URGENT ATTENTION REQUIRED

Regarding the following matter which requires immediate attention:

{email}

Please address this promptly.

Thank you,""",

        'Persuasive': f"""Hello!

I'm excited to share this opportunity with you:

{email}

I'm confident this approach will yield excellent results!

Best regards,"""
    }
    
    return tone_templates.get(tone, email)