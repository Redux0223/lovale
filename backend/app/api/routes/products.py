"""Product endpoints."""

import re
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.models.product import Product, ProductCategory
from app.schemas.product import (
    ProductCreate,
    ProductResponse,
    ProductUpdate,
    ProductCategoryCreate,
    ProductCategoryResponse,
)

router = APIRouter()


def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')


@router.get("", response_model=list[ProductResponse])
async def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category_id: int | None = None,
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """List products with filtering."""
    query = select(Product).where(Product.is_active == True)

    if category_id:
        query = query.where(Product.category_id == category_id)

    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))

    query = query.order_by(Product.created_at.desc())
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get a specific product."""
    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return product


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new product."""
    result = await db.execute(
        select(Product).where(Product.sku == product_data.sku)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product with this SKU already exists",
        )

    slug = slugify(product_data.name)
    base_slug = slug
    counter = 1
    while True:
        result = await db.execute(
            select(Product).where(Product.slug == slug)
        )
        if not result.scalar_one_or_none():
            break
        slug = f"{base_slug}-{counter}"
        counter += 1

    product = Product(
        **product_data.model_dump(),
        slug=slug,
    )

    db.add(product)
    await db.commit()
    await db.refresh(product)

    return product


@router.patch("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a product."""
    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    update_data = product_data.model_dump(exclude_unset=True)

    if "name" in update_data:
        update_data["slug"] = slugify(update_data["name"])

    for field, value in update_data.items():
        setattr(product, field, value)

    await db.commit()
    await db.refresh(product)

    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Soft delete a product."""
    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    product.is_active = False
    await db.commit()


@router.get("/categories/", response_model=list[ProductCategoryResponse])
async def list_categories(db: AsyncSession = Depends(get_db)):
    """List product categories."""
    result = await db.execute(select(ProductCategory))
    return result.scalars().all()


@router.post("/categories/", response_model=ProductCategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: ProductCategoryCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a product category."""
    slug = slugify(category_data.name)

    category = ProductCategory(
        name=category_data.name,
        slug=slug,
        description=category_data.description,
    )

    db.add(category)
    await db.commit()
    await db.refresh(category)

    return category
