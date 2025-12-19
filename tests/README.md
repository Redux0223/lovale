# Lovale 测试套件

## 测试结构

```
tests/
├── __init__.py          # 测试模块初始化
├── conftest.py          # Pytest 配置和 fixtures
├── test_api.py          # API 接口测试
├── test_auth.py         # 认证系统测试
├── test_models.py       # 数据模型测试
├── test_ai.py           # AI 功能测试
├── test_frontend.py     # 前端组件测试用例
└── README.md            # 测试文档
```

## 运行测试

### 后端测试 (pytest)

```bash
# 安装测试依赖
cd backend
pip install pytest pytest-asyncio pytest-cov httpx

# 运行所有测试
pytest ../tests/ -v

# 运行特定测试文件
pytest ../tests/test_api.py -v

# 运行特定测试类
pytest ../tests/test_api.py::TestProductEndpoints -v

# 运行特定测试方法
pytest ../tests/test_api.py::TestProductEndpoints::test_create_product -v

# 生成覆盖率报告
pytest ../tests/ --cov=app --cov-report=html
```

### 前端测试 (Vitest)

```bash
cd frontend

# 安装测试依赖
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# 运行测试
npm run test

# 运行测试并监听
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

## 测试覆盖范围

### API 测试 (`test_api.py`)

| 模块 | 测试用例数 | 覆盖功能 |
|------|-----------|----------|
| Health | 2 | 存活检查、就绪检查 |
| Products | 8 | CRUD、筛选、去重 |
| Orders | 3 | 列表、创建、查询 |
| Customers | 3 | 列表、创建、查询 |
| Dashboard | 1 | 数据获取 |
| AI | 3 | 聊天、模型列表 |

### 认证测试 (`test_auth.py`)

| 功能 | 测试用例数 | 覆盖场景 |
|------|-----------|----------|
| 注册 | 2 | 成功、重复邮箱 |
| 登录 | 3 | 成功、错误密码、不存在用户 |
| Token | 3 | 无Token、无效Token、有效Token |
| 密码安全 | 2 | 最小长度、不返回密码 |

### 模型测试 (`test_models.py`)

| 模型 | 测试用例数 | 覆盖功能 |
|------|-----------|----------|
| Product | 3 | 创建、默认值、关系 |
| Customer | 2 | 创建、VIP等级 |
| Order | 3 | 创建、状态、订单项 |
| User | 2 | 创建、默认激活 |
| Schema | 4 | 数据验证 |

### AI 测试 (`test_ai.py`)

| 功能 | 测试用例数 | 覆盖场景 |
|------|-----------|----------|
| 基础聊天 | 2 | 基础、带上下文 |
| 模型列表 | 2 | 获取、验证结构 |
| 模式 | 3 | 画布、搜索、思考 |
| 验证 | 5 | 空消息、缺字段、无效模型 |
| 响应格式 | 2 | 成功、错误结构 |

### 前端测试 (`test_frontend.py`)

| 组件类型 | 测试用例数 | 覆盖组件 |
|----------|-----------|----------|
| UI组件 | 4 | Button、Card、Dialog、Input |
| 布局组件 | 2 | Sidebar、Header |
| 图表组件 | 2 | KPICard、SalesChart |
| AI组件 | 3 | PromptBox、Canvas、ModelSelector |
| 页面组件 | 4 | Dashboard、Products、Orders、AI |

## 测试统计

```
总测试用例数: 65+
├── API 测试:      20 用例
├── 认证测试:      10 用例
├── 模型测试:      14 用例
├── AI 测试:       14 用例
└── 前端测试:      15+ 用例（文档形式）
```

## 测试规范

### 命名规范

```python
# 测试类: Test + 模块名
class TestProductEndpoints:
    pass

# 测试方法: test_ + 功能描述
def test_create_product_success(self):
    pass

def test_create_product_duplicate_sku(self):
    pass
```

### 断言规范

```python
# 状态码断言
assert response.status_code == 200

# 数据结构断言
assert "id" in data
assert data["name"] == expected_name

# 列表断言
assert len(items) > 0
assert all("id" in item for item in items)
```

### Fixtures 使用

```python
@pytest.fixture
def sample_product_data():
    return {
        "name": "测试产品",
        "sku": "TEST-001",
        "price": 99.99,
    }

async def test_create_product(self, client, sample_product_data):
    response = await client.post("/api/v1/products", json=sample_product_data)
    assert response.status_code == 201
```

## CI/CD 集成

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r backend/requirements.txt
          pip install pytest pytest-asyncio pytest-cov httpx
      
      - name: Run tests
        run: pytest tests/ -v --cov=backend/app
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

*测试文档更新时间: 2024-12-19*
