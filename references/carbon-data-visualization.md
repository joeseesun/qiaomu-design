# Carbon 数据可视化决策手册

> 本手册摘要 Carbon 的图表类型、坐标轴、颜色、图例、仪表盘与复杂图形指南。
> 目标是帮助乔木项目先选对表达，再做美化。

## 一、先写问题，再选图表

来源：[Chart types](https://carbondesignsystem.com/data-visualization/chart-types/)。

| 用户问题 | 优先图形 | 不要用 |
|---|---|---|
| 各类别差多少？ | 条形/柱形、点图 | 难精确比较的饼图 |
| 随时间怎么变？ | 折线、面积、时间轴 | 无时间间隔语义的类别柱罗列 |
| 部分占整体多少？ | 100% 堆叠、少类别环/饼、treemap | 多分片饼图 |
| 两变量是否相关？ | 散点、气泡 | 双 Y 轴制造虚假关系 |
| 连接、流向或层级是什么？ | 网络、Sankey、tree | 用普通饼图/柱图隐藏连接 |
| 空间位置有什么意义？ | 地图叠加、热力、比例符号 | 没有地理问题却为装饰使用地图 |

图表标题要描述用户能得到的信息，不只写数据字段名。

## 二、坐标轴与标签

来源：[Axes and labels](https://carbondesignsystem.com/data-visualization/axes-and-labels/)。

- 长度编码的柱/条图默认从 0 开始，否则视觉差异被夸大。折线可在明确标注范围时截断轴。
- 缺失值和 0 不是一回事；断点、空白或明确标记缺数，不用 0 自动补齐。
- 时间轴间隔与数据粒度一致，时区、日期范围和采样周期可见。
- 单位在轴标题、列头或数值中稳定出现，不让用户猜元/万元、秒/毫秒。
- 优先水平可读标签；不靠大角度旋转硬塞过多类别，改用条形、筛选、分组或滚动。

## 三、颜色只用于编码

来源：[Color palettes](https://carbondesignsystem.com/data-visualization/color-palettes/)。

- categorical palette 用于无顺序类别；sequential palette 用于低到高；diverging palette 用于围绕中性基线的正负偏离。
- 异常/告警 palette 与普通数据 palette 分离，红黄不作无意义装饰类别色。
- 颜色数量不超过人能稳定区分的范围；类别过多时合并“其他”、筛选或分面。
- 重要系列在浅/深主题中保持识别优先级，不只依赖相近色相。
- 使用形状、线型、直接标签和文本摘要补足色觉障碍。

## 四、图例与交互

来源：[Legends](https://carbondesignsystem.com/data-visualization/legends/)。

- 能直接标在图形上就不用用户在图例和图形间来回对照。
- 图例顺序与图中视觉顺序/重要性一致，颜色、线型、名称绑定稳定。
- 可点图例必须有 selected / hidden / focus 状态，并为键盘与屏幕阅读器提供同等操作。
- 图例溢出时优先换行、分组、滚动或筛选，不把色块和文字缩到无法读取。

## 五、仪表盘不是图表陈列架

来源：[Dashboards](https://carbondesignsystem.com/data-visualization/dashboards/)。

- presentation dashboard 用于快速阅读关键结论：少量 KPI、明确层级、有限交互。
- exploration dashboard 用于分析与发现：筛选、比较、下钻、图表联动、可恢复状态。
- 先写每个区块支持的决策，不为填满网格增加图表。
- KPI 必须有时间范围、单位、比较基线与状态解释；单个大数字不自动产生意义。
- 筛选变更时所有受影响的图表给出一致反馈，且 URL/保存视图可恢复分析上下文。

## 六、复杂图形的使用边界

来源：[Flow charts](https://carbondesignsystem.com/data-visualization/flow-charts/)、[Spatial charts](https://carbondesignsystem.com/data-visualization/spatial-charts/) 与 [Gantt charts](https://carbondesignsystem.com/data-visualization/gantt-charts/)。

- Sankey/alluvial 表达流量从来源到去向，宽度有定量意义；不用于仅表达关系存在。
- network 图只在连接结构是核心问题时使用，必须提供筛选、搜索、聚焦、缩放和详情，不展示无法解读的“毛线球”。
- treemap/circle pack 适合层级占比和密度扫读，不用于精确比较相近数值。
- 地图只在位置、距离、区域或路径本身是问题时使用，并警惕投影面积造成的认知偏差。
- Gantt 用于任务时间、依赖、里程碑与资源冲突，需要清晰时间粒度和缩放；简单进度用列表/进度条。

## 七、可访问性与证据

- 每个图表有标题、文本摘要、时间范围、单位和数据来源/刷新时间。
- 关键数据提供表格或可导出的等价形式；屏幕阅读器不必在数百个 SVG node 之间猜数据。
- hover tooltip 里的信息也能通过键盘 focus / 表格 / 详情面板获取。
- 不只用颜色表达系列和状态；测试色觉缺陷、高对比、深浅主题与 200% 放大。
- 验证极值、负值、全 0、单点、缺失、超长类别、大量系列、窄屏和无数据。

## 图表交付前的九问

1. 这张图回答的用户问题是什么？
2. 为什么不用表格、一句话或一个数字？
3. 图形通道是否适合比较/趋势/占比/相关/连接/空间？
4. 轴、单位、时间、缺失值和基线是否真实？
5. 颜色是类别、顺序、正负还是状态？
6. 不看颜色时仍能理解吗？
7. 图例、tooltip、筛选和下钻能否用键盘完成？
8. 极端数据与 390px 宽度下会怎样？
9. 是否有文本摘要、表格/导出和数据来源？
