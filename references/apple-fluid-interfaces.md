# Apple 流体交互补丁（Apple Fluid Interfaces）

> 来源：Emil Kowalski `apple-design`（基于 Apple WWDC fluid interface / typography / design principles）。
> 用途：手势、弹簧、抽屉、sheet、carousel、swipe、透明材质、平台感强的界面。

这不是"把页面做成 Apple 官网"。Apple 网站风格仍走 `references/design-systems/apple/DESIGN.md`。
本文件只处理**界面如何响应人**：即时、跟手、可中断、有动量、有边界阻尼。

## 核心判断

流体界面不靠更花的动画，而靠四件事：

1. **即时响应**：输入发生的那一刻界面就有反馈。
2. **直接操控**：拖拽时内容 1:1 跟着手，不跳、不等、不猜。
3. **可中断**：动画中途能被抓住、反向、重定向。
4. **速度连续**：手势释放后的动画继承手的速度，不在交界处断裂。

如果做不到这四点，宁可删掉动效。

## 1. 响应：杀掉输入延迟

- 按钮/卡片/控件在 `pointerdown` / `:active` 时立刻反馈，不等 `click`。
- 不在人手路径上加无意义 debounce、setTimeout、等待动画播完。
- 拖拽、slider、drawer 打开过程中持续反馈，不能只在手势结束后补一个动画。

```css
.button {
  transition: transform 100ms var(--ease-out);
}
.button:active {
  transform: scale(0.97);
}
```

## 2. 直接操控：1:1 跟手

- 用 Pointer Events；拖拽开始后 `setPointerCapture(pointerId)`。
- 记录用户抓住元素的位置偏移，不要把元素中心瞬移到指针下。
- 记录最近几帧的位置与时间，用于释放速度。
- 先有约 10px hysteresis 判断方向，再锁定横向/纵向，避免误触。

```js
el.addEventListener('pointerdown', (event) => {
  el.setPointerCapture(event.pointerId);
  const grabOffsetY = event.clientY - el.getBoundingClientRect().top;
  // 之后保存 pointermove 的 position + timestamp，用于 velocity handoff
});
```

## 3. 可中断：从当前画面值继续

- 手势驱动动画不要锁输入；用户必须能在运动中重新抓住元素。
- 新动画从**当前屏幕上的 presentation value** 开始，不从逻辑目标值开始。
- CSS transition / keyframes 不适合可抓取、可反向的手势；手势用 spring。
- 反向时保留速度，不硬切。硬切会产生"撞墙"感。
- 复杂 2D 手势把 X / Y 拆成独立 spring，避免不同轴速度互相拖累。

## 4. Spring 参数：默认不弹，动量才弹

Apple 式思考用两个设计师友好的量：

| 场景 | 默认 |
| --- | --- |
| 普通 UI reposition | critically damped，无 overshoot |
| flick / drag release | 有轻微 bounce，因为手势带来动量 |
| sheet / drawer | 快响应，轻微物理感 |

Web 中用 Motion / Framer Motion 时的安全写法：

```js
// 默认 UI：不弹，稳
animate(el, { y: 0 }, { type: 'spring', bounce: 0, duration: 0.35 });

// 动量释放：轻微弹，只因用户 flick 了
animate(el, { y: target }, { type: 'spring', bounce: 0.2, duration: 0.4 });
```

弹性不是默认装饰。没有手势动量、没有玩具感品牌，就不要 bounce。

## 5. 速度交接与投射

释放瞬间，动画必须继承手的速度。否则会出现"手松开的一帧突然慢下来"。

```js
const velocity = recentPointerVelocity(); // px/s
animate(el, { y: target }, { type: 'spring', velocity, bounce: 0.2, duration: 0.4 });
```

不要只看 release 位置决定去哪里；用速度投射落点，再吸附到最近 snap point。

```js
function project(initialVelocity, decelerationRate = 0.998) {
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}

const projected = currentPosition + project(releaseVelocity);
const target = nearestSnapPoint(projected);
```

## 6. 边界阻尼：rubber-band，不硬停

拖到边界外时逐步增加阻力，别突然不动。

```js
function rubberband(overshoot, dimension, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}
```

边界外可动但越来越难动，用户才会觉得界面仍在响应。

## 7. 空间一致性

- 从右侧进来的 panel 应从右侧退出。
- popover / menu / tooltip 从触发源展开；modal 才从屏幕中心出现。
- 需要可逆转场时，进入与返回路径要镜像；不要进来从右、离开从下。
- 中间帧要暗示目标方向：drawer 要像被手拉开，不是随机平移。

## 8. 透明材质与深度

只在**浮动功能层**使用半透明材质，例如 nav、toolbar、sheet、floating panel。

- 内容在浮层下滚动，浮层用 `backdrop-filter` 和半透明背景表达层级。
- 大 surface 的 blur / shadow 可更重，小 chip 更轻。
- 不要把浅色 glass 叠在浅色 glass 上，文字可读性会崩。
- sticky header 底部优先用柔和边缘/渐变遮罩，不默认用硬 1px 分割线。
- glass surface 入场不要只 fade，配合轻微 scale / blur 变化，让它像材质出现。
- 支持 `prefers-reduced-transparency: reduce` 时改成更实的背景。

```css
.floating-toolbar {
  background: rgb(255 255 255 / 0.68);
  backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 0 18px 50px rgb(0 0 0 / 0.12);
}

@media (prefers-reduced-transparency: reduce) {
  .floating-toolbar {
    background: #fff;
    backdrop-filter: none;
  }
}
```

## 9. 无障碍

- `prefers-reduced-motion: reduce` 不是全部归零，而是把 slide / spring / parallax 换成短 crossfade 或静态变化。
- `prefers-reduced-transparency: reduce` 时减少透明和 blur。
- `prefers-contrast: more` 时提高背景不透明度、补清晰边框。
- 避免全屏移动背景、慢速无限摆动、亮度突然大幅跳变。

## 10. 字体与层级

Apple 强调不同字号的 optical sizing、leading、tracking，但本机全局 UI 规则要求**不要默认使用负 letter-spacing**。
所以在 qiaomu-design 中这样落地：

- 正文和 UI 默认 `letter-spacing: 0`。
- 层级靠字号、字重、行高、间距、颜色角色建立，不靠负字距。
- 大标题可用更紧的 line-height，但必须保证中文不断裂、不拥挤。
- 布局用 `rem` / `em` / 流式容器适配用户字体设置，不把固定 px 当唯一真理。
- 只有项目已有设计系统明确要求且实际截图验证无问题时，才允许局部字距偏离默认。

## 11. Apple 八原则的使用方式

设计决策时用它们做问题清单，不要写进 UI 文案：

| 原则 | 检查问题 |
| --- | --- |
| Purpose | 这个功能值得占用用户注意力吗？不值得就砍 |
| Agency | 用户是否能选择、撤销、退出，而不是被迫走一条路 |
| Responsibility | 隐私、安全、AI 风险是否在用户利益侧 |
| Familiarity | 是否尊重用户已有心智模型；破例是否有证据 |
| Flexibility | 是否适应不同设备、能力、语言、使用场景 |
| Simplicity | 是否展示常用路径，把高级项放后一层 |
| Craft | 字体、图标、间距、状态、转场是否都经得起细看 |
| Delight | 愉悦是否来自前七项做对，而不是撒彩带 |

## 交付前快查

- [ ] pointer-down 有即时反馈
- [ ] 拖拽 1:1 跟手，保留抓取偏移
- [ ] 使用 pointer capture，处理多指/取消/离开边界
- [ ] release velocity 交给 spring
- [ ] 目标点基于 momentum projection，而不是只看 release 位置
- [ ] 边界使用 rubber-band / friction，不硬停
- [ ] 动画可中断，不锁输入
- [ ] sheet/drawer/popover 的进入和退出路径一致
- [ ] translucent material 有 reduced-transparency 替代
- [ ] reduced-motion 下无大位移/弹性/parallax
