# Design Tokens: The "Liquid Brutalism" System

## 1. 核心动效哲学 (Motion Philosophy)
该网站的动效核心可以概括为 **"液态惯性 (Liquid Inertia)"**。所有的运动都不是线性或瞬间完成的，而是带有物理世界的"质量感"和"阻尼感"。

*   **关键词**: `Inertia` (惯性), `Lag` (滞后跟随), `Parallax` (视差), `Scrub` (拖拽播放).
*   **时间观**: 并不追求"快"，而是追求"稳"和"跟手"。

---

## 2. 基础视觉原子 (Atomic Design Tokens)

### A. 色板 (Color Palette)
极致的黑白灰底色，配合一个反直觉的"Green"变量（实际是天蓝色），制造冷峻的科技感。

| Token | Hex | Usage | Note |
| :--- | :--- | :--- | :--- |
| `--black` | `#1b1c1e` | 正文, 背景(深色模式), UI 边框 | 非纯黑，带有暖调的深灰炭色 |
| `--white` | `#f5f5f5` | 背景, 文字(反白), 鼠标光标 | 非纯白，类似纸张的米白色 |
| `--green` | `#65AFFF` | **核心强调色** | 虽然变量名叫 green，实际是 Cornflower Blue。用于 Hover、Loading 背景、按钮填充 |
| `--grey` | `#666666` | 次要文字 | - |

### B. 字体系统 (Typography System)
混合使用了极具个性的展示字体和几何无衬线体。

| Role | Font Family | Weights | Feature |
| :--- | :--- | :--- | :--- |
| **Primary** | `StelvioGrotesk` | 400, 600, 700 | 几何感强，用于 UI 和正文 |
| **Display** | `herbert` | 400 | 极具装饰性的衬线体，用于大标题 |
| **Accent** | `july` | 400 | 手写/装饰风格 |

*   **响应式排版**: 极其激进的 `clamp()` 缩放策略。
    *   `clamp(5rem, 25vw, 9999px)`: 标题随视口宽度线性剧烈放大，在大屏上产生震撼的“海报感”。

### C. 贝塞尔曲线 (The "Signature" Curves)
全站并非使用单一曲线，而是根据场景使用了三种不同质感的贝塞尔曲线。

1.  **UI 标准交互 (Standard UI)**
    *   **Value**: `cubic-bezier(.215, .61, .355, 1)` (var `--animation`)
    *   **Use**: 通用 Hover 反馈、颜色变化、次要位移。
    *   **Feel**: "Out-Cubic" 变体。启动快，收尾优雅。

2.  **戏剧性揭示 (Dramatic Reveal)**
    *   **Value**: `cubic-bezier(.99, -0.01, .06, .99)`
    *   **Use**: Loading 结束时的图片揭示、转场核心动画。
    *   **Feel**: 极其陡峭的 S 形曲线。中间几乎瞬间完成，头尾极慢。制造出"幕布瞬间拉开"的冲击感。

3.  **大屏/菜单运动 (Menu & Layout)**
    *   **Value**: `cubic-bezier(.19, 1, .22, 1)` (EaseOutExpo)
    *   **Use**: 全屏菜单展开、手机端导航条动画。
    *   **Feel**: 极速冲刺后长时间的缓缓滑行（指数级减速）。

---

## 3. 动效参数详解 (Animation Spec)

### A. 物理滚动 (Locomotive Scroll Settings)
这是"液态感"的来源。

| Parameter | Value | Description |
| :--- | :--- | :--- |
| `lerp` | **0.03** | 线性插值系数。0.03 是极低值（常规 0.1），带来极强的“溜冰”感和重量感。 |
| `smoothMobile` | `true` | 移动端强制开启平滑滚动，保证全平台体验一致。 |

### B. 文字分词动画 (Splitting & Stagger)
几乎所有大标题都使用了 `Splitting.js`。值得注意的是，动画执行并非完全依赖 GSAP，而是采用了更轻量的 **CSS 变量驱动** 方案。

*   **机制**: `Splitting.js` 将文字拆解并注入 `--word-index` 和 `--char-index` 变量。
*   **CSS 实现 (The "Waterfall" Effect)**:
    ```css
    .char {
      opacity: 0;
      transform: translateY(120%);
      will-change: transform;
      /* 核心节奏点 */
      transition: transform .8s var(--animation), opacity .8s var(--animation);
      /* 极其细腻的延迟计算：利用索引变量实现纯 CSS 的交错动画 */
      transition-delay: calc(.05s * var(--char-index)); 
    }
    ```
*   **节奏感**: 
    *   **Normal**: 0.05s 的字间延迟，产生流水般的顺滑感。
    *   **Slow**: 0.2s 的延迟，用于开场大标题，每个字母都像重锤一样敲击出来，极具分量感。

### C. 磁性光标 (Magnetic Cursor)
光标跟随使用了自定义的 Lerp 算法。

*   **Lag Factor**: `0.5` (光标每帧只追赶鼠标距离的 50%)。
    *   HTML 结构: `#mousepointer > div`
    *   Default: `scale(1)`
    *   Active: `scale(5)` (巨大化)
    *   Blend Mode: `difference` (差值混合模式，确保在黑底白字上都能看清)

### D. 微交互模式 (Micro-Interaction Patterns)

#### 1. "液态填充"按钮 (The Liquid Fill Button)
网站中的 CTA 按钮 (`.botton_g`) 并非简单的变色，而是容器内的物理填充。

*   **Structure**: 胶囊形外壳 (`border-radius: 70px`)。
*   **Effect**: 
    *   **Background**: 伪元素 `::after` 初始位置 `translateY(100%)`。Hover 时向上升起填满容器。
    *   **Content**: 内部文字和图标也是一组 `translateY` 运动。Hover 时当前文字上移消失，新文字（或反色文字）从下方顶入。
*   **Artistic Meaning**: 这种"杯子注水"般的填充感，再次呼应了"液态/物理"的主题。

#### 2. 汉堡菜单 (The Morphing Nav)
移动端菜单图标不是简单的 SVG 变换，而是几何图形的重组。
*   **Animation**: 圆点 (`::before`) 放大变形，线条 (`span`) 旋转错位。使用 `EaseOutExpo` 曲线，制造极速响应的机械感。

#### 3. 悬停揭示 (The Hover Reveal)
在列表页（如 Awards），鼠标划过文字列表时，相关图片会浮现。
*   **Interaction**: 
    *   **Position**: 图片容器 (`#img_aw`) 绝对定位，通过 JS 实时计算 `top` 值跟随当前行。
    *   **Delay**: 300ms 的延迟显示。这不是卡顿，而是为了防止用户快速划过列表时图片疯狂闪烁。只有当用户真正"关注"某一行时，图片才优雅地浮现。

### E. 戏剧性时刻 (Dramatic Moments)

#### The "Super-Scale" Loading
Loading 结束时的转场非常大胆，没有使用常见的 Fade Out。

*   **Action**: Loading 页面的 Logo 容器瞬间放大至 **250倍** (`scale(250)`) 并旋转 `-80deg`。
*   **Result**: Logo 的负空间（白色部分）迅速吞噬屏幕，无缝衔接到首页的白色背景。
*   **Curve**: `1s linear`。这里特意使用了线性曲线，配合巨大的缩放倍数，制造出一种"被黑洞吸入"或"极速穿越"的视觉冲击力。

### F. 数字计数器节奏 (The Counter Rhythm)
在展示数据时（如 Awards 数量），并没有让所有数字同时停下，而是设计了 **"阶梯式刹车"** 的节奏。

*   **Logic**:
    *   Counter 1 (Small): `Time: 100ms` | `Total: ~0.5s` (慢速，早停)
    *   Counter 2 (Medium): `Time: 30ms` | `Total: ~0.8s` (中速，中停)
    *   Counter 3 (Large): `Time: 20ms` | `Total: ~1.2s` (极速，晚停)
*   **Effect**: 这种差异化的结束时间制造了"涟漪"般的视觉残留，避免了机械的统一停止感，让数据展示过程更具呼吸感。

---

## 4. 布局系统 (The Grid)

网站采用了极高密度的网格系统，而非传统的 12 列网格。

*   **Columns**: **32 列** (`grid-template-columns: repeat(32, 1fr)`)
*   **Philosophy**: 高密度的网格允许元素极其精细地错位排列（比如占 1-13 列，下一行占 4-20 列），打破了传统网页的"方块感"，制造出类似平面杂志排版的自由度。

### 5. 技术微调 (Technical Nuances)
除了显性的动效，还有两个隐性的技术细节保证了体验的"固体感"。

#### A. 视口高度修正 (The 100vh Fix)
为了解决移动端浏览器地址栏伸缩导致的抖动，网站并没有直接使用 CSS `100vh`。
*   **JS**: 实时计算 `let vh = window.innerHeight * 0.01;` 并写入 CSS 变量 `--vh`。
*   **CSS**: `height: calc(var(--vh, 1vh) * 100);`
*   **Result**: 无论在 Safari 还是 Chrome 移动版，全屏区块永远稳如磐石，不会因为滚动出现令人恼火的跳动。

#### B. 背景图平滑缩放 (Smooth Background Resizing)
CSS 的 `background-size: cover` 是无法直接做平滑 transition 动画的（会卡顿或跳变）。
*   **Solution**: 作者编写了一个自定义 GSAP 插件 `BackgroundSizePlugin`。
*   **Logic**: 插件会读取图片的自然尺寸 (`naturalWidth`) 和容器尺寸，手动计算出 `cover` 状态下的具体像素值 (e.g., `1920px 1080px`)，然后通过 GSAP 对像素值进行插值动画。
*   **Effect**: 使得背景图在视差滚动或交互时，能像普通 `img` 元素一样丝滑缩放。

#### C. 滚动重置机制 (The Scroll Reset Strategy)
在 `setup.js` 中频繁出现 `invalidateOnRefresh: true` 和 `ScrollTrigger.saveStyles(...)`。
*   **Problem**: 移动端浏览器地址栏的伸缩会触发 `resize` 事件，导致 GSAP 重新计算 ScrollTrigger 的 `start/end` 位置，容易造成布局跳动或错位。
*   **Solution**: 
    *   `saveStyles`: 在动画计算前保存元素的原始内联样式。
    *   `invalidateOnRefresh`: 强制 ScrollTrigger 在刷新时重新计算所有依赖的函数值，而不是使用缓存值。
*   **Takeaway**: 做复杂 Scroll 动画时，这是保证移动端“不崩坏”的保命符。

---

## 6. 页面级叙事 (Page-Level Storytelling)
除了通用组件，每个页面都有自己独特的“动效叙事语言”，通过 ScrollTrigger 绑定滚动进度。

#### 1. 散落的照片 (The Scattering Photos) - *My Story Page*
在“我的故事”页面，照片并不是静态排列的，而是模拟了“把照片撒在桌面上”的物理过程。
*   **Code**:
    ```javascript
    gsap.to("#img_begin3", {
      rotateZ: "-60deg",
      translateX: "-180%",
      translateY: "40%",
      opacity: 0,
      scrollTrigger: { scrub: 1 }
    });
    ```
*   **Effect**: 随着向下滚动，原本堆叠的照片向四周**旋转并飞出**。
*   **Artistic**: 这种“散开”的动作暗示了回忆的展开，赋予了静态图片以时间维度。

#### 2. 文本老虎机 (The Text Slot Machine) - *My Story Page*
在介绍 K95 工作室哲学时，使用了类似老虎机的垂直轮播效果。
*   **Code**:
    ```javascript
    gsap.to("#words_k95 div>span", {
      translateY: "-100%", // -> -200% -> -300%
      duration: 1,
      scrollTrigger: { toggleActions: "restart none none reverse" }
    });
    ```
*   **Effect**: 用户滚动到特定位置时，文字像机械结构一样“卡”入位置。
*   **Nuance**: 这里的 `toggleActions` 设置为 `reverse`，意味着回滚时动画会倒放，保证了交互的双向流畅性。

#### 3. 漂浮气球 (The Floating Balloons) - *Type Design Page*
字体展示页面的图片模仿了氦气球的物理特性。
*   **Code**:
    ```javascript
    gsap.to("picture", {
      translateY: "-200%", // 向上浮动速度极快（2倍于滚动速度）
      rotate: "-20deg",    // 同时轻微旋转
      scrollTrigger: { scrub: 1 }
    });
    ```
*   **Effect**: 这种“又浮又转”的运动打破了网页的垂直网格，制造了失重感。

#### 4. 品牌倾斜 (The Brand Tilt) - *Home Page*
在展示合作品牌 Logo 墙时，使用了交错倾斜。
*   **Logic**: 左侧列向左倾斜 `-8deg`，右侧列向右倾斜 `8deg`。
*   **Trigger**: `scrub: 1` 绑定滚动。
*   **Result**: 滚动越快，倾斜角度越明显（虽然代码是定值，但视觉上会产生这种错觉），模拟了赛车过弯时的离心力。

#### 5. 流体设备 (The Fluid Device) - *Adaptive Page*
Adaptive 页面核心在于展示响应式设计理念，通过改变容器宽度来直观演示。
*   **Code**:
    ```javascript
    gsap.to("#sp_center", {
      width: "16%", // 从全宽缩小到类似手机的宽度
      scrollTrigger: { scrub: 1 }
    });
    ```
*   **Effect**: 随着滚动，一个全屏的容器平滑地“瘦身”成一个手机屏幕的比例。
*   **Metaphor**: 不用文字解释“什么是响应式”，而是让用户通过滚动亲自“挤压”页面，体验流体布局的特性。

#### 6. 锁孔揭示 (The Keyhole Reveal) - *My Story (Meedori)*
在讲述 Meedori 项目时，使用了复杂的蒙版动画。
*   **Code**:
    ```javascript
    // 1. Deep Zoom Out
    foto_meedori.from("#meedori_foto", {
      backgroundSize: { scale: 1.5 } // 配合自定义插件
    });
    // 2. Mask Expansion
    foto_meedori_2.to("#meedori_foto", {
      maskSize: "1400vh", // 蒙版巨大化，从一个小圆点扩散到全屏
      scrollTrigger: { scrub: 1 }
    });
    ```
*   **Effect**: 仿佛透过钥匙孔窥视，然后视线瞬间豁然开朗。这种“窥视->全景”的叙事节奏非常抓人眼球。

#### 7. 液态手风琴 (The Liquid Accordion) - *Goals Page*
列表的展开不仅仅是高度变化。
*   **Interaction**: 点击展开详情。
*   **Detail**: 动画结束后 (`setTimeout 1000ms`) 必须调用 `smoothScroll.update()`。因为 Locomotive Scroll 是基于 transform 的虚拟滚动，DOM 高度变化后如果不通知它，会导致滚动条长度错误（用户滚不到底部）。这是开发虚拟滚动网站时最容易忽略的 **"坑"**。

#### 8. 宇航员的穿越 (The Astronaut's Warp) - *Home Page*
首页开场是一个极其大胆的长距离 ScrollTrigger 序列。
*   **Code**:
    ```javascript
    home_astronauta_2.to("#astronauta img", {
      scale: "80",       // 放大80倍！
      translateY: "-900%", // 向上飞出屏幕
      scrollTrigger: { scrub: 2 } // 这里的 scrub 设为 2，增加了极大的阻尼感
    });
    ```
*   **Effect**: 用户向下滚动时，不是页面向上移动，而是视点向宇航员头盔“撞”过去。
*   **Transition**: 配合 `#sfondo_black` 的透明度变化，模拟进入太空深处的黑暗或穿越虫洞的感觉。

#### 9. 矛盾的挣扎 (The Struggle Expansion) - *Home Page*
在 "Fight" 章节，容器从页面一部分强制撑满全屏。
*   **Code**:
    ```javascript
    fight_3.to("#agitatevi", {
      width: "100vw",
      height: "100vh",
      bottom: "0px",
      scrollTrigger: { scrub: 1 }
    });
    ```
*   **Narrative**: 这种霸道的全屏占据，强迫用户在这个时刻只能关注这一个信息点，非常有力量感。

---

## 7. 开发复刻指南 (Replication Guide)

如果你要在 React/Next.js 中复刻此效果：

### 1. 核心依赖
*   `gsap`: 动画引擎
*   `@studio-freight/lenis`: 替代 Locomotive Scroll，更现代，无侵入性。
*   `splitting` (或 React 替代品): 用于文字分割。

### 2. 全局 CSS 变量注入
```css
:root {
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-signature: cubic-bezier(.215, .61, .355, 1); /* 核心曲线 */
  --black: #1b1c1e;
  --white: #f5f5f5;
  --accent: #65AFFF;
}
```

### 3. 组件化动效 (React Hook 示例)
封装一个通用的视差组件：

```tsx
// useParallax.ts
import { useScroll, useTransform } from 'framer-motion';

export const useParallax = (ref, distance = 100) => {
  const { scrollYProgress } = useScroll({ target: ref });
  // 模拟 Locomotive 的 scrub 效果
  return useTransform(scrollYProgress, [0, 1], [0, distance]);
};
```

### 4. 关键交互复刻
*   **图片**: 加上 `transform: scale(1.1)` 的容器 overflow hidden，滚动时让图片 `y` 轴轻微移动，制造"窗景感"。
*   **文字**: 只要进入 Viewport，必须触发 `y: 100% -> 0%` 的升起动画，**拒绝静态展示**。
