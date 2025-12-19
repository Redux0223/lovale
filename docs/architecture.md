# Lovale 电商后台管理系统 - 技术架构文档

> 版本: 1.0.0  
> 更新日期: 2024-12-19

---

## 目录

1. [系统概述](#1-系统概述)
2. [整体架构图](#2-整体架构图)
3. [技术栈](#3-技术栈)
4. [前端架构](#4-前端架构)
5. [后端架构](#5-后端架构)
6. [数据库设计](#6-数据库设计)
7. [AI 助手模块](#7-ai-助手模块)
8. [核心业务流程](#8-核心业务流程)
9. [部署架构](#9-部署架构)
10. [安全架构](#10-安全架构)

---

## 1. 系统概述

Lovale 是一个现代化的电商后台管理系统，采用前后端分离架构，集成 AI 智能助手，提供产品管理、订单处理、客户管理、数据分析等核心功能。

### 1.1 系统目标

- 提供直观易用的电商后台管理界面
- 实现实时数据分析和可视化
- 集成 AI 助手提升运营效率
- 支持多种 AI 模型切换
- 确保系统安全性和可扩展性

---

## 2. 整体架构图

### 2.1 系统架构总览

```mermaid
graph TB
    subgraph Client["客户端层"]
        Browser[Web Browser]
        Mobile[Mobile Browser]
    end

    subgraph Frontend["前端层 - React"]
        UI[UI Components]
        State[State Management]
        Router[React Router]
        API_Client[API Client]
    end

    subgraph Backend["后端层"]
        subgraph FastAPI["FastAPI Server"]
            Routes[API Routes]
            Middleware[Middleware]
            Auth[JWT Auth]
        end
        subgraph Supabase["Supabase Platform"]
            EdgeFn[Edge Functions]
            RealtimeDB[Realtime]
            Storage[Storage]
        end
    end

    subgraph Data["数据层"]
        PostgreSQL[(PostgreSQL)]
        Redis[(Redis Cache)]
    end

    subgraph External["外部服务"]
        OpenAI[OpenAI API]
        Unsplash[Unsplash API]
    end

    Browser --> UI
    Mobile --> UI
    UI --> State
    State --> API_Client
    API_Client --> Routes
    API_Client --> EdgeFn
    Routes --> Middleware
    Middleware --> Auth
    Auth --> PostgreSQL
    EdgeFn --> PostgreSQL
    EdgeFn --> OpenAI
    Routes --> Redis
    UI --> Unsplash
```

### 2.2 分层架构

```mermaid
graph LR
    subgraph Presentation["表现层"]
        A1[React Components]
        A2[Framer Motion]
        A3[TailwindCSS]
    end

    subgraph Business["业务逻辑层"]
        B1[FastAPI Routes]
        B2[Edge Functions]
        B3[AI Service]
    end

    subgraph Data["数据访问层"]
        C1[SQLAlchemy ORM]
        C2[Supabase Client]
    end

    subgraph Storage["存储层"]
        D1[(PostgreSQL)]
        D2[(Redis)]
    end

    Presentation --> Business
    Business --> Data
    Data --> Storage
```

---

## 3. 技术栈

### 3.1 技术选型

```mermaid
mindmap
  root((Lovale))
    前端
      React 18
      TypeScript
      Vite
      TailwindCSS
      Framer Motion
      Recharts
      shadcn/ui
    后端
      FastAPI
      SQLAlchemy
      Pydantic
      JWT Auth
      Supabase
        Edge Functions
        PostgreSQL
        Realtime
    AI
      OpenAI API
      Multi-Model
        Gemini
        Claude
        GPT
        Grok
    DevOps
      Vercel
      GitHub
      ESLint
```

### 3.2 技术栈对比

| 层级 | 技术 | 选型原因 |
|------|------|----------|
| 前端框架 | React 18 | 组件化、生态丰富、性能优秀 |
| 类型系统 | TypeScript | 类型安全、开发体验好 |
| 构建工具 | Vite | 快速热更新、ESM 原生支持 |
| 样式方案 | TailwindCSS | 原子化 CSS、开发效率高 |
| 动画库 | Framer Motion | 声明式动画、流畅体验 |
| 后端框架 | FastAPI | 高性能、自动文档、类型支持 |
| ORM | SQLAlchemy 2.0 | 异步支持、成熟稳定 |
| 数据库 | PostgreSQL | 可靠性高、功能丰富 |
| BaaS | Supabase | 实时订阅、Edge Functions |
| AI | OpenAI API | 多模型支持、响应质量高 |

---

## 4. 前端架构

### 4.1 组件架构

```mermaid
graph TD
    subgraph App["Application"]
        Router[React Router]
    end

    subgraph Pages["页面组件"]
        Dashboard[Dashboard]
        Products[Products]
        Orders[Orders]
        Customers[Customers]
        Analytics[Analytics]
        AIAssistant[AI Assistant]
        Settings[Settings]
    end

    subgraph Layout["布局组件"]
        Sidebar[Sidebar]
        Header[Header]
        MainContent[Main Content]
    end

    subgraph UI["UI 组件"]
        Button[Button]
        Card[Card]
        Dialog[Dialog]
        Table[Table]
        Charts[Charts]
        AIPromptBox[AI Prompt Box]
        CanvasEditor[Canvas Editor]
    end

    Router --> Pages
    Pages --> Layout
    Layout --> UI
```

### 4.2 状态管理

```mermaid
flowchart LR
    subgraph Global["全局状态"]
        Theme[Theme State]
        Auth[Auth State]
        User[User State]
    end

    subgraph Local["局部状态"]
        Form[Form State]
        Modal[Modal State]
        Filter[Filter State]
    end

    subgraph Server["服务端状态"]
        Products[Products Cache]
        Orders[Orders Cache]
        Customers[Customers Cache]
    end

    Component[React Component]
    Component --> Global
    Component --> Local
    Component --> Server
```

### 4.3 前端目录结构

```
frontend/src/
├── components/           # 可复用组件
│   ├── ui/              # 基础 UI 组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── ai-prompt-box.tsx
│   │   ├── canvas-editor.tsx
│   │   └── model-selector.tsx
│   ├── charts/          # 图表组件
│   │   └── kpi-card.tsx
│   └── layout/          # 布局组件
│       ├── sidebar.tsx
│       └── header.tsx
├── features/            # 功能模块
│   ├── dashboard/       # 仪表盘
│   ├── products/        # 产品管理
│   ├── orders/          # 订单管理
│   ├── customers/       # 客户管理
│   ├── analytics/       # 数据分析
│   ├── ai-assistant/    # AI 助手
│   └── settings/        # 系统设置
├── lib/                 # 工具函数
│   └── utils.ts
├── styles/              # 样式
│   └── tokens/          # Design Tokens
├── App.tsx              # 应用入口
└── main.tsx             # 渲染入口
```

---

## 5. 后端架构

### 5.1 FastAPI 架构

```mermaid
graph TD
    subgraph Request["请求处理"]
        Client[Client Request]
        CORS[CORS Middleware]
        Security[Security Headers]
        RateLimit[Rate Limiter]
    end

    subgraph Routing["路由层"]
        Health[/health]
        Auth[/auth]
        Products[/products]
        Orders[/orders]
        Customers[/customers]
        Dashboard[/dashboard]
        AI[/ai]
    end

    subgraph Service["服务层"]
        AuthService[Auth Service]
        ProductService[Product Service]
        OrderService[Order Service]
        AIService[AI Service]
    end

    subgraph Data["数据层"]
        ORM[SQLAlchemy]
        Cache[Redis]
        External[External APIs]
    end

    Client --> CORS
    CORS --> Security
    Security --> RateLimit
    RateLimit --> Routing
    Routing --> Service
    Service --> Data
```

### 5.2 API 路由设计

```mermaid
graph LR
    subgraph V1["/api/v1"]
        subgraph Health["/health"]
            H1[GET /live]
            H2[GET /ready]
        end

        subgraph Auth["/auth"]
            A1[POST /login]
            A2[POST /register]
            A3[POST /refresh]
        end

        subgraph Products["/products"]
            P1[GET /]
            P2[GET /:id]
            P3[POST /]
            P4[PATCH /:id]
            P5[DELETE /:id]
        end

        subgraph Orders["/orders"]
            O1[GET /]
            O2[GET /:id]
            O3[POST /]
            O4[PATCH /:id/status]
        end

        subgraph AI["/ai"]
            AI1[POST /chat]
            AI2[GET /models]
        end
    end
```

### 5.3 后端目录结构

```
backend/app/
├── api/                 # API 路由
│   ├── __init__.py     # 路由聚合
│   └── routes/         # 各功能路由
│       ├── health.py
│       ├── auth.py
│       ├── products.py
│       ├── orders.py
│       ├── customers.py
│       ├── dashboard.py
│       └── ai.py
├── core/               # 核心配置
│   ├── config.py      # 应用配置
│   ├── database.py    # 数据库连接
│   └── security.py    # 安全工具
├── models/            # SQLAlchemy 模型
│   ├── user.py
│   ├── product.py
│   ├── order.py
│   └── customer.py
├── schemas/           # Pydantic 模式
│   ├── user.py
│   ├── product.py
│   └── order.py
├── middleware/        # 中间件
│   ├── security.py   # OWASP 安全头
│   └── rate_limiter.py
└── main.py           # 应用入口
```

---

## 6. 数据库设计

### 6.1 ER 图

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS {
        int id PK
        string email UK
        string hashed_password
        string full_name
        boolean is_active
        datetime created_at
    }

    CUSTOMERS ||--o{ ORDERS : makes
    CUSTOMERS {
        int id PK
        string name
        string email UK
        string phone
        string vip_level
        decimal total_spent
        datetime created_at
    }

    PRODUCTS ||--o{ ORDER_ITEMS : contains
    PRODUCTS {
        int id PK
        string name
        string slug UK
        string sku UK
        text description
        decimal price
        int stock
        int category_id FK
        string image_url
        boolean is_active
        datetime created_at
    }

    PRODUCT_CATEGORIES ||--o{ PRODUCTS : has
    PRODUCT_CATEGORIES {
        int id PK
        string name
        string slug UK
        text description
    }

    ORDERS ||--|{ ORDER_ITEMS : contains
    ORDERS {
        int id PK
        string order_number UK
        int customer_id FK
        string status
        decimal total_amount
        text shipping_address
        datetime created_at
    }

    ORDER_ITEMS {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal unit_price
    }

    CHAT_MESSAGES {
        int id PK
        string session_id
        string role
        text content
        string model
        datetime created_at
    }
```

### 6.2 数据表说明

| 表名 | 描述 | 主要字段 |
|------|------|----------|
| `users` | 系统用户 | email, password, role |
| `customers` | 客户信息 | name, email, vip_level |
| `products` | 产品信息 | name, sku, price, stock |
| `product_categories` | 产品分类 | name, slug |
| `orders` | 订单记录 | order_number, status, total |
| `order_items` | 订单项 | product_id, quantity, price |
| `chat_messages` | AI 聊天记录 | session_id, role, content |

---

## 7. AI 助手模块

### 7.1 AI 助手架构

```mermaid
graph TD
    subgraph Frontend["前端"]
        Input[AI Prompt Box]
        ModeSelector[Mode Selector]
        ModelSelector[Model Selector]
        Canvas[Canvas Editor]
        ChatHistory[Chat History]
    end

    subgraph Backend["后端处理"]
        EdgeFn[Supabase Edge Function]
        FastAPI[FastAPI /ai/chat]
    end

    subgraph AI["AI 服务"]
        Router[Model Router]
        Gemini[Gemini 3 Pro]
        Claude[Claude Opus 4.5]
        GPT[GPT-5]
        Grok[Grok 4.1]
    end

    subgraph Data["数据注入"]
        Products[(Products)]
        Orders[(Orders)]
        Customers[(Customers)]
        Stats[Real-time Stats]
    end

    Input --> ModeSelector
    ModeSelector --> EdgeFn
    ModelSelector --> EdgeFn
    EdgeFn --> Data
    EdgeFn --> Router
    Router --> Gemini
    Router --> Claude
    Router --> GPT
    Router --> Grok
    EdgeFn --> ChatHistory
    EdgeFn --> Canvas
```

### 7.2 AI 对话模式

```mermaid
stateDiagram-v2
    [*] --> Idle: 初始状态

    Idle --> NormalChat: 直接输入
    Idle --> CanvasMode: [Canvas] 前缀
    Idle --> SearchMode: [Search] 前缀
    Idle --> ThinkMode: [Think] 前缀

    NormalChat --> Processing: 发送请求
    CanvasMode --> Thinking: 显示思考中
    SearchMode --> Processing: 发送请求
    ThinkMode --> Processing: 发送请求

    Thinking --> CanvasOpen: 内容开始生成
    CanvasOpen --> Streaming: 流式输出
    Processing --> Response: 返回结果

    Streaming --> Complete: 生成完成
    Response --> Idle: 显示回复
    Complete --> Idle: 关闭或继续编辑
```

### 7.3 AI 请求流程

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant E as Edge Function
    participant DB as Database
    participant AI as OpenAI API

    U->>F: 输入消息
    F->>F: 检测模式 [Canvas/Search/Think]
    F->>E: POST /ai-chat
    
    E->>DB: 获取实时业务数据
    DB-->>E: Products, Orders, Customers
    
    E->>E: 构建 System Prompt
    E->>E: 注入业务数据上下文
    
    E->>AI: POST /chat/completions
    AI-->>E: AI Response
    
    E->>DB: 保存聊天记录
    E-->>F: 返回响应
    
    alt Canvas Mode
        F->>F: 打开画布
        F->>F: 流式显示内容
    else Normal Mode
        F->>F: 显示消息气泡
    end
    
    F-->>U: 展示结果
```

### 7.4 画布编辑器类图

```mermaid
classDiagram
    class CanvasEditor {
        +boolean isOpen
        +string content
        +string title
        +boolean isGenerating
        +EditorMode mode
        +onClose()
        +onContentChange()
        +onTitleChange()
        +onRequestAI()
        +handleExport()
        +handleCopy()
    }

    class EditorMode {
        <<enumeration>>
        edit
        preview
        split
    }

    class AIAction {
        <<enumeration>>
        improve
        expand
        simplify
    }

    class ToolbarButton {
        +string icon
        +string label
        +function onClick
    }

    CanvasEditor --> EditorMode
    CanvasEditor --> AIAction
    CanvasEditor *-- ToolbarButton
```

---

## 8. 核心业务流程

### 8.1 用户认证流程

```mermaid
flowchart TD
    A[用户访问] --> B{已登录?}
    B -->|否| C[显示登录页]
    B -->|是| D[进入仪表盘]
    
    C --> E[输入凭证]
    E --> F[POST /auth/login]
    F --> G{验证成功?}
    
    G -->|否| H[显示错误]
    H --> E
    
    G -->|是| I[生成 JWT Token]
    I --> J[存储 Token]
    J --> D
    
    D --> K{Token 有效?}
    K -->|是| L[正常访问]
    K -->|否| M[刷新 Token]
    M --> N{刷新成功?}
    N -->|是| L
    N -->|否| C
```

### 8.2 订单处理流程

```mermaid
flowchart TD
    A[创建订单] --> B[订单状态: Pending]
    B --> C{支付成功?}
    
    C -->|否| D[订单取消]
    D --> E[状态: Cancelled]
    
    C -->|是| F[状态: Paid]
    F --> G[库存扣减]
    G --> H[通知发货]
    
    H --> I[状态: Shipped]
    I --> J[物流追踪]
    J --> K{已送达?}
    
    K -->|否| J
    K -->|是| L[状态: Delivered]
    L --> M[订单完成]
```

### 8.3 产品管理流程

```mermaid
flowchart LR
    subgraph Create["创建产品"]
        A1[填写信息] --> A2[上传图片]
        A2 --> A3[设置库存]
        A3 --> A4[选择分类]
        A4 --> A5[保存]
    end

    subgraph Update["更新产品"]
        B1[编辑信息] --> B2[更新库存]
        B2 --> B3[保存变更]
    end

    subgraph Delete["删除产品"]
        C1[软删除] --> C2[标记 inactive]
    end

    Create --> Update
    Update --> Delete
```

---

## 9. 部署架构

### 9.1 部署拓扑

```mermaid
graph TB
    subgraph Users["用户"]
        Browser[Web Browser]
    end

    subgraph CDN["CDN / Edge"]
        Vercel[Vercel Edge Network]
    end

    subgraph Frontend["前端托管"]
        Static[Static Files]
        SSR[SSR Functions]
    end

    subgraph Backend["后端服务"]
        API[FastAPI Server]
        Edge[Supabase Edge Functions]
    end

    subgraph Database["数据库"]
        Supabase[(Supabase PostgreSQL)]
    end

    subgraph External["外部服务"]
        OpenAI[OpenAI API]
    end

    Browser --> Vercel
    Vercel --> Static
    Vercel --> SSR
    Static --> API
    SSR --> Edge
    Edge --> Supabase
    Edge --> OpenAI
    API --> Supabase
```

### 9.2 CI/CD 流程

```mermaid
flowchart LR
    A[Git Push] --> B[GitHub Actions]
    B --> C{Branch?}
    
    C -->|main| D[Production Build]
    C -->|develop| E[Preview Build]
    
    D --> F[Lint & Test]
    E --> F
    
    F --> G{通过?}
    G -->|否| H[通知失败]
    
    G -->|是| I[Build]
    I --> J[Deploy to Vercel]
    J --> K[健康检查]
    K --> L[部署完成]
```

---

## 10. 安全架构

### 10.1 安全层级

```mermaid
graph TD
    subgraph Network["网络层"]
        HTTPS[HTTPS/TLS 1.3]
        CDN[CDN WAF]
    end

    subgraph Application["应用层"]
        CORS[CORS Policy]
        CSP[Content Security Policy]
        RateLimit[Rate Limiting]
    end

    subgraph Auth["认证层"]
        JWT[JWT Tokens]
        Refresh[Refresh Token]
        Hash[Password Hashing]
    end

    subgraph Data["数据层"]
        RLS[Row Level Security]
        Encrypt[Data Encryption]
        Backup[Automated Backup]
    end

    Network --> Application
    Application --> Auth
    Auth --> Data
```

### 10.2 安全措施

| 层级 | 措施 | 说明 |
|------|------|------|
| 传输层 | HTTPS | TLS 1.3 加密传输 |
| 应用层 | CORS | 跨域资源共享策略 |
| 应用层 | CSP | 内容安全策略 |
| 应用层 | Rate Limiting | 滑动窗口限流 |
| 认证层 | JWT | 无状态身份验证 |
| 认证层 | bcrypt | 密码哈希 |
| 数据层 | RLS | 行级安全策略 |
| 数据层 | 加密存储 | 敏感数据加密 |

### 10.3 OWASP 安全头

```python
# Security Headers Middleware
headers = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'",
    "Referrer-Policy": "strict-origin-when-cross-origin"
}
```

---

## 附录

### A. 环境变量配置

```env
# Frontend
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# Backend
DATABASE_URL=postgresql+asyncpg://...
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.openai.com/v1
SECRET_KEY=xxx
```

### B. 开发环境要求

- Node.js >= 18.0
- Python >= 3.11
- PostgreSQL >= 15
- Redis >= 7.0

### C. 相关文档

- [React 文档](https://react.dev)
- [FastAPI 文档](https://fastapi.tiangolo.com)
- [Supabase 文档](https://supabase.com/docs)
- [TailwindCSS 文档](https://tailwindcss.com/docs)

---

*文档生成时间: 2024-12-19*
