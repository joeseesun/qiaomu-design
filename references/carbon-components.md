# Carbon 组件决策手册

> 目标不是要求项目安装 `@carbon/react`，而是借用 Carbon 的组件选型逻辑。
> 对任何自定义组件，都用“何时用 / 何时不用 / 结构 / 内容 / 行为 / 响应式 / 无障碍”七问定义。

## 一、组件选型七问

1. **用户目标**：这是导航、执行、选择、输入、阅读还是状态理解？
2. **为什么不用更简单的元素**？一个链接、按钮、标题加正文能解决就不造新组件。
3. **信息模型**：单值、单选、多选、多行多列、层级树、连续范围还是长文？
4. **操作影响**：即时生效、批量提交、可撤回、需确认还是不可逆？
5. **主状态**：enabled / hover / active / focus / selected / loading / empty / error / disabled / read-only 哪些必须存在？
6. **内容边界**：最长标签、异步内容、空数据、多语言和极端数值会怎样？
7. **替代输入**：键盘、触摸、屏幕阅读器和放大后如何完成同一任务？

## 二、操作与导航

### Button / Link

来源：[Button](https://carbondesignsystem.com/components/button/usage/) 与 [Link](https://carbondesignsystem.com/components/link/usage/)。

- button 改变当前状态或执行命令；link 把用户带到另一位置。不用样式混淆语义。
- 一个区域只保留一个主操作；支持动作用次级/幽灵层级，危险动作只在真正破坏性场景使用。
- 按钮标签应能预测结果；同一按钮组不混用尺寸。
- icon-only button 用于熟悉、高频、空间紧凑的操作，必须有可访问名称和 tooltip。不熟悉或高风险操作保留文字。

### Menu / Overflow menu / Menu button

来源：[Menu](https://carbondesignsystem.com/components/menu/usage/)、[Overflow menu](https://carbondesignsystem.com/components/overflow-menu/usage/) 与 [Menu buttons](https://carbondesignsystem.com/components/menu-buttons/usage/)。

- menu 承载一组紧密相关的命令或选择；不是隐藏本应常驻的主操作。
- overflow menu 收纳低频次要操作；高频操作不能因空间懒惰而全塞入更多菜单。
- split/menu button 只在一个主命令有少量紧密变体时使用；若各选项地位对等，使用普通菜单或选择器。

### Breadcrumb / Tabs / Content switcher / Pagination

来源：[Breadcrumb](https://carbondesignsystem.com/components/breadcrumb/usage/)、[Tabs](https://carbondesignsystem.com/components/tabs/usage/)、[Content switcher](https://carbondesignsystem.com/components/content-switcher/usage/) 与 [Pagination](https://carbondesignsystem.com/components/pagination/usage/)。

- breadcrumb 表达两层以上的信息架构位置，永远是次级导航，不取代主导航。多步任务用 progress indicator，不用 breadcrumb。
- tabs 切换同一上下文中的相关内容组，一次只选一项；切换同一内容的表示方式/过滤状态用 content switcher。
- tabs 适合保留在当前工作流的并列视图；若内容之间有先后依赖，用 stepper/progress indicator。
- pagination 用于可稳定分页、需要位置感的数据；流式浏览可用 load more，但必须保留已加载内容与滚动位置。

## 三、输入与选择

### Text / Number / Date / File

来源：[Text input](https://carbondesignsystem.com/components/text-input/usage/)、[Number input](https://carbondesignsystem.com/components/number-input/usage/)、[Date picker](https://carbondesignsystem.com/components/date-picker/usage/) 与 [File uploader](https://carbondesignsystem.com/components/file-uploader/usage/)。

- 使用与数据类型匹配的原生输入语义，同时提供可见 label；placeholder 不取代 label。
- helper text 在输入前给出约束，error text 在失败后说明修正方式；两者位置稳定，避免出错时整页跳动。
- number stepper 适合小范围、离散、反复微调；大范围或需精确输入时保留文本输入。
- date picker 允许键盘直接输入，不强迫用户在日历中长距离点选。
- file upload 明确格式、数量、上限、上传进度、单文件失败与重试，不把一批文件压成一个笼统错误。

### Checkbox / Radio / Toggle / Select / Dropdown / Slider

来源：[Checkbox](https://carbondesignsystem.com/components/checkbox/usage/)、[Radio button](https://carbondesignsystem.com/components/radio-button/usage/)、[Toggle](https://carbondesignsystem.com/components/toggle/usage/)、[Select](https://carbondesignsystem.com/components/select/usage/)、[Dropdown](https://carbondesignsystem.com/components/dropdown/usage/) 与 [Slider](https://carbondesignsystem.com/components/slider/usage/)。

- checkbox = 多选或独立布尔选择；radio = 一组互斥选项；toggle = 立即开/关且状态长期可见。
- 需要“选择后再提交”的表单字段不伪装成 toggle；即时生效的 toggle 要立刻反映成功/失败。
- 选项少且需比较时用 radio；选项多或空间紧时用 select/dropdown；需搜索、分组或多选时用功能更完整的 dropdown/combobox。
- slider 适合感知“大致多少”和连续范围；需精确、财务、不容误触的数值提供数字输入或刻度辅助。

## 四、内容、容器与渐进披露

### List / Structured list / Contained list / Data table

来源：[List](https://carbondesignsystem.com/components/list/usage/)、[Structured list](https://carbondesignsystem.com/components/structured-list/usage/)、[Contained list](https://carbondesignsystem.com/components/contained-list/usage/) 与 [Data table](https://carbondesignsystem.com/components/data-table/usage/)。

- 简单并列文本用 list；多行、少列、仅浏览/单选的轻量结构用 structured list；小容器中带行内操作用 contained list。
- 需要多列比较、排序、筛选、批量选择、展开行或大数据集时用 data table；不在简单列表上堆成小型表格。
- 数字列右对齐且使用 tabular numerals；文本列左对齐；表头用明确单位。
- 列表文字优先换行而不是截断；表格在窄屏要明确选择横向滚动、列优先级、转卡片或转详情，不让浏览器随意挤列。

### Tile / Accordion / Tree view

来源：[Tile](https://carbondesignsystem.com/components/tile/usage/)、[Accordion](https://carbondesignsystem.com/components/accordion/usage/) 与 [Tree view](https://carbondesignsystem.com/components/tree-view/usage/)。

- tile 只在一块内容是可选、可点或需独立容器边界时使用；不把页面的每个 section 都卡片化。
- 整卡点击时，卡内不再塞互相冲突的主点击目标；需多操作时改为非点击容器 + 明确行内操作。
- accordion 用于非必读、可独立展开的相关内容；若用户大概会全部阅读，直接展开并用标题分节。
- tree view 用于真正的嵌套层级浏览；不用多层 accordion 伪造树。

### Tooltip / Toggletip / Popover / Modal

来源：[Tooltip](https://carbondesignsystem.com/components/tooltip/usage/)、[Toggletip](https://carbondesignsystem.com/components/toggletip/usage/)、[Popover](https://carbondesignsystem.com/components/popover/usage/) 与 [Modal](https://carbondesignsystem.com/components/modal/usage/)。

- tooltip 只放短、非关键、无交互的说明；用户必须看到才能完成任务的信息常驻显示。
- 补充内容含链接、按钮或需停留阅读时用 toggletip/popover，并定义焦点顺序、外部点击和 Esc 行为。
- modal 用于需要中断当前工作、必须给出决定或高重要性的任务；长表单、复杂创建、持续参考内容用侧板或独立页。
- 弹层不嵌套弹层；关闭后焦点回到触发元素；危险操作的主次按钮顺序和文案必须明确。

## 五、状态、反馈与进度

来源：[Notification](https://carbondesignsystem.com/components/notification/usage/)、[Loading](https://carbondesignsystem.com/components/loading/usage/)、[Inline loading](https://carbondesignsystem.com/components/inline-loading/usage/)、[Progress bar](https://carbondesignsystem.com/components/progress-bar/usage/) 与 [Progress indicator](https://carbondesignsystem.com/components/progress-indicator/usage/)。

- 字段级问题就地显示；区块级结果用 inline notification；跨页低阻塞短反馈用 toast；必须当下处理的问题才使用 modal。
- notification 不只有颜色，同时包含状态名、具体信息和下一步。不让多个 toast 无限堆叠。
- 已知进度用 progress bar；未知进度用 spinner/inline loading；多步任务用 progress indicator，不混用。
- 高频按钮操作用按钮内/inline loading，保持原位尺寸并防重复提交；整页载入才用全屏 loading。
- skeleton 与真实内容的布局尺寸一致，用于首次内容加载；已有内容刷新时尽量保留旧内容并标注局部更新。

## 六、组件 dossier 模板

添加或重做关键组件前，在设计计划中写：

```markdown
### Component: <name>
- User goal:
- Use when:
- Do not use when:
- Anatomy:
- Variants and why each exists:
- Content rules and longest realistic content:
- States: default / hover / active / focus / selected / loading / empty / error / disabled / read-only
- Mouse, touch, keyboard and screen-reader behavior:
- Narrow viewport and overflow strategy:
- Recovery path:
- Test evidence:
```

如果无法回答“为什么不用邻近组件”，说明选型尚未完成。
