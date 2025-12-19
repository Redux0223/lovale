"""Order endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderUpdate,
    OrderListResponse,
)

router = APIRouter()


def generate_order_number() -> str:
    """Generate a unique order number."""
    import uuid
    return f"ORD-{uuid.uuid4().hex[:8].upper()}"


@router.get("", response_model=OrderListResponse)
async def list_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: OrderStatus | None = None,
    db: AsyncSession = Depends(get_db),
):
    """List orders with pagination."""
    query = select(Order).options(selectinload(Order.items))

    if status:
        query = query.where(Order.status == status)

    total_query = select(func.count(Order.id))
    if status:
        total_query = total_query.where(Order.status == status)

    total_result = await db.execute(total_query)
    total = total_result.scalar() or 0

    query = query.order_by(Order.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    orders = result.scalars().all()

    pages = (total + page_size - 1) // page_size

    return OrderListResponse(
        items=orders,
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get a specific order."""
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    return order


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new order."""
    from decimal import Decimal

    subtotal = Decimal("0")
    order_items = []

    for item_data in order_data.items:
        result = await db.execute(
            select(Product).where(Product.id == item_data.product_id)
        )
        product = result.scalar_one_or_none()

        if not product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product {item_data.product_id} not found",
            )

        item_total = product.price * item_data.quantity
        subtotal += item_total

        order_items.append(
            OrderItem(
                product_id=product.id,
                product_name=product.name,
                quantity=item_data.quantity,
                unit_price=product.price,
                total_price=item_total,
            )
        )

    tax_amount = subtotal * Decimal("0.13")
    total_amount = subtotal + tax_amount

    order = Order(
        order_number=generate_order_number(),
        customer_id=order_data.customer_id,
        subtotal=subtotal,
        tax_amount=tax_amount,
        total_amount=total_amount,
        shipping_address=order_data.shipping_address,
        notes=order_data.notes,
        items=order_items,
    )

    db.add(order)
    await db.commit()
    await db.refresh(order)

    return order


@router.patch("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: int,
    order_data: OrderUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update an order."""
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    update_data = order_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(order, field, value)

    await db.commit()
    await db.refresh(order)

    return order
