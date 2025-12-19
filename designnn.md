# Alpha Arena 设计系统文档

本文档详细记录项目的色彩系统、图表实现、字体配置和主题切换机制。

---

## 1. 色彩系统 (Color System)

### 1.1 色彩空间

项目采用 **OKLCH** 色彩空间，这是一种感知均匀的色彩空间，提供更好的色彩一致性和可访问性。

格式：`oklch(lightness chroma hue)`
- **Lightness**: 0-1，亮度
- **Chroma**: 0-0.4+，饱和度
- **Hue**: 0-360，色相角度

### 1.2 亮色主题 (Light Theme)

定义于 `@/app/globals.css` 的 `:root` 选择器中：

| 变量名 | OKLCH 值 | 用途 |
|--------|----------|------|
| `--background` | `oklch(0.985 0.005 85)` | 温暖奶油色背景 |
| `--foreground` | `oklch(0.12 0.01 280)` | 深色前景文字 |
| `--card` | `oklch(0.995 0.002 85)` | 卡片背景 |
| `--primary` | `oklch(0.15 0.015 280)` | 主要强调色 |
| `--primary-foreground` | `oklch(0.98 0.005 85)` | 主要强调色上的文字 |
| `--secondary` | `oklch(0.94 0.008 85)` | 次要背景 |
| `--muted` | `oklch(0.93 0.008 85)` | 静音/禁用状态 |
| `--muted-foreground` | `oklch(0.48 0.01 280)` | 静音状态文字 |
| `--accent` | `oklch(0.92 0.01 85)` | 强调色 |
| `--destructive` | `oklch(0.52 0.2 25)` | 危险/错误状态 (红色) |
| `--border` | `oklch(0.88 0.008 85)` | 边框颜色 |
| `--ring` | `oklch(0.65 0.015 280)` | 聚焦环 |
| `--success` | `oklch(0.48 0.14 145)` | 成功状态 (绿色) |

### 1.3 暗色主题 (Dark Theme)

定义于 `.dark` 选择器中：

| 变量名 | OKLCH 值 | 用途 |
|--------|----------|------|
| `--background` | `oklch(0.15 0.01 270)` | 温暖深灰背景 |
| `--foreground` | `oklch(0.97 0.005 270)` | 亮色前景文字 |
| `--card` | `oklch(0.17 0.01 270)` | 略微抬升的卡片表面 |
| `--primary` | `oklch(0.82 0.02 270)` | 银色强调色 |
| `--primary-foreground` | `oklch(0.12 0.01 270)` | 主要强调色上的文字 |
| `--secondary` | `oklch(0.28 0.015 270)` | 中性表面 |
| `--muted` | `oklch(0.32 0.02 270)` | 静音灰色 |
| `--muted-foreground` | `oklch(0.68 0.015 270)` | 中等对比度文字 |
| `--accent` | `oklch(0.78 0.025 270)` | 银色高亮 |
| `--destructive` | `oklch(0.52 0.2 25)` | 危险/错误状态 |
| `--border` | `oklch(0.28 0.015 270)` | 微妙分隔线 |
| `--ring` | `oklch(0.82 0.025 270)` | 银色聚焦环 |
| `--success` | `oklch(0.72 0.12 160)` | 静音绿色 |

### 1.4 图表专用色彩 (Chart Colors)

用于区分不同 AI 模型的曲线，在两种主题中保持一致：

| 变量名 | OKLCH 值 | 对应模型 |
|--------|----------|----------|
| `--chart-1` | `oklch(0.5 0.18 265)` | GPT - 紫色 |
| `--chart-2` | `oklch(0.6 0.16 200)` | Claude - 青色 |
| `--chart-3` | `oklch(0.7 0.13 85)` | Gemini - 金色 |
| `--chart-4` | `oklch(0.55 0.2 305)` | Grok - 粉紫色 |
| `--chart-5` | `oklch(0.58 0.18 25)` | DeepSeek - 橙红色 |
| `--chart-6` | `oklch(0.45 0.16 340)` | Qwen - 深紫红色 |

### 1.5 8级灰度系统 (Grayscale System)

提供精细的灰度控制：

```css
--gray-50:  oklch(0.98 0.005 270);  /* 最亮 */
--gray-100: oklch(0.95 0.005 270);
--gray-200: oklch(0.90 0.008 270);
--gray-300: oklch(0.80 0.010 270);
--gray-400: oklch(0.65 0.012 270);
--gray-500: oklch(0.50 0.015 270);
--gray-600: oklch(0.40 0.015 270);
--gray-700: oklch(0.30 0.015 270);
--gray-800: oklch(0.20 0.012 270);
--gray-950: oklch(0.12 0.010 270);  /* 最暗 */
```

### 1.6 品牌强调色 (Brand Accent Colors)

```css
/* 金色系列 */
--accent-gold:        oklch(0.75 0.12 80);
--accent-gold-hover:  oklch(0.70 0.14 80);
--accent-gold-active: oklch(0.65 0.16 80);

/* 蓝色系列 */
--accent-blue:        oklch(0.60 0.15 240);
--accent-blue-hover:  oklch(0.55 0.17 240);
--accent-blue-active: oklch(0.50 0.19 240);

/* 语义色彩 */
--warning: oklch(0.75 0.12 80);  /* 警告 - 金色 */
--info:    oklch(0.60 0.15 240); /* 信息 - 蓝色 */
```

### 1.7 AI 模型专属颜色

定义于 `@/lib/mock-data.ts` 的 `AI_MODELS` 数组中：

| 模型 | HEX 颜色 | 说明 |
|------|----------|------|
| QWEN3 MAX | `#8b5cf6` | 紫色 |
| DEEPSEEK CHAT V3.1 | `#3b82f6` | 蓝色 |
| CLAUDE SONNET 4.5 | `#f97316` | 橙色 |
| GROK 4 | `#000000` | 黑色 (暗色主题自动转白色) |
| GEMINI 2.5 PRO | `#6366f1` | 靛蓝色 |
| GPT 5 | `#10b981` | 翠绿色 |

**自适应颜色处理** (`@/lib/utils.ts`)：
- `getAdaptiveColor()`: 将黑色在暗色主题中转换为 `#a1a1aa` (zinc-400)
- `getAdaptiveChartColor()`: 将黑色在图表中转换为白色 `#ffffff`

---

## 2. 首页动态图表 (Homepage Dynamic Charts)

### 2.1 主图表 (Main Chart)

**文件位置**: `@/components/main-chart.tsx`

**技术栈**:
- **Recharts** - React 图表库
- 组件: `LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`, `ReferenceLine`

**功能特性**:
- 实时数据更新 (每秒更新一次)
- 双视图模式: 美元值 / 百分比变化
- 时间范围切换: ALL / 72H
- 鼠标滚轮缩放 + 拖拽平移
- 悬停高亮聚焦效果
- AI 模型 Logo 动态定位于曲线末端

**图表配置**:
```typescript
const CHART_CONFIG = {
  HEIGHT: "100%",
  MARGIN: { top: 5, right: 30, left: 20, bottom: 5 },
  Y_MIN: 0,
  Y_MAX: 20000,
  UPDATE_INTERVAL: 1000,      // 1秒更新
  PULSE_DURATION: 1000,       // Logo 脉冲动画时长
  MAX_DATA_POINTS: 168,       // 7天小时数据
  HOVER_FADE_OPACITY: 0.2,    // 非聚焦曲线透明度
  HOVER_FOCUSED_STROKE_WIDTH: 4.0,
  HOVER_DEFAULT_STROKE_WIDTH: 3.0,
  HOVER_TRANSITION_DURATION: 250,
}
```

**主题感知颜色**:
```typescript
// 暗色主题
{
  grid: "oklch(0.28 0.015 270)",
  axis: "oklch(0.68 0.015 270)",
  reference: "oklch(0.78 0.025 270)",
  tooltipBg: "oklch(0.14 0.01 270)",
  tooltipBorder: "oklch(0.28 0.015 270)",
  tooltipText: "oklch(0.97 0.005 270)",
}

// 亮色主题
{
  grid: "oklch(0.75 0.01 270)",
  axis: "oklch(0.45 0.01 270)",
  reference: "oklch(0.35 0.015 270)",
  tooltipBg: "oklch(0.98 0.005 270)",
  tooltipBorder: "oklch(0.85 0.01 270)",
  tooltipText: "oklch(0.15 0.01 270)",
}
```

### 2.2 K线蜡烛图 (Crypto Candlestick Chart)

**文件位置**: `@/components/crypto-candlestick-chart.tsx`

**技术栈**:
- **lightweight-charts** v5 - TradingView 官方图表库

**蜡烛颜色配置**:
```typescript
{
  upColor: "#22c55e",        // 上涨 - 绿色
  downColor: "#ef4444",      // 下跌 - 红色
  borderUpColor: "#22c55e",
  borderDownColor: "#ef4444",
  wickUpColor: "#22c55e",    // 上影线
  wickDownColor: "#ef4444",  // 下影线
}
```

**布局配置**:
```typescript
{
  layout: {
    background: { color: "transparent" },
    textColor: "#9ca3af",
  },
  grid: {
    vertLines: { color: "rgba(75, 85, 99, 0.25)" },
    horzLines: { color: "rgba(75, 85, 99, 0.25)" },
  },
  rightPriceScale: { borderColor: "#4b5563" },
  timeScale: { borderColor: "#4b5563" },
}
```

### 2.3 图表数据生成

**文件位置**: `@/lib/crypto-data.ts`, `@/lib/mock-data.ts`

- `generateChartData()`: 生成 168 小时历史数据
- `generateNextDataPoint()`: 基于前值生成下一个数据点 (随机游走)
- `generateAllMockCryptoData()`: 生成所有加密货币的 K 线数据

---

## 3. 字体系统 (Typography System)

### 3.1 字体引入

在 `@/app/layout.tsx` 中通过 `next/font/google` 引入：

```typescript
import { 
  Space_Grotesk,      // 主要无衬线字体
  JetBrains_Mono,     // 等宽字体
  Playfair_Display,   // 衬线显示字体
  Orbitron,           // 科技感字体
  Bebas_Neue,         // 冲击力字体
  Rajdhani,           // 几何字体
  Audiowide,          // 电子风格字体
  Righteous           // 粗体艺术字体
} from "next/font/google"
```

### 3.2 CSS 变量映射

```css
--font-sans:       var(--font-space-grotesk), system-ui, sans-serif;
--font-mono:       var(--font-jetbrains-mono), "Courier New", monospace;
--font-serif:      var(--font-playfair), Georgia, serif;

/* 艺术字体 */
--font-orbitron:   var(--font-orbitron), sans-serif;
--font-bebas:      var(--font-bebas), sans-serif;
--font-rajdhani:   var(--font-rajdhani), sans-serif;
--font-audiowide:  var(--font-audiowide), sans-serif;
--font-righteous:  var(--font-righteous), sans-serif;
```

### 3.3 工具类 (Utility Classes)

```css
.font-display    { font-family: var(--font-serif); }
.font-tech       { font-family: var(--font-orbitron); }
.font-impact     { font-family: var(--font-bebas); }
.font-geometric  { font-family: var(--font-rajdhani); }
.font-electronic { font-family: var(--font-audiowide); }
.font-bold-art   { font-family: var(--font-righteous); }
```

### 3.4 字体使用场景

| 字体 | CSS 类 | 使用场景 |
|------|--------|----------|
| Space Grotesk | 默认 `font-sans` | 正文、按钮、普通 UI |
| JetBrains Mono | `font-mono` | 数字、代码、图表坐标轴 |
| Playfair Display | `font-display` | 装饰性标题 |
| Bebas Neue | `font-impact` | 大标题 (如 "TOTAL ACCOUNT VALUE") |
| Orbitron | `font-tech` | 科技风格元素 |
| Rajdhani | `font-geometric` | 几何风格文字 |
| Audiowide | `font-electronic` | 电子/未来风格 |
| Righteous | `font-bold-art` | 粗体艺术效果 |

---

## 4. 日夜主题切换 (Theme Switching)

### 4.1 技术实现

**依赖库**: `next-themes`

**Provider 配置** (`@/app/layout.tsx`):
```tsx
<ThemeProvider
  attribute="class"        // 使用 class 属性切换
  defaultTheme="dark"      // 默认暗色主题
  enableSystem={false}     // 禁用系统主题跟随
  disableTransitionOnChange // 禁用内置过渡
>
```

**主题切换组件**: `@/components/theme-toggle.tsx`

### 4.2 切换动画效果

#### View Transitions API (现代浏览器)

使用圆形揭示动画，从点击位置向外扩展：

```typescript
const transition = document.startViewTransition(() => {
  setTheme(newTheme)
})

// 圆形揭示效果
document.documentElement.animate(
  {
    clipPath: [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`
    ]
  },
  {
    duration: 1000,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    pseudoElement: "::view-transition-new(root)"
  }
)
```

#### 降级方案 (旧版浏览器)

创建 DOM 元素模拟涟漪扩散效果：

```typescript
ripple.style.backgroundColor = newTheme === "dark" 
  ? "oklch(0.12 0.01 270)"   // 暗色背景
  : "oklch(0.985 0.005 85)"  // 亮色背景
```

### 4.3 平滑过渡样式

全局 CSS 过渡配置 (`@/app/globals.css`):

```css
html, body, * {
  transition: 
    background-color 1s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 1s cubic-bezier(0.4, 0, 0.2, 1),
    color 1s cubic-bezier(0.4, 0, 0.2, 1),
    fill 1s cubic-bezier(0.4, 0, 0.2, 1),
    stroke 1s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 1s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 交互元素保持快速响应 */
button, a, input, textarea, select {
  transition: 
    all 0.3s ease,
    background-color 1s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 1s cubic-bezier(0.4, 0, 0.2, 1),
    color 1s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 4.4 View Transitions 配置

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root) { z-index: 1; }
::view-transition-new(root) { z-index: 2; }

::view-transition-group(root) {
  animation-duration: 0s;
}
```

### 4.5 主题感知滚动条

```css
/* 亮色主题 */
::-webkit-scrollbar-track {
  background: oklch(0.92 0.005 270);
}
::-webkit-scrollbar-thumb {
  background: oklch(0.65 0.01 270);
}

/* 暗色主题 */
.dark ::-webkit-scrollbar-track {
  background: oklch(0.18 0.01 270);
}
.dark ::-webkit-scrollbar-thumb {
  background: oklch(0.68 0.015 270);
}
```

---

## 5. 背景视觉效果 (Background Visual Effects)

### 5.1 层级结构

```
z-index: -10  DotScreenShader (纯色背景层)
z-index: -5   EtherealShadows (毛玻璃/雾气效果)
z-index: 0+   主内容
```

### 5.2 DotScreenShader

**文件**: `@/components/dot-screen-shader.tsx`

静态背景色层，跟随主题切换：
- 暗色: `oklch(0.15 0.01 270)` - 温暖深灰
- 亮色: `oklch(0.985 0.005 85)` - 温暖奶油色

### 5.3 EtherealShadows

**文件**: `@/components/ethereal-shadows.tsx`

毛玻璃/雾气纹理效果：
- 使用外部遮罩图片创建雾气效果
- SVG 噪点纹理增加深度感
- 固定透明度 0.6，噪点层 0.08
- 8px 模糊滤镜

---

## 6. 设计令牌 (Design Tokens)

### 6.1 间距系统 (基于 4px)

```css
--space-1:  0.25rem;   /* 4px */
--space-2:  0.5rem;    /* 8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-5:  1.25rem;   /* 20px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
```

### 6.2 圆角系统

```css
--radius-sm:   0.25rem;  /* 4px */
--radius-md:   0.375rem; /* 6px - 按钮 */
--radius-lg:   0.5rem;   /* 8px - 卡片 */
--radius-xl:   0.75rem;  /* 12px - 面板 */
--radius-2xl:  1rem;     /* 16px - 模态框 */
--radius-full: 9999px;   /* 完全圆形 */
```

### 6.3 阴影系统

```css
/* 亮色主题 */
--shadow-sm:    0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md:    0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg:    0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl:    0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);

/* 暗色主题 (更深) */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
```

### 6.4 动画时间

```css
--transition-fast:   0.15s;
--transition-normal: 0.3s;
--transition-slow:   0.5s;

--ease-in:     cubic-bezier(0.4, 0, 1, 1);
--ease-out:    cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 7. 动画效果 (Animations)

### 7.1 Logo 呼吸动画

```css
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
    filter: drop-shadow(0 0 0 transparent);
  }
  50% {
    transform: scale(1.35);
    opacity: 0.9;
    filter: 
      drop-shadow(0 0 2px hsl(var(--primary) / 0.6))
      drop-shadow(0 0 4px hsl(var(--primary) / 0.4))
      drop-shadow(0 0 8px hsl(var(--primary) / 0.2));
  }
}
```

### 7.2 图表过渡动画

```css
@keyframes chart-fade-in {
  from { opacity: 0; transform: scale(0.98) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes chart-fade-out {
  from { opacity: 1; transform: scale(1) translateY(0); }
  to   { opacity: 0; transform: scale(0.98) translateY(-8px); }
}
```

### 7.3 卡片渐变扫光效果

```css
.model-card-gradient::after {
  background: linear-gradient(
    135deg,
    transparent 0%,
    transparent 40%,
    rgba(130, 130, 255, 0.15) 50%,
    rgba(180, 130, 255, 0.2) 60%,
    transparent 100%
  );
}

/* 暗色主题 */
.dark .model-card-gradient::after {
  background: linear-gradient(
    135deg,
    transparent 0%,
    transparent 40%,
    rgba(200, 200, 255, 0.12) 50%,
    rgba(220, 200, 255, 0.18) 60%,
    transparent 100%
  );
}
```

---

## 8. 文件索引

| 文件路径 | 内容 |
|----------|------|
| `app/globals.css` | 全局 CSS 变量、主题定义、动画 |
| `app/layout.tsx` | 字体引入、ThemeProvider 配置 |
| `app/page.tsx` | 首页布局、图表组件引用 |
| `components/theme-provider.tsx` | 主题 Provider 封装 |
| `components/theme-toggle.tsx` | 主题切换按钮组件 |
| `components/main-chart.tsx` | 主图表组件 (Recharts) |
| `components/crypto-candlestick-chart.tsx` | K线图组件 (lightweight-charts) |
| `components/ui/chart.tsx` | 图表基础组件 |
| `components/dot-screen-shader.tsx` | 背景色层 |
| `components/ethereal-shadows.tsx` | 毛玻璃效果层 |
| `lib/mock-data.ts` | AI 模型数据、图表数据生成 |
| `lib/utils.ts` | 颜色自适应工具函数 |

---

*文档生成时间: 2024年12月*
