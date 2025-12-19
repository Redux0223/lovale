# Lovale E-Commerce Dashboard

基于现代技术栈的电商后台管理系统，集成 AI 智能助手，提供精美的数据可视化、订单管理、产品管理等核心功能。

🔗 **在线演示**: https://lovale.vercel.app

## 技术栈

### 前端
- **框架**: React 18 + TypeScript + Vite
- **样式**: TailwindCSS + CSS Design Tokens
- **动画**: Framer Motion
- **图表**: Recharts
- **UI组件**: shadcn/ui 风格自定义组件

### 后端 (FastAPI + Supabase)
- **框架**: FastAPI 0.109
- **ORM**: SQLAlchemy 2.0 (async)
- **数据库**: PostgreSQL (Supabase) / SQLite (开发)
- **认证**: JWT (python-jose)
- **Edge Functions**: Supabase Deno Runtime
- **限流**: SlowAPI 滑动窗口限流
- **安全**: OWASP 安全头中间件

### AI 集成
- **API**: OpenAI Compatible API
- **支持模型**: 
  - Gemini 3 Pro
  - Claude Opus 4.5 (Thinking)
  - Grok 4.1 (Thinking)
  - GPT-5

## 快速开始

### 前端

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

访问: http://localhost:3000

### 后端 (FastAPI)

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

API 文档: http://localhost:8000/api/v1/docs

### 部署

```bash
# 构建并部署到 Vercel
npm run build
vercel --prod
```

## 项目结构

```
├── frontend/                 # 前端源码 (React)
│   ├── src/
│   │   ├── components/      # UI组件
│   │   ├── features/        # 功能模块
│   │   ├── lib/             # 工具库
│   │   └── styles/          # Design Tokens
│   └── tailwind.config.js
│
├── backend/                  # 后端源码 (FastAPI)
│   ├── app/
│   │   ├── api/             # API 路由
│   │   │   └── routes/      # 各功能路由
│   │   │       ├── auth.py      # 认证
│   │   │       ├── products.py  # 产品
│   │   │       ├── orders.py    # 订单
│   │   │       ├── customers.py # 客户
│   │   │       ├── dashboard.py # 仪表盘
│   │   │       └── ai.py        # AI聊天
│   │   ├── core/            # 核心配置
│   │   ├── models/          # SQLAlchemy 模型
│   │   ├── schemas/         # Pydantic 模式
│   │   ├── middleware/      # 中间件
│   │   └── main.py          # 应用入口
│   └── requirements.txt
│
├── supabase/                 # Supabase Edge Functions
└── .env                     # 环境变量
```

## API 端点 (FastAPI)

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/v1/health/live` | GET | 存活检查 |
| `/api/v1/auth/login` | POST | 用户登录 |
| `/api/v1/products` | GET/POST | 产品管理 |
| `/api/v1/orders` | GET/POST | 订单管理 |
| `/api/v1/customers` | GET/POST | 客户管理 |
| `/api/v1/dashboard` | GET | 仪表盘数据 |
| `/api/v1/ai/chat` | POST | AI 聊天 |
| `/api/v1/ai/models` | GET | 可用模型列表 |

## 核心功能

### 📊 仪表盘
- 实时销售数据概览
- KPI 动画卡片
- 销售趋势图表
- 热销产品排行

### 📦 产品管理
- 产品 CRUD 操作
- 库存预警系统
- 分类管理
- Unsplash 产品图片

### 📋 订单管理
- 订单列表与详情
- 状态流转管理
- 订单搜索筛选

### 👥 客户管理
- 客户信息管理
- VIP 等级系统
- 消费统计分析

### 🤖 AI 智能助手
基于真实业务数据的 AI 助手，支持多种交互模式：

| 模式 | 功能 | 触发方式 |
|------|------|---------|
| **普通对话** | 基于业务数据回答问题 | 直接输入 |
| **画布模式** | 生成 Markdown 分析报告 | 点击画布按钮 |
| **搜索模式** | 搜索并总结相关信息 | 点击搜索按钮 |
| **深度思考** | 结构化多维度分析 | 点击思考按钮 |

**画布功能特点**:
- 实时流式文档生成
- Markdown 编辑器 + 实时预览
- AI 文本优化/扩展/精简
- 导出 Markdown 文件

### 🎨 UI/UX 特性
- ✅ Design Tokens 系统
- ✅ 深色/浅色主题切换
- ✅ Framer Motion 动画
- ✅ 响应式布局

## 环境变量

```env
# OpenAI API (必需)
OPENAI_API_KEY=your-api-key
OPENAI_BASE_URL=https://api.openai.com/v1
```

## 数据库表结构

| 表名 | 描述 |
|------|------|
| `products` | 产品信息 |
| `customers` | 客户信息 |
| `orders` | 订单记录 |
| `chat_messages` | AI 聊天记录 |

## 开发说明

### Design Tokens
使用语义化 CSS 变量，避免硬编码颜色值：

```css
/* ✅ 正确 */
background-color: var(--background);
color: var(--foreground-muted);

/* ❌ 错误 */
background-color: #fafafa;
```

### 组件开发
```tsx
// 使用 Framer Motion 动画
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  内容
</motion.div>
```

## 截图预览

| 仪表盘 | AI 助手 |
|--------|---------|
| 销售数据概览、KPI 卡片 | 智能对话、画布文档生成 |

## 许可证

MIT License

---

**开发者**: Built with ❤️ using React, Supabase & AI
