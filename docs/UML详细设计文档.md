# Lovale 电商系统 - UML 详细设计文档

> 版本: 1.0.0  
> 更新日期: 2024-12-19

---

## 1. 类图 (Class Diagrams)

### 1.1 前端核心组件类图

```mermaid
classDiagram
    class App {
        +Router router
        +ThemeProvider theme
        +render()
    }

    class Sidebar {
        -boolean isCollapsed
        -NavItem[] navItems
        +toggle()
        +render()
    }

    class Header {
        -User currentUser
        -string searchQuery
        +handleSearch()
        +handleLogout()
    }

    class Dashboard {
        -KPIData[] kpiData
        -ChartData salesData
        +fetchData()
        +render()
    }

    class AIAssistant {
        -Message[] messages
        -string selectedModel
        -boolean isTyping
        -boolean isCanvasOpen
        -string canvasContent
        +handleSend()
        +handleCanvasAI()
        +render()
    }

    class CanvasEditor {
        -boolean isOpen
        -string content
        -string title
        -EditorMode mode
        -boolean isGenerating
        +handleExport()
        +handleCopy()
        +handleAIRequest()
    }

    class AIPromptBox {
        -string inputValue
        -PromptMode mode
        -boolean isLoading
        +handleSubmit()
        +handleModeChange()
    }

    class ModelSelector {
        -AIModel[] models
        -AIModel selectedModel
        +handleSelect()
    }

    App --> Sidebar
    App --> Header
    App --> Dashboard
    App --> AIAssistant
    AIAssistant --> CanvasEditor
    AIAssistant --> AIPromptBox
    AIAssistant --> ModelSelector
```

### 1.2 后端模型类图

```mermaid
classDiagram
    class BaseModel {
        <<abstract>>
        +int id
        +datetime created_at
        +datetime updated_at
    }

    class User {
        +string email
        +string hashed_password
        +string full_name
        +boolean is_active
        +boolean is_superuser
        +verify_password()
        +hash_password()
    }

    class Customer {
        +string name
        +string email
        +string phone
        +string address
        +VIPLevel vip_level
        +decimal total_spent
        +int order_count
        +calculate_vip_level()
    }

    class Product {
        +string name
        +string slug
        +string sku
        +string description
        +decimal price
        +int stock
        +string image_url
        +int category_id
        +boolean is_active
        +update_stock()
    }

    class ProductCategory {
        +string name
        +string slug
        +string description
        +Product[] products
    }

    class Order {
        +string order_number
        +int customer_id
        +OrderStatus status
        +decimal total_amount
        +string shipping_address
        +OrderItem[] items
        +calculate_total()
        +update_status()
    }

    class OrderItem {
        +int order_id
        +int product_id
        +int quantity
        +decimal unit_price
        +decimal subtotal
    }

    class ChatMessage {
        +string session_id
        +MessageRole role
        +string content
        +string model
    }

    BaseModel <|-- User
    BaseModel <|-- Customer
    BaseModel <|-- Product
    BaseModel <|-- ProductCategory
    BaseModel <|-- Order
    BaseModel <|-- OrderItem
    BaseModel <|-- ChatMessage

    ProductCategory "1" --> "*" Product : contains
    Customer "1" --> "*" Order : places
    Order "1" --> "*" OrderItem : contains
    Product "1" --> "*" OrderItem : referenced
```

### 1.3 服务层类图

```mermaid
classDiagram
    class AuthService {
        -Settings settings
        -UserRepository userRepo
        +authenticate(email, password)
        +create_access_token(user_id)
        +create_refresh_token(user_id)
        +verify_token(token)
        +hash_password(password)
    }

    class ProductService {
        -ProductRepository productRepo
        -CategoryRepository categoryRepo
        +list_products(filters)
        +get_product(id)
        +create_product(data)
        +update_product(id, data)
        +delete_product(id)
        +update_stock(id, quantity)
    }

    class OrderService {
        -OrderRepository orderRepo
        -ProductService productService
        -CustomerService customerService
        +list_orders(filters)
        +get_order(id)
        +create_order(data)
        +update_status(id, status)
        +calculate_total(items)
    }

    class CustomerService {
        -CustomerRepository customerRepo
        +list_customers(filters)
        +get_customer(id)
        +create_customer(data)
        +update_customer(id, data)
        +calculate_vip_level(customer)
    }

    class AIService {
        -Settings settings
        -HttpClient httpClient
        +chat(message, model, context)
        +build_system_prompt(mode, data)
        +fetch_business_data()
        +list_models()
    }

    class DashboardService {
        -OrderRepository orderRepo
        -ProductRepository productRepo
        -CustomerRepository customerRepo
        +get_kpi_data()
        +get_sales_trend()
        +get_top_products()
        +get_recent_orders()
    }

    OrderService --> ProductService
    OrderService --> CustomerService
    AIService --> DashboardService
```

---

## 2. 序列图 (Sequence Diagrams)

### 2.1 用户登录序列图

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as Login Page
    participant API as FastAPI
    participant Auth as AuthService
    participant DB as Database

    User->>UI: 输入邮箱和密码
    UI->>UI: 前端表单验证
    UI->>API: POST /api/v1/auth/login
    
    API->>Auth: authenticate(email, password)
    Auth->>DB: SELECT * FROM users WHERE email = ?
    DB-->>Auth: User Record
    
    alt 用户不存在
        Auth-->>API: UserNotFound
        API-->>UI: 401 Unauthorized
        UI-->>User: 显示错误: 用户不存在
    else 密码错误
        Auth->>Auth: verify_password(input, hashed)
        Auth-->>API: InvalidPassword
        API-->>UI: 401 Unauthorized
        UI-->>User: 显示错误: 密码错误
    else 验证成功
        Auth->>Auth: verify_password(input, hashed)
        Auth->>Auth: create_access_token(user_id)
        Auth->>Auth: create_refresh_token(user_id)
        Auth-->>API: TokenPair
        API-->>UI: 200 OK + Tokens
        UI->>UI: 存储 Token 到 localStorage
        UI-->>User: 跳转到仪表盘
    end
```

### 2.2 AI 对话序列图

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as AI Assistant
    participant Edge as Edge Function
    participant DB as Supabase DB
    participant AI as OpenAI API

    User->>UI: 输入消息 + 选择模型
    UI->>UI: 检测消息模式
    
    alt Canvas 模式
        UI->>UI: setIsTyping(true)
        UI->>UI: 显示 "思考中..."
    end
    
    UI->>Edge: POST /functions/v1/ai-chat
    Note over UI,Edge: { message, model, context, session_id }
    
    Edge->>DB: 查询 products
    DB-->>Edge: 产品列表
    Edge->>DB: 查询 orders
    DB-->>Edge: 订单统计
    Edge->>DB: 查询 customers
    DB-->>Edge: 客户数据
    
    Edge->>Edge: buildSystemPrompt(mode, realData)
    Edge->>Edge: 构建 messages 数组
    
    Edge->>AI: POST /chat/completions
    Note over Edge,AI: { model, messages, temperature }
    AI-->>Edge: AI Response
    
    Edge->>DB: INSERT chat_messages
    Edge-->>UI: { response, model }
    
    alt Canvas 模式
        UI->>UI: setIsTyping(false)
        UI->>UI: setIsCanvasOpen(true)
        UI->>UI: 流式显示内容
    else 普通模式
        UI->>UI: 添加消息气泡
    end
    
    UI-->>User: 显示 AI 回复
```

### 2.3 创建订单序列图

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as Orders Page
    participant API as FastAPI
    participant OrderSvc as OrderService
    participant ProductSvc as ProductService
    participant DB as Database

    User->>UI: 填写订单信息
    UI->>UI: 验证表单
    UI->>API: POST /api/v1/orders
    
    API->>OrderSvc: create_order(data)
    
    loop 检查每个商品
        OrderSvc->>ProductSvc: get_product(product_id)
        ProductSvc->>DB: SELECT * FROM products
        DB-->>ProductSvc: Product
        ProductSvc-->>OrderSvc: Product
        
        alt 库存不足
            OrderSvc-->>API: InsufficientStock
            API-->>UI: 400 Bad Request
            UI-->>User: 显示库存不足错误
        end
    end
    
    OrderSvc->>OrderSvc: calculate_total(items)
    OrderSvc->>DB: INSERT INTO orders
    DB-->>OrderSvc: Order Created
    
    loop 创建订单项
        OrderSvc->>DB: INSERT INTO order_items
        OrderSvc->>ProductSvc: update_stock(id, -quantity)
        ProductSvc->>DB: UPDATE products SET stock = stock - ?
    end
    
    OrderSvc-->>API: Order
    API-->>UI: 201 Created
    UI-->>User: 显示订单创建成功
```

### 2.4 画布文档生成序列图

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Prompt as AIPromptBox
    participant Assistant as AIAssistant
    participant Canvas as CanvasEditor
    participant Edge as Edge Function
    participant AI as OpenAI API

    User->>Prompt: 点击画布模式按钮
    Prompt->>Prompt: setMode("canvas")
    User->>Prompt: 输入主题
    User->>Prompt: 点击发送
    
    Prompt->>Assistant: handleSend(message)
    Assistant->>Assistant: 检测 [Canvas] 前缀
    Assistant->>Assistant: setIsTyping(true)
    Assistant->>Assistant: 添加用户消息到列表
    
    Assistant->>Edge: POST /ai-chat
    Note over Assistant,Edge: message: "[Canvas] 主题"
    
    Edge->>Edge: 识别 Canvas 模式
    Edge->>Edge: 构建文档生成提示词
    Edge->>AI: 请求生成文档
    AI-->>Edge: Markdown 文档内容
    Edge-->>Assistant: { response }
    
    Assistant->>Assistant: setIsTyping(false)
    Assistant->>Canvas: setIsCanvasOpen(true)
    Assistant->>Canvas: setCanvasContent("")
    Assistant->>Canvas: setIsCanvasGenerating(true)
    
    loop 流式输出
        Assistant->>Canvas: 逐字符添加内容
        Canvas->>Canvas: 更新显示
    end
    
    Assistant->>Canvas: setIsCanvasGenerating(false)
    Assistant->>Assistant: 添加完成消息
    
    Canvas-->>User: 显示完整文档
    User->>Canvas: 编辑/预览/导出
```

---

## 3. 活动图 (Activity Diagrams)

### 3.1 订单状态流转活动图

```mermaid
stateDiagram-v2
    [*] --> Pending: 创建订单

    Pending --> Paid: 支付成功
    Pending --> Cancelled: 取消订单
    Pending --> Cancelled: 支付超时

    Paid --> Processing: 开始处理
    Paid --> Refunded: 申请退款

    Processing --> Shipped: 发货
    Processing --> Refunded: 处理异常

    Shipped --> Delivered: 签收
    Shipped --> Returned: 拒收

    Delivered --> Completed: 确认收货
    Delivered --> Returned: 申请退货

    Returned --> Refunded: 退款处理

    Refunded --> [*]
    Cancelled --> [*]
    Completed --> [*]
```

### 3.2 AI 助手模式切换活动图

```mermaid
stateDiagram-v2
    [*] --> Idle: 初始化

    Idle --> InputMode: 用户开始输入
    
    state InputMode {
        [*] --> Normal
        Normal --> Canvas: 点击画布按钮
        Normal --> Search: 点击搜索按钮
        Normal --> Think: 点击思考按钮
        Canvas --> Normal: 切换模式
        Search --> Normal: 切换模式
        Think --> Normal: 切换模式
    }

    InputMode --> Processing: 发送消息
    
    state Processing {
        [*] --> ValidateInput
        ValidateInput --> BuildPrompt: 验证通过
        ValidateInput --> Error: 验证失败
        BuildPrompt --> CallAPI
        CallAPI --> ParseResponse: API 成功
        CallAPI --> Error: API 失败
    }

    Processing --> DisplayResult: 处理完成
    
    state DisplayResult {
        [*] --> CheckMode
        CheckMode --> OpenCanvas: Canvas 模式
        CheckMode --> ShowMessage: 其他模式
        OpenCanvas --> StreamContent
        StreamContent --> CanvasReady
    }

    DisplayResult --> Idle: 完成显示
    Processing --> Idle: 发生错误
```

---

## 4. 组件图 (Component Diagrams)

### 4.1 系统组件图

```mermaid
graph TB
    subgraph Frontend["前端应用"]
        subgraph Pages["页面组件"]
            Dashboard[Dashboard]
            Products[Products]
            Orders[Orders]
            Customers[Customers]
            AIAssistant[AI Assistant]
        end
        
        subgraph Shared["共享组件"]
            UI[UI Components]
            Layout[Layout]
            Charts[Charts]
        end
        
        subgraph State["状态管理"]
            LocalState[Local State]
            Context[React Context]
        end
    end

    subgraph Backend["后端服务"]
        subgraph FastAPI["FastAPI 应用"]
            Routes[API Routes]
            Services[Business Services]
            Models[Data Models]
        end
        
        subgraph Middleware["中间件"]
            Auth[JWT Auth]
            CORS[CORS]
            RateLimit[Rate Limiter]
            Security[Security Headers]
        end
    end

    subgraph External["外部服务"]
        Supabase[(Supabase)]
        OpenAI[OpenAI API]
        Vercel[Vercel CDN]
    end

    Pages --> Shared
    Pages --> State
    Frontend --> Backend
    Backend --> External
    FastAPI --> Middleware
```

---

## 5. 部署图 (Deployment Diagram)

```mermaid
graph TB
    subgraph Client["客户端"]
        Browser[Web Browser]
    end

    subgraph Vercel["Vercel Platform"]
        CDN[Edge Network CDN]
        Static[Static Files]
        Serverless[Serverless Functions]
    end

    subgraph Supabase["Supabase Platform"]
        EdgeFunctions[Edge Functions]
        PostgreSQL[(PostgreSQL)]
        Auth[Auth Service]
        Realtime[Realtime Service]
    end

    subgraph OpenAI["OpenAI Platform"]
        ChatAPI[Chat Completions API]
    end

    Browser -->|HTTPS| CDN
    CDN --> Static
    CDN --> Serverless
    Serverless -->|REST| EdgeFunctions
    EdgeFunctions --> PostgreSQL
    EdgeFunctions --> Auth
    EdgeFunctions -->|HTTPS| ChatAPI
    PostgreSQL --> Realtime
    Realtime -->|WebSocket| Browser
```

---

## 6. 数据流图 (Data Flow Diagrams)

### 6.1 系统数据流图

```mermaid
flowchart LR
    subgraph External["外部实体"]
        User((用户))
        Admin((管理员))
        AI((AI 服务))
    end

    subgraph Process["处理过程"]
        P1[用户认证]
        P2[产品管理]
        P3[订单处理]
        P4[客户管理]
        P5[AI 对话]
        P6[数据分析]
    end

    subgraph DataStore["数据存储"]
        D1[(用户表)]
        D2[(产品表)]
        D3[(订单表)]
        D4[(客户表)]
        D5[(聊天记录)]
    end

    User -->|登录请求| P1
    P1 -->|验证| D1
    P1 -->|Token| User

    Admin -->|CRUD| P2
    P2 <-->|读写| D2

    User -->|下单| P3
    P3 <-->|读写| D3
    P3 -->|更新库存| D2

    Admin -->|管理| P4
    P4 <-->|读写| D4

    User -->|对话| P5
    P5 -->|查询数据| D2
    P5 -->|查询数据| D3
    P5 -->|查询数据| D4
    P5 <-->|调用| AI
    P5 -->|保存| D5

    P6 -->|统计| D2
    P6 -->|统计| D3
    P6 -->|统计| D4
    P6 -->|报表| Admin
```

---

## 附录: 图表说明

| 图表类型 | 用途 | 工具 |
|---------|------|------|
| 类图 | 展示系统中类的结构和关系 | Mermaid |
| 序列图 | 展示对象之间的交互顺序 | Mermaid |
| 活动图 | 展示工作流程和状态转换 | Mermaid |
| 组件图 | 展示系统组件及其依赖 | Mermaid |
| 部署图 | 展示系统的物理部署架构 | Mermaid |
| 数据流图 | 展示数据在系统中的流动 | Mermaid |

---

*文档生成时间: 2024-12-19*
