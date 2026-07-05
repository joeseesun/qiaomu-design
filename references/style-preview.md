# 风格试衣间规范（Style Preview）

> 来源：用户反馈——"每次设计时快速给几种风格预览（本地网页），用户选中方向后再开始设计"。
> 这是本 skill 与其它设计 skill 的核心差异点：**方向决策必须建立在看得见的样品上**。

## 何时生成

- Phase 2 输出方案时（凡是涉及视觉方向的任务）
- 用户说"给我几个风格/方向看看"
- 重设计任务在动手前

不适用：纯代码审查、纯交互逻辑优化、用户已指定唯一明确参考（如"完全照 Linear 做"）。

## 产物要求

生成一个浅层、非隐藏、可直接发给别人的预览任务目录。默认规则：

1. 用户指定输出目录时，以用户指定为准
2. 当前在项目 / Git 仓库中工作时，写到项目根目录：
   `design-previews/YYYY-MM-DD-任务名/index.html`
3. 同目录放 `selection.json`、可选 `README.md` 和必要 assets；不要用隐藏目录，
   不要多层嵌套
4. 当前不在任何项目目录时，退到桌面：
   `~/Desktop/qiaomu-design-YYYY-MM-DD-任务名/`
5. 预览目录用于方向选择、截图、打包分享；最终生产代码仍写进用户当前项目文件，
   并由该项目 Git 管理

主入口固定叫 `index.html`，自包含单文件（CSS/JS 内联，Google Fonts 允许），打开即用。
如果旧流程或工具必须找 `design-preview.html`，可以额外复制一份同内容文件作兼容别名，
但对用户汇报时只报更友好的任务目录与 `index.html`。

默认还要启动本 skill 自带的本地预览回传服务：

```bash
node /Users/joe/.agents/skills/qiaomu-design/scripts/qiaomu-design-preview-server.mjs \
  --file design-previews/YYYY-MM-DD-任务名/index.html
```

服务会自动绑定 `127.0.0.1` 的可用端口、打开浏览器，并把用户选择写回当前目录的
`selection.json`。只有服务无法启动时，才退回 `file://` 静态预览。

### 固定选择外壳

预览页的 demo 可以有不同视觉风格，但**选择外壳必须稳定一致**，避免用户每次重新理解：

- 顶部固定中性工具条：任务名 / "选择一个设计方向" / 回传状态 / 快捷键 1-4
- 顶部说明必须显眼写明：这是**设计方向样机**，用于选择视觉与交互气质，**不是最终 App /
  最终页面**；点选方向后才进入正式实现。不能让用户误以为 4 个卡片就是交付成品
- 若展示设计拨盘，必须使用中文标签和解释：`视觉冒险度`、`动效强度`、`信息密度`；
  可以在括号里保留 `VARIANCE/MOTION/DENSITY`，但不能只显示英文变量名
- 拨盘说明必须提示可调：用户可以说"更稳一点/更大胆/动效少一点/信息更密"或直接给数值
- 每个方向卡片底部有同样样式的明显按钮：`选择 A · 方向名`
- 选中后卡片有统一高亮状态，底部 toast 显示"已回传到 Codex"
- 本地服务会自动注入这层外壳；生成的 HTML 也应主动包含等价结构，不能只靠点卡片隐式选择。
  如果 HTML 已经自带选择按钮，按钮必须带 `.qmdp-pick-button` 或等价识别标记，且运行服务后要确认
  实际 DOM 中每个方向仍只有一颗选择按钮；按钮嵌在 `.meta` 等内部容器时也必须能被服务识别
- 外壳保持中性克制，不参与方向风格竞争；方向差异只发生在 demo/mockup 内

### 多方向隔离协议

多个方向不能由同一套默认样式连续换皮。默认流程：

1. 给 A/B/C/D 分别写互斥 brief：目标用户、功能契约、视觉轴、布局轴、密度轴、禁止项
2. 能调用 subagent 时，每个 subagent 只负责一个方向；不能修改共享预览壳，不能引用其它方向样式
3. 每个方向使用独立 stage 和 scoped CSS：类名前缀如 `.dir-a` / `.sa-a`，不得写全局
   `button`、`.card`、`body` 等会污染其它方向的选择器
4. 主流程只做统一壳、选择回传、推荐理由和横向对比；整合后检查 4 个方向遮住颜色仍能区分
5. 如果无法使用 subagent，仍按独立 brief 逐个生成，并在回复里说明"本次使用单 agent 隔离 brief 降级"

### 页面结构

1. **顶部说明条**：任务名 + "选择一个设计方向"提示 + "这是方向样机，不是最终 App /
   最终页面" + 快捷键提示（1-4）+ 回传状态
2. **方向卡片 × 4**（固定 A/B/C/D，每个带互斥约束，其中一个标注「推荐」徽标 + 一句推荐理由），每张卡片包含：
   - **真实迷你 mockup**（核心）：用该方向的真字体、真配色、真布局做一个
     Hero 级别的缩尺片段（约 480×300 逻辑尺寸，`transform: scale` 适配卡宽）。
     必须是真的排版，**不是色板色块 + 字体名列表**——用户要看的是"做出来长什么样"
   - mockup 必须嵌在同一个 `index.html` 的独立 stage / iframe-like 容器中，
     4 个方向同屏可比较；不允许散落成 4 个难找的文件
   - 方向卡片内也应以低干扰方式标注"方向样机"，确保截图单独传播时不会被误解为最终成品
   - 方向名 + 一句话气质（"像〈某类杂志/空间/年代〉"）
   - 字体策略、色彩策略、记忆点（三行小字）
   - **明显的「选择 A/B/C/D · 方向名」按钮**，按钮位置、样式、交互在所有方向一致
   - 每个方向只能有一组选择按钮；运行本地回传服务后也不得出现重复按钮
3. **选中反馈**：点击后卡片高亮 + 底部浮条显示
   "已选择方向 X——选择已回传到 Codex"；同时调用 `sendSelection(...)` 向
   `POST /api/select` 回传。如果运行在 `file://` 静态模式，则降级为剪贴板复制
   `选 X：〈方向名〉` 并提示用户回到对话发送
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

默认不是静态文件，而是本地回传桥：

1. `GET /` 服务预览目录内的 `index.html`
2. `POST /api/select` 接收 `{id,label,name,notes}`，写入同目录 `selection.json`
3. 服务终端打印 `QIAOMU_DESIGN_SELECTION::{...}`，供 Codex 读取或轮询
4. `GET /api/selection` 返回最新选择，便于 Codex 恢复状态
5. 页面选择按钮、卡片点击、键盘 1-4 都调用 `sendSelection(...)`
6. Codex 启动预览后必须保持轮询，不得发送 final 结束回合；推荐同时运行：
   `node /Users/joe/.agents/skills/qiaomu-design/scripts/qiaomu-design-watch-selection.mjs --selection design-previews/YYYY-MM-DD-任务名/selection.json`

静态 `file://` 只是降级路径：页面高亮 + 剪贴板复制"选 X"文本，并明确提示
"当前不会自动回传，请在对话里回复选择"。

Codex 进入 Phase 3 前必须满足其一：

- 已观察到预览目录内的 `selection.json`
- 已在服务日志看到 `QIAOMU_DESIGN_SELECTION::`
- 用户在对话中明确回复选择或明确授权默认推荐方向

禁止在没有观察到回传证据时，把页面上的推荐态当作用户选择。
禁止只留下一个预览 URL 就结束当前回合；那样选择会写入文件，但 Codex 不会自动醒来继续执行。

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
  async function sendSelection(payload){
    const msg = '选 ' + payload.id + '：' + payload.name;
    if (location.protocol === 'file:') {
      if (navigator.clipboard) await navigator.clipboard.writeText(msg).catch(()=>{});
      return {ok:false, fallback:true};
    }
    const res = await fetch('/api/select', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    return res.json();
  }
  async function pick(i, name, auto){
    picked = true;
    document.querySelectorAll('.card').forEach((c,idx)=>c.classList.toggle('selected', idx===i));
    const id = 'ABCD'[i];
    const msg = '选 ' + id + '：' + name;
    const bar = document.getElementById('pickbar');
    let result = {ok:false, fallback: location.protocol === 'file:'};
    if (!auto) result = await sendSelection({id, label: msg, name, auto:false});
    bar.textContent = result.ok
      ? '已选择 ' + msg + ' — 已回传到 Codex'
      : (auto
        ? '已超时，高亮推荐方向 ' + msg + ' — Codex 仍需确认默认授权'
        : '已选择 ' + msg + ' — 当前为静态降级，请回到对话发送这句话');
    bar.classList.add('show');
    if (!result.ok && navigator.clipboard) navigator.clipboard.writeText(msg).catch(()=>{});
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
   本地预览 URL + 预览目录 + `index.html` 路径
2. 如展示拨盘，必须用中文解释并说明可调，不只写 `VARIANCE/MOTION/DENSITY`
3. 用户明确选择（服务回传/回复"选 X"/混搭描述）→ 以用户为准
4. 用户下一条消息未选（或"你定"/"都行"）→ 才按推荐方向进入 Phase 3，不再追问
5. 推荐方向的选择标准：最贴合设计读取与受众，而非最炫

## 交付话术

生成后对用户说（示例）：
"四个方向的可视化预览已生成并打开：`http://127.0.0.1:{port}/`
（文件夹：`design-previews/YYYY-MM-DD-任务名/`，入口：`index.html`）。
点选任一方向（或按 1-4）后会回传到 Codex，
我会看到选择再继续；也可以混搭——比如「要 B 的字体 + C 的配色」。
我的推荐是 X：〈一句理由〉。如果你直接说「你定」，我就按 X 继续。"

若提到拨盘，使用中文话术：

"这三个参数都能调：视觉冒险度决定页面有多大胆，动效强度决定动画反馈多少，
信息密度决定内容是更松还是更紧。你可以直接说『更稳一点』『更大胆』『动效少一点』
或指定数值。"

若本地服务启动失败，才用降级话术：

"四个方向的可视化预览已生成：`design-previews/YYYY-MM-DD-任务名/index.html`，
但本地回传服务未启动（原因：...）。请打开文件后把页面复制的「选 X」发回来；
当前点选不会自动回传到 Codex。"
