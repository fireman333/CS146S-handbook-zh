---
week: 4
title: "Awesome Claude Agents (curated list)"
source_url: "https://github.com/vijaythecoder/awesome-claude-agents"
source_type: "github"
fetched_at: "2026-05-02"
status: "complete"
---

# Awesome Claude Agents (curated list)

> **一句話摘要**：把 24 個 specialized subagent 編成「虛擬開發團隊」 — 由 orchestrator 分派工作、framework specialist 處理特定技術棧、universal expert 跨棧支援、core team 做 QA 與 documentation — 比起單一 generalist Claude，分工 + 自動配置能輸出更高品質的 code。

## 核心論點（150-200 字繁中）

這個 repo 不是 framework，而是 curated list — 把 24 個預製好的 Claude subagent 分成四個層級：(1) **Orchestrators**（3 個，含 Tech Lead Orchestrator、Project Analyst、Team Configurator）負責分析專案、路由任務；(2) **Framework Specialists**（13 個）是特定技術棧的深度專家，含 Laravel / Django / Rails / React / Vue 的 backend / API / ORM 三組；(3) **Universal Experts**（4 個）是跨 framework 的 polyglot；(4) **Core Team**（4 個）做 code review、performance 優化、documentation、code archaeology。核心命題是「specialized expertise + real collaboration + tailored solutions 勝過 solo AI」 — 把 Claude Code 的 subagent 機制當組織學的 division of labor 來操作。內建 auto-configurator 會偵測專案技術棧並自動派任合適 specialist。

## 關鍵概念

1. **Orchestrator pattern** — senior 級 agent 不寫 code，只分析任務、路由給 specialist，模擬 tech lead 角色。
2. **Framework Specialist** — 對單一技術棧（如 Laravel）做深度 prompt engineering，比 generalist 更熟慣例。
3. **Universal Expert** — 跨棧通才，處理 framework specialist 涵蓋不到的 cross-cutting 問題。
4. **Core Team（QA layer）** — code reviewer、performance optimizer、documentation specialist、code archaeologist，作為品質防線。
5. **Auto-configuration** — 掃描 repo 偵測 stack（package.json、composer.json 等）→ 自動激活對應 specialist。

## 對 CS146S 的意義

對 Week 4 課程而言，這 repo 是「subagent ecosystem」具體化的 case study。它把 best practice 文件中抽象的 subagent 概念具體化成「24 個角色 + 路由規則」，是課堂討論「agent specialization vs generalization」trade-off 的現成素材。也展示了社群如何把 Claude Code 的 primitive 包裝成 reusable agent library。

## 對 Vibe Coder 的 Takeaway

非工程背景使用者的啟發：與其想自己寫 24 個 agent，不如把這個 list 當 inspiration，挑出與自己 workflow 對應的 2-3 個直接複製到 `.claude/agents/`。對醫學研究情境，可以類比成「自己編一支研究團隊」 — biostatistician agent、manuscript reviewer agent、literature search agent，各管一段，主對話只負責協調。但要注意：agent 多 ≠ 效果好，沒實際使用會變成維護成本。

## 原文連結

[Awesome Claude Agents](https://github.com/vijaythecoder/awesome-claude-agents)
