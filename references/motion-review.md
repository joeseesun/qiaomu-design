# 动效专项审查（Motion Review）

> 来源：Emil Kowalski `review-animations` 与 `STANDARDS.md`。
> 用途：审查动画/过渡/手势代码时使用；交付前若任何动效"说不清是否舒服"，也按本文件过一遍。

## 何时使用

- 用户要求 review / 审查 / 看看动画 / 动效是否对
- 代码里出现 `transition`、`animation`、`@keyframes`、Framer Motion / Motion、WAAPI、drag/swipe/spring
- 页面体验里出现 sluggish、卡顿、忽隐忽现、从奇怪位置冒出、手势不跟手
- preflight C 节有任一项不确定

纯非动效代码审查走 `engineering-checklist.md`；动效专项审查必须优先找体验回归，不做泛泛表扬。

## 审查姿态

动效不是"跑了就行"。一个过渡如果让高频动作变慢、从错误 origin 出现、不能中断、掉帧、
或只是在炫技，就是回归。默认质疑，批准要靠证据。

## 十条硬标准

1. **动效有目的**：只能用于空间一致性、状态指示、解释、反馈、防突变；"看起来酷"不是理由。
2. **频率匹配**：键盘触发和每天 100+ 次操作不动画；每天几十次的操作只保留极短反馈。
3. **响应式缓动**：进入/离开用强化 `ease-out`；屏幕内移动用 `ease-in-out`；UI 禁 `ease-in`。
4. **UI 低于 300ms**：按钮 100-160ms，tooltip 125-200ms，下拉 150-250ms；超过必须解释。
5. **物理正确**：popover/dropdown/tooltip 从触发器 origin 缩放；modal 才保持 center；禁 `scale(0)`。
6. **可中断**：toast、toggle、drag 等快速/手势触发场景用 transition 或 spring，不用重播 keyframes。
7. **GPU 友好**：只动 `transform` / `opacity`；避免 layout 属性、父级 CSS 变量驱动子级 transform。
8. **可访问**：`prefers-reduced-motion` 有温和替代；hover 动效只在真鼠标/触控板设备启用。
9. **进出不对称**：用户决策阶段可慢，系统响应必须快；按住确认慢，松手/取消快。
10. **气质一致**：专业仪表盘干脆，玩具/庆祝可弹；动效人格和视觉人格必须同一种语言。

## 见到即标记

- `transition: all`
- UI 上的 `ease-in`
- `scale(0)` 或纯 fade 入场
- 高频动作/键盘快捷键/命令面板开关带动画
- UI 动画 > 300ms 且无理由
- trigger-anchored popover 使用 `transform-origin: center`
- 快速触发组件用 `@keyframes`
- 动 `width` / `height` / `margin` / `padding` / `top` / `left`
- Framer Motion 在高负载场景用 `x` / `y` / `scale` shorthand 而不是完整 `transform`
- 拖拽中更新父级 CSS 变量导致整棵子树重算
- 缺 `prefers-reduced-motion`
- hover 动效没包 `@media (hover: hover) and (pointer: fine)`
- hold / press 场景进出同速
- 多个元素一起出现而没有 30-80ms stagger

## 修复优先级

1. **删除动效**：高频、键盘、无目的的动效先删。
2. **缩小动效**：缩短时长、减小位移、减少属性。
3. **修缓动**：`ease-in` 改强化 `ease-out` / 自定义曲线。
4. **修 origin 与物理感**：触发器 origin、`scale(0.95)+opacity`。
5. **修可中断**：keyframes 改 transition；手势改 spring。
6. **修性能**：layout 属性改 `transform` / `opacity`；必要时用 WAAPI。
7. **修时序**：用户决定慢，系统响应快；enter/exit 不同速。
8. **抛光**：crossfade 加微模糊、列表 stagger、`@starting-style`。
9. **补 a11y 与 cohesion**：reduced-motion、hover gating、动效人格统一。

## 必须输出格式

动效审查必须先给一张 Markdown 表格，不用普通列表：

| Before | After | Why |
| --- | --- | --- |
| `transition: all 300ms` | `transition: transform 200ms var(--ease-out)` | `all` 会动到非 GPU 属性，且未来改样式容易误伤 |
| `transform: scale(0)` | `transform: scale(0.95); opacity: 0` | 元素不应凭空从无到有，轻微尺度 + 透明度更自然 |
| dropdown 用 `ease-in` | 强化 `ease-out` | 入场要马上响应，`ease-in` 在用户盯着的瞬间显迟钝 |

表格后再给结论，按影响排序：

1. 体感破坏：迟钝、凭空出现、高频/键盘动作动画。
2. 应删除/减弱的动效。
3. 性能风险：非 GPU 属性、掉帧、重算。
4. 可中断与时序问题。
5. origin、物理感与气质一致性。
6. 无障碍问题。

最后明确：

- **Block**：出现体感破坏、键盘/高频动画、`scale(0)`、UI `ease-in`、容易修的非 GPU 动画。
- **Approve**：没有上述问题，时长/缓动合格，可中断和 reduced-motion 都处理了。

有源码时必须引用 `file:line`。没有源码时，明确说这是体验层观察，需要截图/录屏/DevTools 慢放确认。
