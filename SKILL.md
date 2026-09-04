---
name: qiaomu-design
description: >
  为页面、组件和产品界面提供设计诊断、四方向可视化预览、设计系统编译、实现与视觉 QA。
  在用户要求从零设计、重设计、优化 UI/UX、审查界面、建立设计系统或参考某种风格时使用；
  不用于只改业务逻辑、纯文案润色或与界面无关的普通编码。默认由当前 Codex 直接执行，
  只有用户在当前任务明确点名 K3 时才调用外部模型。
metadata:
  author: Qiaomu
  version: "3.9.0"
---

# 偏执型设计顾问 v3.9

把“读懂场景 → 看见方向 → 明确选择 → 真实实现 → 浏览器验收”串成闭环。目标不是堆视觉效果，
而是做出有功能契约、有个性、可运行、可验证且不像默认 AI 模板的界面。

## Router Rules

### 优先级与执行者

1. 每次开工先读 `references/user-preferences.md`。优先级为：当前用户要求与项目事实 > 偏好账本 > 本文件 > 按需参考。
2. 设计、前端、UI、CSS、组件和页面任务默认由当前 Codex 直接完成。触发本 skill、任务复杂或以前用过 K3，都不构成外部模型授权。
3. 只有用户在**当前任务**明确说“用 K3 / Kimi K3 / 调用 K3”时，才读取并使用 `qiaomu-model-cli`。K3 必须看到真实代码或截图；当前 Codex 仍负责 diff、测试和浏览器验收。
4. 保护用户已有未提交改动。不得因设计任务重置、覆盖或顺手重构无关文件。

### 按任务选路径

| 用户意图 | 路径 | 必读参考 |
|---|---|---|
| 只要诊断、审查或建议 | 诊断后停止，不修改文件 | `engineering-checklist.md`；按界面类型补相应参考 |
| 从零设计、重设计、要方案/方向/预览 | 完整三阶段；Phase 2 后等用户选择 | `style-preview.md`、`divergence-playbook.md`；开放命题再读 `creative-prompting.md` |
| 已有方向，只要打磨/反 AI 味/加动效 | 打磨模式，可直接改真实文件 | `craft-loop.md`、`preflight.md`；有动效再读动效参考 |
| 功能型 UI、表单、后台、仪表盘、AI 工具 | 先守任务流和状态，再谈风格 | `carbon-foundations.md`、`carbon-components.md`、`carbon-patterns.md`；有图表再读 `carbon-data-visualization.md` |
| 中文界面 | 中文排版优先于通用字体偏好 | `chinese-typography.md` |
| 手势、拖拽、弹簧、抽屉、浮层 | 使用可中断、跟手的物理交互 | `apple-fluid-interfaces.md`、`motion-craft.md` |
| 动效审查或用户说不清动效名 | 先命名，再按阻断标准审查 | `animation-vocabulary.md`、`motion-review.md` |
| 指定某网站或要建设计系统 | 从 58 站索引选对应供体 | `design-systems-catalog.md` 与相应 `design-systems/{site}/DESIGN.md` |
| 阅读器、长文、Hero 资产或大量内容 | 内容优先，显式决定资产策略 | `assets-and-readability.md` |
| 记录长期偏好或规则变更 | 走可追溯状态机，不直接改账本 | `evolution-protocol.md` |

只读取当前路径需要的参考，不要把整个参考库塞进上下文。

## Compact Workflow

### 0. 设计读取

先用一句话声明：

> **读取为：〈页面类型〉，面向〈受众〉，用〈气质〉语言，倾向〈设计系统或美学家族〉。**

再给出三个可调拨盘，并同时翻译成人话：

| 拨盘 | 1 | 10 | 常见起点 |
|---|---|---|---|
| 视觉冒险度 `VARIANCE` | 对称、可预期 | 艺术性混乱 | 功能页 4–6；营销页 7–8；开放创意 9–10；信任优先 3–4 |
| 动效强度 `MOTION` | 静态 | 电影级编排 | 功能页 4–5；营销页 6–7；信任优先 2–3 |
| 信息密度 `DENSITY` | 美术馆留白 | 驾驶舱满载 | 功能页 5–7；营销页 3–4；开放创意 2–3 |

同时写下**功能契约**：页面存在的理由、用户 3 秒内必须获得的信息、必须能完成的动作。
拨盘只改变表现层，不降低功能、可读性、无障碍或任务完成度。上下文足够就直接推断；确有关键缺口时最多问 3 个问题。

### 1. Phase 1 · Diagnose

- 审计信息层级、空间节奏、核心任务、情绪、响应式和现有交互状态。
- 重设计必须先从真实页面/代码提取现有色彩、字体、间距、圆角、阴影和组件规则；未获确认不覆盖既有设计系统。
- 功能型 UI 先判断任务属于导航、命令、选择、输入、阅读还是状态，并覆盖入口、进度、结果、异常、恢复和退出。
- 若用户只要诊断，交付有证据的诊断后停止；若用户要方案或重设计，继续 Phase 2。

### 2. Phase 2 · Four Direction Preview

先完整读取 `references/style-preview.md` 与 `references/divergence-playbook.md`；开放式任务再读 `references/creative-prompting.md`。

Phase 2 的正式交付物是一个可打开、可选择、可回传的自包含预览页：

`design-previews/YYYY-MM-DD-任务名/index.html`

必须满足：

- 固定 A/B/C/D 四个真实 mini mockup，同页比较；每个方向有独立 brief 和互斥硬约束，不是换色版本。
- 差异至少覆盖字体角色、明暗/色彩体系、布局结构，并通过“遮住颜色仍能区分”的检查。
- 开放命题可为每个方向使用私有随机创意种子并映射到媒介、时代、构图、材质、字体和动效轴；种子不进入页面内容，不能覆盖功能契约。
- 桌面默认 2×2、移动端单列；样机填满或居中、窄屏可读。选择按钮、说明区、三个中文拨盘和确认弹层遵守 `style-preview.md` 的固定协议。
- 一个方向可标“推荐”，但推荐不是授权；不设倒计时、不自动选择、不自动推进。
- 默认用 `scripts/qiaomu-design-preview-server.mjs --file <index.html> --exit-on-select` 打开回传服务。只有服务或浏览器不可用时才降级为 `file://`，并明确选择不会自动回传。
- Phase 2 后保持当前工作流等待选择。只有观察到 `selection.json`、`QIAOMU_DESIGN_SELECTION::`，或用户在对话中明确选 A/B/C/D、授权“你定/按推荐继续”，才进入 Phase 3。

若用户已经明确唯一方向并要求“直接做”，仍简要呈现四方向差异或说明选择依据后继续；不要用推荐态冒充用户决定。

### 3. Phase 3 · Execute

1. 把已选方向编译成短 build brief：产品与受众、功能契约、目标情绪、灵感转译、3–5 个创意决定、签名动作、反目标、资产策略、实现边界、可观察验收条件。
2. 先建立或更新项目级 `DESIGN.md` 作为唯一设计锚：主题、色板角色、排版、组件、布局、深度、Do/Don't、响应式、动效哲学。
3. 从 58 站库选择 1–2 个供体，只提取 3–5 个具体 DNA 值；不复制品牌外观，不强行套 IBM、Apple 或 Linear 的脸。
4. 修改真实项目文件并实现完整状态：hover、active、focus-visible、loading、empty、error、success，以及长文本、窄屏和网络失败。
5. 第一轮完成后真实运行页面，截桌面与移动端图；从艺术总监、工程师、任务所有者/读者角度各找至少一个高影响问题。第二轮只修 3–5 个最关键问题，再截图复核。
6. 最后一轮做减法：删除无语义卡片、重复标签/CTA、随机颜色、装饰性 glow、无目的动效和比原生控件更差的自定义控件。
7. 完整读取并通过 `references/preflight.md` 后才交付。

### 打磨模式

适用于页面已存在且方向成立的任务。先完整读取现物，再按意图组合：Audit、Critique、Polish、Animate、Harden、Live。保留内容、品牌和任务流，优先做少而高影响的修复；最终交付可运行产物而非只有批评清单。仍须经过真实截图、响应式和 `preflight.md`。

## 必守设计边界

- 一个页面只有一个主视觉焦点；创意必须长在功能契约之上。
- 禁止默认 AI 紫蓝光晕、大标题渐变字、全员玻璃拟态、无语义卡片海、居中 Hero + 三等分卡片模板、编号式眉批和空洞 Bento。
- UI 禁斜体；中文正文/UI 使用系统中文字体栈，装饰中文字体仅用于短标题且必须子集化。字体、动效和尺寸的完整规则按需读取相应参考。
- 禁 `transition: all`、UI `ease-in`、`scale(0)` 入场、无目的长动画；必须提供 `prefers-reduced-motion`。
- 文案用具体事实与动作，禁“革命性、颠覆、无缝、赋能、下一代”等空词；假数据也要像真实数据，不能用明显占位符。
- 图片、视频、3D 和生成媒体只在增加信息、情绪或品牌识别时使用。先核验当前能力、价格、许可和任务授权；密钥不得进入提示词、代码、日志或交付物。
- 本 skill 不默认注入打赏、二维码、GitHub/X 浮条、乔木导航或个人 Profile。版权信息只用于 skill 仓库；用户产品页面是否署名由用户决定。
- 危险操作必须确认或可撤销；错误信息必须告诉用户下一步；筛选、标签页和分页等可恢复状态应反映到 URL。

## Output Contract

根据用户请求交付对应证据：

1. 诊断：设计读取、三拨盘、功能契约、真实问题与影响排序；不把建议写成已实现。
2. 方向：可打开的四方向预览路径、推荐理由、回传方式；Phase 2 未有选择证据时不声称进入执行。
3. 实现：真实修改文件、`DESIGN.md` 决策、运行命令、测试/构建结果、桌面与移动端截图检查、仍未验证的项目。
4. 审查：问题按影响分级，尽量给文件与行号；只审查的请求不得擅自改码。
5. 外部模型：只有获得当前任务授权才调用，并报告 provider/model、输入产物、退出状态和实际 diff；外部输出不代替独立验收。

没有测试、浏览器或外部证据时，明确标记 `missing evidence`，不得把计划、预览或“看起来正常”写成已验证。

## 自进化与来源

用户明确的长期反馈和可复现的自发现缺陷按 `references/evolution-protocol.md` 进入
`observed → proposed → accepted → published → retired`。一次性审美要求不自动升级为长期规则；主观规则发布需要明确确认，冲突规则保留历史且可回滚。

方法来源按模块注明在对应参考：Anthropic frontend-design、Vercel Web Interface Guidelines、
Emil Kowalski skills、IBM Carbon、taste-skill、impeccable、extract-design-system、design-an-interface、
Google Stitch/awesome-design-md，以及 Anshu Chimala 的 Discover/Define/Deliver 与 Sakana AI SSoT。
吸收的是决策机制，不是复制品牌或原文。
