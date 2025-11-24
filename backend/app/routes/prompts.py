from fastapi import APIRouter, HTTPException, Depends
from app.services.prompt_service import PromptService
from app.schemas.prompt_schemas import PromptResponse, PromptUpdateRequest, PromptUpdateResponse

router = APIRouter()

def get_prompt_service():
    return PromptService()

@router.get("/prompts", response_model=PromptResponse)
async def get_prompts(prompt_service: PromptService = Depends(get_prompt_service)):
    """Get current prompt configurations"""
    return await prompt_service.get_prompts()

@router.put("/prompts")
async def update_prompt(
    update: PromptUpdateRequest,
    prompt_service: PromptService = Depends(get_prompt_service)
):
    """Update specific prompt"""
    try:
        updated_prompts = await prompt_service.update_prompt(update.prompt_type, update.content)
        return PromptUpdateResponse(
            message="Prompt updated successfully",
            updated_prompt=update.content
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating prompt: {str(e)}")

@router.post("/prompts/reset")
async def reset_prompts(prompt_service: PromptService = Depends(get_prompt_service)):
    """Reset prompts to default values"""
    return await prompt_service.reset_to_defaults()