"""Database configuration and session management."""

import os
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import declarative_base

from app.core.config import settings

CPU_CORES = os.cpu_count() or 4

def get_engine_kwargs() -> dict:
    """Get engine kwargs based on database type."""
    if "sqlite" in settings.DATABASE_URL:
        return {"echo": settings.DEBUG}
    else:
        return {
            "pool_size": max(4 * CPU_CORES, 20),
            "max_overflow": max(8 * CPU_CORES, 40),
            "pool_pre_ping": True,
            "pool_recycle": 3600,
            "pool_timeout": 30,
            "echo": settings.DEBUG,
        }

engine = create_async_engine(settings.DATABASE_URL, **get_engine_kwargs())

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for getting async database sessions."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
