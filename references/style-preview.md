# 风格试衣间规范（Style Preview）

> 来源：用户反馈——"每次设计时快速给几种风格预览（本地网页），用户选中方向后再开始设计"。
> 这是本 skill 与其它设计 skill 的核心差异点：**方向决策必须建立在看得见的样品上**。

## 何时生成

- Phase 2 输出方案时（凡是涉及视觉方向的任务）
- 用户说"给我几个风格/方向看看"
- 重设计任务在动手前

不适用：纯代码审查、纯交互逻辑优化、用户已指定唯一明确参考（如"完全照 Linear 做"）。

## 产物要求

生成 `design-preview.html`，写到当前项目的工作目录（或用户指定的输出目录）。
自包含单文件（CSS/JS 内联，Google Fonts 允许），打开即用。

### 页面结构

1. **顶部说明条**：任务名 + "选择一个设计方向"提示 + 快捷键提示（1-4）+ **60 秒倒计时**
2. **方向卡片 × 4**（固定 A/B/C/D，每个带互斥约束，其中一个标注「推荐」徽标 + 一句推荐理由），每张卡片包含：
   - **真实迷你 mockup**（核心）：用该方向的真字体、真配色、真布局做一个
     Hero 级别的缩尺片段（约 480×300 逻辑尺寸，`transform: scale` 适配卡宽）。
     必须是真的排版，**不是色板色块 + 字体名列表**——用户要看的是"做出来长什么样"
   - 方向名 + 一句话气质（"像〈某类杂志/空间/年代〉"）
   - 字体策略、色彩策略、记忆点（三行小字）
   - **「选择此方向」按钮**
3. **选中反馈**：点击后卡片高亮 + 底部浮条显示
   "已选择方向 X——回到对话告诉我「选 X」，或直接把这句话粘贴给我"，
   并尝试 `navigator.clipboard.writeText('选 X：〈方向名〉')` 把选择文本复制到剪贴板
4. **备选交互**：支持键盘 1/2/3/4 选择；卡片底部注明"也可以只选中意某个细节，
   在对话里告诉我（如：要 A 的配色 + B 的字体）"
5. **60 秒自动推进**：页面顶部倒计时（用户任意点选即停止）；归零时自动高亮
   推荐方向并在浮条显示"已超时，采用推荐方向 X——如不同意，回到对话改选即可"

### Mockup 质量标准

- 每个 mockup 必须能独立通过反套路扫描（禁令同 SKILL.md：无 AI 紫、无斜体、无居中套路…）
- **预览页自身必须遵守中文字体纪律（chinese-typography.md），无豁免**：
  壳与所有 mockup 正文用系统字体栈（零下载）；装饰中文字体只用于 mockup
  标题短语，且必须 `text=` 子集化（只含实际渲染的字符，每个请求几 KB）：
  `family=ZCOOL+XiaoWei&text=让每场会议都值得铭记&display=swap`。
  方向卡标注的"字体策略"同样如实写"标题（子集化）+ 中文系统栈正文"
- 方向之间满足 divergence-playbook 的轴级差异（≥4 条轴不同，含明度轴或时代气质轴）
- mockup 内文案用任务的真实内容，不用 Lorem ipsum
- 预览页自身的"壳"（说明条、卡片框）保持中性克制，不与方向 mockup 抢戏

### 选择回传

静态文件无法回传点击，所以三通道并行：
1. 页面高亮 + 剪贴板复制"选 X"文本（主通道）
2. 用户在对话直接说"选 A/B/C"（等价）
3. 用户混搭（"A 的布局 + C 的配色"）——按混搭结果更新设计读取后再进 Phase 3

## 页面骨架模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>设计方向预览 — {任务名}</title>
<!-- 每个方向各自的 Google Fonts -->
<style>
  /* 壳：中性灰白，克制 */
  body{margin:0;font-family:system-ui;background:#f4f4f2;color:#1a1a1a}
  .bar{padding:20px 32px;border-bottom:1px solid #ddd;display:flex;justify-content:space-between}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:24px;padding:32px}
  .card{background:#fff;border:2px solid #e2e2e0;border-radius:12px;overflow:hidden;cursor:pointer}
  .card.selected{border-color:#1a1a1a}
  .mock{height:300px;overflow:hidden;position:relative}
  .mock>.stage{width:960px;height:600px;transform:scale(.5);transform-origin:0 0}
  /* .stage 内是各方向的真实排版，各自独立的 CSS 作用域（用方向前缀类名） */
  .meta{padding:16px 20px}
  .pickbar{position:fixed;bottom:0;left:0;right:0;padding:14px;background:#1a1a1a;color:#fff;
           text-align:center;transform:translateY(100%);transition:transform 200ms cubic-bezier(.23,1,.32,1)}
  .pickbar.show{transform:translateY(0)}
</style>
</head>
<body>
  <div class="bar"><strong>{任务名} · 选择一个设计方向</strong>
    <span>键盘 1-4 快速选择 · <b id="cd">60</b>s 后自动采用推荐方向</span></div>
  <div class="grid"><!-- 4 张方向卡片，推荐卡片加 data-rec 与「推荐」徽标 --></div>
  <div class="pickbar" id="pickbar"></div>
<script>
  const REC = 0; // 推荐方向下标（按设计读取判断）
  let picked = false, left = 60;
  function pick(i, name, auto){
    picked = true;
    document.querySelectorAll('.card').forEach((c,idx)=>c.classList.toggle('selected', idx===i));
    const msg = '选 ' + 'ABCD'[i] + '：' + name;
    const bar = document.getElementById('pickbar');
    bar.textContent = auto
      ? '已超时，采用推荐方向 ' + msg + ' — 如不同意，回到对话改选即可'
      : '已选择 ' + msg + ' — 回到对话把这句话发给我（已尝试复制到剪贴板）';
    bar.classList.add('show');
    if (!auto && navigator.clipboard) navigator.clipboard.writeText(msg).catch(()=>{});
  }
  document.addEventListener('keydown', e=>{
    const i = ['1','2','3','4'].indexOf(e.key);
    if(i>-1){ const c=document.querySelectorAll('.card')[i]; if(c) c.click(); }
  });
  const t = setInterval(()=>{
    if(picked){ clearInterval(t); document.getElementById('cd').textContent='—'; return; }
    document.getElementById('cd').textContent = --left;
    if(left<=0){ clearInterval(t);
      const c = document.querySelectorAll('.card')[REC];
      pick(REC, c.dataset.name || '推荐方向', true);
    }
  }, 1000);
</script>
</body>
</html>
```

## 选择协议（含超时默认）

1. 对话侧输出必须包含：4 方向一句话摘要 + **"推荐 X，因为〈理由〉"** +
   "不选的话我就按推荐方向继续"
2. 用户明确选择（点选回传/回复"选 X"/混搭描述）→ 以用户为准
3. 用户下一条消息未选（或"你定"/"都行"）→ **直接按推荐方向进入 Phase 3**，不再追问
4. 推荐方向的选择标准：最贴合设计读取与受众，而非最炫

## 交付话术

生成后对用户说（示例）：
"四个方向的可视化预览已生成：`design-preview.html`，打开即可看到真实排版效果
（页内有 60 秒倒计时，超时自动落到推荐方向）。点选任一方向（或按 1-4），
把页面给你的那句「选 X」发回来；也可以混搭——比如「要 B 的字体 + C 的配色」。
我的推荐是 X：〈一句理由〉。如果你不选，我就按 X 继续往下做。"
