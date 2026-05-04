---
week: 5
title: "Warp University (Getting Started with Warp and Oz)"
source_url: "https://www.warp.dev/university?slug=university"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# Warp University (Getting Started with Warp and Oz)

> **一句話摘要**：Warp 把自己定義為 Agentic Development Environment（代理式開發環境）— 由 modern terminal「Warp」加上 cloud agent orchestration platform「Oz」組成的雙產品架構，讓 local interactive coding 與 cloud-side automation 共用同一套 agent / context / rules。

## 核心論點（150-200 字繁中）

Warp 不再把自己定位成「比較好看的 terminal」，而是直接喊出 Agentic Development Environment 這個新類別。產品被切成兩塊：**Warp** 是使用者面前的 modern terminal，內建 block-based UI、code editor、LSP、code review，並能直接跑 third-party CLI agent（Claude Code、Codex、OpenCode）；**Oz** 則是背後的 cloud agent orchestration platform，負責驅動所有 AI 功能。Oz 同時支援 local agent（在 app 裡即時 pair coding）與 cloud agent（在 Warp 機房或自家機房背景跑、靠 trigger / schedule / parallelism 處理 PR review、issue triage、dependency update 等不需即時關注的任務）。兩邊共用同一個 agent core、同一套 Warp Drive / Rules / MCP context，所以可以「雲端開工、local 接手」無縫切換。整個 client 在 AGPL v3 開源，並標榜 SOC 2 + Zero Data Retention 的合規承諾。

## 關鍵概念

1. **Agentic Development Environment（代理式開發環境）** — 把 IDE + terminal + agent runtime 合成單一 first-class 產品類別，不是把 chatbot 黏在 editor 旁邊。
2. **Oz（Orchestration Platform）** — Warp 自家的 cloud agent 調度層，多模型架構，使用者可在不同任務挑不同 LLM。
3. **Local Agent vs Cloud Agent** — 前者 interactive、人在 loop 裡審 diff；後者 background、被 webhook / cron 觸發、可大規模並行。
4. **Block-based Terminal（區塊化終端機）** — 每條 command + output 是一個可分享、可搜尋、可篩選的 block，取代傳統 line-buffer。
5. **Warp Drive** — 跨 local/cloud agent 共享的 notebook / workflow / env var / rules 倉庫，是 agent 的 persistent context layer。

## 對 CS146S 的意義

這是「Modern Terminal」單元最直白的 reading — 它把 terminal 的下一個演進方向講得很白：terminal 不再只是 input/output stream，而是 agent runtime。Block 概念、Warpify、AGENTS.md / WARP.md 對應 Claude Code 的 CLAUDE.md，都是課程在談「人 + agent 在 CLI 共存」的具體 design pattern 範本。

## 對 Vibe Coder 的 Takeaway

對非資工背景、用 Claude Code 寫程式的使用者，Warp 提供兩條路：要嘛把 Claude Code 當 first-class CLI agent 跑在 Warp 裡（拿到 rich input、agent notification、code review panel），要嘛直接用 Warp 內建的 Agent Mode。Warp Drive 的 Rules / Prompts / env var 概念跟 CLAUDE.md import 結構非常像，學一邊就能類推。

## 原文連結

[Warp University (Getting Started with Warp and Oz)](https://www.warp.dev/university?slug=university)
