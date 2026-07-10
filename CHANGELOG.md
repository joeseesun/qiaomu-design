# Changelog

## v3.7 变更（2026-07-10）

1. **系统研究 Carbon Design System**：以官方 sitemap 的 319 个 URL 为覆盖范围，对官方 `carbon-website` 快照 `1703364` 的 321 个 MDX 页面做分类索引，深读 foundations、components、patterns、data visualization、content、accessibility 与 AI 指南。
2. **新增五份按需参考**：`carbon-foundations.md`、`carbon-components.md`、`carbon-patterns.md`、`carbon-data-visualization.md`、`carbon-source-map.md`，把 Carbon 的方法转化为中文、品牌中立的可执行规则。
3. **组件七问 + 模式七段**：功能型 UI 在设计前必须回答何时用/不用、结构、内容、状态、输入方式、溢出与恢复；主工作流必须覆盖 entry / progress / result / exception / recovery / exit。
4. **门禁扩展**：preflight 新增 Carbon 功能 UI 决策门和数据可视化门，强制检查 loading/empty/error、disabled/read-only/hidden、tooltip 边界、独立状态、URL 可恢复、图表诚实性和无障碍。
5. **明确反品牌移植边界**：借用 Carbon 的决策结构，不将 IBM 蓝、Plex、Carbon 默认尺寸或组件 API 强加到乔木项目。

## v3.6 变更（2026-07-09）

1. **同步 Emil Kowalski skills 四件套**：对齐 `emilkowalski/skills` upstream
   `f76bece`，在原 `motion-craft.md` 基础上新增三份参考：
   `motion-review.md`、`animation-vocabulary.md`、`apple-fluid-interfaces.md`。
2. **动效审查变成硬门禁**：preflight C 节新增目的/频率判断、origin、可中断、
   GPU 属性、Framer Motion shorthand、手势速度交接和慢放/逐帧检查；专项审查统一用
   `Before / After / Why` 表格。
3. **Apple 流体交互补丁**：补入 pointer-down 即时反馈、1:1 直接操控、presentation value、
   velocity handoff、momentum projection、rubber-band 边界、透明材质和 reduced-transparency。
4. **动效术语词典**：新增动效 vocabulary，用户描述"那个动效叫什么"时先命名，再写精确 brief。

## v3.5 变更（2026-07-06）

1. **预览卡片说明防挤压**：方向卡片按钮上方的短说明必须使用 full-width 横排 meta block；
   禁止放进窄侧栏、metric column 或 grid auto column，避免一字一行和按钮遮挡。
2. **预览服务防御 CSS**：本地回传服务会把方向卡片的直接说明子元素拉回整行，并让选择按钮
   独立成行，降低生成页局部 CSS 失控导致的预览破版概率。
3. **门禁强化**：preflight 新增“按钮上方说明横排可读、无竖排/遮挡”的截图验收项。

## v3.4 变更（2026-07-06）

1. **拨盘数值实时可见**：预览服务同步 `[data-qmdp-output]` 的 `value` 与 `textContent`，
   兼容 `<output>`、`span` 等显示节点，拖动滑块时用户立刻看到数值变化。
2. **四方向预览默认 2×2**：风格试衣间桌面端默认左右两栏网格，移动端收敛为单列；
   仅在明确需要全宽沉浸展示时允许例外。
3. **门禁强化**：preflight 新增桌面 2×2 / 移动单列检查，以及拨盘拖动数值即时变化检查。

## v3.3 变更（2026-07-06）

1. **试衣间改为手动确认回传**：移除 60 秒自动推进。方向按钮或键盘 1-4 只打开确认弹层，
   用户可调整三拨盘并填写调整建议，点击“确认并回传”后才写入 `selection.json`。
2. **回传链路提速**：预览服务支持 `--exit-on-select` 快速路径；watcher 默认改为文件事件 +
   75ms 兜底轮询，并可从服务日志哨兵读取选择。
3. **README 视频案例改用 GIF 内联**：GitHub README 中直接显示冥想网站动图，MP4 保留为源文件。

## v3.2 变更（2026-07-04）

**新增功能契约（Functional Contract）**：用户发现 404 页创意满分但「404」只是
底部 5% 透明度的幽灵装饰字——拨盘只调美学冒险度，缺少功能配重。新规则：

- 动手前写下页面功能契约（存在理由 / 3 秒必得信息 / 必须能完成的动作），
  创意只能长在契约之上；任何 VARIANCE 值都不豁免
- 页面类型核心标识必须首屏可辨：404 的错误码、定价的价格、表单的提交路径
- 甲方评审视角新增契约核查（优先级高于一切美学问题）；preflight 新增 A4 组
- 偏好账本收录 P-7

## v3.1 变更（2026-07-04）

用户三连击反馈（多样性展示差 / 作品集可读性差 / Hero 右侧简陋）驱动，
深挖 taste-skill 4.4-4.9 节后新增 references/assets-and-readability.md：

1. **Hero 资产三选一**：图像生成资产 > 高保真组件预览（深度 >=3 层、
   真实元素 >=8、至少 1 处活细节、构图有姿态）> 抽象编辑构图；
   "文字 + 渐变斑点"与空心 div 假截图均为违规
2. **可读性红线**：暗底正文 .85 / 次要 >=.60、正文区纹理 <=3%、
   CTA 逐个对比度审计、CTA 不换行、同一意图单一文案、文案自审
3. **内容密度**：每节 <=8 词标题 + <=25 词短段；列表 >5 项换组件
4. **多方向展示规范**：每方向全宽沉浸带 + 独立工艺密度 >=3 + 设计宣言入版面
5. 两轮制评审增设第 4 视角「读者」；preflight 新增 A3 检查组；
   偏好账本收录 P-4/P-5/P-6

## v3.0 变更（2026-07-03）

**从"防守型"转向"防守 + 进攻"**。复盘发现 v2.x 的融合几乎全是禁令与门禁——
抬高了下限（不翻车、不 AI 味），但不产生上限（惊艳）。新增进攻三步
（references/craft-loop.md，Phase 3 强制）：

1. **参考 DNA 注入**：从 58 站 DESIGN.md 库挑 1-2 个供体，偷 3-5 个具体值
   （阴影栈/字阶/hover 位移），逐条写进设计计划——终结库闲置
2. **工艺密度 >= 5**：签名动作菜单（氛围层/::selection/品牌 focus 环/签名交互/
   多层染色阴影/编辑细节…）至少落地 5 项，交付时逐项报告
3. **两轮制**：第一轮完成后真实渲染截图 → 三视角偏执评审（艺术总监/工程师/甲方
   各挑至少一处最弱）→ 第二轮只修这几处 → 再交付

preflight 新增 A2 进攻三步核验。实测：两轮制评审真实揪出淡入 JS 黑屏、
元素溢出裁剪、标题断句等问题并修复。

## v2.4 变更（2026-07-03）

**新增自进化机制**：
- `references/user-preferences.md` 用户偏好账本——用户反馈被抽象成分级规则
  （硬禁令/强偏好/情境规则）后入库，含原话摘录与日期；废止规则保留历史。
  已收录 P-1 禁斜体、P-2 先看后选、P-3 禁滥用中文 webfont
- SKILL.md 新增「自进化协议」：反馈监听 → 抽象提炼（区分一次性要求 vs 长期
  偏好，拿不准就问）→ 写入账本并同步到对应规范文件 → **立即用新规则复查
  本次已交付产物** → 安全阀（不揣测、重大变更先确认、入库要告知用户）
- preflight 新增第 0 步：开工先读账本，账本优先级高于一切通用规则

## v2.3 变更（2026-07-03）

1. **试衣间升级为 4 方向 + 60 秒自动推进**：固定给 A/B/C/D 四个互斥约束方向，
   其中一个标注「推荐」+ 理由；页面内置 60 秒倒计时，超时自动落到推荐方向；
   对话侧协议：用户不选即按推荐方向直接进入 Phase 3，不再追问。
2. **新增中文排版与配色规范** `references/chinese-typography.md`（联网调研
   W3C clreq / Ant Design / Apple HIG / 中文文案排版指北后整理）：
   - **第一硬规则：装饰性中文 webfont（ZCOOL 系列等）严禁滥用**——用户没装、
     CDN 加载 5-20MB 拖慢首屏；中文正文/UI 一律系统字体栈，个性靠西文展示
     字体/字重/排版实现；装饰中文字体仅限创意标题且必须 `text=` 子集化
   - 中文字重陷阱（多数字体只有 400/700、苹方无 Bold）
   - 行高 1.5-1.75、盘古之白、全角标点、禁斜体
   - 暗色中文页对比度按 7:1 设防；数字 tabular-nums + 半角
   - preflight 新增中文页 D2 检查组

## v2.2 变更（2026-07-03）

研究 5 组补充 skill 后吸收的机制：

| 机制 | 来源 | 落点 |
|------|------|------|
| 打磨模式（Audit/Critique/Polish/Animate/Harden/Live 六动作，先读现物、少而果断） | pbakaus/impeccable | SKILL.md「两种入口」 |
| 重设计先提取现状 token，不确认不覆盖 | arvindrk/extract-design-system | Phase 1 |
| 方向互斥约束 + 先呈现后对比再综合 | mattpocock/design-an-interface | Phase 2 试衣间 |
| DESIGN.md 锚（先编译设计系统再写码，防多页风格漂移） | leonxlnx/stitch-skill | Phase 3 第 0 步 |
| 掷骰子反惰性选型、H1 ≤3 行铁律、gapless bento、meta-label 禁令 | leonxlnx/gpt-taste | 反套路规则 + divergence-playbook |
| 风格协议卡：方向挂载 minimalist/brutalist/gpt-taste 深度协议 | leonxlnx 风格分支 | divergence-playbook |

未吸收：sleekdotdesign/agent-skills（调用外部 Sleek API 的工具型 skill，需 API key，机制不可迁移）。

## v2.1 变更（2026-07-03）

用户实测反馈驱动的两处升级：

1. **斜体禁令**：界面排版全面禁用 `font-style: italic`（中文伪斜体渲染不和谐），
   强调改用字重/颜色/字号。已写入字体禁令 + preflight 门禁。
2. **风格试衣间**（招牌功能）：Phase 2 不再只给文字方案——同步生成
   `design-preview.html` 本地预览页，每个方向一个真字体/真配色/真布局的迷你 mockup，
   用户点选（或键盘 1/2/3、剪贴板回传"选 X"）后才进入执行。
   规范见 `references/style-preview.md`。

## v2.0 变更（2026-07）

基于一场受控实验（6 变体 × 7 任务 × 42 页面，横评 5 个头部设计 Skill + 无 Skill 对照组），
将每个维度胜者的核心机制融合进本 skill：

| 新增 | 来源 | 位置 |
|------|------|------|
| 设计读取 + 三拨盘（VARIANCE/MOTION/DENSITY 按任务类型自适应） | taste-skill | SKILL.md 第二原则 |
| 发散纪律（轴级差异检验，杜绝伪多样方案） | 实验任务 G 发现 | SKILL.md Phase 2 + references/divergence-playbook.md |
| 动效工艺规范（缓动/时长/组件动效/手势完整体系） | emil-design-eng | references/motion-craft.md |
| 工程验收清单（a11y/表单/焦点管理/组件行为标准） | Vercel Web Interface Guidelines | references/engineering-checklist.md |
| 交付前门禁（不过不交付的强制检查） | taste-skill pre-flight | references/preflight.md |
| 记忆点要求 + "每次生成都不同"纪律 | frontend-design (Anthropic) | SKILL.md Phase 3 / 字体禁令 |
| 错误恢复思维、危险操作解锁模式 | ui-ux-pro-max 准则 + 实验任务 E/F | engineering-checklist.md |
| 反套路禁令扩充（文案禁词、眉批限额、动效禁令） | frontend-design + taste-skill | SKILL.md 反套路规则 |

同时修正了 v1 的自相矛盾：原"动画参数"推荐 `transition: all 0.3s`，
与反套路原则冲突，已按 Emil 体系改为逐属性 + 分场景时长。

**[English](#english) | [中文](#中文)**

---

<a name="english"></a>
