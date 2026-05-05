---
title: "課程簡介與自學路線圖"
parent: "00_index.md"
---

## 為什麼這門課值得念

CS146S《The Modern Software Developer》是 Stanford CS 在 Fall 2025 全新開的課，由 Mihail Eric（[mihail911](https://github.com/mihail911) — ex-Amazon AGI、ex-Goodlight）主講。它的特殊性在於：

1. **內容極度當前**：講義連結 2025 年才出現的工具（Claude Code、Warp、Devin、Vercel v0、Resolve.ai），industry guest speaker 都是這些公司的創辦人或核心成員。
2. **聚焦「人 + AI 協作」的實作層**：不是純 ML 理論，而是「身為一個軟體工程師，要怎麼用 AI 工具更快做出正確的東西」。
3. **Final project 占 80%**：強迫實作。沒寫過東西、只看課的話會看不出價值。

## 為什麼非資工背景也能念

雖然 prerequisite 寫 CS111 + CS221/229 recommended，但實際上：

- 大半週次的 lecture 內容是**工具使用與工作流**（W1 prompt、W2 MCP、W3 IDE setup、W4 agent management、W5 terminal、W7 code review、W8 UI building），不需要深 ML 背景。
- 真正需要 ML 知識的只有 W1 後半（"What is an LLM actually"）和 W6 vulnerability detection 的 prompt injection 攻擊面，本講義對這兩塊都會加倍譯解。
- W2/W3 的 agent + context engineering 是 vibe coder 的核心日常，不是學術內容。

**對非資工背景讀者的建議**：W1 LLM 基礎讀完即可，不必鑽 transformer architecture；把時間花在 W2-W4 的 agent + IDE + Claude Code 實作練習上，這是 ROI 最高的部分。

---

## 課程資訊（完整）

### 修課負擔
- 每週 10-12 hrs：含 lecture（3 hrs）、assignment（4-6 hrs）、reading（2-3 hrs）
- Final project 不計入週負擔，是學期末額外時間。

### 評分組成
| 項目 | 占比 | 說明 |
|------|------|------|
| Final Project | 80% | 學期末個人專案，展示 modern dev practices |
| Weekly Assignments | 15% | 9 個 hands-on 練習，多半是用 Claude Code / Cursor / MCP / Warp 實作 |
| Class Participation | 5% | Stanford 課堂出席與討論 |

對自學者來說，weekly assignments 才是訓練的核心。Final project 沒有 peer / mentor 互相 review 的話，建議用「對應 vibe coding 副業 side project」當練習。

### 旁聽政策
> "We're open to auditing requests by Stanford students and staff. You will be able to attend all the lectures, but we won't be able to grade your homework or give advice on final projects."

非 Stanford 學生不能旁聽現場課，但 syllabus / slides / reading 都公開在 themodernsoftware.dev。本講義就是基於公開資源做的繁中化版本。

---

## 三條自學路線（從 [00_index.md](00_index.html) 重點展開）

### Track A — Vibe Coder 速成路線

**目標**：1-2 週讀完，能用 Claude Code 從零做出一個 side project。

```
W1（LLM 基礎 + prompting）
  → W2（agents + MCP，挑出 MCP 部分動手做）
    → W3（AI IDE + context engineering，學 PRD 寫法）
      → W4（Claude Code 高階用法，Boris Cherny 的 agent manager 概念）
        → W8（UI/app building，學 v0 / Vercel）
          → 動手做 final project
```

**跳過**：W5 terminal（除非你已經在用 Warp）、W6 security（advanced）、W7 code review（團隊用）、W9 observability（production 用）、W10 trends。

### Track B — 完整軟體工程路線

**目標**：跟 Stanford 學生同步進度（10 週），全 syllabus 走完。

每週流程：
1. 讀本講義的週 .md（30 min）
2. 讀該週 readings 至少 2 篇（90 min）
3. 嘗試該週 assignment（90-180 min）
4. 看 Mon lecture slides 對照（30 min）
5. Fri guest speaker 看 industry context（30 min）

### Track C — Tech Lead / PM 視角

**目標**：理解 AI-assisted coding 對團隊、流程、產品的衝擊，不寫 code。

```
W1（LLM 基礎，理解能力邊界）
  → W4（agent autonomy levels，理解人機分工）
    → W6（security，理解風險）
      → W7（code review，理解品控變革）
        → W9（observability，理解 production 風險）
          → W10（industry trends，預測未來 5 年）
```

---

## 學習資源

### 必備工具（免費可開始）
| 工具 | 用途 | 免費額度 |
|------|------|---------|
| [Claude Code](https://claude.com/claude-code) | AI coding agent CLI | 免費 plan 有限額 |
| [Cursor](https://cursor.sh/) | AI IDE | 14 天 free trial |
| [Warp](https://www.warp.dev/) | AI terminal | 個人免費 |
| [Vercel v0](https://v0.dev/) | UI 生成 | 免費額度 |

### 學習成本最低的兩篇 prereq
- Andrej Karpathy [Deep Dive into LLMs](https://www.youtube.com/watch?v=7xTGNNLPyMI) — 3.5 hr 影片，看完就懂 W1 後半的所有概念
- [Prompt Engineering Guide](https://www.promptingguide.ai/techniques) — 30 min 讀完，覆蓋 W1 的 prompt 技巧

---

## 本講義的譯解原則

1. **技術名詞**：`English（中文）` 首次出現，後續用 English。例：Model Context Protocol（模型上下文協定，MCP），後續用 MCP。
2. **產品名稱**：只用英文。例：Claude Code、Cursor、Warp、Semgrep、Graphite。
3. **縮寫**：`縮寫（全稱）` 首次出現。例：MCP（Model Context Protocol）、PRD（Product Requirements Document）。
4. **不需翻譯的通用詞**：直接使用。例：CLI、IDE、API、SDK、CI/CD。
5. **對非資工背景讀者的譯解**：在概念第一次出現時，用「💡 譯解」block 補一句白話。

例：
> **MCP（Model Context Protocol）** 是 Anthropic 提出的開放協定，讓 AI agent 能用標準化方式呼叫外部工具與資料源。
>
> 💡 **譯解**：可以想成 USB-C 之於充電線——以前每個工具廠都有自己的接頭，MCP 讓 AI 可以一個統一接口接所有外部工具（Slack、GitHub、Google Drive 等）。

---

## 講義產出限制 / 已知 caveat

- **Google Slides 大多需登入** → Mon lecture 內容是基於 topics + speaker context 做的 best-effort 重建，不是逐字 transcript。
- **Friday industry guest speaker 部分內容無 source** → 只能依 speaker bio + 公司產品做高層摘要。
- **W8 與 W10 沒有 reading list** → 內容偏延伸思考 + 工具介紹，會明確標註「我的延伸」。
- **W6 與 W9 對非資工背景偏深** → 加倍譯解，但仍假設讀者理解基本 web / 系統概念。

如發現摘要內容與原文有出入，請以原文為準（每篇摘要均含原文連結）。
