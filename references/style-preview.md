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
`selection.json`。每次重启服务后必须把新 URL 明确告诉用户；旧端口页面视为过期预览，
不能再作为验收依据。只有服务无法启动时，才退回 `file://` 静态预览。

### 固定选择外壳

预览页的 demo 可以有不同视觉风格，但**选择外壳必须稳定一致**，避免用户每次重新理解：

- 顶部固定中性工具条：任务名 / 回传状态 / 快捷键 1-4。按钮已有明确文案时，顶部不再重复
  "点按钮选择"之类小字说明
- 用一句低干扰文案说明：这是**设计方向样机**，用于选择视觉与交互气质，**不是最终 App /
  最终页面**；点选方向后才进入正式实现。不要把免责声明、教程或系统说明堆在首屏
- 若展示设计拨盘，必须使用中文标签和解释：`视觉冒险度`、`动效强度`、`信息密度`；
  可以在括号里保留 `VARIANCE/MOTION/DENSITY`，但不能只显示英文变量名
- 三拨盘必须是可拖动滑块，默认值来自设计读取；用户调整后，确认选择时随方向一起回传
- 每个方向卡片底部有同样样式的明显按钮：`选择 A · 方向名`
- 点选方向或按键 1-4 后，先打开确认弹层；弹层显示方向名、当前三拨盘值，并提供一个输入框
  让用户写调整建议。只有点击"确认并回传"才写入 `selection.json`
- 选中确认后卡片有统一高亮状态，底部 toast 显示"已回传"
- 本地服务会自动注入这层外壳；生成的 HTML 也应主动包含等价结构，不能只靠点卡片隐式选择。
  如果 HTML 已经自带选择按钮，按钮必须带 `.qmdp-pick-button` 或等价识别标记，且运行服务后要确认
  实际 DOM 中每个方向仍只有一颗选择按钮；按钮嵌在 `.meta` 等内部容器时也必须能被服务识别
- 若 HTML 自带选择按钮和回传 handler，服务不能再对该按钮重复触发回传；服务自动注入的按钮
  必须带 `data-qmdp-injected` 或等价标识。页面自带按钮如果没有自己的 handler，仍应由
  服务接管；只有显式标记 `data-qmdp-native-handler="true"` 或 `data-qmdp-managed="page"`
  的按钮才跳过服务处理
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

1. **顶部状态条**：任务名 + "方向样机，不是最终 App / 最终页面" + 快捷键提示（1-4）+
   回传状态；不重复按钮已有的选择说明；不放倒计时
2. **设计样机区 × 4**（固定 A/B/C/D，每个带互斥约束，其中一个标注「推荐」徽标），每个样机块包含：
   - **真实迷你 mockup**（核心）：用该方向的真字体、真配色、真布局做一个
     Hero 级别的缩尺片段（约 480×300 逻辑尺寸，`transform: scale` 适配卡宽）。
     必须是真的排版，**不是色板色块 + 字体名列表**——用户要看的是"做出来长什么样"
   - mockup 必须嵌在同一个 `index.html` 的独立 stage / iframe-like 容器中，
     4 个方向同屏可比较；不允许散落成 4 个难找的文件
   - mockup 舞台必须填满留给它的空间；比例不匹配时居中展示，不允许出现大片无意义空白
   - 方向卡片内也应以低干扰方式标注"方向样机"，确保截图单独传播时不会被误解为最终成品
   - 窄屏下不能让 mockup 内部控件和文字互相挤压；复杂桌面/控台方向使用内部缩放舞台、
     移动端专用构图或明确可控裁切，截图检查必须覆盖移动端
   - 只保留方向名、极短标签和选择按钮；不要把长解释混在样机卡里
   - **明显的「选择 A/B/C/D · 方向名」按钮**，按钮位置、样式、交互在所有方向一致
   - 每个方向只能有一组选择按钮；运行本地回传服务后也不得出现重复按钮
3. **方向说明区**：在样机区之外单独放说明，可以是右侧栏、下方说明卡、抽屉或 tabs；
   内容包括一句话气质、字体策略、色彩策略、记忆点、适用场景、推荐理由和可混搭提示。
   说明区可以密一点，但不能挤压或打断样机比较
4. **三拨盘控制区**：在样机区附近放三个滑块：
   `视觉冒险度`、`动效强度`、`信息密度`，范围 1-10，当前数值可见；滑块变化不立即回传
5. **确认弹层**：点击方向按钮、方向卡或按 1/2/3/4 后，只打开确认弹层，不直接回传。
   弹层包含方向名、当前三拨盘值、一个可选调整建议输入框、`取消`、`确认并回传`。
   点击确认后才调用 `sendSelection(...)` 向 `POST /api/select` 回传
   `{id,label,name,notes,dials,adjustments}`。如果运行在 `file://` 静态模式，则降级为剪贴板复制
   `选 X：〈方向名〉；拨盘：...；建议：...` 并提示用户回到对话发送
6. **选中反馈**：确认后卡片高亮 + 底部浮条显示"已选择方向 X，已回传"
7. **备选交互**：支持键盘 1/2/3/4 选择；说明区注明"也可以只选中意某个细节，
   在对话里告诉我（如：要 A 的配色 + B 的字体）"
8. **禁止自动推进**：预览页不允许 60 秒倒计时、超时默认选择或自动回传。推荐方向只是建议，
   必须用户确认或在对话中明确授权才进入正式实现

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
2. `POST /api/select` 接收 `{id,label,name,notes,dials,adjustments}`，写入同目录 `selection.json`
3. 服务终端打印 `QIAOMU_DESIGN_SELECTION::{...}`，供调用方读取或监听
4. `GET /api/selection` 返回最新选择，便于调用方恢复状态
5. 页面选择按钮、卡片点击、键盘 1-4 都先打开确认弹层；弹层确认后才调用 `sendSelection(...)`
6. 执行代理启动预览后必须保持监听，不得发送 final 结束回合；推荐同时运行：
   `node /Users/joe/.agents/skills/qiaomu-design/scripts/qiaomu-design-watch-selection.mjs --selection design-previews/YYYY-MM-DD-任务名/selection.json`
   watcher 默认使用文件事件，75ms 短轮询仅作兜底；不要再用 1s 轮询作为默认路径
7. 执行环境允许时，优先使用更快的单进程路径：
   `node /Users/joe/.agents/skills/qiaomu-design/scripts/qiaomu-design-preview-server.mjs --file ... --exit-on-select`
   用户确认后服务会写入选择、打印哨兵并退出，调用方无需再等文件轮询

静态 `file://` 只是降级路径：页面高亮 + 剪贴板复制"选 X"文本，并明确提示
"当前不会自动回传，请在对话里回复选择"。

执行代理进入 Phase 3 前必须满足其一：

- 已观察到预览目录内的 `selection.json`
- 已在服务日志看到 `QIAOMU_DESIGN_SELECTION::`
- 用户在对话中明确回复选择或明确授权默认推荐方向

禁止在没有观察到回传证据时，把页面上的推荐态当作用户选择。
禁止用超时、倒计时、推荐态自动写入 `selection.json`。
禁止只留下一个预览 URL 就结束当前回合；那样选择会写入文件，但当前工作流不会自动继续执行。

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
  .dials{display:grid;grid-template-columns:repeat(3,minmax(180px,1fr));gap:12px;padding:20px 32px;border-bottom:1px solid #ddd}
  .dial{display:grid;gap:6px;font-size:13px}.dial b{font-weight:650}.dial output{font-variant-numeric:tabular-nums}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:24px;padding:32px}
  .card{background:#fff;border:2px solid #e2e2e0;border-radius:12px;overflow:hidden;cursor:pointer}
  .card.selected{border-color:#1a1a1a}
  .mock{height:300px;overflow:hidden;position:relative;display:grid;place-items:center}
  .mock>.stage{width:960px;height:600px;transform:scale(.5);transform-origin:center center}
  /* .stage 内是各方向的真实排版，各自独立的 CSS 作用域（用方向前缀类名） */
  .meta{padding:16px 20px}
  .confirm{position:fixed;inset:0;display:none;place-items:center;background:rgb(0 0 0 / 32%);z-index:20}
  .confirm.open{display:grid}.dialog{width:min(520px,calc(100vw - 32px));background:#fff;border-radius:12px;padding:20px}
  textarea{width:100%;min-height:84px;resize:vertical}
  .pickbar{position:fixed;bottom:0;left:0;right:0;padding:14px;background:#1a1a1a;color:#fff;
           text-align:center;transform:translateY(100%);transition:transform 200ms cubic-bezier(.23,1,.32,1)}
  .pickbar.show{transform:translateY(0)}
</style>
</head>
<body>
  <div class="bar"><strong>{任务名} · 方向样机</strong>
    <span>键盘 1-4 选择 · 确认后回传</span></div>
  <div class="dials" aria-label="设计拨盘">
    <label class="dial"><b>视觉冒险度 <output id="varianceOut">7</output></b><input id="variance" type="range" min="1" max="10" value="7"></label>
    <label class="dial"><b>动效强度 <output id="motionOut">6</output></b><input id="motion" type="range" min="1" max="10" value="6"></label>
    <label class="dial"><b>信息密度 <output id="densityOut">4</output></b><input id="density" type="range" min="1" max="10" value="4"></label>
  </div>
  <div class="grid"><!-- 4 张方向卡片，推荐卡片加 data-rec 与「推荐」徽标 --></div>
  <div class="confirm" id="confirm" role="dialog" aria-modal="true" aria-labelledby="confirmTitle">
    <div class="dialog">
      <h2 id="confirmTitle">确认设计方向</h2>
      <p id="confirmMeta"></p>
      <textarea id="adjustments" placeholder="可选：写下想调整的地方，比如更稳一点、要 B 的字体 + C 的配色"></textarea>
      <button type="button" id="cancelPick">取消</button>
      <button type="button" id="confirmPick">确认并回传</button>
    </div>
  </div>
  <div class="pickbar" id="pickbar"></div>
<script>
  let pending = null;
  function dials(){
    return {
      variance: Number(document.getElementById('variance').value),
      motion: Number(document.getElementById('motion').value),
      density: Number(document.getElementById('density').value)
    };
  }
  ['variance','motion','density'].forEach(id => {
    const input = document.getElementById(id), out = document.getElementById(id + 'Out');
    input.addEventListener('input', () => out.value = input.value);
  });
  function selectionText(payload){
    const values = payload.dials || dials();
    const advice = payload.adjustments ? '；建议：' + payload.adjustments : '';
    return payload.label + '；拨盘：视觉冒险度 ' + values.variance +
      ' / 动效强度 ' + values.motion + ' / 信息密度 ' + values.density + advice;
  }
  async function sendSelection(payload){
    const msg = selectionText(payload);
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
  function openConfirm(i, name){
    document.querySelectorAll('.card').forEach((c,idx)=>c.classList.toggle('selected', idx===i));
    const id = 'ABCD'[i];
    pending = {id, name, label:'选 ' + id + '：' + name};
    const values = dials();
    document.getElementById('confirmMeta').textContent =
      pending.label + ' · 视觉冒险度 ' + values.variance + ' / 动效强度 ' + values.motion + ' / 信息密度 ' + values.density;
    document.getElementById('confirm').classList.add('open');
    document.getElementById('adjustments').focus();
  }
  async function confirmSelection(){
    if(!pending) return;
    const msg = pending.label;
    const bar = document.getElementById('pickbar');
    const payload = {...pending, dials: dials(), adjustments: document.getElementById('adjustments').value.trim()};
    const result = await sendSelection(payload);
    bar.textContent = result.ok
      ? '已选择 ' + msg + ' — 已回传'
      : '已选择 ' + msg + ' — 当前为静态降级，请回到对话发送这句话';
    bar.classList.add('show');
    document.getElementById('confirm').classList.remove('open');
    if (!result.ok && navigator.clipboard) navigator.clipboard.writeText(msg).catch(()=>{});
  }
  document.addEventListener('keydown', e=>{
    const i = ['1','2','3','4'].indexOf(e.key);
    if(i>-1){ const c=document.querySelectorAll('.card')[i]; if(c) c.click(); }
  });
  document.getElementById('cancelPick').onclick = () => document.getElementById('confirm').classList.remove('open');
  document.getElementById('confirmPick').onclick = confirmSelection;
</script>
</body>
</html>
```

## 选择协议

1. 对话侧输出必须包含：4 方向一句话摘要 + **"推荐 X，因为〈理由〉"** +
   本地预览 URL + 预览目录 + `index.html` 路径
2. 三拨盘必须在预览页里可拖动；确认选择时随方向一起回传
3. 用户点击方向后必须进入确认弹层，可补充调整建议；确认后才写入 `selection.json`
4. 用户明确选择（服务回传/回复"选 X"/混搭描述）→ 以用户为准
5. 用户未选时不得自动推进；只有用户明确说"你定/按推荐继续"才可按推荐方向进入 Phase 3
6. 推荐方向的选择标准：最贴合设计读取与受众，而非最炫

## 交付话术

生成后对用户说（示例）：
"四个方向的可视化预览已生成并打开：`http://127.0.0.1:{port}/`
（文件夹：`design-previews/YYYY-MM-DD-任务名/`，入口：`index.html`）。
点选任一方向（或按 1-4）后会回传，
页面会让你确认方向、调整三拨盘，也可以写一句混搭建议——比如「要 B 的字体 + C 的配色」。
我的推荐是 X：〈一句理由〉。如果你直接说「你定」，我才按 X 继续。"

若提到拨盘，使用中文话术：

"这三个参数都能在预览页拖动：视觉冒险度决定页面有多大胆，动效强度决定动画反馈多少，
信息密度决定内容是更松还是更紧。选方向时也可以写调整建议。"

若本地服务启动失败，才用降级话术：

"四个方向的可视化预览已生成：`design-previews/YYYY-MM-DD-任务名/index.html`，
但本地回传服务未启动（原因：...）。请打开文件后把页面复制的「选 X」发回来；
当前点选不会自动回传。"
