# qiaomu-design · 偏执型设计顾问

**中文** | [English](#english)

> 让 AI 做出"不像 AI 做的"设计：Jobs 式产品直觉 + Rams 式功能纯粹主义，融合五大顶级设计 Skill 的实测精华。
>
> An opinionated design advisor skill for Claude Code: anti-generic aesthetics, engineering-grade delivery, and a visual "style fitting room" — distilled from a controlled experiment across 5 top design skills.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE) [![Skill](https://img.shields.io/badge/Claude%20Code-Agent%20Skill-blue)](https://docs.anthropic.com/claude/docs/claude-code) [更新日志](CHANGELOG.md)

**已验证：** 本 skill 的每条核心规则均来自一场 6 变体 × 7 任务 × 42 页面的受控对比实验（5 个头部设计 Skill + 无 Skill 对照组），并经浏览器实测交互验证。

## 这是什么

一个 Claude Code Agent Skill。安装后，当你说"帮我设计 / 重新设计 / 优化界面"时，它会接管设计流程：先诊断真实需求，再用**可视化风格试衣间**给你 4 个方向实际看着选，确认后按工程验收标准交付——而不是直接吐一个紫渐变居中 Hero 的"AI 味"页面。

## 为什么值得用

大多数 AI 设计的问题不是画不好，而是：默认审美收敛（Inter + 紫渐变 + 三等分卡片）、方向靠文字描述拍脑袋选、交付物过不了工程验收、中文排版直接套英文规则。本 skill 针对这四个问题各给了一套实测过的机制。

## 核心能力

| 能力 | 你得到什么 |
|---|---|
| 风格试衣间 | 4 个互斥方向的真实迷你 mockup 本地预览页，点选/键盘/60s 超时自动推荐，先看后选 |
| 设计读取 + 三拨盘 | 按任务类型自适应冒险度/动效/密度：功能页收敛、开放命题放开 |
| AI 反套路禁令 | 禁 AI 紫渐变、禁 Inter、禁斜体、禁居中套路、禁 AI 文案词——从源头消灭"AI 味" |
| 中文排版规范 | 系统字体栈优先、装饰中文字体子集化、盘古之白、行高/字重/标点纪律 |
| 动效工艺库 | Emil Kowalski 体系：缓动曲线、分场景时长、按压反馈、stagger、进出不对称 |
| 工程验收清单 | Vercel 规范：a11y、表单、焦点陷阱、危险操作防护，`file:line` 格式审查 |
| 58 站设计系统库 | Stripe/Linear/Apple 等真实网站 DESIGN.md（Google Stitch 格式），可直接"参考 XX 做" |
| 打磨模式 | 已有页面不推倒重来：Audit/Critique/Polish/Animate/Harden/Live 六动作 |
| 交付门禁 | preflight 强制检查清单，任何一条不过就不交付 |
| 自进化机制 | 用户反馈自动抽象成规则写入偏好账本，越用越贴合你 |

## 快速开始

```bash
npx skills add joeseesun/qiaomu-design
```

然后在 Claude Code 里直接说：

```
帮我设计一个产品落地页
```

<details>
<summary>手动安装</summary>

```bash
git clone https://github.com/joeseesun/qiaomu-design.git
cp -r qiaomu-design ~/.claude/skills/qiaomu-design
```

前置条件：已安装 [Claude Code](https://docs.anthropic.com/claude/docs/claude-code)。

</details>

## 使用方式

**触发词**：重新设计 / redesign / 优化界面 / 设计方案 / UI 审查 / 帮我看看设计 / 参考 XX 的设计 / 给我一个设计系统

**典型流程**（三阶段，每阶段等你确认）：

```
你：帮我重新设计博客首页
 ↓ Phase 1  诊断：设计读取 + 三拨盘 + 2-3 个关键问题
 ↓ Phase 2  风格试衣间：生成 design-preview.html，4 个方向实际看着选
            （不选？60 秒后自动按推荐方向继续）
 ↓ Phase 3  执行：先立 DESIGN.md 锚 → 写码 → preflight 门禁 → 交付
```

**已有页面要优化**：说"帮我打磨这个页面 / 反 AI 味 / 加动效"，走打磨模式，不推倒重来。

## 工作原理

```
SKILL.md                       人格 + 工作流 + 拨盘 + 反套路禁令 + 自进化协议
references/
  user-preferences.md          用户偏好账本（自进化写入，最高优先级）
  style-preview.md             风格试衣间规范（4 方向 + 60s 自动推进）
  divergence-playbook.md       发散手册（轴级差异检验 + 14 种美学方向）
  motion-craft.md              动效工艺（Emil Kowalski 体系）
  engineering-checklist.md     工程验收（Vercel WIG + 组件行为标准）
  chinese-typography.md        中文排版与配色（W3C clreq / Ant Design / Apple HIG）
  preflight.md                 交付前门禁
  design-systems/{58 站}/      DESIGN.md 设计系统参考库
```

## 实测验证

规则不是拍脑袋写的。改造前先做了一场受控实验：6 个变体（anthropics/frontend-design、vercel/web-design-guidelines、ui-ux-pro-max、taste-skill、emil-design-eng、无 Skill 对照组）× 7 个任务（落地页/仪表盘/作品集/交互向导/组件面板/创意 404/多样性挑战）= 42 个页面，横评视觉个性、工程规范、动效工艺、交互完成度、组件合理性、创造性、多样性七个维度。每个维度胜者的核心机制被移植进本 skill，来源在 SKILL.md「血统说明」逐条可查。

## 限制与边界

- 这是 Claude Code 的 Agent Skill，不是独立软件；效果依赖模型能力
- 风格试衣间是本地静态 HTML，"点选回传"依赖剪贴板/对话确认，不含服务端
- 58 站 DESIGN.md 库来自公开网站的设计系统提炼，用于风格参考，不代表对应公司背书
- 装饰性中文字体默认禁用（体积 5-20MB），只在创意标题场景子集化加载——这是特性不是缺陷

## 来源与致谢

MIT License。融合机制来源（详见 SKILL.md 血统说明）：[anthropics/skills](https://github.com/anthropics/skills) · [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines) · [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) · [emilkowalski/skills](https://github.com/emilkowalski/skills) · [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) · [pbakaus/impeccable](https://github.com/pbakaus/impeccable) · [arvindrk/extract-design-system](https://github.com/arvindrk/extract-design-system) · [mattpocock/skills](https://github.com/mattpocock/skills) · DESIGN.md 库基于 [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)（Google Stitch 格式）

## 关于向阳乔木

- 网站：[qiaomu.ai](https://qiaomu.ai) · 博客：[blog.qiaomu.ai](https://blog.qiaomu.ai) · 工具推荐：[tuijian.qiaomu.ai](https://tuijian.qiaomu.ai)
- X：[@vista8](https://x.com/vista8) · GitHub：[@joeseesun](https://github.com/joeseesun) · 公众号：向阳乔木推荐看

---

<a name="english"></a>

# English

**qiaomu-design** is a Claude Code Agent Skill that makes AI-generated interfaces stop looking AI-generated. It fuses the experimentally-validated strengths of five top design skills (Anthropic frontend-design, Vercel web-interface-guidelines, taste-skill, Emil Kowalski's design engineering, ui-ux-pro-max) into one opinionated design advisor.

## Install

```bash
npx skills add joeseesun/qiaomu-design
```

Then just ask Claude Code: `redesign my landing page`.

## What you get

- **Style fitting room**: a local HTML preview with 4 mutually-divergent direction mockups (real fonts/colors/layout). Pick by click or keys; after 60s it auto-advances with the recommended direction.
- **Design read + three dials**: VARIANCE / MOTION / DENSITY auto-tuned per task type — restrained on functional UI, bold on open creative briefs.
- **Anti-slop bans**: no AI-purple gradients, no Inter, no italics, no centered-hero clichés, no "revolutionary/seamless" copy.
- **Chinese typography rules**: system font stack first, subset decorative CJK webfonts (5-20 MB otherwise), CJK spacing/punctuation/line-height discipline.
- **Motion craft** (Emil Kowalski system) and **engineering checklist** (Vercel WIG): easing/durations/stagger, a11y, focus traps, destructive-action guards.
- **58 real-site DESIGN.md library** (Stripe, Linear, Apple…, Google Stitch format) for "make it like X" requests.
- **Polish mode** for existing pages (Audit/Critique/Polish/Animate/Harden/Live) — no rewrites from scratch.
- **Pre-flight gate**: a hard checklist; nothing ships if any item fails.
- **Self-evolution**: your feedback gets abstracted into a preferences ledger the skill reads before every task.

## Verified

Every core rule traces back to a controlled experiment: 6 variants × 7 tasks × 42 generated pages, scored on visual identity, engineering rigor, motion craft, interaction completeness, component sanity, creativity, and diversity. Provenance is documented per-module in SKILL.md.

## Limits

Requires Claude Code. The fitting room is a static local HTML page (selection returns via clipboard/chat). The DESIGN.md library is distilled from public sites for reference, not endorsement.

MIT © [joeseesun](https://github.com/joeseesun)
