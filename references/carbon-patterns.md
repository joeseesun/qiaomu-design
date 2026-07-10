# Carbon 模式手册：用完整工作流取代零散控件

> Carbon 定义 pattern 为“用户如何完成目标的最佳实践解法”。
> 组件是局部部件，pattern 必须包含入口、过程、反馈、异常、恢复和退出。

## 一、模式级思考

来源：[Patterns overview](https://carbondesignsystem.com/patterns/overview/)。

对任何主工作流画出七段：

1. **Entry**：用户从哪里开始，入口是否符合频率和权限。
2. **Setup**：开始前要理解什么，哪些默认值可以减少输入。
3. **Act**：主任务是否单一、连续、可预测。
4. **Progress**：系统正在做什么，还需要多久，用户能否离开。
5. **Result**：成功是什么，产物在哪里，下一步是什么。
6. **Exception**：部分失败、网络中断、权限不足、内容冲突如何表达。
7. **Recovery / Exit**：重试、撤回、保存草稿、取消、回到原位如何完成。

## 二、披露与密度

来源：[Disclosures](https://carbondesignsystem.com/patterns/disclosures-pattern/) 与 [Overflow content](https://carbondesignsystem.com/patterns/overflow-content/)。

- 渐进披露用于非核心、用户可自主请求、不影响当前任务判断的附加内容。
- 不隐藏完成任务必需的信息、安全警告、关键错误、价格或提交后果。
- 触发器要表明可展开性与当前状态，展开后的内容与触发器保持空间、语义和焦点关联。
- “Show more” 要明确展开什么；展开后不让用户丢失阅读位置，必要时提供“收起”。
- 截断是最后选择。先换行、调整容器、减少次要内容；必须截断时提供完整内容的可访问路径。

## 三、空状态、加载与通知

来源：[Empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/)、[Loading](https://carbondesignsystem.com/patterns/loading-pattern/) 与 [Notifications](https://carbondesignsystem.com/patterns/notification-pattern/)。

### Empty state

- 区分 first use、user cleared、no results、not available、permission limited 和 system error；它们的文案和 CTA 不同。
- 空状态包含“现在是什么状态”和“最合理的下一步”；不用大插画和长教程掩盖空间。
- 搜索无结果保留查询与筛选上下文，给出放宽条件/清除筛选的路径。

### Loading

- 骨架屏表达即将出现的结构；不确定等待用 loading indicator；已知进度用 progress bar。
- 分批/渐进显示已就绪内容，不等所有请求一起完成。
- 刷新已有内容时保留可用结果，局部标记正在更新；不回退到整屏空白。

### Notification

- 按“严重度 + 时效性 + 与当前任务的距离 + 是否必须操作”选 inline / toast / banner / panel / modal。
- 反馈尽量靠近触发位置；跨页事件才移到全局。
- 成功通知低打扰且可自动消失；错误与需要操作的通知不得过早消失。

## 四、表单、验证与长任务

来源：[Forms pattern](https://carbondesignsystem.com/patterns/forms-pattern/) 与 [Fluid styles](https://carbondesignsystem.com/patterns/fluid-styles/)。

- 一个表单只承担一个用户目标；按心智模型分组，标签长度与排列保持扫读性。
- 优先说明少数 optional 字段；如果大部分可选，则标注少数 required 字段。不让用户猜必填规则。
- 在输入前说明格式约束；在用户完成字段后适时验证；提交失败后把焦点带到问题摘要或第一个错误字段。
- 不以“有错就禁用提交按钮”取代错误解释；若按钮不可用，用户必须知道原因。
- 长表单考虑分步、草稿、返回恢复、离开警告和提交后摘要；不把简单表单为了“高级感”人为拆步。
- fluid input 是高密度表格/工作台的局部工具，不应让全站所有表单都变成高密度平面方格。

## 五、对话框、中断与焦点

来源：[Dialog pattern](https://carbondesignsystem.com/patterns/dialog-pattern/)。

- modal dialog 会中断当前流程，只在必须当下决策、高影响或独立小任务时使用。
- non-modal dialog/popover 用于辅助当前任务且需同时参考页面内容的场景。
- 弹层打开时焦点进入最有用的控件，而不是无意义的容器；关闭时回到触发点。
- 关闭规则与数据风险匹配：无状态弹层可外部点击/Esc；有未保存变更时需明确确认或保存草稿。
- 按钮顺序、文案与视觉层级必须让用户知道什么是默认后果。

## 六、禁用、只读与隐藏

来源：[Disabled states](https://carbondesignsystem.com/patterns/disabled-states/) 与 [Read-only states](https://carbondesignsystem.com/patterns/read-only-states-pattern/)。

- **Disabled**：当前不可交互但保留控件位置对理解有价值。必须让用户能找到不可用原因和解锁路径。
- **Read-only**：数据可看、可复制、不可修改；外观要与 disabled 区分，不把有效数据变成低对比灰尘。
- **Hidden**：用户不需要知道此功能存在，或它对当前角色永久不适用。不用 hidden 回避解释暂时不可用的功能。

## 七、筛选、搜索与 URL 状态

来源：[Filtering](https://carbondesignsystem.com/patterns/filtering/) 与 [Search pattern](https://carbondesignsystem.com/patterns/search-pattern/)。

- 单筛选或低成本筛选可即时生效；多类别、高开销或结果跳动大时批量应用。
- 显示已应用条件与结果数；提供按条件移除和全部重置，重置后状态一致。
- 搜索是精确查找，筛选是缩小已知数据集；两者可组合但视觉和语义不混淆。
- 有分享、回退、重载、跨页价值的筛选/搜索/tab/分页状态写入 URL。

## 八、通用动作与危险分级

来源：[Common actions](https://carbondesignsystem.com/patterns/common-actions/) 与 [Remove pattern](https://carbondesignsystem.com/community/patterns/remove-pattern/)。

- Add / Create：“加入现有集合”与“创建新对象”使用不同动词，不用一个加号混淆。
- Clear / Reset / Remove / Delete 按影响不同分开：clear 清当前输入，reset 恢复默认，remove 解除关系，delete 删除对象。
- 低影响可直接执行 + undo；中影响需确认后果；高影响/不可逆需明确对象、影响范围和意图验证。
- 不因实现方便把所有删除都弹窗；过度确认会训练用户无脑点确定。

## 九、创建、编辑、导入、导出和 API Key

来源：[Create flows](https://carbondesignsystem.com/community/patterns/create-flows/)、[Edit](https://carbondesignsystem.com/community/patterns/edit-pattern/)、[Import](https://carbondesignsystem.com/community/patterns/import-pattern/)、[Export](https://carbondesignsystem.com/community/patterns/export-pattern/) 与 [Generate an API key](https://carbondesignsystem.com/community/patterns/generate-an-api-key/)。

- 选容器要看任务长度和参考需求：少量就地字段用 inline，独立小任务用 modal，需参考背景用 side panel，长/高影响任务用 full page。
- 编辑时说明不可编辑字段，必要时在提交前给变更摘要。
- 导出提供可用默认文件名，选项只在用户真有格式/位置需求时展开；成功后告诉产物在哪里。
- 导入按文件逐个显示校验、进度与失败，保留成功项并允许重试失败项。
- API key 在创建时明确范围、权限、到期与只显示一次的风险；创建后给复制、安全保存与轮换/撤销路径。

## 十、全局导航与 AI 对话

来源：[Global header](https://carbondesignsystem.com/patterns/global-header/) 与 [Chatbot](https://carbondesignsystem.com/community/patterns/chatbot/overview/)。

- 顶部导航从左到右由 product-local 过渡到 system-global；产品名和主导航在左，账号、通知、跨产品切换等全局功能在右。
- 导航持久但不吞掉首屏；窄屏收纳次级导航，保留产品识别与核心操作。
- chatbot 必须明确身份、能力边界、数据使用和退出路径；不伪装成全知人类。
- 对话流覆盖多轮、追问、线程切换、卡片展开、工具调用、部分失败、重试、停止生成和人工接管。

## 模式验收表

```markdown
### Pattern: <user goal>
- Entry points and frequency:
- Happy path:
- Progress feedback:
- Partial success:
- Empty / error / permission / offline states:
- Cancel / undo / retry / resume:
- Focus and keyboard journey:
- URL and persistence behavior:
- Mobile adaptation:
- Completion evidence:
```

只画 happy path 的方案不算完整模式。
