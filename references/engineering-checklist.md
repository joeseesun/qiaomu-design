# 工程验收清单（Engineering Checklist）

> 蒸馏自 Vercel Web Interface Guidelines（实测工程规范第一），
> 补充受控实验任务 E（组件面板）验证过的组件行为标准。
> 用途：实现表单/组件/生产页面前通读；审查 UI 代码时逐条对照，输出 `file:line` 格式。

## 一、无障碍（Accessibility）

- 纯图标按钮必须有 `aria-label`
- 表单控件必须有 `<label>`（可点击，`htmlFor` 或包裹）或 `aria-label`
- 动作用 `<button>`，导航用 `<a>`/`<Link>`——禁止 `<div onClick>`
- 图片有 `alt`（装饰性用 `alt=""`），装饰性图标加 `aria-hidden="true"`
- 异步更新（Toast、校验消息）用 `aria-live="polite"` 播报
- 优先语义 HTML，再考虑 ARIA；标题层级 `<h1>`-`<h6>` 连续，提供 skip-link
- 焦点可见：`:focus-visible` 环；禁止裸 `outline: none`
- 复合控件用 `:focus-within` 做组焦点

## 二、表单

- 输入用正确 `type`（email/tel/url/number）和 `inputmode`，带 `autocomplete`
- **永不阻止粘贴**（禁 `onPaste` + `preventDefault`）
- 邮箱/验证码/用户名禁用拼写检查
- checkbox/radio：label 与控件共享一个点击热区，无死区
- 提交按钮在请求发出前保持可用，请求中显示 spinner
- 错误内联显示在字段旁；提交失败自动聚焦第一个错误字段
- 占位符以 `…` 结尾并展示示例格式
- 有未保存修改时离开页面要警告
- 校验时机：blur 后即时校验，输入中不打扰

## 三、组件行为标准（实验任务 E 验证）

### Modal / 弹窗
- 打开：焦点移入弹窗（焦点陷阱），`Esc` 可关闭，遮罩点击行为明确
- 关闭：焦点返还触发元素
- `overscroll-behavior: contain` 防滚动穿透
- 居中入场 `scale(0.95→1)`，origin 保持 center

### 危险操作
- **永不即时执行**：确认弹窗或可撤销窗口二选一
- 不可逆的重度操作（删除工作区级别）用"输入名称解锁确认按钮"模式
- 危险区视觉隔离（红色语义 + 独立分区），确认按钮默认禁用态

### Toast
- `aria-live="polite"`，自动消退 3-5s，退出比进入快
- 从固定方位进出（空间一致性），可手动关闭
- 标签页隐藏时暂停计时

### Toggle / Switch
- `role="switch"` + `aria-checked`；用 transition（可中断）不用 keyframes

### Slider
- 实时数值回显；`aria-valuenow/min/max`；键盘方向键可调

### 表格
- 数字列 `tabular-nums` 右对齐；可排序列 `aria-sort`
- 长内容 `truncate`/`line-clamp`，flex 子项 `min-w-0`

### 错误页（404/500）
- 除"返回首页"外提供恢复路径：搜索或 3-5 条推荐链接
- 错误信息给下一步，不只是宣告错误

## 四、排版细节

- `…` 不是 `...`；弯引号不是直引号；`10&nbsp;MB`、品牌名用不换行空格
- 加载文案以 `…` 结尾（"保存中…"）
- 数字对比场景一律 `font-variant-numeric: tabular-nums`
- 标题 `text-wrap: balance` 防孤行，正文 `text-wrap: pretty`

## 五、内容与状态

- 文本容器处理超长内容：`truncate` / `line-clamp-*` / `break-words`
- 空字符串/空数组不渲染破碎 UI——设计空态
- 用户生成内容按"极短/正常/超长"三档设防

## 六、图片与性能

- `<img>` 显式 `width`/`height` 防 CLS；首屏外 `loading="lazy"`
- 大列表（>50 项）虚拟化或 `content-visibility: auto`
- 渲染路径禁 layout 读取（`getBoundingClientRect` 等）；批量读写 DOM
- CDN 域名 `<link rel="preconnect">`；关键字体 preload + `font-display: swap`

## 七、导航与状态

- URL 反映状态：筛选、标签页、分页、展开面板进 query params
- 链接用真 `<a>`（支持 Cmd+Click / 中键）

## 八、触控与布局

- `touch-action: manipulation` 防双击缩放延迟
- modal/drawer 内 `overscroll-behavior: contain`
- 拖拽中禁用文本选择
- 全出血布局用 `env(safe-area-inset-*)` 适配刘海
- `autoFocus` 仅桌面端单主输入场景

## 九、暗色模式与国际化

- 暗色主题：`<html>` 加 `color-scheme: dark`，`<meta name="theme-color">` 匹配底色
- 原生 `<select>` 显式 `background-color`/`color`（Windows 暗色兼容）
- 日期/数字/货币用 `Intl.*`，禁止硬编码格式
- 品牌名/代码 token 包 `translate="no"`

## 十、反模式（见到即标记）

`user-scalable=no` · 阻止粘贴 · `transition: all` · 无替代的 `outline-none` ·
div/span 当按钮 · 无尺寸图片 · 大数组直接 `.map()` · 无 label 表单 ·
无 `aria-label` 图标按钮 · 硬编码日期格式 · 无理由 `autoFocus`

## 审查输出格式

按文件分组，`file:line - 问题` 一行一条，可点击跳转，无废话：

```text
## src/Modal.tsx
src/Modal.tsx:12 - 缺 overscroll-behavior: contain
src/Modal.tsx:34 - "..." → "…"

## src/Card.tsx
✓ pass
```
