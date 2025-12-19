"""Dashboard schemas."""

from datetime import date
from decimal import Decimal
from pydantic import BaseModel


class DashboardStats(BaseModel):
    """Dashboard statistics schema."""

    total_revenue: Decimal
    total_orders: int
    total_customers: int
    conversion_rate: float
    revenue_trend: float
    orders_trend: float
    customers_trend: float
    conversion_trend: float


class SalesData(BaseModel):
    """Sales data point schema."""

    date: date
    revenue: Decimal
    orders: int


class TopProduct(BaseModel):
    """Top selling product schema."""

    id: int
    name: str
    sales_count: int
    revenue: Decimal


class RecentOrder(BaseModel):
    """Recent order schema."""

    id: int
    order_number: str
    customer_name: str
    amount: Decimal
    status: str
    created_at: str


class DashboardData(BaseModel):
    """Complete dashboard data schema."""

    stats: DashboardStats
    sales_chart: list[SalesData]
    top_products: list[TopProduct]
    recent_orders: list[RecentOrder]
