# Zhong Chen — personal food & AI website

全英文的个人探索网站：冷链小实验、图文文章、简短个人介绍，以及按需启用的学术栏目。

## 日常使用

1. 双击 `Start Writing Studio.cmd`（需要已安装 Node.js；当前电脑已有）。
2. 在浏览器打开 `http://127.0.0.1:4174/studio`。
3. 新建文章，填写标题、摘要、分类、日期，使用 Markdown 编辑正文；右侧显示排版。
4. 使用 Upload image 上传 PNG / JPEG / WebP / GIF，最大 6 MB。图片会插入正文，也会填入尚为空的封面字段。请补上图片描述。
5. 默认新文章为 Draft。保存后可用 Open saved page preview 看完整页面。
6. 复核内容后改为 Published 并保存。它会出现在本地网站和 `dist` 导出中。
7. 将修改后的源文件提交并推送到 `https://github.com/itbird/website` 的生产分支；Cloudflare 自动构建并部署 `dist`，随后更新 zhongchen.ai。本地保存不会自动推送或发布。

管理端只监听本机 `127.0.0.1`，不是公开网站后台。请勿把管理服务暴露到局域网或公网。网站导出不包含管理端、文章源文件或草稿正文。

现有三篇入门文章是本次生成的 AI 辅助文稿，预览中展示，并标注了来源与示意边界。正式上线前请阅读确认它们代表你愿意公开表达的观点；在管理端可随时改回 Draft。

## 本地命令

```powershell
npm ci
npm start
npm run build
npm test
```

`npm start` 提供网站及本地管理端；`npm run build` 只生成静态网站。部署目录为 `dist`，不是整个代码仓库。首页模板保存在 `src/home.html`；根目录 `index.html` 是构建生成的成品页面，可供现有零构建静态部署直接发布。以前的首页保留在 Git 历史中；原有 draft 文件和 draft.zip 未改动。

本地文件位置：

- `content/posts/<slug>.md`：文章正文。
- `content/posts/<slug>.json`：标题、摘要、分类、状态、封面等。
- `assets/uploads`：上传的实际图片文件。
- `content/site.json`：社交链接与学术栏目开关。
- `content/academic.json`：未来学术条目。
- `src/home.html`：首页模板；`src`：样式、交互和透明的演示计算。
- 根目录 `index.html`、`assets/style.css`、`assets/app.js`、`assets/models.mjs`、`robots.txt`、`sitemap.xml`、`404.html`：自动同步生成的可发布文件。
- `scripts`：静态生成与本地管理服务；`studio`：管理界面。
- `dist`：可部署的生成结果，不纳入 Git。

文章内容与页面布局分离；未来迁移到 Jekyll / Academic Pages / Astro 等，可重用 Markdown 正文并转换元数据。当前并非直接采用 Academic Pages 的 Jekyll 模板。

## 学术内容升级

打开 Profile & future sections，可填写 Google Scholar、ORCID，并控制 Publications、Talks、Teaching、Activities、CV。默认全部隐藏。学术栏目只有开关开启、列表非空时才显示；空的 Scholar / ORCID 链接不显示。

每条学术记录支持：title、date、venue、description、url。Publications 的 description 可写作者列表和摘要，url 可链接 DOI / PDF；CV 可链接将来托管的 PDF。当前提供的是首页内容模块和数据接口，尚未实现自动 BibTeX 导入、完整学术子页、引用统计或自动生成 CV。

## GitHub → Cloudflare → zhongchen.ai

已确认继续使用 GitHub 仓库 `https://github.com/itbird/website` 和现有 Cloudflare 自动部署。当前本地分支为 `main`；线上生产分支应保持 Cloudflare 已连接的分支。无需换域名或托管平台。

如果现有项目为 Cloudflare Pages，在项目 Settings 的 Build configuration 中做一次配置：

| 项目 | 值 |
| --- | --- |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | 留空，使用仓库根目录 |
| Node.js | 仓库 `.node-version` 指定 22 |

Cloudflare 默认安装 package.json 中的依赖；请同时提交 package-lock.json。若现有配置显式关闭了自动依赖安装，构建命令改用 `npm ci && npm run build`。若项目已有 NODE_VERSION 环境变量，确认它同样为 22，以免覆盖文件设置。

本次只修改了本地文件，没有访问或修改 Cloudflare 后台，也没有推送 GitHub。请先保存上表设置，再推送新版源码；现在也兼容原来的“直接发布仓库根目录”配置，根目录包含完整成品。

提交源码包括：根目录模板、`.node-version`、`.gitignore`、package.json、package-lock.json，以及 assets、content、src、scripts、studio 等目录。不要只上传 index.html。node_modules、dist 和测试临时目录已在 .gitignore 中排除。Cloudflare 会自行生成 dist，不需要手动上传它。

日常更新：本地管理端编辑并保存 → 将文章设为 Published → 提交 Markdown、对应 JSON 和图片等变更 → 推送生产分支 → 等待 Cloudflare 部署成功。Draft 只控制网站展示；如果 GitHub 仓库公开，提交到仓库中的草稿源文件仍然可以被读取。

如果 Cloudflare 项目实际显示为 Workers 而非 Pages，不要套用 Pages 的输出目录设置，应按该项目已有的 Workers 部署配置对接。本仓库未擅自加入 Wrangler 配置，以免覆盖未知的现有项目设置。

参考：[Cloudflare Pages 构建配置](https://developers.cloudflare.com/pages/configuration/build-configuration/)、[Node 版本配置](https://developers.cloudflare.com/pages/configuration/build-image/)。

当前资源路径针对 zhongchen.ai 域名根路径；若使用 `github.io/website/` 这样的子路径，需要另设 base path。

字体与 Academic Pages 使用同一套系统无衬线字体栈，优先使用设备已有字体（如 Windows 的 Segoe UI、macOS 的 San Francisco），无需加载 Google Fonts。无付费 API、用户登录、访问追踪或网站访客数据存储。

## 三个实验的边界

1. Hidden journey：固定 12 小时行程，基线 4°C，插入 0–6 小时的 16°C 区间。额外暴露量为 `12 × interruptionHours` °C·h，不代表保质期、鲜度或食品安全。
2. Between the readings：第 35–55 分钟的三角温度峰，45 分钟时达 12°C，其余为 4°C。从 0 分钟开始按 5 / 10 / 15 / 30 / 60 分钟取样。展示采样时机可能漏检，不是采样频率行业标准。
3. Small losses：每周处理量 10,000 kg × 避免损耗占处理量比例 × 52 周。场景假设，不是企业实测或 AI 减损承诺。

示意图原创 SVG，无外部素材授权依赖。正文链接 UNEP、FAO 与相关原始论文，全球食品浪费数据与运输损耗场景明确区分。

## 建议更新节奏

先每月两篇短文，每 6–8 周补充或深化一个互动实验，不必追逐每日 AI 新闻。第一篇回答实际问题，第二篇展示一个可复现的技术观察。每篇建议 500–900 英文词、一个清楚问题、一张有意义的图、2–4 个原始来源，以及你自己的判断或仍不知道的地方。短文也可以更短，不为字数填充。

发布流程：AI 辅助初稿 → 核对每项数字与来源 → 补充个人判断 → 校对图与模型边界 → 手机阅读检查 → Published → 部署。不要让 AI 代写不存在的经历、客户结果、实测或论文贡献。

首批延伸选题：温度记录缺失；空气温度与产品温度；同一温度背后的不同过程；让 AI 将冷链日志转为可查证的事件；图像识别可以看到什么、看不到什么；澳洲公开食品浪费案例的证据拆解。涉及行业案例时另做来源核查。

## 暂时隐藏文章栏目

目前 Notes 整体关闭：导航、首页文章区域和独立文章页面均不进入网站导出，原文章文件保留。以后在本地管理端进入 Profile & future sections，勾选 Show Notes section and article pages 并保存，即可恢复 Published 文章。该开关保存于 content/site.json 的 notesEnabled。draft 博士进度目录不受影响。

## SEO

首页标题、描述和正式域名来自 content/site.json。构建时自动生成 canonical、Person / WebSite / WebPage 结构化数据，以及 robots.txt、sitemap.xml。站点地图只包含首页和实际公开的文章；Notes 关闭时不会列入任何文章。文章重启后自动生成独立 canonical 与 BlogPosting 元数据。管理端、草稿预览和 404 页面设置 noindex。无虚构论文、机构背书或专家头衔。

部署成功后，在 Google Search Console 中验证 zhongchen.ai 的所有权，提交 https://zhongchen.ai/sitemap.xml，并检查首页索引情况。这是独立的线上步骤，目前未执行；SEO 配置不等于已被收录或保证排名。

## 现有零构建部署兼容

每次本地管理端保存或 npm run build 时，同时生成 dist 和根目录发布文件。请一并提交生成文件，再推送；现有 Cloudflare 无需先改构建设置就能发布。根目录页面与 dist 保持一致。不要手工编辑生成文件，应编辑 src/home.html / src/style.css 等源文件。保留 dist 方式以便未来切换。`.root-pages.json` 仅追踪生成的文章页面，关闭 Notes 时会清除对应的成品页面，不会改动 draft 目录。
