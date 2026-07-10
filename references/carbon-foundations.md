# Carbon 基础方法：从视觉 token 到界面决策

> 本文是对 [Carbon Design System](https://carbondesignsystem.com/) 公开文档的中文转化与场景化摘要，不是 Carbon 视觉风格复制手册。
> 研究范围与版本见 `carbon-source-map.md`。

## 一、借方法，不借脸

Carbon 最有价值的不是 IBM 蓝、Plex 字体或方正外形，而是一套可验证的决策顺序：

1. 先明确用户目标与内容层级，再选布局。
2. 先选语义正确的组件，再调外观。
3. 组件必须同时定义 usage、style、behavior、content 和 accessibility。
4. 组件解决局部问题，pattern 解决跨组件的用户目标。
5. 通过 token 表达角色，不在业务代码里散落具体色值和间距。

**乔木适配原则：**保留项目现有品牌、中文排版、圆角与动效语言；吸收 Carbon 的选型、状态、语义、容错与验收方法。除非项目明确使用 Carbon，不强制复制其尺寸、颜色、断点或组件 API。

## 二、布局：用网格建立关系

来源：[2x Grid overview](https://carbondesignsystem.com/elements/2x-grid/overview/) 与 [2x Grid usage](https://carbondesignsystem.com/elements/2x-grid/usage/)。

- Carbon 以 8px mini unit 建立结构节奏，液态网格靠二等分，固定网格靠倍增。乔木可继续用 4px 组件微单位，但页面级间距和网格优先落在 8px 倍数上。
- 先判断用户调整窗口时想看到什么：想看更多项目，用固定宽卡片并增加列数；想看每项更多内容，固定列数并让容器液态变宽。
- 流式文章、仪表盘、图像、数据可视化适合液态列；工具栏、图标组、索引卡适合固定盒；头部、侧栏、数据表常是混合尺寸。
- 保持 key lines：标题、正文、数字、图表、卡片内容线应共享可追踪的水平/垂直对齐线。
- 设计断点不是“把桌面缩小”，而是在关键宽度重新决定列数、优先级、导航与操作位置。
- 同类组件用稳定宽高、比例或 grid track，避免内容变化造成布局跳动。

## 三、空间：间距要表达信息关系

来源：[Spacing](https://carbondesignsystem.com/elements/spacing/overview/)。

- 间距层级必须体现“组内 < 组间 < 区块间”，不得只为“看着松一点”随意增大。
- 相邻元素的距离会被用户理解为归属关系；同一控件的 label/helper/error 必须比下一个控件更靠近。
- 高密度不等于所有间距同比缩小；保留分组差，否则信息会糊成一层。
- 留白应该服务层级、聚焦和阅读，不能因容器被 `1fr` 拉伸而产生无意义大块空白。

## 四、颜色与主题：命名角色，不命名色值

来源：[Color overview](https://carbondesignsystem.com/elements/color/overview/)、[Color usage](https://carbondesignsystem.com/elements/color/usage/) 与 [Themes](https://carbondesignsystem.com/elements/themes/overview/)。

- token 按语义命名：`text-primary`、`text-secondary`、`background`、`layer`、`border-strong`、`focus`、`support-error`，而不是 `gray-700-for-card`。
- 分离 core token、component token 与业务 token；业务页尽量不直接依赖底层色板。
- 嵌套表面用 layer 层级区分，不靠每层都加重阴影、重边框。不要让卡片里的卡片继续复制整套容器样式。
- hover / active / selected / focus / disabled 是不同语义，不得用同一个深色背景模糊代替。
- 主题切换改 token 值而不改 token 角色；深浅模式下信息层级与状态必须保持。
- 高对比瞬间应用于聚焦、关键操作或警告，不要把整页所有元素都推到同一对比强度。

## 五、排版：产品性与表达性分工

来源：[Typography](https://carbondesignsystem.com/elements/typography/overview/) 与 [Type style strategies](https://carbondesignsystem.com/elements/typography/style-strategies/)。

- productive type 服务高频任务、表单、密集数据和反复操作；expressive type 服务叙事、品牌、教育和强层级时刻。
- 两者可以在一页中混用，但要用区域和任务边界区分：表达性标题 + 产品性工具区，而不是随机混字号。
- 字阶必须按 role 定义：heading、body、label、helper、code、numeric；同一 role 跨页一致。
- 中文场景继续以 `chinese-typography.md` 为最高优先级，Carbon 的英文大小写与 Plex 指导不能直接套用。

## 六、动效：为理解和连续性服务

来源：[Motion overview](https://carbondesignsystem.com/elements/motion/overview/) 与 [Motion choreography](https://carbondesignsystem.com/elements/motion/choreography/)。

- productive motion 快、小、高频，用于控件反馈和状态变化；expressive motion 可更慢、距离更大，用于进入新上下文或叙事节点。
- 入场要快速建立位置和因果；离场更快，不阻断下一任务。
- 动画路径要与元素来源和目标一致；从触发器展开的 popover 应保持空间连续性。
- 多元素编排先讲顺序，再讲 stagger；优先让主体与关键操作可用，次要细节后到。
- 必须支持 reduced motion。具体参数和实现仍以 `motion-craft.md` 为准。

## 七、图标与图形：功能和叙事不要混用

来源：[Icons](https://carbondesignsystem.com/elements/icons/usage/) 与 [Pictograms](https://carbondesignsystem.com/elements/pictograms/usage/)。

- icon 是高频功能符号；pictogram 是更大、更表达性的内容图形。不用大插画替代工具按钮，也不用 16px 图标承担品牌叙事。
- 图标视觉尺寸和点击区分离；图标可小，触摸目标不能跟着缩小。
- 图标与文字用光学对齐，不只靠几何中心；相邻按钮必须保持同一图标尺寸与笔画家族。
- 无文字 icon button 必须有可访问名称；陌生图标用 tooltip 解释，但关键信息不能只放 tooltip。

## 八、内容：文案是界面组件

来源：[Content overview](https://carbondesignsystem.com/guidelines/content/overview/) 与 [Writing style](https://carbondesignsystem.com/guidelines/content/writing-style/)。

- 用熟悉的词、短句、现在时、主动语态；需要专业词时先确保受众真的知道。
- 按钮标签写“动词 + 对象/结果”，让用户在点击前预测后果；避免泛化的“确定”“是”“继续”。
- 同一动作全站使用同一标签；不因文案个性破坏可预测性。
- 错误信息说明发生了什么、受影响的对象和下一步；不责怪用户。
- 语气随情境变，但品牌 voice 保持稳定。严重错误和危险操作不玩笑。

## 九、无障碍：不是交付前的附加检查

来源：[Accessibility overview](https://carbondesignsystem.com/guidelines/accessibility/overview/)、[Keyboard](https://carbondesignsystem.com/guidelines/accessibility/keyboard/) 与 [Developers](https://carbondesignsystem.com/guidelines/accessibility/developers/)。

- 从语义 HTML 开始，只在原生语义不足时增加 ARIA；不用 `div` 重造 button/link/input。
- DOM 顺序应与视觉阅读顺序一致，焦点流可预测，长导航提供 skip link。
- 所有交互可以仅用键盘完成，且 `focus-visible` 始终可见；弹层管理初始焦点、循环、Esc 关闭与触发器回焦。
- 标准文本对比度至少 4.5:1，大文字和关键 UI 边界至少 3:1；文字在图片/动态背景上要测试整个运动过程。
- 颜色不是唯一信息通道；状态同时用文本、图标、形状或位置表达。
- 数据可视化提供文本摘要或数据表替代；媒体提供字幕/文本转录。
- 支持放大文字、高对比模式、减少动效和屏幕阅读器；不假设用户有鼠标、精准视力或稳定注意力。

## 十、AI 界面：透明、可解释、可恢复

来源：[Carbon for AI](https://carbondesignsystem.com/guidelines/carbon-for-ai/) 与 [AI label](https://carbondesignsystem.com/components/ai-label/usage/)。

- 明确标出哪些内容或操作由 AI 生成/辅助，不把 AI 标识当装饰。
- 标识是前往解释信息的入口，不是“重新生成”按钮；生成、接受、重试、撤回各自用清晰操作。
- 生成内容应有可恢复路径：撤回、恢复原文、重新生成或查看来源。
- 区分“AI 正在工作”、“AI 输出已完成”、“AI 结果需审阅”和“AI 失败”，不用一个泛化的魔法图标包办所有状态。

## 实施时的基础决策单

1. 页面类型是产品性还是表达性？哪些区域可混合？
2. 用户在调整屏幕时是想看更多项，还是每项更多内容？
3. 哪些 key lines 跨区块持续？
4. token 是按角色命名还是按当前色值命名？
5. 每一个交互的 hover / active / focus / selected / disabled 是否可区分？
6. 动效是在说明因果与空间连续，还是仅为装饰？
7. 仅用键盘、屏幕阅读器、200% 放大和减少动效时，任务是否仍然完成？
