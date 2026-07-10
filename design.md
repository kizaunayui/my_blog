# Kieran's Blog Design System & Art Style Guide

本文档为 Kieran 个人博客（`mysterious-newton`）的美术风格与设计规范指南。其目的是为未来维护此项目的 AI 助手或开发者提供统一的设计语言准则，以确保后续开发、设计改动和新页面的视觉一致性。

---

## 1. 设计核心理念 (Core Philosophy)

### ✦ 无界透明 (Borderless Transparency)

本博客最核心的视觉理念是**摒弃传统的「卡片式/毛玻璃容器」承载内容的设计**。

- **无容器感**：除订阅区等极少数需要高对比度强调的面板外，内容（文章列表、关于我、文章详情）应当**直接悬浮/漂浮于固定的艺术背景之上**，而不是被包裹在具有白/黑半透明背景（`bg-white/10`）和四周描边的卡片中。
- **背景融入**：通过精细控制文字阴影（`text-shadow`）、透明度（`opacity`）以及渐变分割线，让文字和交互元素自然融入多层动态叠加的深色背景。

### ✦ 优雅极简 (Elegant Minimalism)

- 拒绝繁琐和堆砌。不要使用粗重的边框、强烈的投影。
- 使用渐变线条作为逻辑分割，利用微动效（Micro-animations）和渐变色扫光增强视觉品质感与呼吸感。

---

## 2. 色彩系统 (Color System)

项目全面拥抱 **Tailwind CSS v4** 并广泛采用 **OKLCH 色彩空间**（以提供比 HSL 更均匀、平滑的感知明度渐变）。

### 2.1 基础色盘 (CSS Variables & OKLCH)

```css
:root {
  /* OKLCH 格式的主色调 (Primary) —— 偏桃红/玫瑰色系 */
  --color-primary-500: oklch(0.656 0.241 354.308);
  --color-primary-600: oklch(0.592 0.249 0.584);

  /* 辅助/强调色 (Accents) */
  --accent-pink: oklch(0.65 0.25 350); /* 偏粉红 */
  --accent-cyan: #06b6d4; /* 青色/蓝绿 (oklch(0.79 0.13 205)) */
  --accent-purple: rgba(192, 132, 252, 0.5); /* 紫色 */

  /* 基础灰度 (Slate Tones) */
  --color-gray-900: oklch(0.21 0.034 264.665);
  --color-gray-950: oklch(0.13 0.028 261.692);
}
```

### 2.2 渐变色规范

- **主渐变色带** (蓝→紫→粉)：在 Avatar 呼吸环、导航项 Hover 下划线等处统一使用：
  `linear-gradient(90deg, #60a5fa, #c084fc, #ec4899)`
- **主按钮渐变**：`linear-gradient(135deg, var(--color-primary-600), oklch(0.58 0.16 190))`
- **青色渐变 (Cyan-Sky)**：在首页 CTA 主要按钮中使用，提供高亮指引：
  `from-cyan-600 to-sky-500` （Hover 时提升明度 `from-cyan-500 to-sky-400`）

---

## 3. 字体与排版 (Typography)

字体的选用旨在烘托学术、技术随笔的精致感与专业度。

| 字体分类           | 字体名称             | 适用场景                     | 样式属性 (Tailwind Classes)                |
| :----------------- | :------------------- | :--------------------------- | :----------------------------------------- |
| **Sans (无衬线)**  | `Inter`              | 正文、标准 UI 文本           | `font-sans font-light`                     |
| **Heading (标题)** | `Outfit`             | 分类标签、元数据、英文标签   | `font-heading uppercase tracking-wider`    |
| **Serif (衬线)**   | `Cormorant Garamond` | 文章大标题、关键引言、Slogan | `font-serif font-light tracking-wide`      |
| **Display (展示)** | `Cinzel`             | Logo、网站标题               | `font-display tracking-[0.22em] uppercase` |

### 3.1 标题大小控制

为了避免大字重破坏排版的优雅感，文章详情页的标题应控制在合理范围内：

- **桌面端文章标题**：最大限制在 `text-3xl` 到 `text-4xl`（`font-serif font-light`），**严禁使用过大字号**（如 `text-5xl` 或 `text-6xl`）。
- **移动端文章标题**：使用 `clamp(2.15rem, 10vw, 3.25rem)` 进行自适应响应。

---

## 4. 关键布局与组件规范

### 4.1 全局艺术背景 (Cinematic Fixed Background)

整个站点底座由一个固定的艺术背景图、多层径向渐变（Radial Gradient）和微弱呼吸动效构成。

- **样式类**：`.site-fixed-bg`（位于网页底层，`z-index: 0`）。
- **动效**：通过 `@keyframes background-breathe` 保持 28s 的极轻微缩放与饱和度偏移，配合 `.hero-grid` 产生 22s 的网格漂移效果，营造深邃的极光/暗夜空间感。

### 4.2 优雅头部 (Header Elegant)

- **透明无边框**：绝对不允许卡片式背景或高斯模糊毛玻璃。
- **渐变底边分割线**：使用绝对定位的 `::after` 伪元素实现一条从两端向中间淡入的极细渐变线：
  ```css
  background: linear-gradient(
    90deg,
    transparent,
    rgba(148, 163, 184, 0.25) 20%,
    rgba(96, 165, 250, 0.3) 50%,
    rgba(148, 163, 184, 0.25) 80%,
    transparent
  );
  ```
- **导航链接动效**：`.header-nav-link` 使用 `::after` 渐变下划线。Hover 时通过改变 `transform-origin` (从 `right` 切换到 `left`) 实现丝滑的滑过（Sweep）展开效果。
- **头像光环**：头像包裹在 `.header-avatar-ring` 中，带有三色渐变旋转动效（`avatar-ring-glow`）和外发光（`box-shadow`）。

### 4.3 首页特色聚合 (Featured Spotlight)

首页的置顶特色文章使用 `.featured-spotlight` 样式：

- 顶端设有一条彩色渐变细线 `.featured-spotlight-line`。
- 背景完全透明，仅在 Hover 时在左侧渲染一个微弱的径向高光（`radial-gradient`）。
- **标签样式**：使用极其轻量化的扁平标签（`.rounded-full border border-white/10 px-2.5 py-0.5 text-white/45`）。

### 4.4 列表项 premium-row (Premium Row Item)

普通文章列表项通过级联的微交互实现高级感：

- **结构类**：`.premium-row` + `.post-card-motion`。
- **Hover 浮起**：向上平移 `translate3d(0, -0.28rem, 0)`。
- **光影扫过 (Shimmer Sweep)**：使用 `::after` 蒙版渐变，Hover 时从左至右扫过一道极淡的白光。
- **Hover 背景微显**：使用 `linear-gradient(90deg, rgba(255, 255, 255, 0.08), transparent 72%)` 轻轻托底。
- **标题链接下划线流光**：`.premium-row-link` 在 Hover 时拉伸出主色下划线。

### 4.5 文章详情页结构 (Post Content Layout)

文章详情页是排版设计的重中之重。

- **容器去卡片化**：正文使用 `.post-content-card.prose.dark:prose-invert`，去除原有的卡片背景与描边。
- **前言/摘录 (Blockquote)**：
  - 左侧带有一条 `oklch(0.79 0.13 205)` 的青蓝色粗竖线。
  - 背景由粉/青双色极其暗淡的渐变（`rgba(236,72,153,0.08)` / `rgba(14,165,233,0.06)`）组成，带来优雅的段落提神效果。
- **行内代码与代码块**：
  - 行内代码：使用微粉色边框与淡粉色文字高亮。
  - 代码块 (`pre`)：带有圆角（`border-radius: 1.25rem`），深色底色，并带有优雅的投影以确保代码易读性。
- **列表与表格**：表格 `.post-content-card table` 应支持横向滚动，表头使用粉/蓝渐变半透明托底，表格本身带有轻微的圆角。

### 4.6 关于我页面 (Author Subpage Layout)

- **左侧 Profile (`.author-profile-aside`)**：
  在左侧生成一条纤细的垂直渐变分隔线（`linear-gradient(180deg, transparent, rgba(34, 211, 238, 0.6), rgba(192, 132, 252, 0.4), transparent)`），避免使用标准的封闭方框。
- **右侧内容区 (`.author-content-area`)**：
  在顶部（或宽屏下的左侧）渲染一条横向渐变淡出的水平线，使左右两个区域在视觉上既有区隔又浑然一体。

---

## 5. 交互与动效规范 (Motion & Easing)

为了保证触觉般的流畅操作，必须使用合理的缓动函数（Easing Variables）：

```css
:root {
  /* 液体般丝滑的过渡：适用于菜单收展、大面积移动 */
  --ease-fluid: cubic-bezier(0.19, 1, 0.22, 1);

  /* 柔软的回弹过渡：适用于背景呼吸、高光漂移、卡片微悬浮 */
  --ease-spring-soft: cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

### 5.1 常用微动效参数

- **标签微弹 (Tag Bounce)**：Hover 时使用 `translate3d(0, -2px, 0) scale(1.035)`，配合 `cubic-bezier(0.19, 1, 0.22, 1)`。
- **按钮扫光 (Button Shimmer)**：按钮 Hover 时通过过渡 `left` 坐标将倾斜的白色渐变条从左侧快速滑到右侧。
- **页面加载渐入 (Fade Up)**：组件入场统一配置 `.animate-fade-up`，向上位移 18px 并淡入。列表项应通过 `transition-delay` 实现阶梯式（Staggered）淡入。

---

## 6. 严禁踩坑的视觉反模式 (Anti-Patterns / DO NOT DO)

AI 助手在修改或新增组件时，**绝对不可引入**以下被用户明确拒绝的视觉样式：

1. **禁止使用卡片式毛玻璃包裹页面大区**
   - 🛑 _错误_：`bg-white/10 backdrop-blur border border-white/20 rounded-2xl shadow-xl`。
   - ✅ _正确_：使用完全透明的背景，让内容直接呈现在网页的艺术背景上，仅用细线或投影作为暗示。
2. **禁止在桌面端将导航栏折叠为菜单/汉堡包形式**
   - 🛑 _错误_：在桌面端（宽屏）隐藏链接并使用 `☰ Menu` 按钮。
   - ✅ _正确_：直接平铺展示带有下划线流动动效的链接。
3. **禁止使用过大或过粗的文章标题**
   - 🛑 _错误_：使用 `text-5xl` 或 `text-6xl font-extrabold` 作为博文详情页标题。
   - ✅ _正确_：使用 `text-3xl` 或 `text-4xl font-light font-serif`，保持优雅与留白。
4. **禁止使用单调纯色或生硬的默认阴影**
   - 🛑 _错误_：`shadow-md`、纯黑文字、纯红色/纯蓝色的高亮。
   - ✅ _正确_：使用带有柔和颜色（如 Cyan/Pink）的彩色模糊投影，文字使用 `white/70` 或 `slate-200` 并伴有极轻微的 `text-shadow` 增强抗锯齿和可读性。

---

## 7. 影像杂志与数字档案语言 (Editorial Layer)

在原有电影感背景之上，页面采用“个人数字杂志 / 可检索档案”的编排方式，依靠字体、编号和细线建立秩序，而不是增加容器。

- **首页版次标记**：桌面端使用 `VOL. 01 / DIGITAL GARDEN` 纵向边缘标记，作为低对比度的杂志版次信息；移动端隐藏，避免占用正文空间。
- **编号体系**：特色内容、文章列表、标签索引统一采用两位数编号（`01`、`02`……）。编号使用展示字体、小字号和低透明度，只承担导航与节奏作用。
- **子页刊头**：文章归档、标签页使用 `.subpage-masthead`。刊头保持透明，以底部发光细线、Kicker 和小型版本信息构成层级，禁止重新包裹为毛玻璃大卡片。
- **索引列表**：标签和文章条目使用横向细线、留白与 Hover 光场，不使用独立圆角卡片。计数、日期和跳转箭头应作为元数据对齐。

### 7.1 高级动效原则

- **环境动效**：背景仅允许低透明度胶片颗粒、长周期呼吸和跟随指针的柔和光场，不做高频大幅位移。
- **景深反馈**：首页主文案可跟随指针产生不超过 `6px × 4px` 的轻微位移，缓动必须使用 `--ease-fluid`，移动端关闭。
- **滚动入场**：归档和标签条目可使用 CSS View Timeline 渐入；不支持时必须保持内容正常可见。
- **交互反馈**：Hover 以细线伸展、文字小幅位移、透明度变化为主。单次移动通常不超过 `0.35rem`。
- **无障碍**：所有持续动画必须受 `prefers-reduced-motion` 约束；动效不能成为理解内容或完成导航的前提。

### 7.2 无毛玻璃界面约束

- 全站界面不得使用 `backdrop-blur-*`、`backdrop-filter: blur()` 或带模糊效果的半透明大容器。
- 页面刊头、内容入口、文章列表、标签页、分页器、下拉菜单、移动菜单和浮动控件统一使用透明底、细分隔线与轻量 Hover。
- 代码块、Prompt 原文和播放器抽屉允许使用高不透明度的深色实体底，以保证可读性，但不得添加背景模糊。
- 首页保持既有排版关系，仅允许等比例缩小字号、控件和上下留白；不得再次拆分或重排主标题、按钮组与特色文章。
- 桌面首页首屏高度控制在约 `650px–680px`，主标题上限约 `60px–64px`；移动端优先减少纵向留白，不改变内容顺序。
