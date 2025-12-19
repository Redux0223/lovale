"""Product schemas."""

from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    """Base product schema."""

    name: str = Field(..., max_length=255)
    sku: str = Field(..., max_length=50)
    description: str | None = None
    price: Decimal = Field(..., ge=0)
    cost_price: Decimal | None = Field(None, ge=0)
    stock_quantity: int = Field(0, ge=0)
    category_id: int | None = None
    image_url: str | None = None


class ProductCreate(ProductBase):
    """Schema for creating a product."""

    pass


class ProductUpdate(BaseModel):
    """Schema for updating a product."""

    name: str | None = Field(None, max_length=255)
    sku: str | None = Field(None, max_length=50)
    description: str | None = None
    price: Decimal | None = Field(None, ge=0)
    cost_price: Decimal | None = Field(None, ge=0)
    stock_quantity: int | None = Field(None, ge=0)
    category_id: int | None = None
    image_url: str | None = None
    is_active: bool | None = None


class ProductResponse(ProductBase):
    """Schema for product response."""

    id: int
    slug: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProductCategoryBase(BaseModel):
    """Base product category schema."""

    name: str = Field(..., max_length=100)
    description: str | None = None


class ProductCategoryCreate(ProductCategoryBase):
    """Schema for creating a product category."""

    pass


class ProductCategoryResponse(ProductCategoryBase):
    """Schema for product category response."""

    id: int
    slug: str
    created_at: datetime

    class Config:
        from_attributes = True
