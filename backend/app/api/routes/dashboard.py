"""Dashboard endpoints with mock data."""

from datetime import date, timedelta
from decimal import Decimal
from fastapi import APIRouter

from app.schemas.dashboard import (
    DashboardStats,
    SalesData,
    TopProduct,
    RecentOrder,
    DashboardData,
)

router = APIRouter()


def generate_mock_sales_data(days: int = 30) -> list[SalesData]:
    """Generate mock sales data for the chart."""
    import random
    
    data = []
    base_revenue = 50000
    base_orders = 50
    
    for i in range(days):
        day = date.today() - timedelta(days=days - i - 1)
        variation = random.uniform(0.7, 1.3)
        data.append(
            SalesData(
                date=day,
                revenue=Decimal(str(round(base_revenue * variation, 2))),
                orders=int(base_orders * variation),
            )
        )
    
    return data


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """Get dashboard statistics."""
    return DashboardStats(
        total_revenue=Decimal("2847392.00"),
        total_orders=1847,
        total_customers=12453,
        conversion_rate=3.24,
        revenue_trend=12.5,
        orders_trend=8.2,
        customers_trend=-2.4,
        conversion_trend=0.8,
    )


@router.get("/sales-chart", response_model=list[SalesData])
async def get_sales_chart(days: int = 30):
    """Get sales chart data."""
    return generate_mock_sales_data(days)


@router.get("/top-products", response_model=list[TopProduct])
async def get_top_products():
    """Get top selling products."""
    return [
        TopProduct(id=1, name="iPhone 15 Pro Max", sales_count=234, revenue=Decimal("280000")),
        TopProduct(id=2, name="MacBook Pro 14寸", sales_count=156, revenue=Decimal("312000")),
        TopProduct(id=3, name="AirPods Pro 2", sales_count=423, revenue=Decimal("84600")),
        TopProduct(id=4, name="Apple Watch S9", sales_count=189, revenue=Decimal("56700")),
        TopProduct(id=5, name="iPad Pro 12.9", sales_count=98, revenue=Decimal("78400")),
    ]


@router.get("/recent-orders", response_model=list[RecentOrder])
async def get_recent_orders():
    """Get recent orders."""
    return [
        RecentOrder(id=1, order_number="ORD-001", customer_name="张三", amount=Decimal("1299"), status="pending", created_at="5分钟前"),
        RecentOrder(id=2, order_number="ORD-002", customer_name="李四", amount=Decimal("2599"), status="processing", created_at="12分钟前"),
        RecentOrder(id=3, order_number="ORD-003", customer_name="王五", amount=Decimal("899"), status="completed", created_at="25分钟前"),
        RecentOrder(id=4, order_number="ORD-004", customer_name="赵六", amount=Decimal("3499"), status="completed", created_at="1小时前"),
        RecentOrder(id=5, order_number="ORD-005", customer_name="钱七", amount=Decimal("1799"), status="pending", created_at="2小时前"),
    ]


@router.get("", response_model=DashboardData)
async def get_dashboard_data():
    """Get all dashboard data in one request."""
    return DashboardData(
        stats=await get_dashboard_stats(),
        sales_chart=generate_mock_sales_data(30),
        top_products=await get_top_products(),
        recent_orders=await get_recent_orders(),
    )
