"""Customer schemas."""

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class CustomerBase(BaseModel):
    """Base customer schema."""

    email: EmailStr
    first_name: str = Field(..., max_length=100)
    last_name: str = Field(..., max_length=100)
    phone: str | None = Field(None, max_length=20)
    address: str | None = None
    city: str | None = Field(None, max_length=100)
    country: str | None = Field(None, max_length=100)


class CustomerCreate(CustomerBase):
    """Schema for creating a customer."""

    pass


class CustomerUpdate(BaseModel):
    """Schema for updating a customer."""

    email: EmailStr | None = None
    first_name: str | None = Field(None, max_length=100)
    last_name: str | None = Field(None, max_length=100)
    phone: str | None = Field(None, max_length=20)
    address: str | None = None
    city: str | None = Field(None, max_length=100)
    country: str | None = Field(None, max_length=100)
    is_active: bool | None = None


class CustomerResponse(CustomerBase):
    """Schema for customer response."""

    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
