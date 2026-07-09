# 动效术语词典（Animation Vocabulary）

> 来源：Emil Kowalski `animation-vocabulary`。
> 用途：用户描述一个动效但不知道名字时，先命名；写给设计师、AI、动效实现者的 brief 时，使用这里的准确词。

## 使用规则

1. 先读用户描述的**感觉和画面**，不要只匹配关键词。
2. 先给最贴近的术语，再给 1-2 个易混替代项。
3. 如果没有完全对应的术语，说明是近似组合，不发明野词。
4. 写 brief 时优先用英文术语 + 中文解释，避免实现者误会。

输出格式：

```md
**Origin-aware animation** — 元素从触发它的按钮/位置长出来，而不是从自身中心缩放。

近似但不同：
- **Scale in**：只是从小到大出现，不一定锚定触发源。
- **Shared element transition**：同一个元素跨位置移动和变形。
```

## 入口与离场

| 术语 | 用法 |
| --- | --- |
| Fade in / Fade out | 通过透明度出现/消失；最克制，但也最容易无聊 |
| Slide in | 从屏幕边缘或容器外滑入，适合 drawer / toast / panel |
| Scale in | 从较小尺寸放大到原尺寸，通常配合 fade |
| Pop in | Scale in 带轻微 overshoot；只用于轻快/玩具感场景 |
| Reveal | 用 clip-path / mask 逐步揭示内容 |
| Enter / Exit | 元素加入或离开界面的入场/退场动画 |

## 编排与时序

| 术语 | 用法 |
| --- | --- |
| Keyframes | 固定关键帧动画；适合预定动画，不适合快速触发 UI |
| Interpolation / Tween | 在起点和终点之间生成连续中间帧 |
| Stagger | 多个元素按 30-80ms 间隔依次出现 |
| Orchestration | 多个动效按一个节奏编排成整体 |
| Delay | 动画开始前的等待；UI 中慎用 |
| Duration | 动画持续时间；UI 默认 < 300ms |
| Fill mode | 动画前后是否保留首帧/尾帧样式 |
| Stepped animation | 离散帧动画，如倒计时或机械翻页 |

## 运动与变形

| 术语 | 用法 |
| --- | --- |
| Translate | 沿 X/Y 轴移动 |
| Scale | 放大/缩小，按压反馈常用 `scale(0.97)` |
| Rotate | 旋转 |
| Skew | 斜切变形，UI 中少用 |
| 3D tilt / Flip | `rotateX` / `rotateY` 带景深的翻转或倾斜 |
| Perspective | 3D 透视强度；数值越小越夸张 |
| Transform origin | 变形锚点 |
| Origin-aware animation | 从触发源展开，如 popover 从按钮位置长出来 |

## 状态与页面转换

| 术语 | 用法 |
| --- | --- |
| Crossfade | 两个状态在同一位置交叉淡入淡出 |
| Continuity transition | 用连续视觉线索让用户知道前后状态的关系 |
| Morph | 一个形状平滑变成另一个形状，如 Dynamic Island |
| Shared element transition | 同一元素跨位置移动并缩放/变形 |
| Layout animation | 布局变化时元素平滑移动到新位置 |
| Accordion / Collapse | 区块高度展开/折叠 |
| Direction-aware transition | 前进和返回方向相反，保留导航方向感 |

## 滚动与路由

| 术语 | 用法 |
| --- | --- |
| Scroll reveal | 元素进入视口时显现 |
| Scroll-driven animation | 动画进度由滚动位置驱动 |
| Parallax | 前景/背景不同速度移动，形成深度 |
| Page transition | 路由切换时的页面级转场 |
| View transition | 浏览器 View Transition API 连接状态或页面 |

## 反馈与手势

| 术语 | 用法 |
| --- | --- |
| Hover effect | 指针悬停反馈；必须用 hover/pointer media query 限定 |
| Press / Tap feedback | 按下瞬间缩小/变色，让界面像听到了 |
| Hold to confirm | 按住一段时间完成危险操作，常配进度填充 |
| Drag | 抓取拖动，必须 1:1 跟手 |
| Drag to reorder | 拖拽排序，其他项让位 |
| Swipe to dismiss | 横扫或纵扫关闭 toast / drawer / card |
| Rubber-banding | 边界外逐步增加阻力并回弹 |
| Shake / Wiggle | 错误或拒绝输入时短促抖动；慎用 |
| Ripple | 点击点扩散的圆形反馈；偏 Material 语境 |

## 缓动与弹簧

| 术语 | 用法 |
| --- | --- |
| Easing | 速度随时间变化的曲线 |
| Ease-out | 起步快、收尾慢；UI 响应默认 |
| Ease-in | 起步慢；UI 中通常禁用 |
| Ease-in-out | 屏幕内移动/变形 |
| Linear | 匀速；spinner、marquee、hold progress |
| Cubic-bezier | 自定义缓动曲线 |
| Asymmetric easing | 进出曲线/速度不对称，更接近真实交互 |
| Spring | 物理弹簧，适合手势和可中断运动 |
| Stiffness / Tension | 拉向目标的强度 |
| Damping | 阻尼；越低越弹 |
| Mass | 质量感；越大越慢 |
| Bounce | overshoot 和回弹；只给动量或玩具感场景 |
| Momentum | 释放后的速度延续 |
| Velocity | 速度和方向；手势释放时要交给 spring |
| Interruptible animation | 能被中途重定向，不必等播完 |

## 循环与氛围

| 术语 | 用法 |
| --- | --- |
| Marquee | 内容持续滚动 |
| Loop | 循环动画 |
| Alternate / Yoyo | 往返循环 |
| Orbit | 环绕运动 |
| Pulse | 轻微呼吸/脉冲 |
| Float | 轻微上下漂浮 |
| Idle animation | 空闲时的细微生命感；不能干扰核心工作 |

## 抛光效果

| 术语 | 用法 |
| --- | --- |
| Blur | 微模糊遮住 crossfade 叠影；控制在轻量范围 |
| Clip-path | 裁切显隐；适合 reveal、hold-to-confirm、slider |
| Mask | 带软边的遮罩，比 clip-path 更柔 |
| Before / after slider | 拖动分割线比较两张图 |
| Line drawing | SVG 路径像笔一样画出来 |
| Text morph | 文本字符级变化 |
| Skeleton / Shimmer | 加载占位骨架和扫光 |
| Number ticker | 数字滚动/递增 |
| Tabular numbers | 等宽数字，避免计数时抖动 |
| Typewriter | 打字机逐字出现；正式 UI 慎用 |

## 性能与原则

| 术语 | 用法 |
| --- | --- |
| FPS / Frame rate | 帧率，60fps 是底线 |
| Jank / Dropped frame | 掉帧卡顿 |
| Compositing | GPU 合成层移动/淡出，不触发布局 |
| will-change | 提前提示浏览器要动某属性；不要滥用 |
| Layout thrashing | 每帧读写布局导致重排 |
| Purposeful animation | 动效必须服务理解/反馈/空间关系 |
| Anticipation | 动作前的小预备 |
| Follow-through | 主动作后的小延续 |
| Squash & stretch | 变形表达重量和速度；产品 UI 少用 |
| Perceived performance | 动效让同样耗时感觉更快 |
| Spatial consistency | 前后状态保持空间关系，用户不迷路 |
| Reduced motion | 给 motion-sensitive 用户更温和的替代 |
