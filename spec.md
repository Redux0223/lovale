# Saleor E-Commerce Dashboard - 技术规格文档

> **项目名称**: 基于Saleor的电商后台管理系统  
> **版本**: v1.0.0  
> **最后更新**: 2024年12月

---

## 目录

1. [项目概述](#1-项目概述)
2. [系统架构](#2-系统架构)
3. [前端技术规格](#3-前端技术规格)
4. [后端技术规格](#4-后端技术规格)
5. [数据库设计](#5-数据库设计)
6. [API设计](#6-api设计)
7. [安全规格](#7-安全规格)
8. [部署规格](#8-部署规格)
9. [测试规格](#9-测试规格)
10. [交付清单](#10-交付清单)

---

## 1. 项目概述

### 1.1 项目背景

本项目旨在开发一个**基于Saleor架构的电商后台管理系统Dashboard**，为电商运营人员提供数据可视化、订单管理、产品管理、客户分析等核心功能。系统强调：
- 精美的交互动效与视觉设计
- 高性能的后端架构
- AI辅助的智能分析能力

### 1.2 目标用户

| 角色 | 需求 |
|------|------|
| 运营管理者 | 实时销售数据、KPI监控 |
| 商品运营 | 产品管理、库存监控 |
| 客服团队 | 订单查询、客户信息 |
| 数据分析师 | 深度报表、趋势分析 |

### 1.3 核心功能模块

```
┌─────────────────────────────────────────────────────────────┐
│                    Dashboard Overview                        │
├─────────────┬─────────────┬─────────────┬─────────────────────┤
│   Orders    │  Products   │  Customers  │     Analytics       │
│   订单管理   │   产品管理   │   客户管理   │      数据分析        │
├─────────────┴─────────────┴─────────────┴─────────────────────┤
│                      AI Assistant                            │
│                     智能助手模块                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                 │
│     React 18 + TypeScript + Vite + TailwindCSS                  │
│     + Framer Motion + GSAP + Tremor Charts                      │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API / WebSocket
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway                                 │
│                        FastAPI                                   │
│              (Authentication, Rate Limiting, CORS)              │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   PostgreSQL  │  │      Redis      │  │    OpenAI API   │
│   主数据库     │  │   缓存/会话      │  │    AI服务       │
└───────────────┘  └─────────────────┘  └─────────────────┘
```

### 2.2 技术栈明细

| 层级 | 技术选型 | 版本要求 |
|------|----------|----------|
| **前端框架** | React | ^18.3.0 |
| **构建工具** | Vite | ^5.4.0 |
| **类型系统** | TypeScript | ^5.4.0 |
| **样式方案** | TailwindCSS | ^3.4.0 |
| **UI组件** | shadcn/ui | latest |
| **动画库** | Framer Motion + GSAP | ^11.0 / ^3.12 |
| **图表库** | Tremor + Recharts | ^3.0 / ^2.12 |
| **状态管理** | Zustand + React Query | ^4.5 / ^5.0 |
| **路由** | React Router | ^6.20 |
| **后端框架** | FastAPI | ^0.109.0 |
| **ASGI服务器** | Uvicorn | ^0.27.0 |
| **ORM** | SQLAlchemy | ^2.0.0 |
| **数据库** | PostgreSQL | ^15.0 |
| **缓存** | Redis | ^7.0 |
| **AI SDK** | OpenAI Python | ^1.12.0 |

---

## 3. 前端技术规格

### 3.1 项目结构

```
frontend/
├── public/
│   └── fonts/                    # 本地字体文件
├── src/
│   ├── components/
│   │   ├── ui/                   # 基础UI组件 (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── charts/               # 图表组件
│   │   │   ├── AreaChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── KPICard.tsx
│   │   │   └── SparkLine.tsx
│   │   ├── layout/               # 布局组件
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── DashboardLayout.tsx
│   │   └── common/               # 通用业务组件
│   │       ├── DataTable.tsx
│   │       ├── StatusBadge.tsx
│   │       └── SearchBar.tsx
│   │
│   ├── features/                 # 功能模块
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── index.tsx
│   │   ├── orders/
│   │   │   ├── components/
│   │   │   │   ├── OrderList.tsx
│   │   │   │   ├── OrderDetail.tsx
│   │   │   │   └── OrderFilters.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useOrders.ts
│   │   │   └── index.tsx
│   │   ├── products/
│   │   ├── customers/
│   │   ├── analytics/
│   │   └── ai-assistant/
│   │
│   ├── hooks/                    # 全局Hooks
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── lib/                      # 工具库
│   │   ├── api.ts               # API客户端
│   │   ├── utils.ts             # 通用工具
│   │   └── animations.ts        # 动画预设
│   │
│   ├── stores/                   # Zustand状态
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   │
│   ├── styles/
│   │   ├── tokens/
│   │   │   ├── primitives.css   # 原始Token
│   │   │   └── semantic.css     # 语义Token
│   │   ├── globals.css
│   │   └── animations.css
│   │
│   ├── types/                    # TypeScript类型
│   │   ├── api.ts
│   │   ├── models.ts
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── .env.example
```

### 3.2 Design Tokens规格

#### 颜色系统 (高级白+银色)

```css
/* primitives.css - 原始色值 */
:root {
  /* 白色系 */
  --white-pure: #ffffff;
  --white-50: #fafafa;
  --white-100: #f5f5f5;
  --white-200: #eeeeee;
  
  /* 银色系 */
  --silver-50: #f8f9fa;
  --silver-100: #e9ecef;
  --silver-200: #dee2e6;
  --silver-300: #ced4da;
  --silver-400: #adb5bd;
  --silver-500: #6c757d;
  
  /* 深色系 (文本) */
  --charcoal-600: #52525b;
  --charcoal-700: #3f3f46;
  --charcoal-800: #27272a;
  --charcoal-900: #18181b;
  
  /* 强调色 */
  --accent-indigo: #6366f1;
  --accent-emerald: #10b981;
  --accent-amber: #f59e0b;
  --accent-rose: #f43f5e;
  
  /* 渐变 */
  --gradient-silver: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  --gradient-premium: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* semantic.css - 语义化Token */
:root {
  /* 背景层级 */
  --background-base: var(--white-50);
  --background-elevated: var(--white-pure);
  --background-subtle: var(--silver-50);
  --background-muted: var(--silver-100);
  --background-interactive: var(--silver-200);
  
  /* 文本层级 */
  --text-primary: var(--charcoal-900);
  --text-secondary: var(--charcoal-600);
  --text-tertiary: var(--silver-500);
  --text-disabled: var(--silver-400);
  --text-inverse: var(--white-pure);
  
  /* 边框 */
  --border-default: var(--silver-200);
  --border-subtle: var(--silver-100);
  --border-strong: var(--silver-300);
  
  /* 交互状态 */
  --state-hover: var(--silver-100);
  --state-active: var(--silver-200);
  --state-focus-ring: var(--accent-indigo);
  
  /* 语义颜色 */
  --semantic-success: var(--accent-emerald);
  --semantic-warning: var(--accent-amber);
  --semantic-error: var(--accent-rose);
  --semantic-info: var(--accent-indigo);
}
```

#### 间距系统

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
}
```

#### 字体系统

```css
:root {
  /* 字体族 */
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* 字号 */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  
  /* 行高 */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* 字重 */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

#### 动画Token

```css
:root {
  /* 时长 */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 700ms;
  
  /* 缓动曲线 */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### 3.3 组件规格

#### 核心UI组件

| 组件 | 描述 | 动效要求 |
|------|------|----------|
| `Button` | 按钮 | hover缩放、ripple效果 |
| `Card` | 卡片容器 | hover阴影提升、玻璃态效果 |
| `Input` | 输入框 | focus边框动画、标签浮动 |
| `Select` | 下拉选择 | 下拉展开动画 |
| `Modal` | 模态框 | 淡入缩放、背景模糊 |
| `Toast` | 提示消息 | 滑入滑出动画 |
| `Skeleton` | 加载骨架 | 闪烁动画 |
| `DataTable` | 数据表格 | 行hover高亮、排序动画 |

#### Dashboard专用组件

| 组件 | 描述 |
|------|------|
| `KPICard` | KPI指标卡片，含数值动画、趋势箭头、Sparkline |
| `AreaChart` | 面积图，支持渐变填充、工具提示动画 |
| `BarChart` | 柱状图，柱子依次入场动画 |
| `PieChart` | 饼图/环形图，扇区展开动画 |
| `TrendIndicator` | 趋势指示器，上升绿色/下降红色 |
| `ActivityFeed` | 活动流，新消息滑入动画 |
| `StatusBadge` | 状态徽章，脉冲动画(pending状态) |

### 3.4 页面规格

#### Dashboard首页布局 (Bento Grid)

```
┌─────────────────────────────────────────────────────────────────┐
│  Header: Logo + Search + Notifications + User Menu              │
├───────┬─────────────────────────────────────────────────────────┤
│       │ ┌─────────┬─────────┬─────────┬─────────┐               │
│       │ │ 总销售额 │ 订单数   │ 客户数   │ 转化率   │  KPI Row   │
│  S    │ └─────────┴─────────┴─────────┴─────────┘               │
│  i    │ ┌─────────────────────────────┬─────────────────────────┤
│  d    │ │                             │                         │
│  e    │ │     销售趋势图 (Area)        │   订单状态分布 (Pie)     │
│  b    │ │                             │                         │
│  a    │ ├─────────────────────────────┼─────────────────────────┤
│  r    │ │                             │                         │
│       │ │     热销产品 (Bar)           │   最近订单 (Table)       │
│       │ │                             │                         │
│       │ └─────────────────────────────┴─────────────────────────┘
└───────┴─────────────────────────────────────────────────────────┘
```

#### 响应式断点

```javascript
const breakpoints = {
  sm: '640px',   // 移动端
  md: '768px',   // 平板
  lg: '1024px',  // 小屏桌面
  xl: '1280px',  // 标准桌面
  '2xl': '1536px' // 大屏
};
```

### 3.5 动效规格

#### 页面过渡

```typescript
// 使用 Framer Motion
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
};
```

#### 列表入场动画

```typescript
// stagger动画
const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }
  }
};
```

#### 数值动画

```typescript
// 使用 framer-motion 的 useSpring
import { useSpring, animated } from '@react-spring/web';

function AnimatedNumber({ value }: { value: number }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    config: { mass: 1, tension: 20, friction: 10 }
  });
  
  return <animated.span>{number.to(n => n.toFixed(0))}</animated.span>;
}
```

---

## 4. 后端技术规格

### 4.1 项目结构

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                   # FastAPI应用入口
│   ├── config.py                 # 配置管理
│   │
│   ├── api/                      # API路由
│   │   ├── __init__.py
│   │   ├── deps.py              # 依赖注入
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── router.py        # 路由聚合
│   │   │   ├── auth.py          # 认证路由
│   │   │   ├── dashboard.py     # Dashboard路由
│   │   │   ├── orders.py        # 订单路由
│   │   │   ├── products.py      # 产品路由
│   │   │   ├── customers.py     # 客户路由
│   │   │   ├── analytics.py     # 分析路由
│   │   │   └── ai.py            # AI功能路由
│   │   └── health.py            # 健康检查
│   │
│   ├── core/                     # 核心模块
│   │   ├── __init__.py
│   │   ├── security.py          # 安全相关
│   │   ├── database.py          # 数据库连接
│   │   └── redis.py             # Redis连接
│   │
│   ├── models/                   # SQLAlchemy模型
│   │   ├── __init__.py
│   │   ├── base.py              # 基础模型
│   │   ├── user.py
│   │   ├── order.py
│   │   ├── product.py
│   │   └── customer.py
│   │
│   ├── schemas/                  # Pydantic模型
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── order.py
│   │   ├── product.py
│   │   ├── customer.py
│   │   └── analytics.py
│   │
│   ├── services/                 # 业务逻辑
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── order_service.py
│   │   ├── product_service.py
│   │   ├── analytics_service.py
│   │   └── ai_service.py
│   │
│   └── utils/                    # 工具函数
│       ├── __init__.py
│       └── helpers.py
│
├── alembic/                      # 数据库迁移
│   ├── versions/
│   ├── env.py
│   └── alembic.ini
│
├── tests/                        # 测试
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_orders.py
│   └── test_analytics.py
│
├── requirements.txt
├── requirements-dev.txt
├── Dockerfile
├── .env.example
└── pyproject.toml
```

### 4.2 依赖清单

```txt
# requirements.txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
gunicorn==21.2.0

# Database
sqlalchemy[asyncio]==2.0.25
asyncpg==0.29.0
alembic==1.13.1

# Redis
redis==5.0.1
aioredis==2.0.1

# Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6

# Validation
pydantic==2.5.3
pydantic-settings==2.1.0
email-validator==2.1.0

# OpenAI
openai==1.12.0

# Utilities
httpx==0.26.0
python-dateutil==2.8.2

# Testing (dev)
pytest==7.4.4
pytest-asyncio==0.23.3
pytest-cov==4.1.0
httpx==0.26.0
```

### 4.3 配置管理

```python
# app/config.py
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Saleor Dashboard API"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"
    
    # Security
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"
    
    # Database
    DATABASE_URL: str
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    CACHE_TTL: int = 3600
    
    # OpenAI
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4o-mini"
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
```

### 4.4 数据库连接

```python
# app/core/database.py
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.config import get_settings

settings = get_settings()

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_pre_ping=True,
    pool_recycle=3600,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

---

## 5. 数据库设计

### 5.1 ER图

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Customer  │       │   Product   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ email       │       │ email       │       │ name        │
│ hashed_pwd  │       │ first_name  │       │ description │
│ role        │       │ last_name   │       │ price       │
│ is_active   │       │ phone       │       │ stock       │
│ created_at  │       │ created_at  │       │ category_id │
└─────────────┘       │ user_id(FK) │       │ created_at  │
                      └──────┬──────┘       └──────┬──────┘
                             │                     │
                             │     ┌───────────────┘
                             │     │
                      ┌──────▼─────▼───┐
                      │     Order      │
                      ├────────────────┤
                      │ id (PK)        │
                      │ order_number   │
                      │ customer_id(FK)│
                      │ status         │
                      │ total_amount   │
                      │ created_at     │
                      │ updated_at     │
                      └───────┬────────┘
                              │
                      ┌───────▼────────┐
                      │   OrderItem    │
                      ├────────────────┤
                      │ id (PK)        │
                      │ order_id (FK)  │
                      │ product_id(FK) │
                      │ quantity       │
                      │ unit_price     │
                      └────────────────┘
```

### 5.2 核心模型定义

```python
# app/models/order.py
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    total_amount = Column(Numeric(10, 2), nullable=False)
    shipping_address = Column(String(500))
    notes = Column(String(1000))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    customer = relationship("Customer", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product")
```

### 5.3 索引策略

```sql
-- 订单表索引
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- 产品表索引
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_price ON products(price);

-- 客户表索引
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_created_at ON customers(created_at DESC);
```

---

## 6. API设计

### 6.1 API端点清单

#### 认证模块 `/api/v1/auth`

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | `/login` | 用户登录 |
| POST | `/refresh` | 刷新Token |
| POST | `/logout` | 用户登出 |
| GET | `/me` | 获取当前用户 |

#### Dashboard模块 `/api/v1/dashboard`

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/overview` | 获取总览数据(KPIs) |
| GET | `/sales-trend` | 销售趋势数据 |
| GET | `/order-status` | 订单状态分布 |
| GET | `/top-products` | 热销产品排行 |
| GET | `/recent-orders` | 最近订单列表 |

#### 订单模块 `/api/v1/orders`

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/` | 获取订单列表(分页) |
| GET | `/{id}` | 获取订单详情 |
| POST | `/` | 创建订单 |
| PUT | `/{id}` | 更新订单 |
| PATCH | `/{id}/status` | 更新订单状态 |
| DELETE | `/{id}` | 删除订单 |

#### 产品模块 `/api/v1/products`

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/` | 获取产品列表 |
| GET | `/{id}` | 获取产品详情 |
| POST | `/` | 创建产品 |
| PUT | `/{id}` | 更新产品 |
| DELETE | `/{id}` | 删除产品 |
| PATCH | `/{id}/stock` | 更新库存 |

#### 客户模块 `/api/v1/customers`

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/` | 获取客户列表 |
| GET | `/{id}` | 获取客户详情 |
| GET | `/{id}/orders` | 获取客户订单 |
| POST | `/` | 创建客户 |
| PUT | `/{id}` | 更新客户 |

#### 分析模块 `/api/v1/analytics`

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/sales` | 销售分析报表 |
| GET | `/customers` | 客户分析报表 |
| GET | `/products` | 产品分析报表 |
| GET | `/export` | 导出报表 |

#### AI模块 `/api/v1/ai`

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | `/generate-description` | 生成产品描述 |
| POST | `/analyze-sales` | 销售数据分析 |
| POST | `/chat` | AI助手对话 |
| POST | `/stream-chat` | 流式AI对话 |

### 6.2 请求/响应示例

#### 获取Dashboard总览

```http
GET /api/v1/dashboard/overview
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total_revenue": {
    "value": 284739.50,
    "change": 12.5,
    "trend": "up"
  },
  "total_orders": {
    "value": 1247,
    "change": 8.3,
    "trend": "up"
  },
  "total_customers": {
    "value": 892,
    "change": 15.2,
    "trend": "up"
  },
  "conversion_rate": {
    "value": 3.24,
    "change": -0.5,
    "trend": "down"
  },
  "period": {
    "start": "2024-11-01",
    "end": "2024-11-30"
  }
}
```

#### 分页查询订单

```http
GET /api/v1/orders?page=1&limit=20&status=pending&sort=-created_at
Authorization: Bearer <token>
```

**Response:**
```json
{
  "items": [
    {
      "id": 1001,
      "order_number": "ORD-20241201-001",
      "customer": {
        "id": 501,
        "name": "张三",
        "email": "zhangsan@example.com"
      },
      "status": "pending",
      "total_amount": 1299.00,
      "items_count": 3,
      "created_at": "2024-12-01T10:30:00Z"
    }
  ],
  "total": 156,
  "page": 1,
  "limit": 20,
  "pages": 8
}
```

### 6.3 错误响应格式

```json
{
  "detail": {
    "code": "ORDER_NOT_FOUND",
    "message": "订单不存在",
    "params": {
      "order_id": 9999
    }
  }
}
```

---

## 7. 安全规格

### 7.1 认证流程

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│  Login   │────▶│  Server  │
└──────────┘     └──────────┘     └──────────┘
     │                                  │
     │        Access Token (15min)      │
     │◀─────────────────────────────────│
     │        Refresh Token (7d)        │
     │◀─────────────────────────────────│
     │                                  │
     │       API Request + Token        │
     │─────────────────────────────────▶│
     │                                  │
     │        Token Expired (401)       │
     │◀─────────────────────────────────│
     │                                  │
     │       Refresh Token Request      │
     │─────────────────────────────────▶│
     │                                  │
     │        New Access Token          │
     │◀─────────────────────────────────│
```

### 7.2 安全配置

```python
# CORS
CORS_ORIGINS = ["https://dashboard.yoursite.com"]
CORS_ALLOW_CREDENTIALS = True
CORS_MAX_AGE = 600

# Rate Limiting
RATE_LIMIT_DEFAULT = "100/minute"
RATE_LIMIT_AUTH = "10/minute"

# JWT
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE = 15  # minutes
REFRESH_TOKEN_EXPIRE = 7  # days

# Password
PASSWORD_MIN_LENGTH = 8
PASSWORD_REQUIRE_UPPERCASE = True
PASSWORD_REQUIRE_NUMBER = True
```

### 7.3 安全检查清单

- [ ] 所有API端点需要认证(除登录/健康检查)
- [ ] 敏感数据传输使用HTTPS
- [ ] 密码使用bcrypt哈希存储
- [ ] SQL注入防护(使用ORM参数化查询)
- [ ] XSS防护(响应头设置)
- [ ] CSRF防护(SameSite Cookie)
- [ ] 速率限制防止暴力攻击
- [ ] 日志不记录敏感信息
- [ ] 环境变量管理密钥

---

## 8. 部署规格

### 8.1 Docker配置

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY ./app ./app

# Run with gunicorn
CMD ["gunicorn", "app.main:app", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "--workers", "4"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://user:pass@db:5432/saleor
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
  
  frontend:
    build: ./frontend
    ports:
      - "5173:80"
    depends_on:
      - backend
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=saleor
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 8.2 环境变量

```bash
# .env.example

# Application
DEBUG=false
SECRET_KEY=your-super-secret-key-here

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/saleor_dashboard

# Redis
REDIS_URL=redis://localhost:6379

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# CORS
CORS_ORIGINS=["http://localhost:5173"]
```

---

## 9. 测试规格

### 9.1 测试覆盖要求

| 模块 | 最低覆盖率 |
|------|-----------|
| API路由 | 80% |
| 业务逻辑 | 85% |
| 工具函数 | 90% |
| 总体 | 75% |

### 9.2 测试类型

#### 单元测试
```python
# tests/test_order_service.py
import pytest
from app.services.order_service import OrderService

@pytest.mark.asyncio
async def test_create_order():
    service = OrderService()
    order = await service.create_order(
        customer_id=1,
        items=[{"product_id": 1, "quantity": 2}]
    )
    assert order.status == "pending"
    assert order.total_amount > 0
```

#### API集成测试
```python
# tests/test_api_orders.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_orders(client: AsyncClient, auth_headers):
    response = await client.get("/api/v1/orders", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
```

### 9.3 前端测试

```typescript
// tests/components/KPICard.test.tsx
import { render, screen } from '@testing-library/react';
import { KPICard } from '@/components/charts/KPICard';

describe('KPICard', () => {
  it('renders value correctly', () => {
    render(
      <KPICard 
        title="Total Revenue" 
        value={28473950} 
        format="currency"
        trend={12.5}
      />
    );
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText(/¥284,739/)).toBeInTheDocument();
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
  });
});
```

---

## 10. 交付清单

### 10.1 代码交付物

```
项目根目录/
├── frontend/                 # 前端源码
├── backend/                  # 后端源码
├── docs/                     # 文档
│   ├── architecture.md      # 架构文档
│   ├── api-reference.md     # API文档
│   └── deployment.md        # 部署文档
├── docker-compose.yml       # Docker编排
├── README.md                # 项目说明
└── .env.example             # 环境变量模板
```

### 10.2 文档交付物

| 文档 | 描述 | 格式 |
|------|------|------|
| README.md | 项目概述、快速开始 | Markdown |
| architecture.md | 系统架构、技术选型 | Markdown + 图 |
| api-reference.md | API详细文档 | OpenAPI/Swagger |
| deployment.md | 部署指南 | Markdown |
| 演示PPT | 10分钟演示材料 | PPTX/PDF |

### 10.3 演示材料

#### PPT结构建议 (10分钟)

1. **项目介绍** (2分钟)
   - 项目背景与问题定义
   - 目标用户画像
   - 核心价值主张

2. **技术架构** (3分钟)
   - 整体架构图
   - 技术选型理由
   - 核心设计决策

3. **功能演示** (4分钟)
   - Dashboard总览
   - 订单管理流程
   - AI辅助功能
   - 交互动效展示

4. **总结展望** (1分钟)
   - 项目价值总结
   - 未来改进方向

### 10.4 验收标准

| 项目 | 验收条件 |
|------|----------|
| 功能完整性 | 所有核心功能可正常使用 |
| 界面响应 | 页面加载<3秒，交互响应<100ms |
| API性能 | P95延迟<500ms |
| 测试通过 | 所有测试用例通过，覆盖率>75% |
| 文档完整 | 所有文档齐全且内容准确 |
| 代码质量 | 无ESLint/Ruff严重警告 |

---

## 11. 高级前端交互规格 (增强版)

### 11.1 微交互组件规格

#### KPI卡片动画规格

```typescript
// components/charts/KPICard.tsx
import { motion } from "framer-motion";
import { AnimateNumber } from "motion/react";

interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: number;
  trendType: "up" | "down" | "neutral";
  icon?: React.ElementType;
}

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25 
    }
  },
  hover: { 
    y: -4, 
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    transition: { duration: 0.2 }
  }
};

export function KPICard({ title, value, prefix, trend, trendType, icon: Icon }: KPICardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="bg-card rounded-xl border border-border p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-foreground-muted">{title}</span>
        {Icon && <Icon className="h-4 w-4 text-foreground-muted" />}
      </div>
      <div className="text-3xl font-bold text-foreground font-display">
        {prefix}
        <AnimateNumber
          value={value}
          format={(v) => v.toLocaleString('zh-CN')}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
      <TrendIndicator value={trend} type={trendType} />
    </motion.div>
  );
}
```

#### 趋势指示器

```typescript
const TrendIndicator = ({ value, type }: { value: number; type: "up" | "down" | "neutral" }) => {
  const colors = {
    up: "text-accent-success bg-accent-success/10",
    down: "text-accent-error bg-accent-error/10",
    neutral: "text-foreground-muted bg-background-muted"
  };
  
  return (
    <motion.div 
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${colors[type]}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 }}
    >
      <motion.span
        animate={{ rotate: type === "up" ? 0 : type === "down" ? 180 : 90 }}
      >
        ↑
      </motion.span>
      <span className="ml-1">{Math.abs(value)}%</span>
    </motion.div>
  );
};
```

### 11.2 全屏Bento布局规格

```typescript
// components/layout/BentoDashboard.tsx
const BENTO_LAYOUT = {
  // 12列网格，全屏铺满
  grid: "grid-cols-12",
  gap: "gap-4",
  padding: "p-4",
  height: "min-h-screen",
  
  // 卡片尺寸配置
  cards: {
    kpiRow: "col-span-3",           // 4个KPI卡片
    mainChart: "col-span-8 row-span-2",  // 主图表
    sidePanel: "col-span-4 row-span-2",  // 侧边面板
    tableArea: "col-span-12",        // 全宽表格
    smallWidget: "col-span-3",       // 小组件
  }
};

// 响应式断点
const RESPONSIVE_GRID = {
  xl: "xl:grid-cols-12",
  lg: "lg:grid-cols-8",
  md: "md:grid-cols-6",
  sm: "sm:grid-cols-4",
  default: "grid-cols-2"
};
```

### 11.3 Stagger入场动画配置

```typescript
// lib/animations.ts
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
};

// GSAP ScrollTrigger配置
export const scrollRevealConfig = {
  trigger: ".scroll-reveal",
  start: "top 85%",
  toggleActions: "play none none reverse",
  stagger: 0.1,
  from: { y: 60, opacity: 0 },
  to: { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
};
```

### 11.4 动态数据表格规格

```typescript
// components/common/DataTable.tsx
import { useVirtualizer } from "@tanstack/react-virtual";
import { motion, AnimatePresence } from "framer-motion";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  virtualScrollEnabled?: boolean;
  rowHeight?: number;
  maxHeight?: number;
}

// 表格行动画变体
const rowVariants = {
  initial: { opacity: 0, x: -20 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.3 }
  }),
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  hover: { 
    backgroundColor: "var(--state-hover)",
    transition: { duration: 0.15 }
  }
};

// 单元格更新高亮
const cellUpdateVariants = {
  initial: { backgroundColor: "transparent" },
  highlight: {
    backgroundColor: ["transparent", "var(--accent-success)", "transparent"],
    transition: { duration: 0.8 }
  }
};
```

### 11.5 Lenis平滑滚动配置

```typescript
// lib/smoothScroll.ts
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  // 同步GSAP
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}
```

---

## 12. 工业级后端规格 (增强版)

### 12.1 高并发架构配置

```python
# app/core/database.py
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
import os

CPU_CORES = os.cpu_count() or 4

engine = create_async_engine(
    settings.DATABASE_URL,
    # 连接池配置 - 工业级
    pool_size=max(4 * CPU_CORES, 20),
    max_overflow=max(8 * CPU_CORES, 40),
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_timeout=30,
    
    # 性能优化
    echo=False,
    
    # 连接参数
    connect_args={
        "server_settings": {
            "jit": "off",
            "statement_timeout": "30000",
            "idle_in_transaction_session_timeout": "60000",
        },
        "command_timeout": 30,
    }
)
```

### 12.2 Redis滑动窗口限流

```python
# app/core/rate_limiter.py
from datetime import datetime
import redis.asyncio as redis

class SlidingWindowRateLimiter:
    def __init__(
        self,
        redis_client: redis.Redis,
        limit: int = 100,
        window: int = 60
    ):
        self.redis = redis_client
        self.limit = limit
        self.window = window
    
    async def is_allowed(self, identifier: str) -> tuple[bool, int, int]:
        """
        返回: (是否允许, 剩余配额, 重置时间)
        """
        key = f"ratelimit:{identifier}"
        now = datetime.utcnow().timestamp()
        window_start = now - self.window
        
        async with self.redis.pipeline(transaction=True) as pipe:
            pipe.zremrangebyscore(key, 0, window_start)
            pipe.zadd(key, {str(now): now})
            pipe.zcard(key)
            pipe.expire(key, self.window)
            results = await pipe.execute()
        
        request_count = results[2]
        remaining = max(0, self.limit - request_count)
        reset_time = int(now) + self.window
        
        return request_count <= self.limit, remaining, reset_time
```

### 12.3 断路器实现

```python
# app/core/circuit_breaker.py
from enum import Enum
from datetime import datetime, timedelta
from functools import wraps
import asyncio

class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

class CircuitBreaker:
    def __init__(
        self,
        failure_threshold: int = 5,
        recovery_timeout: int = 30,
        half_open_max_calls: int = 3
    ):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.half_open_max_calls = half_open_max_calls
        
        self._state = CircuitState.CLOSED
        self._failure_count = 0
        self._last_failure_time = None
        self._half_open_calls = 0
        self._lock = asyncio.Lock()
    
    def __call__(self, func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            async with self._lock:
                if self._state == CircuitState.OPEN:
                    if self._should_attempt_reset():
                        self._state = CircuitState.HALF_OPEN
                        self._half_open_calls = 0
                    else:
                        raise CircuitBreakerOpenError(
                            f"Circuit breaker open, retry after {self.recovery_timeout}s"
                        )
            
            try:
                result = await func(*args, **kwargs)
                await self._on_success()
                return result
            except Exception as e:
                await self._on_failure()
                raise
        
        return wrapper
```

### 12.4 OWASP安全中间件

```python
# app/middleware/security.py
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        
        # 安全头
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # CSP (根据实际需求调整)
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https:; "
        )
        
        return response
```

### 12.5 账户锁定策略

```python
# app/services/auth_service.py
class AccountLockoutService:
    def __init__(self, redis_client):
        self.redis = redis_client
        self.max_attempts = 5
        self.observation_window = 900  # 15分钟
        self.lockout_duration = 1800   # 30分钟
    
    async def record_failed_attempt(self, user_id: str) -> dict:
        key = f"login_attempts:{user_id}"
        lockout_key = f"account_locked:{user_id}"
        
        # 检查是否已锁定
        if await self.redis.exists(lockout_key):
            ttl = await self.redis.ttl(lockout_key)
            return {"locked": True, "retry_after": ttl}
        
        attempts = await self.redis.incr(key)
        await self.redis.expire(key, self.observation_window)
        
        if attempts >= self.max_attempts:
            # 指数退避锁定
            lockout_count = await self.redis.incr(f"lockout_count:{user_id}")
            duration = min(self.lockout_duration * (2 ** (lockout_count - 1)), 86400)
            
            await self.redis.setex(lockout_key, duration, "1")
            await self.redis.delete(key)
            
            return {"locked": True, "retry_after": duration}
        
        return {
            "locked": False,
            "attempts_remaining": self.max_attempts - attempts
        }
```

---

## 附录

### A. 参考链接

- [FastAPI官方文档](https://fastapi.tiangolo.com/)
- [React官方文档](https://react.dev/)
- [Framer Motion文档](https://motion.dev/)
- [GSAP文档](https://gsap.com/docs/)
- [Tremor组件库](https://www.tremor.so/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lenis平滑滚动](https://github.com/darkroomengineering/lenis)
- [TanStack Table/Virtual](https://tanstack.com/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [21st.dev UI组件库](https://21st.dev/)

### B. 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0.0 | 2024-12 | 初始规格文档 |
| v1.1.0 | 2024-12 | 增强前端交互规格、工业级后端规格、安全策略 |

---

*文档结束*
