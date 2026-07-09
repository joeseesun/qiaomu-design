# 动效工艺规范（Motion Craft）

> 蒸馏自 Emil Kowalski 的设计工程哲学（Sonner / Vaul 作者，13M+ 周下载）。
> 核心信念：用户注意不到的细节会复利叠加成"说不出为什么但就是好用"的体验。
> 2026-07-09 对齐 `emilkowalski/skills` upstream：补入 review-animations、animation-vocabulary、
> apple-design 的场景分流。

## 零、先选正确手册

- **写动画/过渡/交互反馈**：先读本文件。
- **做手势驱动 UI**（sheet、drawer、swipe、drag、carousel、spring、透明浮层）：同时读
  `apple-fluid-interfaces.md`。
- **审查动效代码**：按 `motion-review.md` 输出 Before / After / Why 表格。
- **用户只是在描述"那个动效叫什么"**：先查 `animation-vocabulary.md`，把感觉转成准确术语。

## 一、动画决策框架（写任何动画代码前按序回答）

### 1. 该不该动？——看使用频率

| 频率 | 决定 |
|------|------|
| 每天 100+ 次（键盘快捷键、命令面板开关） | **永不动画** |
| 每天几十次（hover、列表导航） | 移除或大幅缩短 |
| 偶尔（弹窗、抽屉、Toast） | 标准动画 |
| 稀有/首次（onboarding、成功庆祝） | 可以给惊喜 |

**键盘触发的操作永不动画。** Raycast 的开关没有动画，那就是每天用几百次的东西的最优体验。

### 2. 为什么动？——必须有明确目的

合法目的：空间一致性（Toast 从哪进就从哪出）、状态指示、反馈（按压缩放确认"我听到了"）、
防突变（元素凭空出现/消失感觉像坏了）。
如果答案只是"看起来酷"而且用户会经常看到——不要动。

### 3. 用什么缓动？

```
入场/出场？        → ease-out（起步快，感觉响应及时）
屏幕上移动/变形？  → ease-in-out
hover/颜色变化？   → ease
匀速运动（跑马灯）？→ linear
默认               → ease-out
```

**内置 CSS 缓动太弱，必须用自定义曲线：**

```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);   /* UI 交互强化 ease-out */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* 屏上移动 */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* iOS 式抽屉 */
```

**永不用 ease-in**：起步慢会让界面在用户盯得最紧的瞬间显得迟钝。

### 4. 多快？

| 元素 | 时长 |
|------|------|
| 按钮按压反馈 | 100-160ms |
| Tooltip、小型 popover | 125-200ms |
| 下拉、select | 150-250ms |
| 弹窗、抽屉 | 200-500ms |
| 营销/叙事动画 | 可以更长 |

**UI 动效上限 300ms。** 180ms 的下拉比 400ms 的感觉响应更快；转得快的 spinner
让加载显得更短（感知性能与真实性能同等重要）。

## 二、组件动效原则

### 按钮必须有按压感
```css
.button { transition: transform 160ms var(--ease-out); }
.button:active { transform: scale(0.97); }
```
适用于一切可按元素，缩放幅度 0.95-0.98。

### 永不从 scale(0) 入场
现实世界没有东西凭空出现。从 `scale(0.95) + opacity: 0` 起步。

### Popover 要感知触发源
`transform-origin` 设为触发器位置（Radix: `var(--radix-popover-content-transform-origin)`）。
**例外：Modal 保持居中 origin**——它不锚定任何触发器。

### Tooltip 二次悬停跳过延迟
第一个 tooltip 有延迟防误触；打开后相邻 tooltip 即时出现、无动画。

### 快速触发的 UI 用 transition 不用 keyframes
transition 可中断可重定向；keyframes 每次从零重播。Toast、开关这类会被连点的
组件必须用 transition。

### 入场用 @starting-style（现代 CSS）
```css
.toast {
  opacity: 1; transform: translateY(0);
  transition: opacity 400ms ease, transform 400ms ease;
  @starting-style { opacity: 0; transform: translateY(100%); }
}
```

### 不对称进出时序
系统响应要快：退出比进入快（enter 400ms / exit 250ms）。
用户决策要慢：hold-to-delete 按住 2s linear，松手 200ms ease-out 弹回。

### crossfade 不顺就加微模糊
两状态交叉时叠影不自然，过渡期加 `filter: blur(2px)` 骗过眼睛。模糊 < 20px（Safari 开销大）。

## 三、弹簧与可中断性

弹簧没有固定时长，它用物理参数自然收敛。适合：

- 拖拽释放、swipe-to-dismiss、可抓取 sheet
- 用户可能中途反向或打断的动画
- 装饰性 mouse tracking（不服务精确读数）
- 需要继承速度的物理化界面

默认不要弹。专业 UI 用接近 critically damped 的 spring；只有用户 flick / throw / drag release
带来真实动量时，才给 0.1-0.3 的轻微 bounce。

```js
// Apple/Motion 风格，容易推理
{ type: "spring", duration: 0.4, bounce: 0 }

// 动量释放才允许轻微弹性
{ type: "spring", duration: 0.4, bounce: 0.2, velocity }
```

可中断 UI 从**当前屏幕值**继续，而不是从逻辑目标值重开。keyframes 会从零重播；
transition 可重定向；手势最好用 spring。

## 四、Stagger（交错入场）

多元素同时入场时，每项延迟 30-80ms 依次出现：

```css
.item { opacity: 0; transform: translateY(8px); animation: fadeIn 300ms var(--ease-out) forwards; }
.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }
```

延迟过长会显得慢。stagger 是装饰——播放期间绝不阻塞交互。

## 五、性能铁律

- **只动 `transform` 和 `opacity`**（跳过 layout/paint，跑 GPU）
- 禁止动 `width` / `height` / `margin` / `padding` / `top` / `left`
- 拖拽时直接改元素 `style.transform`，不要改父级 CSS 变量（会触发全子树重算）
- CSS 动画跑合成线程，主线程繁忙时也不掉帧；JS 动画（rAF）会掉。
  预定动画用 CSS，动态可中断的用 JS
- 需要 JS 控制又要 CSS 性能时用 WAAPI：`element.animate([...], { easing: 'cubic-bezier(...)' })`
- Framer Motion / Motion 在高负载场景不要用 `x` / `y` / `scale` shorthand；用完整
  `transform: "translateX(...)"` 才更接近 GPU 合成路径
- `will-change` 只在临近动画时使用；长期挂在大量元素上会浪费内存

## 六、无障碍

```css
@media (prefers-reduced-motion: reduce) {
  /* 保留有助理解的 opacity/color 过渡，移除位移类动画 */
}
@media (hover: hover) and (pointer: fine) {
  /* hover 动效只在真指针设备生效，防触屏误触发 */
}
```

reduced-motion 是"更少更温和"，不是"全部归零"。

## 七、拖拽手势（进阶）

- **即时响应**：按下那一刻就给反馈，不等 `click` 或手势结束
- **1:1 跟手**：拖拽时内容跟着指针，保留用户抓取位置偏移，不瞬移到中心
- **动量判定**：`velocity = |dragDistance| / elapsedTime`，> 0.11 即可 dismiss，
  不强制拖过阈值——快速一甩就该生效
- **速度交接**：释放时把 velocity 交给 spring；否则松手瞬间会断
- **投射落点**：用 release velocity 预测 resting point，再吸附到最近 snap point
- **边界阻尼**：拖过自然边界时递增阻力，现实中的东西是先减速不是撞墙
- **pointer capture**：拖拽开始后捕获所有指针事件，出界不断
- **多指保护**：拖拽中忽略新增触点，防止换手指跳位
- **hysteresis**：约 10px 后再确认横/纵向意图，减少误判

涉及 sheet/drawer/swipe/carousel 时，不要只看本节；必须追加读 `apple-fluid-interfaces.md`。

## 八、调试动效

- 慢放到 2-5 倍，看缓动是否突然停、origin 是否错、颜色/透明度是否错拍
- 用 Chrome DevTools Animations 面板逐帧看关键帧
- 手势必须在真实触控设备或至少移动端模拟里测试；复杂手势只看桌面鼠标不算验收
- 次日用新鲜眼睛复查。全速下看不到的问题，隔天常常会跳出来

## 九、动效一致性（Cohesion）

动效风格必须匹配组件人格：玩具感的产品可以弹一点，专业仪表盘必须干脆利落。
缓动、时长、视觉设计、命名要在同一个气质里。隔天用新鲜眼睛慢放复查动画——
全速下看不见的时序问题在慢放里无所遁形。

## 审查对照表

| 问题 | 修复 |
|------|------|
| `transition: all` | 逐属性声明 |
| `scale(0)` 入场 | `scale(0.95) + opacity: 0` |
| `ease-in` | `ease-out` 或自定义曲线 |
| popover 居中 origin | origin 对准触发器（modal 除外） |
| 键盘操作有动画 | 删除动画 |
| UI 时长 > 300ms | 降到 150-250ms |
| hover 无媒体查询 | 包 `@media (hover: hover)` |
| 连点组件用 keyframes | 换 transition |
| 高频/键盘操作有动画 | 删除动画 |
| 动了 layout 属性 | 换 `transform` / `opacity` |
| 拖拽用父级 CSS 变量驱动子级 | 直接改当前元素 `style.transform` |
| Framer Motion 高负载动效用 `x/y/scale` | 用完整 `transform` 字符串 |
| 手势释放没有 velocity handoff | 把 release velocity 交给 spring |
| 边界硬停 | 加 rubber-band / friction |
| 进出同速 | 出场更快 |
| 全员同时出现 | 加 30-80ms stagger |
