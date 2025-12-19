"""AI Chat endpoints."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

from app.core.config import settings

router = APIRouter()


class ChatRequest(BaseModel):
    """Chat request schema."""
    message: str
    model: str = "gemini-3-pro-preview"
    context: list[dict] | None = None


class ChatResponse(BaseModel):
    """Chat response schema."""
    response: str
    model: str


# System prompts
SYSTEM_PROMPT = """你是一个专业的AI商业助手，专注于帮助用户分析销售数据、库存管理、客户运营等业务问题。

你的特点：
- 回答简洁专业，直击要点
- 善于用数据说话，给出具体建议
- 关注业务实际，提供可操作的方案
- 使用中文回答，适当使用emoji增强可读性

当前时间：{timestamp}"""


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    AI Chat endpoint - 调用 OpenAI 兼容 API
    
    支持的模型:
    - gemini-3-pro-preview
    - claude-opus-4-5-20251101-thinking
    - grok-4-1-thinking-1129
    - gpt-5
    """
    if not settings.OPENAI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="OpenAI API key not configured"
        )

    from datetime import datetime
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT.format(timestamp=timestamp)}
    ]

    # Add context if provided
    if request.context:
        for msg in request.context[-6:]:
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })

    messages.append({"role": "user", "content": request.message})

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{settings.OPENAI_BASE_URL}/chat/completions",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {settings.OPENAI_API_KEY}"
                },
                json={
                    "model": request.model,
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 4096
                }
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"OpenAI API error: {response.text}"
                )

            data = response.json()
            ai_response = data["choices"][0]["message"]["content"]

            return ChatResponse(
                response=ai_response,
                model=request.model
            )

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="AI service timeout"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {str(e)}"
        )


@router.get("/models")
async def list_models():
    """List available AI models."""
    return {
        "models": [
            {
                "id": "gemini-3-pro-preview",
                "name": "Gemini 3 Pro",
                "description": "Google's multimodal AI model"
            },
            {
                "id": "claude-opus-4-5-20251101-thinking",
                "name": "Claude Opus 4.5",
                "description": "Anthropic's thinking model"
            },
            {
                "id": "grok-4-1-thinking-1129",
                "name": "Grok 4.1",
                "description": "xAI's reasoning model"
            },
            {
                "id": "gpt-5",
                "name": "GPT-5",
                "description": "OpenAI's latest model"
            }
        ]
    }
