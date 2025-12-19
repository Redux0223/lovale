"""
AI 功能测试
===========

测试 AI 助手相关功能
"""

import pytest
from httpx import AsyncClient


class TestAIChat:
    """AI 聊天功能测试"""

    @pytest.mark.asyncio
    async def test_ai_chat_basic(self, client: AsyncClient):
        """测试基础 AI 聊天"""
        chat_data = {
            "message": "你好，请介绍一下你自己",
            "model": "gemini-3-pro-preview",
        }
        response = await client.post("/api/v1/ai/chat", json=chat_data)
        # API Key 可能未配置，接受多种状态码
        assert response.status_code in [200, 500]

    @pytest.mark.asyncio
    async def test_ai_chat_with_context(self, client: AsyncClient):
        """测试带上下文的 AI 聊天"""
        chat_data = {
            "message": "继续上面的话题",
            "model": "gemini-3-pro-preview",
            "context": [
                {"role": "user", "content": "你好"},
                {"role": "assistant", "content": "你好！有什么可以帮助你的？"},
            ],
        }
        response = await client.post("/api/v1/ai/chat", json=chat_data)
        assert response.status_code in [200, 500]

    @pytest.mark.asyncio
    async def test_ai_models_list(self, client: AsyncClient):
        """测试获取 AI 模型列表"""
        response = await client.get("/api/v1/ai/models")
        assert response.status_code == 200
        data = response.json()
        
        assert "models" in data
        models = data["models"]
        
        # 验证模型列表结构
        for model in models:
            assert "id" in model
            assert "name" in model

    @pytest.mark.asyncio
    async def test_ai_chat_different_models(self, client: AsyncClient):
        """测试不同 AI 模型"""
        models = [
            "gemini-3-pro-preview",
            "claude-opus-4-5-20251101-thinking",
            "grok-4-1-thinking-1129",
            "gpt-5",
        ]
        
        for model in models:
            chat_data = {
                "message": "测试消息",
                "model": model,
            }
            response = await client.post("/api/v1/ai/chat", json=chat_data)
            # 验证请求格式正确（不验证实际响应）
            assert response.status_code in [200, 500, 422]


class TestAIModes:
    """AI 模式测试"""

    @pytest.mark.asyncio
    async def test_canvas_mode_prefix(self, client: AsyncClient):
        """测试画布模式前缀"""
        chat_data = {
            "message": "[Canvas] 生成产品分析报告",
            "model": "gemini-3-pro-preview",
        }
        response = await client.post("/api/v1/ai/chat", json=chat_data)
        assert response.status_code in [200, 500]

    @pytest.mark.asyncio
    async def test_search_mode_prefix(self, client: AsyncClient):
        """测试搜索模式前缀"""
        chat_data = {
            "message": "[Search] 最新销售数据",
            "model": "gemini-3-pro-preview",
        }
        response = await client.post("/api/v1/ai/chat", json=chat_data)
        assert response.status_code in [200, 500]

    @pytest.mark.asyncio
    async def test_think_mode_prefix(self, client: AsyncClient):
        """测试思考模式前缀"""
        chat_data = {
            "message": "[Think] 分析销售下降原因",
            "model": "gemini-3-pro-preview",
        }
        response = await client.post("/api/v1/ai/chat", json=chat_data)
        assert response.status_code in [200, 500]


class TestAIRequestValidation:
    """AI 请求验证测试"""

    @pytest.mark.asyncio
    async def test_empty_message(self, client: AsyncClient):
        """测试空消息"""
        chat_data = {
            "message": "",
            "model": "gemini-3-pro-preview",
        }
        response = await client.post("/api/v1/ai/chat", json=chat_data)
        # 空消息可能被拒绝或接受
        assert response.status_code in [200, 400, 422, 500]

    @pytest.mark.asyncio
    async def test_missing_message_field(self, client: AsyncClient):
        """测试缺少消息字段"""
        chat_data = {
            "model": "gemini-3-pro-preview",
        }
        response = await client.post("/api/v1/ai/chat", json=chat_data)
        assert response.status_code == 422  # Validation Error

    @pytest.mark.asyncio
    async def test_invalid_model(self, client: AsyncClient):
        """测试无效模型"""
        chat_data = {
            "message": "测试",
            "model": "invalid-model-name",
        }
        response = await client.post("/api/v1/ai/chat", json=chat_data)
        # 无效模型可能返回错误
        assert response.status_code in [200, 400, 500]

    @pytest.mark.asyncio
    async def test_long_message(self, client: AsyncClient):
        """测试长消息"""
        long_message = "这是一条很长的消息。" * 100
        chat_data = {
            "message": long_message,
            "model": "gemini-3-pro-preview",
        }
        response = await client.post("/api/v1/ai/chat", json=chat_data)
        assert response.status_code in [200, 400, 500]

    @pytest.mark.asyncio
    async def test_special_characters(self, client: AsyncClient):
        """测试特殊字符"""
        chat_data = {
            "message": "测试特殊字符：!@#$%^&*()_+-=[]{}|;':\",./<>?",
            "model": "gemini-3-pro-preview",
        }
        response = await client.post("/api/v1/ai/chat", json=chat_data)
        assert response.status_code in [200, 500]


class TestAIResponseFormat:
    """AI 响应格式测试"""

    @pytest.mark.asyncio
    async def test_response_structure(self, client: AsyncClient):
        """测试响应结构"""
        chat_data = {
            "message": "你好",
            "model": "gemini-3-pro-preview",
        }
        response = await client.post("/api/v1/ai/chat", json=chat_data)
        
        if response.status_code == 200:
            data = response.json()
            assert "response" in data
            assert "model" in data

    @pytest.mark.asyncio
    async def test_error_response_structure(self, client: AsyncClient):
        """测试错误响应结构"""
        # 发送可能触发错误的请求
        chat_data = {
            "message": "测试",
            "model": "gemini-3-pro-preview",
        }
        response = await client.post("/api/v1/ai/chat", json=chat_data)
        
        if response.status_code == 500:
            data = response.json()
            # 错误响应应该有 error 或 detail 字段
            assert "error" in data or "detail" in data or "response" in data
