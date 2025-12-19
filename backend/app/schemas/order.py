"""Order schemas."""

from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field

from app.models.order import OrderStatus


class OrderItemBase(BaseModel):
    """Base order item schema."""

    product_id: int
    quantity: int = Field(..., ge=1)


class OrderItemCreate(OrderItemBase):
    """Schema for creating an order item."""

    pass


class OrderItemResponse(BaseModel):
    """Schema for order item response."""

    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: Decimal
    total_price: Decimal

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    """Base order schema."""

    customer_id: int
    shipping_address: str | None = None
    notes: str | None = None


class OrderCreate(OrderBase):
    """Schema for creating an order."""

    items: list[OrderItemCreate]


class OrderUpdate(BaseModel):
    """Schema for updating an order."""

    status: OrderStatus | None = None
    shipping_address: str | None = None
    notes: str | None = None


class OrderResponse(OrderBase):
    """Schema for order response."""

    id: int
    order_number: str
    status: OrderStatus
    subtotal: Decimal
    tax_amount: Decimal
    shipping_amount: Decimal
    discount_amount: Decimal
    total_amount: Decimal
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemResponse] = []

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    """Schema for paginated order list response."""

    items: list[OrderResponse]
    total: int
    page: int
    page_size: int
    pages: int
