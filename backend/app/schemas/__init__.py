"""Pydantic schemas for API validation."""

from app.schemas.user import UserCreate, UserResponse, UserUpdate, Token
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.schemas.order import OrderCreate, OrderResponse, OrderUpdate, OrderItemCreate
from app.schemas.customer import CustomerCreate, CustomerResponse, CustomerUpdate
from app.schemas.dashboard import DashboardStats, SalesData, TopProduct

__all__ = [
    "UserCreate",
    "UserResponse", 
    "UserUpdate",
    "Token",
    "ProductCreate",
    "ProductResponse",
    "ProductUpdate",
    "OrderCreate",
    "OrderResponse",
    "OrderUpdate",
    "OrderItemCreate",
    "CustomerCreate",
    "CustomerResponse",
    "CustomerUpdate",
    "DashboardStats",
    "SalesData",
    "TopProduct",
]
