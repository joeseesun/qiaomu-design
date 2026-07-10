# Carbon 研究范围与源映射

## 快照

- 研究日期：2026-07-10
- 站点索引：`https://carbondesignsystem.com/sitemap-0.xml`
- sitemap URL 数：319
- 官方源仓库：[carbon-design-system/carbon-website](https://github.com/carbon-design-system/carbon-website)
- 源仓库快照：`17033640cf7680ee803690f2bd21c2a4bb307743`
- 源 MDX 页：321
- 许可证：Carbon website 为 Apache-2.0；本 skill 以重写、摘要和场景化规则引用，不复制官方图片、组件代码或大段原文。

## 研究方法

1. 用官方 sitemap 建立完整页面范围，避免只读搜索热门页。
2. 浅克隆官方 website 仓库，对 321 个 MDX 按目录和标题做结构化索引。
3. 对所有组件 usage 文档抽取 Overview / When to use / When not to use / Formatting / Content / Behavior / Accessibility 结构。
4. 深读 foundations、universal patterns、community workflows、data visualization 和无障碍核心页。
5. 只将能跨品牌复用的决策方法转化到 qiaomu-design；不把 IBM 特有文案、颜色和框架 API 当成乔木默认。

## 覆盖结构

| 官方类别 | MDX 数 | 在本 skill 的落点 |
|---|---:|---|
| Components | 175 | `carbon-components.md` + 现有 `engineering-checklist.md` |
| Developing | 43 | 仅吸收语义 HTML、token、键盘和验证方法；不绑定 React/Angular/Vue |
| Elements | 23 | `carbon-foundations.md` |
| Patterns | 18 | `carbon-patterns.md` |
| Community | 14 | `carbon-patterns.md` 的 CRUD / import / export / API key / chatbot |
| Data visualization | 11 | `carbon-data-visualization.md` |
| Guidelines | 8 | `carbon-foundations.md` 的 content / accessibility / AI |
| Contributing | 6 | 转化为“七问 dossier + 交付门禁” |
| Designing | 4 | 用于理解设计资产与系统约束 |
| Migrating | 4 | 转化为主题/token/行为不可破坏的迁移意识 |
| All about Carbon | 4 | 用于设计系统治理与复用边界 |

## Foundation 源索引

- [2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/)
- [Color](https://carbondesignsystem.com/elements/color/overview/)
- [Icons](https://carbondesignsystem.com/elements/icons/usage/)
- [Pictograms](https://carbondesignsystem.com/elements/pictograms/usage/)
- [Motion](https://carbondesignsystem.com/elements/motion/overview/)
- [Spacing](https://carbondesignsystem.com/elements/spacing/overview/)
- [Themes](https://carbondesignsystem.com/elements/themes/overview/)
- [Typography](https://carbondesignsystem.com/elements/typography/overview/)
- [Accessibility](https://carbondesignsystem.com/guidelines/accessibility/overview/)
- [Content](https://carbondesignsystem.com/guidelines/content/overview/)
- [Carbon for AI](https://carbondesignsystem.com/guidelines/carbon-for-ai/)

## Component 源索引

研究了官方组件的 usage / style / code / accessibility 页，组件家族包括：

- Shell：UI shell header、left panel、right panel
- Content/disclosure：accordion、code snippet、contained list、list、structured list、tile、tree view
- Actions/navigation：breadcrumb、button、content switcher、link、menu、menu buttons、overflow menu、pagination、tabs
- Inputs/selection：checkbox、date picker、dropdown、file uploader、form、number input、radio button、search、select、slider、text input、toggle
- Overlay/help：modal、popover、toggletip、tooltip
- Data/status：data table、tag、notification、loading、inline loading、progress bar、progress indicator
- AI：AI label

详细入口：[Components overview](https://carbondesignsystem.com/components/overview/components/)。

## Pattern 源索引

### Universal patterns

- [Common actions](https://carbondesignsystem.com/patterns/common-actions/)
- [Dialogs](https://carbondesignsystem.com/patterns/dialog-pattern/)
- [Disabled states](https://carbondesignsystem.com/patterns/disabled-states/)
- [Disclosures](https://carbondesignsystem.com/patterns/disclosures-pattern/)
- [Empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/)
- [Filtering](https://carbondesignsystem.com/patterns/filtering/)
- [Fluid styles](https://carbondesignsystem.com/patterns/fluid-styles/)
- [Forms](https://carbondesignsystem.com/patterns/forms-pattern/)
- [Global header](https://carbondesignsystem.com/patterns/global-header/)
- [Loading](https://carbondesignsystem.com/patterns/loading-pattern/)
- [Login](https://carbondesignsystem.com/patterns/login-pattern/)
- [Notifications](https://carbondesignsystem.com/patterns/notification-pattern/)
- [Overflow content](https://carbondesignsystem.com/patterns/overflow-content/)
- [Read-only states](https://carbondesignsystem.com/patterns/read-only-states-pattern/)
- [Search](https://carbondesignsystem.com/patterns/search-pattern/)
- [Status indicators](https://carbondesignsystem.com/patterns/status-indicator-pattern/)
- [Text toolbar](https://carbondesignsystem.com/patterns/text-toolbar-pattern/)

### Community patterns

- [Chatbot](https://carbondesignsystem.com/community/patterns/chatbot/overview/)
- [Create flows](https://carbondesignsystem.com/community/patterns/create-flows/)
- [Edit](https://carbondesignsystem.com/community/patterns/edit-pattern/)
- [Export](https://carbondesignsystem.com/community/patterns/export-pattern/)
- [Generate an API key](https://carbondesignsystem.com/community/patterns/generate-an-api-key/)
- [Import](https://carbondesignsystem.com/community/patterns/import-pattern/)
- [Remove](https://carbondesignsystem.com/community/patterns/remove-pattern/)

## Data visualization 源索引

- [Chart anatomy](https://carbondesignsystem.com/data-visualization/chart-anatomy/)
- [Chart types](https://carbondesignsystem.com/data-visualization/chart-types/)
- [Axes and labels](https://carbondesignsystem.com/data-visualization/axes-and-labels/)
- [Color palettes](https://carbondesignsystem.com/data-visualization/color-palettes/)
- [Legends](https://carbondesignsystem.com/data-visualization/legends/)
- [Dashboards](https://carbondesignsystem.com/data-visualization/dashboards/)
- [Simple charts](https://carbondesignsystem.com/data-visualization/simple-charts/)
- [Spatial charts](https://carbondesignsystem.com/data-visualization/spatial-charts/)
- [Flow charts](https://carbondesignsystem.com/data-visualization/flow-charts/)
- [Gantt charts](https://carbondesignsystem.com/data-visualization/gantt-charts/)

## 更新方法

当 Carbon 出现大版本、官方文档结构调整，或用户要求刷新时：

```bash
curl -fsSL https://carbondesignsystem.com/sitemap-0.xml -o /tmp/carbon-sitemap.xml
git clone --depth=1 https://github.com/carbon-design-system/carbon-website.git /tmp/carbon-website
find /tmp/carbon-website/src/pages -type f -name '*.mdx' | wc -l
git -C /tmp/carbon-website rev-parse HEAD
```

对比 sitemap 分类、组件 usage 页和 pattern 目录；只更新发生决策变化的规则，不追随细枝末节的视觉数值更动。
