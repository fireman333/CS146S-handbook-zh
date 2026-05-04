---
week: 8
title: "Week 8：Automated UI and App Building"
title_zh: "自動化 UI 與 App 生成"
dates:
  - "Mon 2025-11-10"
  - "Fri 2025-11-14"
topics:
  - "Design and frontend for everyone"
  - "Rapid UI/UX prototyping and iteration"
guest_speaker:
  name: "Gaspar Garcia"
  title: "Head of AI Research"
  org: "Vercel"
status: complete
---

> **本週你會學到什麼**：v0、Lovable、Bolt、Replit Agent、Cursor Composer — 這一波「一句話生整個 app」的工具怎麼運作？前端設計與 UX 對非設計師變得多容易？本週由 Vercel（v0 母公司）的 Head of AI Research Gaspar Garcia 親自開講。

## 學習目標

完成本週後，你應該能：

1. **比較** v0 / Lovable / Bolt / Replit Agent / Cursor Composer 在「一句話生 app」的能力差異
2. **應用** v0 prompt 技巧生成 production-ready React/Next.js component
3. **設計** 一個「prompt → preview → iterate → deploy」的完整 vibe coding workflow
4. **評估** 哪些 app 適合 AI 全自動生成 vs 哪些需要人工架構設計

## 核心概念導讀

### 一、UI generation 的演化：從「截圖轉 code」到「一句話生 app」

過去三年 UI generation 的能力曲線跳了三個世代。**第一代（2023, v0 1.0）**：Vercel 把 v0 推出時定位是「screenshot → JSX」，你貼一張 Figma 截圖或 mockup，它輸出對應的 React code。可用但有限，只能處理單一 component、設計一複雜就崩。**第二代（2024, v0 2.0 + 競品爆發）**：從 single-component 變 single-page，從只生 markup 變生帶 state 的互動元件。同時間 Lovable、Bolt、Replit Agent 跳出來，各自切不同 niche — Bolt 強調 in-browser dev environment、Replit Agent 強調全棧 + 部署、Lovable 強調 design-first。**第三代（2025, v0 3.0 / Cursor Composer / Claude Artifacts）**：跨入「一句話生整個 app」 — 包含 routing、auth、database schema、API route、UI 全套。能力到 production-grade demo level 但離 production-ready 還有距離（multi-tenancy、payment、observability 多半還是要人工接）。

理解這個演化曲線，重點不是記住每個版本能做什麼，而是看清**這條技術曲線的驅動力**：(a) LLM model 能力提升（context window 從 8k → 200k → 1M，可以塞整個小型 codebase）；(b) tool ecosystem 成熟（Next.js App Router、shadcn/ui、Tailwind v4 等 AI-friendly 框架同時崛起）；(c) execution sandbox 成熟（WebContainers 讓 LLM 能在瀏覽器裡跑 npm install 並 preview）。三者加乘才催生第三代。（基於既有知識的延伸寫作）

### 二、Design system 與 component library 在 AI 時代的角色重定位

過去 design system（設計系統）是大公司的奢侈品 — 自己維護一套 token、一套 component、一套 documentation site。AI 時代這個資源結構逆轉：**design system 從「成本」變「prompt 槓桿」**。當你跟 v0 說「給我一個 dashboard」，它需要某個 default 來生成 — 那個 default 就是它讀過、訓練過、知道怎麼穩定產出的 component library。

這就是為什麼 **shadcn/ui** 在 2024-2025 年大爆發。它不是傳統意義上的 component library（不是 npm 包），而是一套 **copy-paste-able** 的 React component source code，建立在 Radix UI primitives + Tailwind CSS 之上。對 AI 友善的三個關鍵設計：

1. **Source 在你 repo**：不是 black-box 套件，每個 component 的 code 全在你 codebase 裡，AI 讀 code 直接知道結構，不用猜 props
2. **Tailwind utility class**：所有 styling 是 inline class，AI 改 styling 不用追到外部 CSS 檔
3. **Composition over configuration**：複合元件用 `<Dialog><DialogTrigger /><DialogContent /></Dialog>` 結構，AI 對這種 declarative tree 的 reasoning 比 prop-heavy API 強

對應的，Tailwind CSS 也是 AI-native：所有 design decision 直接在 markup 裡，沒有「跳到另一個 .css 檔」的 context-switch 成本。v0、Cursor Composer、Claude Artifacts 預設都跑 Tailwind + shadcn/ui，幾乎是業界共識。（基於既有知識的延伸寫作）

### 三、Prompt-to-app 五大工具的職能差異

把 2025-2026 主要的「自然語言生 app」工具放在同一張地圖上比較，差異不在「會不會生 code」，在**它替你做了多少 infra 決策**：

| 工具 | 設計哲學 | 強項 | 弱項 |
|------|---------|------|------|
| **v0（Vercel）** | UI-first、generate React/Next.js | 元件品質頂、整合 Vercel 部署一鍵到位、shadcn/ui 原生 | 後端要自己接、不適合非 Next.js 棧 |
| **Lovable** | Design-first、做 SaaS 起手式 | 包整套 frontend + Supabase backend、迭代體驗順 | 棧鎖定（Supabase + React）、客製度有限 |
| **Bolt（StackBlitz）** | In-browser full-stack IDE | WebContainers 跑 Node.js / npm 完全在 browser、瞬間 preview | Browser 能跑就能寫，無法做 native / heavy compute |
| **Replit Agent** | All-in-one：寫 + 跑 + 部署 | 一站完整、適合 0 設定 prototyping、有 cloud DB | Replit 平台鎖定、產出搬到別處要重整 |
| **Cursor Composer** | IDE 內 multi-file edit | 直接在你 local repo 操作、跨 file 改動最強、用熟的工具 | 沒 preview / 沒 deploy，純 coding 段 |

選用直覺：**Demo / prototype 趕時間** → Lovable 或 Bolt（一句話到能 share 的 link）；**自己長期 side project** → Cursor Composer + v0（v0 生 UI、Cursor 改 code、Vercel 部署）；**全棧 + 不想碰 infra** → Replit Agent。

第二類差異是「**iteration loop 的閉合速度**」 — 從你說一句話到看到結果的時間。Bolt / Lovable 在 30 秒內，v0 約 1-2 分鐘，Cursor Composer 看你 repo 大小但通常即時。loop 越快，prompt iteration 的次數越多，最終品質越高。這就是為什麼 v0 / Bolt 把 preview 做進產品本體 — 它們把 iteration loop 內建化。（基於既有知識的延伸寫作）

### 四、為什麼 Vercel 的全棧押注（v0 + AI SDK + AI Gateway）值得單獨理解

Vercel 在這波 prompt-to-app 賽道裡是少數同時做產品（v0）+ infrastructure（Vercel platform）+ developer SDK（AI SDK）+ AI infra（AI Gateway）四層的玩家。理解這個 stack 才看得懂 Gaspar Garcia 演講背後的策略：

- **v0**：自然語言 → React/Next.js component / app（前端 UI 層）
- **Vercel AI SDK**：TypeScript SDK，讓你在自己 app 裡接各家 LLM（OpenAI / Anthropic / Google）的統一介面，提供 streaming、tool use、structured output、generative UI 等高階 abstraction
- **AI Gateway**：跨 LLM provider 的統一 endpoint + observability + cost control + rate limiting，讓 production app 能在 model 之間 hot-swap
- **Vercel Platform**：edge runtime、serverless function、CDN、preview deployment，是 v0 生成的 app 部署的 default 目的地

這個 stack 的整合點是 **edge-first generative UI**：v0 生 component → AI SDK 在 edge runtime 串 LLM → AI Gateway 做 multi-provider routing → Vercel 部署。對 vibe coder 的 takeaway：選 Next.js + Vercel 棧的最大紅利不是 framework 本身，是這條完整的 AI-native infrastructure pipeline，每一段都減少你的工程負擔。（基於既有知識的延伸寫作）

## Monday Lecture（11/10）：End-to-end apps with a single prompt

- **Slides**: [Google Slides（需 Stanford 帳號）](https://docs.google.com/presentation/d/1GrVLsfMFIXMiGjIW9D7EJIyLYh_-3ReHHNd_vRfZUoo/edit?usp=sharing)
- **講者**: Mihail Eric

> Slides 需 Stanford 帳號，依 lecture title + 2025-2026 prompt-to-app 工具景觀 best-effort 重建：

這節 Mihail 把「一句話生整個 app」現象拆成可被 evaluate 的工程問題。預期內容：

1. **景觀總覽** — v0 / Lovable / Bolt / Replit Agent / Cursor Composer 五大工具的功能 matrix（誰生 UI、誰跑 sandbox、誰部署、誰連 DB），對應上面四象限分析
2. **技術棧分析** — 為什麼 Next.js + shadcn/ui + Tailwind + TypeScript 是 AI-native 共識？對比過去 React + CSS-in-JS 時代為什麼 LLM 寫不順
3. **Prompt-to-app 的失敗模式** — 三類典型 fail：(a) generation 看起來能跑但 deploy 後 build 失敗、(b) UI 漂亮但功能假、(c) 一句話生 demo 美但 second iteration 開始崩
4. **Live demo 段** — Mihail 應該會 demo 用 v0 從 prompt 到 deploy 一個 todo app + dashboard，全程不寫一行 code，計時看多快能上線
5. **「what AI builds well vs poorly」** — Crud dashboard、landing page、form-heavy admin tool 是 AI 強項；real-time collaboration、payment integration、auth flow、performance-critical animation 還是要人工
6. **企業 / 個人選擇 framework** — 對學生：先學 v0 + Cursor 即可；對 startup：選 Vercel + AI SDK；對企業：考慮 LangChain / LlamaIndex 等 framework-agnostic 方案

**Key takeaway**：「一句話生整個 app」現象的工程本質是 LLM × component library × execution sandbox × deployment platform 四要素的整合。Demo 容易、production 難 — 知道邊界在哪比追新工具更重要。

## Friday Lecture（11/14）：Gaspar Garcia（Vercel Head of AI Research）

- **Speaker**: [Gaspar Garcia](https://www.linkedin.com/in/gaspargarcia/), Head of AI Research at [Vercel](https://vercel.com/)
- **Slides**: [Google Slides（需 Stanford 帳號）](https://docs.google.com/presentation/d/1Jf2aN5zIChd5tT86rZWWqY-iDWbxgR-uynKJxBR7E9E/edit?usp=sharing)

> Slides 需 Stanford 帳號，依 Vercel 公開資料 + Gaspar Garcia 角色 best-effort 重建：

Garcia 在 Vercel 領導 AI research，這場演講預期會橫跨 v0 / AI SDK / AI Gateway 三條產品線：

1. **v0 的設計哲學** — 為什麼 v0 不只生 code、要做 chat-driven iteration loop？為什麼 default 用 shadcn/ui？v0 V1 → V3 的 product evolution 故事
2. **Generative UI 的範式轉移** — 傳統 UI 是「設計師畫 → 工程師實作 → 用戶看」，generative UI 是「LLM 即時 generate component 給每個用戶看」。這不只是 v0 的內部技術，也是 AI SDK 給 developer 的 abstraction（`generateUI` API、streaming React components）
3. **Vercel AI SDK 的 design decision** — 為什麼選 TypeScript first、為什麼 streaming 是 first-class、為什麼 tool use 跟 generative UI 同一套 API。對比 LangChain / OpenAI SDK 的取捨
4. **AI Gateway 的 production reality** — 為什麼大家最終需要 multi-provider abstraction（cost、rate limit、availability、quality drift）。AI Gateway 怎麼解：unified endpoint + observability + caching + fallback chain
5. **Vercel infrastructure 怎麼支撐 vibe coding** — Edge runtime、preview deployment、Postgres / KV / Blob storage 三件套怎麼讓 v0 生的 app 能 zero-config 上 production
6. **What's next** — Garcia 應該會給 Vercel 對 generative UI / agent infra 的下一步想法（agent-as-a-service？multi-tenant generative app？）

**Key takeaway**：v0 不是孤立的「畫 UI 工具」，是 Vercel 整條 AI-native stack 的 entry point。Vibe coder 用 v0 + AI SDK + Vercel 部署的最大紅利是「**從 prompt 到 production 的單一供應商整合**」，把工程負擔壓到趨近於零。

## Reading

> 本週原 syllabus 沒列 reading list。本講義延伸推薦資源：
>
> - [v0 by Vercel — Official Docs](https://v0.dev/docs)
> - [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
> - [shadcn/ui — The component library AI loves](https://ui.shadcn.com/)
> - [Lovable.dev](https://lovable.dev/) / [bolt.new](https://bolt.new/) / [replit.com/agent](https://replit.com/agent)（產品比較）

## Assignment：Multi-stack Web App Builds

- **Source**: [github.com/mihail911/modern-software-dev-assignments/tree/master/week8](https://github.com/mihail911/modern-software-dev-assignments/tree/master/week8)
- **任務描述**: 用至少三種不同工具（建議 v0 + Lovable + Cursor Composer，或 Bolt + Replit Agent + v0）各自從同一個 prompt 生成同一款小型 web app（例：todo app with auth、blog with markdown editor、minimal SaaS landing page），比較產出的 (a) UI 品質、(b) code 結構乾淨度、(c) 從 prompt 到 deploy 的時間、(d) iteration 第二輪的穩定度。最終寫一份 comparison report，給未來的 vibe coder 同學一份「該用哪個工具」決策指南。
- **自學者可行性**: ⭐⭐⭐⭐⭐ 完全可做且強烈推薦做。所有工具都有 free tier：v0 個人 free quota、Lovable 試用、Bolt 在 stackblitz.com 直接用、Replit 個人免費、Cursor 14 天試用。預估 6-10 hr — 這是整門課最動手的 assignment 之一，做完你會對 prompt-to-app 工具的真實能力邊界有 first-hand 直覺，而不是 demo 影片裡的感覺。

> 💡 **加速 tip**：三個工具不要分開三天做，**同一天並行做**最有效 — 你能 side-by-side 看到同一 prompt 產出三個截然不同的結果，差異最明顯。比如同一個下午開三個瀏覽器分頁，每個 paste 同一段 prompt，等 30 秒看誰先生完、誰生得對。

## 對 Vibe Coder 的應用

W8 是把 vibe coder 從「能寫 component」升級到「**能一個人 ship 完整 app**」的關鍵一週。實戰建議：

1. **建立 v0 + Cursor + Vercel 三件套 workflow** — 這是目前最成熟、最便宜（個人 free tier 可走完整 pipeline）、最少 vendor lock-in 的組合。流程：(a) 在 v0 生第一版 UI（用 chat 迭代到滿意）→ (b) 把 v0 產出 export 到本地 repo（v0 有 "Open in Cursor" / "Download Code" 按鈕）→ (c) Cursor Composer 接手做業務邏輯、API 接、跨 file 改動 → (d) git push 自動觸發 Vercel preview deployment → (e) merge 到 main 自動 production deploy

2. **shadcn/ui 是 default 不要懷疑** — 任何新 React/Next.js 專案開頭直接 `npx shadcn-ui@latest init`。理由 W8 核心概念已說明：source 在你 repo、Tailwind utility、composition pattern 三件事讓 AI 寫起來最穩。其他 component library（MUI、Chakra、Mantine）對 AI 都沒這麼友善

3. **Prompt 永遠帶 design system context** — 跟 v0 / Cursor 對話時把 design system 寫進 prompt：「使用 shadcn/ui Card / Dialog / Form 元件，配色用 zinc + emerald，圓角 lg，間距 6/8/12 rhythm」。這比寫「做個漂亮的 dashboard」效果差 10 倍。沒 design system 直覺的話先去 [shadcn/ui blocks](https://ui.shadcn.com/blocks) 抓一個現成 layout 當 reference，把 reference 截圖貼進 prompt

4. **Iteration 鐵律：第一版用 v0 / Lovable 做粗、第二版進 Cursor 做細** — Prompt-to-app 工具在 first generation 是天才、second iteration 開始崩（會回頭刪你已經改好的東西）。穩定的 workflow 是 **第一版做 dirty draft → export 到 git repo → 之後所有改動在 Cursor 做**，把 v0 當「美術初稿生成器」而非「長期 IDE」

5. **不要在 Replit / Bolt 養大型專案** — 它們是 prototype 殺手 app，不是長期 dev environment。Demo / hackathon / 一日 MVP 用得很爽，但你 side project 想養三個月以上一定要在 git repo + local IDE + 自選 deployment 平台。Vendor lock-in 越早脫離越好

6. **Design system prompting 進階技巧** — 把你常用的 design 偏好寫進 `CLAUDE.md` / `.cursorrules` / `v0 system instructions`：「色票限定 zinc + emerald」「字體 Inter」「圓角統一 lg」「動畫用 framer-motion」「icon 用 lucide-react」「不要用 gradient 除非我明說」。每次新 prompt 不必重述，產出一致性會跳一個 level

> 💡 **vibe coder 的 Day-1 Quick Win**：今天 30 分鐘做這件事 — 開 [v0.dev](https://v0.dev)，prompt「Build a clean dashboard with sidebar navigation, top header with user avatar, main area showing 4 stat cards and a data table. Use shadcn/ui, Tailwind, zinc + emerald color scheme, lucide-react icons」。等 1 分鐘看產出。然後點 "Open in Cursor"，把產出拉到本地 repo。再 prompt Cursor「把這個 dashboard 接到 mock data，加一個 dark mode toggle」。最後 `vercel deploy` 上線。從零到 production URL 不到一小時 — 這就是你 W8 之後常駐的 baseline workflow。

---

**上一週**：[W7 Modern Software Support](07_modern_software_support.md) | **下一週**：[W9 Agents Post-Deployment](09_agents_post_deployment.md)
