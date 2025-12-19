"""Rate limiting middleware using sliding window algorithm."""

from datetime import datetime
from typing import Callable

from fastapi import Request, Response, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings


class InMemoryRateLimiter:
    """Simple in-memory rate limiter for development."""

    def __init__(self, limit: int = 100, window: int = 60):
        self.limit = limit
        self.window = window
        self._requests: dict[str, list[float]] = {}

    def is_allowed(self, identifier: str) -> tuple[bool, int, int]:
        """
        Check if request is allowed.
        Returns: (allowed, remaining, reset_time)
        """
        now = datetime.utcnow().timestamp()
        window_start = now - self.window

        if identifier not in self._requests:
            self._requests[identifier] = []

        self._requests[identifier] = [
            ts for ts in self._requests[identifier] if ts > window_start
        ]

        request_count = len(self._requests[identifier])

        if request_count < self.limit:
            self._requests[identifier].append(now)
            remaining = self.limit - request_count - 1
            reset_time = int(now) + self.window
            return True, remaining, reset_time
        else:
            remaining = 0
            reset_time = int(now) + self.window
            return False, remaining, reset_time


rate_limiter = InMemoryRateLimiter(
    limit=settings.RATE_LIMIT_PER_MINUTE,
    window=60,
)


class RateLimiterMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware."""

    async def dispatch(self, request: Request, call_next) -> Response:
        if request.url.path.startswith("/api/v1/health"):
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        identifier = f"{client_ip}:{request.url.path}"

        allowed, remaining, reset_time = rate_limiter.is_allowed(identifier)

        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded",
                headers={
                    "X-RateLimit-Limit": str(settings.RATE_LIMIT_PER_MINUTE),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(reset_time),
                    "Retry-After": str(60),
                },
            )

        response = await call_next(request)

        response.headers["X-RateLimit-Limit"] = str(settings.RATE_LIMIT_PER_MINUTE)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(reset_time)

        return response
