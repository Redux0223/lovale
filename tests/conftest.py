"""
Pytest Configuration and Fixtures
==================================

提供测试所需的通用配置和 fixtures
"""

import pytest
import asyncio
from typing import AsyncGenerator, Generator
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool

import sys
sys.path.insert(0, "../backend")

from app.main import app
from app.core.database import Base, get_db


# 测试数据库 URL (使用内存 SQLite)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """创建事件循环"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def test_engine():
    """创建测试数据库引擎"""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield engine
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    await engine.dispose()


@pytest.fixture
async def db_session(test_engine) -> AsyncGenerator[AsyncSession, None]:
    """创建测试数据库会话"""
    async_session = async_sessionmaker(
        test_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    
    async with async_session() as session:
        yield session
        await session.rollback()


@pytest.fixture
async def client(db_session) -> AsyncGenerator[AsyncClient, None]:
    """创建测试客户端"""
    
    async def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()


@pytest.fixture
def sample_product_data():
    """示例产品数据"""
    return {
        "name": "测试产品",
        "sku": "TEST-001",
        "description": "这是一个测试产品",
        "price": 99.99,
        "stock": 100,
        "category_id": 1,
        "is_active": True,
    }


@pytest.fixture
def sample_customer_data():
    """示例客户数据"""
    return {
        "name": "张三",
        "email": "zhangsan@test.com",
        "phone": "13800138000",
        "address": "北京市朝阳区",
    }


@pytest.fixture
def sample_order_data():
    """示例订单数据"""
    return {
        "customer_id": 1,
        "items": [
            {"product_id": 1, "quantity": 2, "unit_price": 99.99}
        ],
        "shipping_address": "北京市朝阳区xxx路xxx号",
    }


@pytest.fixture
def sample_user_data():
    """示例用户数据"""
    return {
        "email": "admin@test.com",
        "password": "Test123456",
        "full_name": "管理员",
    }
