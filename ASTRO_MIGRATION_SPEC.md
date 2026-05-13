# Astro Migration Spec — CS146S 繁中講義

> 把這個 repo 從 Quarto book 改造成 Astro Starlight 站，沿用 [`li-hung-yi-ai-agent-2026`](https://github.com/fireman333/li-hung-yi-ai-agent-2026)（2026-05-12 上線）的架構。
>
> Spec 寫作日期：2026-05-13
>
> **2026-05-13 grill 後修正**（見 `~/.claude/scratch/grilled-CS146S-Astro-migration-2026-05-13.md`）：
> - **F3 PDF**: 不走 `scripts/sync-pdfs.mjs`、不放 `site/public/pdf/` — PDF 改放 **GitHub Release**，homepage 下載連結指 `releases/latest/download/CS146S_handbook_zh.pdf`
> - **F4 Reader**: 目標讀者改為「海內外華語 CS 自學者 + vibe coder + tech lead」
> - **F5 Locale**: Phase 1 zh-TW only；不裝 OpenCC pipeline（簡中走瀏覽器轉換）
> - **F2 Homepage**: `index.mdx` 放 `site/src/content/docs/`、import path 對應改成 `'../../components/...'`
> - **F7 Verify Gates**: Step 1 / Step 4 / Step 6 後各加 verify gate，user review 才繼續

## Context — 為什麼遷

| 維度 | 現況（Quarto） | 遷後（Astro Starlight） |
|---|---|---|
| 全文搜尋 | Quarto 內建（基本 token match） | Pagefind（CJK segmenter，搜得到「prompt engineering」+「上下文工程」） |
| 行動裝置體驗 | Cosmo theme，OK 但偏 desktop | Starlight 原生 responsive、TOC sidebar / 卡片牆 |
| 視覺差異化 | Quarto book 制式版型 | 可自訂 hero / 3 條學習路徑卡片 / 每週 metadata 卡 |
| Mermaid / Math | Quarto 內建 OK | rehype-mermaid build-time SVG + KaTeX，CJK 友善 |
| CI 部署速度 | Quarto + Typst 整套 ~10 min | Astro Starlight + Playwright cache ~3 min |
| 加新 reading SOP | 編 `_quarto.yml` chapters[] 手動加一行 | 丟新 `readings/wN_*.md` → glob loader 自動收 → push → 自動部署 |
| PDF 印製版 | Quarto Typst 渲染（CJK 字型穩） | Astro 不直接出 PDF；保留 Quarto pipeline 另跑 |

**留 Quarto pipeline 做 PDF**：Astro 不擅長出書本級 PDF（CJK 排版 / 章節編號 / 索引）。Quarto + Typst 出 PDF 的能力保留，**雙軌並行** — 平日 push 走 Astro CI 出網站、需要 PDF 時手動 `quarto render` 跑 Typst。

## Architecture — 跟 Li Hung-Yi 一樣的設計

**核心**：Astro Starlight + glob loader 直讀 `weeks/` + `readings/` + `assignments/` + GitHub Actions 自動部署。新增內容只需丟 `.md` → push → CI。

```
CS146S/                                  ← 既有 repo root
├── weeks/                               ← 10 週講義（保留原位）
│   ├── 01_intro_to_coding_llms.md
│   └── ...
├── readings/                            ← 46 篇 reading 摘要（保留原位）
│   ├── _index.md
│   └── wN_*.md
├── assignments/                         ← assignments
│   └── _index.md
├── 00_index.md                          ← 既有總目錄（轉成 homepage）
├── 01_overview.md                       ← 整體 overview
├── pdf/                                 ← Quarto 出的 PDF（gitignored，本機 build artifact，從這裡上傳到 GitHub Release）
│   └── CS146S_handbook_zh.pdf
├── _quarto.yml                          ← 保留：PDF pipeline 仍走 Quarto
├── styles.css                           ← 保留給 Quarto PDF 用
├── site/                                ← NEW: Astro app
│   ├── astro.config.mjs                 ← 設 site/base/sidebar from filesystem
│   ├── package.json
│   ├── src/
│   │   ├── content.config.ts            ← 單一 docs collection + brace pattern（grill F1）
│   │   ├── content/docs/index.mdx       ← homepage with splash hero + 3 tracks + 10 週卡（grill F2）
│   │   ├── components/
│   │   │   ├── WeekIndex.astro          ← 10 週卡片
│   │   │   ├── ReadingTable.astro       ← 46 篇 reading 排序 + 篩選
│   │   │   ├── TrackPicker.astro        ← 三條學習路徑 hero cards
│   │   │   └── SiteFooter.astro         ← 著作權 / Mihail Eric 致謝
│   │   ├── assets/logo.svg              ← Stanford-themed icon (cardinal red + minimal CS glyph)
│   │   └── styles/global.css            ← KaTeX import + PingFang TC font stack
│   └── public/                          ← Astro public assets（不含 PDF — grill F3 PDF 走 GitHub Release）
├── scripts/
│   ├── migrate-frontmatter.mjs          ← idempotent: 補/補齊 weeks 的 frontmatter
│   └── audit-reading-links.mjs          ← (optional) 檢查 reading 內外連是否還活著
├── .github/workflows/
│   └── deploy.yml                       ← GitHub Pages CI（沿用 Li Hung-Yi 模板）
├── .gitignore                           ← 修：保留 Quarto ignore + 加 site/node_modules etc.
└── README.md                            ← 改寫（保留授權聲明）：dual-mode 說明
```

## 關鍵設計決策

1. **單一 `docs` collection 而非三個** — Starlight 限制只有 `docs` collection 會被路由。用一個 `docs`，glob 進 `weeks/`、`readings/`、`assignments/` 三條 base，再用 sidebar group 分類。實作上需要兩個 glob entries 合併或用 base='../' + pattern 包整個 repo。

   **推薦做法**：glob loader 用 `pattern: '{weeks,readings,assignments}/**/*.md'`、base: 上層 repo root。slug 自然是 `weeks/01_intro_to_coding_llms` 等。

   ```ts
   import { defineCollection, z } from 'astro:content';
   import { docsSchema } from '@astrojs/starlight/schema';
   import { glob } from 'astro/loaders';

   const courseSchema = z.object({
     week: z.number().int().optional(),
     title_zh: z.string().optional(),
     dates: z.array(z.string()).optional(),
     topics: z.array(z.string()).optional(),
     status: z.enum(['complete', 'draft', 'pending']).optional(),
     reading_for_week: z.number().int().optional(),
     // … 其他你 reading 用的 frontmatter
   });

   export const collections = {
     docs: defineCollection({
       loader: glob({
         pattern: '{weeks,readings,assignments,01_overview,00_index}.{md,mdx}',
         base: '..',
       }),
       schema: docsSchema({ extend: courseSchema.partial() }),
     }),
   };
   ```

2. **Sidebar 自動分組** — 因為 slug 帶 `weeks/` / `readings/` / `assignments/` 前綴，Starlight 的 `autogenerate` 不能用（autogenerate 走 fs path，跟 glob loader 不相容；Li Hung-Yi 踩過這個雷）。改用 Li Hung-Yi 同樣模式：`astro.config.mjs` 內 Node `readdirSync` 讀檔案 + 解析 frontmatter 生 sidebar items。範本：

   ```js
   sidebar: [
     { label: '課程總覽', items: [
       { label: 'Welcome', slug: '00_index' },
       { label: 'Overview', slug: '01_overview' },
     ]},
     { label: '10 週講義', items: loadWeekSidebar() },       // 從 weeks/ 讀
     { label: 'Reading 摘要', items: loadReadingSidebar() },  // 從 readings/ 讀，依 wN 分組
     { label: 'Assignments', items: [{ label: 'Index', slug: 'assignments/_index' }] },
   ]
   ```

3. **首頁三條學習路徑 (Track A/B/C)** — 用 Starlight `template: splash` + 自製 `TrackPicker.astro` 元件，呈現三張卡片：
   - Track A — Vibe Coder 速成（W1 → W2 → W3 → W4 → W8）
   - Track B — 完整軟體工程（W1 → W10 依序）
   - Track C — Tech Lead / PM 視角（W1 → W4 → W6 → W7 → W9 → W10）

   點卡片直接跳該 track 第一週。底下還可放 10 週卡片牆（`WeekIndex.astro` 抄 Li Hung-Yi 的 LectureIndex 改）。

4. **Reading 不上首頁卡片** — 46 篇 reading 上首頁會太擠。Reading 走 `ReadingTable.astro` 元件嵌在 `/readings/` 路由：表格 columns = 週次 / 原文標題 / 中文摘要連結 / 原文外連 / 預估閱讀時間。Sidebar 內 reading 仍按 wN 自動分組。

5. **PDF 提供下載 — 走 GitHub Release**（grill F3 修正）— PDF 不入 git、不進 `site/public/`、不走 sync script。流程：
   - 更新 PDF：本機 `quarto render` 出 `pdf/CS146S_handbook_zh.pdf`
   - 上傳：`gh release create v$(date +%F) --notes "PDF refresh" pdf/CS146S_handbook_zh.pdf`（或 `gh release upload <existing-tag> pdf/CS146S_handbook_zh.pdf --clobber`）
   - Homepage / overview / 每個 week 頁面下方「下載 PDF」連結指 `https://github.com/<user>/CS146S-handbook-zh/releases/latest/download/CS146S_handbook_zh.pdf`（GitHub 自動 redirect 到當下最新 release 的同名 asset）
   - `pdf/**` 維持 gitignored、不污染 main、CI 不需碰 PDF

6. **保留 Quarto pipeline 出 PDF** —
   - `_quarto.yml` 不刪，繼續存在
   - 當你想更新 PDF：`quarto render`（產出到本機 `pdf/`），然後依關鍵設計決策 5 上傳 GitHub Release
   - 不把 Quarto 接 CI（成本高 — 要裝 LaTeX/Typst，build +5 min），只手動觸發 + 手動 release

7. **Stanford-themed branding**：
   - Logo: 紅黑配色 + 抽象「CS」glyph（不抄 Stanford 校徽避免侵權）
   - Site title: `CS146S 繁中講義 · The Modern Software Developer`
   - Footer 必須含：原作者致謝（Mihail Eric / Stanford）/ CC BY-NC-SA 4.0 / 非官方獨立翻譯免責聲明 / GitHub repo 連結
   - **目標讀者**（grill F4）：海內外華語 CS 自學者 + 想學 vibe coding 的工程師 + tech lead / PM 視角。homepage 文案 + meta description + OG image 對這三類設計

8. **Locale 策略**（grill F5）：Phase 1 **zh-TW only**（`locales: { root: { lang: 'zh-TW' } }`）。簡中讀者走瀏覽器轉換；**不裝 OpenCC build hook**。Phase 2 若 GA / 讀者回饋顯示中港馬讀者比例高再評估。

## Migration steps（執行時的順序）

### Step 0 — 備份 + 確認 git 乾淨

```bash
cd ~/claude_domain/reading/CS146S
git status                                # 確認 working tree 乾淨或 stash
cp -r weeks weeks.bak.pre-astro          # 安全網
cp -r readings readings.bak.pre-astro
cp _quarto.yml _quarto.yml.bak
```

### Step 1 — Astro Starlight scaffold

```bash
npm create astro@latest site -- --template starlight --no-install --no-git --typescript strict --yes --skip-houston
cd site && npm install
npm install --save rehype-mermaid playwright remark-math rehype-katex katex
npx playwright install chromium
rm -rf src/content/docs/guides src/content/docs/reference src/content/docs/index.mdx
mkdir -p src/components src/styles src/content/docs
cd ..
```

### Verify Gate 1 — starter template builds（grill F7）

在改 content.config / astro.config 前先確認 scaffold 本身沒壞：

```bash
cd site && npm run build
# 預期：build 成功，`site/dist/index.html` 存在（雖然是空白 Starlight starter 頁面）。
# 失敗：Node 版本（要 ≥ 18）、Playwright chromium 沒裝好、npm 倉庫 cache 壞。
```

通過才繼續 Step 2。

### Step 2 — Frontmatter audit / migration

每週 `.md` 應該已有 frontmatter（看 `weeks/01_intro_to_coding_llms.md` 範例）。確認 schema 統一：
- `week` (int, required)
- `title` (en, required)
- `title_zh` (zh, required)
- `dates` (array of date strings)
- `topics` (array of strings)
- `status` (enum: complete / draft / pending)

Reading 檔可能 schema 不一致 — 寫 `scripts/migrate-frontmatter.mjs`（抄 Li Hung-Yi 的 idempotent script）統一補：
- `reading_for_week` (int, 從檔名 `wN_` 抓)
- `original_url` (從 markdown 內文找第一個外連、或人工補)
- `original_title_en` / `summary_zh_length` (從內容統計)

Run `node scripts/migrate-frontmatter.mjs` 一次。

### Step 3 — Content collection 設定

`site/src/content.config.ts`（見上面 §1 範本）。記得 base 是 `'..'`（從 site/ 上一層）。

### Step 4 — `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeMermaid from 'rehype-mermaid';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z_]+):\s*["']?(.+?)["']?\s*$/);
    if (kv) out[kv[1]] = kv[2];
  }
  return out;
}

function loadWeekSidebar() {
  return readdirSync(resolve(REPO_ROOT, 'weeks'))
    .filter((f) => /^\d+_.+\.md$/.test(f))
    .sort()
    .map((f) => {
      const fm = parseFrontmatter(readFileSync(resolve(REPO_ROOT, 'weeks', f), 'utf8'));
      const n = fm.week ?? f.match(/^(\d+)_/)[1];
      const title = fm.title_zh || fm.title || f.replace(/\.md$/, '');
      return { label: `W${String(n).padStart(2, '0')} · ${title.slice(0, 24)}${title.length > 24 ? '…' : ''}`, slug: `weeks/${f.replace(/\.md$/, '')}` };
    });
}

function loadReadingSidebar() {
  const files = readdirSync(resolve(REPO_ROOT, 'readings'))
    .filter((f) => /^w\d+_.+\.md$/.test(f))
    .sort();
  // Group by week
  const byWeek = new Map();
  for (const f of files) {
    const wMatch = f.match(/^w(\d+)_/);
    const w = wMatch ? parseInt(wMatch[1], 10) : 0;
    if (!byWeek.has(w)) byWeek.set(w, []);
    byWeek.get(w).push(f);
  }
  return Array.from(byWeek.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([w, fs]) => ({
      label: `W${String(w).padStart(2, '0')} reading`,
      collapsed: true,
      items: fs.map((f) => {
        const fm = parseFrontmatter(readFileSync(resolve(REPO_ROOT, 'readings', f), 'utf8'));
        const title = fm.title_zh || fm.title || f;
        return { label: title.slice(0, 28), slug: `readings/${f.replace(/\.md$/, '')}` };
      }),
    }));
}

export default defineConfig({
  site: 'https://fireman333.github.io',
  base: '/CS146S-handbook-zh',
  integrations: [
    starlight({
      title: 'CS146S 繁中講義',
      description: 'Stanford CS146S "The Modern Software Developer" Fall 2025 繁中講義 + 46 篇 reading 摘要',
      logo: { src: './src/assets/logo.svg', alt: 'CS146S' },
      defaultLocale: 'root',
      locales: { root: { label: '繁體中文', lang: 'zh-TW' } },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/fireman333/CS146S-handbook-zh' },
        { icon: 'external', label: '原版課程', href: 'https://themodernsoftware.dev' },
      ],
      sidebar: [
        { label: '課程總覽', items: [
          { label: '首頁', slug: '00_index' },
          { label: 'Overview', slug: '01_overview' },
        ]},
        { label: '10 週講義', items: loadWeekSidebar() },
        { label: 'Reading 摘要', collapsed: true, items: loadReadingSidebar() },
        { label: 'Assignments', items: [{ label: 'Index', slug: 'assignments/_index' }] },
      ],
      components: { Footer: './src/components/SiteFooter.astro' },
      customCss: ['./src/styles/global.css'],
      pagefind: true,
      lastUpdated: true,
    }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeMermaid, { strategy: 'pre-mermaid' }], rehypeKatex],
  },
});
```

### Step 5 — Homepage（`site/src/content/docs/index.mdx`，grill F2 確認）

**位置**：`site/src/content/docs/index.mdx`（不是 repo root 的 mdx）。Slug = root，Starlight 直接路由到 `/CS146S-handbook-zh/`。

**處理 index.qmd 衝突**：把 `index.qmd` rename 成 `_quarto_index.qmd`，同時更新 `_quarto.yml` 內 chapters[] 第一項指向新名稱（Quarto pipeline 仍可出 PDF）。

把 `00_index.md` 內容轉成 `template: splash` 的 mdx，加 `TrackPicker.astro` + `WeekIndex.astro`：

```mdx
---
title: CS146S 繁中講義
description: Stanford CS146S "The Modern Software Developer" Fall 2025 繁中教材包
template: splash
hero:
  tagline: 10 週講義 · 46 篇 reading 摘要 · 三條學習路徑
  actions:
    - text: 從 W01 開始
      link: /CS146S-handbook-zh/weeks/01_intro_to_coding_llms/
      icon: right-arrow
      variant: primary
    - text: 下載 PDF
      link: https://github.com/<user>/CS146S-handbook-zh/releases/latest/download/CS146S_handbook_zh.pdf
      icon: document
    - text: 原版課程（英文）
      link: https://themodernsoftware.dev
      icon: external
---

import TrackPicker from '../../../components/TrackPicker.astro';
import WeekIndex from '../../../components/WeekIndex.astro';

<TrackPicker />

## 10 週講義

<WeekIndex />
```

**Import path（grill F2 修正）**：mdx 在 `site/src/content/docs/index.mdx`，components 在 `site/src/components/`，相對路徑是 `../../../components/`（三層 `..` 跳出 `docs/` → `content/` → `src/`）。spec 原本寫的兩層 `..` 是「mdx 放 repo root」的版本，已過時。

### Verify Gate 2 — npm run build 驗證（grill F7）

在 Step 4 結束、Step 5 前先驗 brace expansion + sidebar generator 跑得起來：

```bash
cd site && npm run build
# 預期：build 成功、`site/dist/` 內 weeks/01_*/index.html、readings/w1_*/index.html、
#       assignments/_index/index.html 都存在、頁數約 60+。
# 失敗 fallback：brace expansion 不 work → 改成 multiple glob entries（spec §風險 2 第二選項）
```

通過才繼續 Step 5。

### Step 6 — Components 設計

**`TrackPicker.astro`** — 三張卡（Track A/B/C），每張顯示路徑 + CTA「開始這條 track」。靜態內容、不從 collection 抓。

**`WeekIndex.astro`** — 抄 Li Hung-Yi `LectureIndex.astro`：
- 卡片有：week badge / title_zh / topics chip tag / dates / status badge / CTA「閱讀講義」
- 從 `getCollection('docs')` filter `id.startsWith('weeks/')` + sort by week number

**`ReadingTable.astro`** — 嵌在 `/readings/` 索引頁的表格：
- 排序 by week
- columns: 週次 / 中文標題 / 原文連結 / 字數
- 可做 client-side filter（按週次）— Phase 2，先做靜態

**`SiteFooter.astro`** — 必含：
```
© 2025-2026 WLK 繁中譯解。本講義以 CC BY-NC-SA 4.0 授權。
原版課程內容 © Stanford / Mihail Eric / industry speakers，
非官方獨立翻譯，請以原版 themodernsoftware.dev 為準。
```

### Verify Gate 3 — preview + manual review（grill F7）

```bash
cd site && npm run preview
# 開 http://localhost:4321/CS146S-handbook-zh/ 手動驗：
#   - splash hero 有 tagline + 三 actions（W01 / 下載 PDF / 原版課程）
#   - TrackPicker 三張 Track 卡顯示、CTA 連結正確
#   - WeekIndex 10 週卡片牆顯示、按 week 排序
#   - sidebar 三 group（10 週講義 / Reading 摘要 / Assignments）展開正確
#   - footer 授權聲明 + GitHub repo 連結都在
#   - 全文搜尋輸入「prompt engineering」+「上下文工程」都要有 hit
# user 親自過一遍，全綠才繼續 Step 7
```

### Step 7 — GitHub Actions deploy

`.github/workflows/deploy.yml` 直接抄 Li Hung-Yi 的版本（含 Playwright cache）。改：
- `working-directory: site`
- repo URL `fireman333/CS146S-handbook-zh`
- 不需要 migrate-frontmatter step（不是 idempotent skill pipeline、frontmatter 直接源頭就有；要的話就加）

### Step 8 — `.gitignore` 修改

```
# Quarto build artefacts (既有，保留)
.quarto/
_freeze/
_site/
pdf/**           # PDF 是 build artifact、不上 main
**/*.quarto_ipynb

# Astro
site/node_modules/
site/dist/
site/.astro/

# OS / editor
.DS_Store
*.swp
*~
.vscode/
.idea/

# LaTeX intermediates
*.aux
*.log
*.out
*.toc
*.tex
*.synctex.gz

# Backups
weeks.bak*/
readings.bak*/
*.bak
```

### Step 9 — README.md 改寫

保留現有授權聲明區塊（重要！），把「怎麼用」section 改成 dual-mode：

```markdown
## 怎麼用

### 線上閱讀（Astro 站，2026 起）
https://fireman333.github.io/CS146S-handbook-zh/
- 全文搜尋（支援中文 / 英文混搜）
- 三條學習路徑導覽
- 行動裝置友善

### 下載 PDF（Quarto 出書版）
從網站首頁點「下載 PDF」（指向 GitHub Releases 最新版），或直接到 GitHub repo 的 [releases](releases) 頁挑版本。

### 自己渲染並發布 PDF（更新 PDF 印製版用）
\`\`\`bash
quarto --version  # 1.5+ 要求
quarto render     # 出 pdf/CS146S_handbook_zh.pdf（local-only，gitignored）
gh release create v$(date +%F) --notes "PDF refresh $(date +%F)" pdf/CS146S_handbook_zh.pdf
# 或覆寫既有 release 的 asset：
# gh release upload <tag> pdf/CS146S_handbook_zh.pdf --clobber
\`\`\`

### 加新 reading / week
直接丟新 `.md` 到 `weeks/` 或 `readings/`，push 到 main，CI 自動更新網站 sidebar + 首頁卡片牆。PDF 版需要手動 `quarto render` 後上傳 GitHub Release。
```

### Step 10 — Verify + push

```bash
cd site && npm run build       # 應該成功生 60+ 頁 HTML（10 weeks + 46 readings + assignments + overview + index）
npm run preview                 # 本機看 http://localhost:4321/CS146S-handbook-zh/
                                # 確認：sidebar 分組 / 三 track 卡 / 10 週卡 / footer 授權聲明
cd ..
git add site/ scripts/ .github/ .gitignore README.md _quarto.yml _quarto_index.qmd
git commit -m "Add Astro Starlight site (dual-mode with Quarto for PDF, PDF via GH Release)"
git push
# 進 GitHub repo Settings → Pages → Source: GitHub Actions（若還沒設）
# 首次 PDF release：quarto render && gh release create v$(date +%F) pdf/CS146S_handbook_zh.pdf
```

**注意**：`git add` 不含 `pdf/`（grill F3，PDF 走 GitHub Release）。`00_index.md` 內容已遷進 `site/src/content/docs/index.mdx`，原檔可刪可留（留作為 Quarto 來源、或 git rm）。

## Critical files to create

- `/site/astro.config.mjs`
- `/site/src/content.config.ts`
- `/site/src/components/{TrackPicker,WeekIndex,ReadingTable,SiteFooter}.astro`
- `/site/src/styles/global.css`
- `/site/src/assets/logo.svg`
- `/site/src/content/docs/index.mdx` (homepage with splash hero — grill F2)
- `/scripts/migrate-frontmatter.mjs`
- `/.github/workflows/deploy.yml`

> `/scripts/sync-pdfs.mjs` 已刪除（grill F3 — PDF 走 GitHub Release）。

## Critical files to modify in place

- `weeks/*.md` — 可能需要 frontmatter 補齊（migration script idempotent，安全）
- `readings/*.md` — 同上
- `00_index.md` — 內容遷進 `site/src/content/docs/index.mdx`（grill F2）；原檔可留作 Quarto 來源或 git rm
- `index.qmd` → rename 成 `_quarto_index.qmd`（grill F2 — 騰出 `index` slug 給 Astro homepage）。`_quarto.yml` 對應改 chapters[] 第一項。
- `_quarto.yml` — 保留並更新（Quarto PDF pipeline 還在用，但首章來源改 `_quarto_index.qmd`）
- `.gitignore` — 加 Astro 規則
- `README.md` — dual-mode 說明（PDF 改 GitHub Release 流程，grill F3）

## Verification — 怎麼驗證遷成功

1. **Local build**：`cd site && npm run build` 應該成功，輸出頁數 = 1 + 2 + 10 + 46 + 1 + 404 = 61 頁左右
2. **Local preview**：`npm run preview` 然後手動點過：
   - 首頁 → 三 track 卡顯示
   - 點 Track A → 跳到 W01
   - W01 頁 → sidebar 三 group 全部展開可見
   - Reading 摘要群組 → 按週分組 collapsed by default
   - 全文搜尋輸入「prompt engineering」+ 中文「上下文」都有 hit
   - 任一頁滑到底 → footer 授權聲明在
3. **PDF 還能出**：`quarto render` 仍跑得通、`pdf/CS146S_handbook_zh.pdf` 生出來
4. **CI 部署**：push 後 GitHub Actions deploy.yml 綠燈，瀏覽 `https://fireman333.github.io/CS146S-handbook-zh/` 顯示新 Astro 站（取代舊 Quarto 站）
5. **擴充性 regression test**：手動建 `readings/w99_test_dummy.md` 加 frontmatter → push → 2 分鐘內線上 sidebar 多一個 W99 reading group → 確認後刪除測試檔再 push

## Future enhancements（不阻斷遷移）

- **Reading filtering by tag** — 客戶端 JS 加 tag filter
- **三 track checklist 模式** — 每篇看完可勾 progress（localStorage）
- **互動式 Mermaid 流程圖** — 把 Track A/B/C 學習路徑做成 mermaid graph，標示 prerequisites
- **Reading 與原文連結 health check** — `scripts/audit-reading-links.mjs` 跑 curl 檢查 200 status，過期 link 告警
- **整本 PDF 自動 CI 出** — 若想 PDF 自動跟著 push 更新，加 Quarto + Typst 進 CI（要裝 LaTeX，build time +5 min；不建議自動）

## 跟 Li Hung-Yi 站不一樣的關鍵差異總結

| 維度 | Li Hung-Yi | CS146S |
|---|---|---|
| 內容類型 | 單一 lecture 列表 | weeks + readings + assignments 三類 |
| 內容生成方式 | Gemini 看 YouTube 自動生成 | 人工撰寫繁中 paraphrase（已存在） |
| Reader persona | 台灣醫學生 | **海內外華語 CS 自學者 + vibe coder + tech lead**（grill F4） |
| 首頁 | 10 張 lecture 卡 | 3 條 track 卡 + 10 週卡 |
| Reading | 無 | 46 篇、按週分組、可篩選 |
| PDF | nice-to-have | required（Quarto pipeline 留著） |
| 著作權 | 致謝李宏毅老師 | CC BY-NC-SA 4.0 + 致謝 Stanford / Mihail Eric |
| 加新內容 | playlist 多新影片 → skill 跑 generation | 人工寫新 `.md` → push |

## 估時

- Step 0-2（scaffold + frontmatter audit）：30 min
- Step 3-4（content config + astro.config 含 sidebar generator）：1 hr
- Step 5-6（homepage + 4 個 components）：2 hr
- Step 7-9（CI + .gitignore + README）：30 min
- Step 10（verify + push + Pages settings）：30 min
- **總計：~4.5 hr 一個人工**（含偵錯時間）

## 風險 / 已知踩雷

1. **既有線上 URL 不會自動 redirect** — Quarto 原本路徑可能是 `/01_overview.html`，Astro 是 `/01_overview/`。GitHub Pages 改用 Actions deploy 後舊 Quarto build artefact 會被覆蓋。若有人 bookmark 舊 URL → 失效。**對策**：在 `00_index.mdx` 加說明 + 在 README 附舊 URL → 新 URL 對照表（如必要）。
2. **Glob loader pattern 跨多目錄** — 確認 `pattern: '{weeks,readings,assignments,01_overview,00_index}.{md,mdx}'` 真的 match 到。Astro 6 glob loader 對 brace expansion 支援要驗證。**對策**：若 brace expansion 不 work，分多個 collections 或用 multiple glob loaders。
3. **Reading 數量 46 篇 → sidebar 太長** — Starlight sidebar collapsed group 預設行為要對。**對策**：每個 week 內 reading group 設 `collapsed: true`，預設只展開「10 週講義」group。
4. ~~`00_index.mdx` 用 `index` slug 衝突~~ **已決議（grill F2）**：首頁 mdx 命名為 `index.mdx` 放 `site/src/content/docs/`，原 `index.qmd` 改名 `_quarto_index.qmd`，`_quarto.yml` 對應更新。
5. **Quarto `.quarto/` 編譯 cache 不該被 Astro 讀** — gitignore 應已 ignored、但 glob loader 設定要排除（pattern 不要 match `**/*.quarto*`）。
6. **跨 domain CLAUDE.md import** — 既有 `.claude/` 資料夾若有 project memory，遷移後仍能用；確認 `~/claude_domain/reading/` 的 domain-level CLAUDE.md（若有）跟 Astro setup 不衝突。

## 下一步

當使用者準備執行這個遷移時：

1. **先 grill 一次**：本 spec 是寫死的方案，但有些決策（單 collection vs 三 collection、首頁 layout 選 splash 還是 doc 風格、要不要保留 Quarto pipeline）值得 `/grill quick` 過一遍
2. **小批量先試**：Step 0-4 跑完就先 `npm run build` 看能不能 build，不要一路寫到 Step 10 才驗證
3. **保留回退路徑**：`_quarto.yml` 不刪、舊 Quarto build 出的 `pdf/` 不動，遷失敗可以隨時回去
4. **Domain CLAUDE.md 影響**：若 `~/claude_domain/reading/CLAUDE.md` 有規範 reading project 結構，需要先看過確認 Astro 結構不違反 domain rules
