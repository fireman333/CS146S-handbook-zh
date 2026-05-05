---
week: 4
title: "Super Claude Framework"
source_url: "https://github.com/SuperClaude-Org/SuperClaude_Framework"
source_type: "github"
fetched_at: "2026-05-02"
status: "complete"
---

# Super Claude Framework

> **一句話摘要**：SuperClaude 是 Claude Code 的「meta-programming configuration framework」 — 透過 30 個 slash command、20 個 specialized agent、7 個 behavioral mode、8 個 MCP server 整合，把通用 Claude Code 升級成有結構化開發生命週期支援的平台。

## 核心論點（150-200 字繁中）

SuperClaude 解決的問題是「Claude Code 預設 generic、缺 domain-specific workflow」。解方是 behavioral instruction injection + component orchestration：在 Claude Code 上層疊加四類元件。**30 個 slash command** 涵蓋 ideation 到 deployment 全週期 — `/brainstorm`、`/design`、`/implement`、`/test`、`/document`、`/git`、`/spawn` 等。**20 個 specialized agent** 是 domain expert persona（PM Agent、Deep Research Agent、Security Engineer、Frontend Architect），按 context 自動激活。**7 個 behavioral mode** 是 adaptive operating context — Brainstorming、Business Panel、Deep Research、Orchestration、Token-Efficiency、Task Management、Introspection。**8 個 MCP server** 整合外部能力 — Tavily（web search）、Context7（doc）、Sequential-Thinking、Serena（memory）、Playwright、Magic（UI gen）、Morphllm-Fast-Apply、Chrome DevTools。設計哲學強調「framework footprint 要小，把 context window 留給 project code」。安裝走 `pipx install superclaude` + `superclaude install`。

## 關鍵概念

1. **Behavioral Instruction Injection** — 在 Claude 行為層注入 prompt，不改 model 也不改 Claude Code 本體。
2. **Component Orchestration** — 多個 agent + tool 協同的調度層。
3. **Behavioral Mode** — 不是 agent 也不是 command，是「整段對話的操作脈絡」（如 Brainstorming Mode 會讓所有後續回應變成 Q&A 探索風格）。
4. **MCP Server Bundle** — 把多個 MCP 預打包進 framework，使用者一次裝齊。
5. **Plugin Marketplace（v5.0 開發中）** — 未來支援 TypeScript plugin 可擴充。

## 對 CS146S 的意義

對 Week 4 而言，SuperClaude 是「community framework on top of Claude Code」最完整的範例。它示範了如何把 Anthropic 提供的 primitive（slash command / agent / hook / MCP）系統化包裝成上層產品。可作為討論「Claude Code 的可擴充性 ceiling 在哪」、以及「framework 與 primitive 之間的取捨」的教案。

## 對 Vibe Coder 的 Takeaway

對非資工使用者要小心：SuperClaude 是強大但 opinionated 的 framework，會在你的 Claude Code 上注入大量 behavioral instruction，可能與已有 CLAUDE.md / skill 衝突。建議先用 `superclaude doctor` 驗證、選擇性 install component，而非無腦 full install。對使用者已有的 medical / biostat skill ecosystem，SuperClaude 的 mode 概念（Brainstorming / Deep Research）是值得學習的 pattern — 把「對話脈絡」當成可切換的 first-class concept。

## 原文連結

[SuperClaude Framework](https://github.com/SuperClaude-Org/SuperClaude_Framework)
