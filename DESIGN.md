# 个人博客设计文档

> 本文档描述博客的视觉设计体系、颜色方案、排版规范和动画风格。
> 新增页面或组件时，必须遵循本文档的风格约定。

## 技术栈

| 层级 | 选型 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| UI 库 | shadcn/ui + Radix UI |
| 样式 | Tailwind CSS v4 (oklch 颜色空间) |
| 动画 | Framer Motion |
| 图标 | Lucide React |
| 富文本 | Tiptap Editor (博客编辑) / react-markdown (渲染) |
| 部署 | Vercel (自动部署) |

## 颜色体系

### 核心色板（oklch 颜色空间）

```
--primary:     oklch(0.55 0.2 250)   → 蓝紫色主色
--accent:      oklch(0.94 0.02 200)   → 浅蓝辅助色
--background:  oklch(0.99 0 0)        → 几乎纯白背景
--foreground:  oklch(0.2 0.01 240)    → 深色文字
--muted:       oklch(0.96 0.01 240)   → 浅灰背景
--border:      oklch(0.92 0.01 240)   → 边框色
```

### 季节主题

博客支持四个季节主题，通过 CSS 变量动态切换：

- **春** (`.spring`) — 粉绿色调 `hue=155`
- **夏** (`.summer`) — 橙蓝撞色 `hue=55`
- **秋** (`.autumn`) — 暖橙色调 `hue=50`
- **冬** (`.winter`) — 纯净蓝白 `hue=220`

每个季节在浅色/深色模式下各有一套配色。

### 天气主题

天气效果叠加在季节主题上，只微调 accent 和 background，不覆盖 primary：
- `.weather-sunny` / `.weather-cloudy` / `.weather-overcast`
- `.weather-rainy` / `.weather-thunderstorm` / `.weather-snowy` / `.weather-windy`

### 深色模式

通过 `.dark` 类切换，`next-themes` 管理状态。深色模式下背景为 `oklch(0.145 0 0)`。

## 排版

### 字体

- **正文**：`PingFang SC` → `Hiragino Sans GB` → `Microsoft YaHei` → 系统无衬线（中文优先）
- **等宽**：`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas`
- **衬线**：`Noto Serif SC` → `Songti SC` → `SimSun`（中文优先）

### 圆角

统一使用 CSS 变量 `--radius: 0.625rem`（约 10px），所有组件通过 `var(--radius)` 派生。

### 间距

- 页面顶部留白：`pt-24`（导航栏高度补偿）
- 页面底部留白：`pb-20`
- 内容最大宽度：`max-w-4xl` / `max-w-5xl` / `max-w-6xl`（按页面复杂度）
- 水平内边距：`px-4 sm:px-6`

## 动画规范

### Framer Motion 预设

项目中常用的动画变体：

```ts
// 容器入场（子元素交错）
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

// 子元素入场
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
```

### 微交互

- `whileHover: { scale: 1.05 }` — 悬停放大
- `whileTap: { scale: 0.95 }` — 点击缩小
- `whileInView` — 滚动触发动画

### CSS 动画工具类

| 类名 | 效果 |
|------|------|
| `.animate-fade-in-up` | 淡入上移 |
| `.animate-fade-in` | 淡入 |
| `.animate-slide-in-left` | 左滑入 |
| `.animate-float` | 上下浮动 |
| `.animate-aurora` | 极光波动 |
| `.animate-shimmer` | 闪光扫过 |
| `.animate-twinkle` | 闪烁 |

### 交互增强

- `.hover-lift` — 悬停上浮 + 阴影
- `.card-hover` — 卡片悬停效果

## 组件风格

### 卡片

- 圆角：`rounded-xl` 或 `rounded-2xl`
- 边框：`border border-border`
- 背景：`bg-card`
- 悬停：`hover:shadow-xl hover:border-primary/30`
- 玻璃效果：`bg-card/50 backdrop-blur-sm`

### 按钮

使用 shadcn/ui Button 组件，常用变体：
- `variant="default"` — 主色按钮
- `variant="outline"` — 边框按钮
- `size="sm"` — 小尺寸

### 导航栏

- `fixed top-0 z-50` 固定顶部
- `bg-background/80 backdrop-blur-md` 毛玻璃效果
- 渐入动画：初始 `translateY(-100px)` 动画到 `translateY(0)`

### 头像

- `rounded-full` 圆形
- 呼吸光晕效果：`box-shadow` 动态变化

## 页面布局模式

```
<main className="min-h-screen ...">
  <div className="max-w-[N]xl mx-auto px-4 sm:px-6 py-12">
    {content}
  </div>
</main>
```

常用背景渐变：`bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900`

## 视觉特效

### 渐变文字
`.gradient-text` — `primary → accent` 渐变文字

### 玻璃态
`.glass` — 毛玻璃卡片效果（`backdrop-filter: blur`）

### 渐变边框
`.gradient-border` — 渐变色边框卡片（`mask-composite` 技术）

### 粒子效果
`SeasonParticles` 组件 — 根据季节/天气渲染不同粒子动画（樱花、雨滴、雪花等）

### 滚动条
自定义细滚动条，`width: 8px`，圆角，半透明

## 设计原则

1. **简约优先** — 不过度装饰，留白充分
2. **中文友好** — 字体栈中文字体优先
3. **动画克制** — 入场动画轻柔，不像企业官网那样大动效
4. **一致圆角** — 所有组件使用 `rounded-md`（10px base）
5. **oklch 色彩** — 统一使用 oklch 颜色函数，便于主题化
6. **响应式** — 移动端优先，`sm:` / `md:` / `lg:` 断点
