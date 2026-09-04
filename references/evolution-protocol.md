# qiaomu-design 自进化协议

## 目标

让 Skill 从“会记住反馈”升级为“能用证据安全改进执行路径”。自进化不等于模型自动改权重，而是把真实反馈、可复现缺陷和验证结果，转成下一次任务能执行、能检查、能回滚的规则。

## 状态机

```text
observed → proposed → accepted → published → retired
              ↓           ↓
            rejected     rolled-back
```

- `observed`：只记录事实，不改变行为。
- `proposed`：从一条或多条事件抽象出候选规则，必须带适用范围和证据。
- `accepted`：用户明确同意，或已授权的自发现缺陷满足“可复现 + 有证据 + 可抽象”三项条件。
- `published`：规则已经写入 `user-preferences.md`，并且同步到对应规范或 `preflight.md`。
- `retired` / `rolled-back`：新规则造成回归、与更高优先级事实冲突，或用户明确废止；保留历史，不静默删除。

## 机器可读记录

由 `scripts/qiaomu-design-evolution.mjs` 管理的文件位于 `references/evolution/`：

- `events.jsonl`：原始反馈、确认、自发现缺陷、验证结果。
- `candidates.jsonl`：抽象后的候选规则及其证据引用。
- `decisions.jsonl`：接受、拒绝、发布、废止和回滚等不可变状态转移。

JSONL 采用追加记录，不原地改历史。每条记录必须有唯一 `id`、`timestamp`、`type` 和 `source`；候选规则通过 `eventIds` 关联原始事件。自发现问题必须额外提供 `evidence`；路径应指向截图、日志、测试输出、选择文件或复现记录，而不是“看起来不对”。

## 安全发布规则

1. 先 `record` 事实，再 `propose` 规则；禁止把未经抽象的用户原话直接塞进通用禁令。
2. 候选规则必须声明 `level`（硬禁令 / 强偏好 / 情境规则）、`scope`、`rationale` 和 `eventIds`；原始事件提供 `evidence`。
3. 一次性需求不进入长期账本；不确定是否长期有效时，询问用户。
4. 只有 `approve` 后才允许 `publish`。`publish` 必须写入唯一规则编号、原话摘录、日期和状态，并记录对应的规范/门禁；回归用 `transition --status rolled-back` 留痕。
5. 与已有规则冲突时，先生成冲突报告；不得靠文件顺序“后写覆盖前写”。新规则发布后，旧规则改为“已废止（日期，原因）”，保留决策历史。
6. 发布后立即对当前产物重跑受影响门禁；失败则 `rollback`，不能只保留一条漂亮的账本记录。
7. 每次发布最多改变一个主题，避免无法判断是哪条规则带来了回归。

## 评估闭环

每个已发布规则都应该逐渐获得三类证据：

- **触发证据**：为什么出现这条规则。
- **执行证据**：后续任务确实按规则改变了行为。
- **结果证据**：截图、测试、用户确认或回归数据证明结果更好。

只有触发证据的规则是“记忆”，不是“学习”。重复触发、被用户反复确认、或在同类任务中降低缺陷率后，才考虑升级为硬禁令；若长期没有触发或造成误伤，应降级、废止或回滚。

## 推荐调用

```bash
EVOLUTION_ROOT="${QIAOMU_DESIGN_ROOT:-${HOME}/.agents/skills/qiaomu-design}"
node "$EVOLUTION_ROOT/scripts/qiaomu-design-evolution.mjs" init --root "$EVOLUTION_ROOT"
node "$EVOLUTION_ROOT/scripts/qiaomu-design-evolution.mjs" record --root "$EVOLUTION_ROOT" \
  --type correction --source user --quote "用户的原话" --scope "中文界面" \
  --evidence /path/to/screenshot.png
node "$EVOLUTION_ROOT/scripts/qiaomu-design-evolution.mjs" report --root "$EVOLUTION_ROOT"
node "$EVOLUTION_ROOT/scripts/qiaomu-design-evolution.mjs" verify --root "$EVOLUTION_ROOT"
```

`record` 和 `propose` 不会改变 Skill 行为；`publish` 必须显式带 `--confirm`，并且只接受已经 `accepted` 的候选规则。自动化可以收集证据和生成候选，但不能替用户批准主观审美规则。
