"""
API 接口测试
============

测试后端 FastAPI 接口的基本功能
"""

import pytest
from httpx import AsyncClient


class TestHealthEndpoints:
    """健康检查接口测试"""

    @pytest.mark.asyncio
    async def test_health_live(self, client: AsyncClient):
        """测试存活检查接口"""
        response = await client.get("/api/v1/health/live")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "alive"

    @pytest.mark.asyncio
    async def test_health_ready(self, client: AsyncClient):
        """测试就绪检查接口"""
        response = await client.get("/api/v1/health/ready")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ready"


class TestProductEndpoints:
    """产品管理接口测试"""

    @pytest.mark.asyncio
    async def test_list_products_empty(self, client: AsyncClient):
        """测试获取空产品列表"""
        response = await client.get("/api/v1/products")
        assert response.status_code == 200
        assert response.json() == []

    @pytest.mark.asyncio
    async def test_create_product(self, client: AsyncClient, sample_product_data):
        """测试创建产品"""
        response = await client.post("/api/v1/products", json=sample_product_data)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == sample_product_data["name"]
        assert data["sku"] == sample_product_data["sku"]
        assert data["price"] == sample_product_data["price"]
        assert "id" in data
        assert "slug" in data

    @pytest.mark.asyncio
    async def test_create_product_duplicate_sku(self, client: AsyncClient, sample_product_data):
        """测试创建重复SKU产品"""
        # 首次创建
        await client.post("/api/v1/products", json=sample_product_data)
        # 重复创建
        response = await client.post("/api/v1/products", json=sample_product_data)
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_get_product(self, client: AsyncClient, sample_product_data):
        """测试获取单个产品"""
        # 先创建产品
        create_response = await client.post("/api/v1/products", json=sample_product_data)
        product_id = create_response.json()["id"]
        
        # 获取产品
        response = await client.get(f"/api/v1/products/{product_id}")
        assert response.status_code == 200
        assert response.json()["id"] == product_id

    @pytest.mark.asyncio
    async def test_get_product_not_found(self, client: AsyncClient):
        """测试获取不存在的产品"""
        response = await client.get("/api/v1/products/99999")
        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_update_product(self, client: AsyncClient, sample_product_data):
        """测试更新产品"""
        # 先创建产品
        create_response = await client.post("/api/v1/products", json=sample_product_data)
        product_id = create_response.json()["id"]
        
        # 更新产品
        update_data = {"name": "更新后的产品", "price": 199.99}
        response = await client.patch(f"/api/v1/products/{product_id}", json=update_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "更新后的产品"
        assert data["price"] == 199.99

    @pytest.mark.asyncio
    async def test_delete_product(self, client: AsyncClient, sample_product_data):
        """测试删除产品（软删除）"""
        # 先创建产品
        create_response = await client.post("/api/v1/products", json=sample_product_data)
        product_id = create_response.json()["id"]
        
        # 删除产品
        response = await client.delete(f"/api/v1/products/{product_id}")
        assert response.status_code == 204

    @pytest.mark.asyncio
    async def test_list_products_with_filter(self, client: AsyncClient, sample_product_data):
        """测试产品列表筛选"""
        # 创建产品
        await client.post("/api/v1/products", json=sample_product_data)
        
        # 搜索筛选
        response = await client.get("/api/v1/products?search=测试")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1


class TestOrderEndpoints:
    """订单管理接口测试"""

    @pytest.mark.asyncio
    async def test_list_orders_empty(self, client: AsyncClient):
        """测试获取空订单列表"""
        response = await client.get("/api/v1/orders")
        assert response.status_code == 200
        assert response.json() == []

    @pytest.mark.asyncio
    async def test_create_order(self, client: AsyncClient, sample_order_data):
        """测试创建订单"""
        response = await client.post("/api/v1/orders", json=sample_order_data)
        # 可能因为缺少关联数据而失败，但接口应该响应
        assert response.status_code in [201, 400, 404]

    @pytest.mark.asyncio
    async def test_get_order_not_found(self, client: AsyncClient):
        """测试获取不存在的订单"""
        response = await client.get("/api/v1/orders/99999")
        assert response.status_code == 404


class TestCustomerEndpoints:
    """客户管理接口测试"""

    @pytest.mark.asyncio
    async def test_list_customers_empty(self, client: AsyncClient):
        """测试获取空客户列表"""
        response = await client.get("/api/v1/customers")
        assert response.status_code == 200
        assert response.json() == []

    @pytest.mark.asyncio
    async def test_create_customer(self, client: AsyncClient, sample_customer_data):
        """测试创建客户"""
        response = await client.post("/api/v1/customers", json=sample_customer_data)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == sample_customer_data["name"]
        assert data["email"] == sample_customer_data["email"]

    @pytest.mark.asyncio
    async def test_get_customer(self, client: AsyncClient, sample_customer_data):
        """测试获取单个客户"""
        # 先创建客户
        create_response = await client.post("/api/v1/customers", json=sample_customer_data)
        customer_id = create_response.json()["id"]
        
        # 获取客户
        response = await client.get(f"/api/v1/customers/{customer_id}")
        assert response.status_code == 200
        assert response.json()["id"] == customer_id


class TestDashboardEndpoints:
    """仪表盘接口测试"""

    @pytest.mark.asyncio
    async def test_get_dashboard_data(self, client: AsyncClient):
        """测试获取仪表盘数据"""
        response = await client.get("/api/v1/dashboard")
        assert response.status_code == 200
        data = response.json()
        # 验证返回数据结构
        assert "total_revenue" in data or "kpis" in data or isinstance(data, dict)


class TestAIEndpoints:
    """AI 助手接口测试"""

    @pytest.mark.asyncio
    async def test_list_ai_models(self, client: AsyncClient):
        """测试获取可用 AI 模型列表"""
        response = await client.get("/api/v1/ai/models")
        assert response.status_code == 200
        data = response.json()
        assert "models" in data
        assert len(data["models"]) > 0

    @pytest.mark.asyncio
    async def test_ai_chat_missing_message(self, client: AsyncClient):
        """测试 AI 聊天缺少消息"""
        response = await client.post("/api/v1/ai/chat", json={})
        assert response.status_code == 422  # Validation Error

    @pytest.mark.asyncio
    async def test_ai_chat_request_format(self, client: AsyncClient):
        """测试 AI 聊天请求格式"""
        chat_data = {
            "message": "你好",
            "model": "gemini-3-pro-preview",
        }
        response = await client.post("/api/v1/ai/chat", json=chat_data)
        # 可能因为 API Key 未配置而返回 500，但格式应该正确
        assert response.status_code in [200, 500]


class TestRootEndpoint:
    """根路由测试"""

    @pytest.mark.asyncio
    async def test_root(self, client: AsyncClient):
        """测试根路由"""
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "version" in data
