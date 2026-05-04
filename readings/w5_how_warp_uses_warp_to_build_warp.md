---
week: 5
title: "How Warp Uses Warp to Build Warp"
source_url: "https://notion.warp.dev/How-Warp-uses-Warp-to-build-Warp-21643263616d81a6b9e3e63fd8a7380c"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# How Warp Uses Warp to Build Warp

> **一句話摘要**：Warp 公司內部的「Coding Mandate」— 每個 coding task 都必須先用 Warp prompt 起手，連續卡關十分鐘才能 fallback 到別的工具，這份 dogfooding 紀律才是 Warp 產品快速演進的真正引擎。

## 核心論點（150-200 字繁中）

這是 Warp CEO 公開的內部規範。核心是一條 mandate：**每個 coding task 都從在 Warp 裡 prompt 開始**；若十分鐘內無進展，必須先到 `#feedback-` channel 回報 prompt + conversation id（給內部建 eval），然後才允許試 Cursor / Claude / 手寫。Mandate 的「why」有三：(1) prompt-driven coding 對許多任務真的更快，且能 multi-thread 開發、加速摸熟陌生 codebase；(2) dogfooding — 既然要客戶這樣工作、要拿這個押公司未來，自己就得相信到願意用；(3) 用競品建立對市場上限的直覺。配套指南包含：**送審的 code 要像自己手寫的一樣負責**（不能用「AI 寫的」當 bug 藉口）、**告訴 agent 怎麼做不是只說做什麼**（指定 data model / API / 檔案位置 / 測試）、**拆小步、別 one-shot**、**先要 plan 再要 diff**、**重複工作做成 Warp Drive prompt / rule、context 用 MCP 拉**（Sentry、Linear、Notion、Slack）。

## 關鍵概念

1. **Coding Mandate** — 強制 prompt-first 的內部紀律，把 dogfooding 從口號變成 enforced workflow。
2. **Ten-Minute Escape Hatch** — 卡十分鐘必須先回報 feedback + 提供 conversation id，再被允許 fallback。
3. **Eval-Driven Feedback Loop** — 內部第一直覺是把每個 bug report 轉成 eval，不是直接 patch。
4. **「Tell the agent how, not just what」** — 反 goal-seeking prompt、要 explicit engineering spec（data model / API / test）。
5. **Small-step over One-shot** — 大改用 incremental commit + frequent test 取代一發命中。
6. **Persistent Context（Rules / Prompts / WD objects / MCP）** — Warp Drive 是讓重複指令不必每次重打的關鍵層；MCP server 連 Sentry / Linear / Notion 餵 context。
7. **Multi-thread Local Setup** — 同時開多份 warp-internal / warp-server clone 平行跑多個 agent task。

## 對 CS146S 的意義

從「終端機 + AI = 怎麼真的拿來工作」這個角度看，這份 mandate 比任何 marketing page 都誠實 — 它告訴你 prompt-driven coding 不是魔法，而是需要工程紀律：拆小步、明確規格、code review 不放水、把 context 寫成 reusable rule、把 bug 變 eval。對課程談「modern terminal 改變開發流程」是非常具體的 case study。

## 對 Vibe Coder 的 Takeaway

兩個立刻能套用的習慣：(1) **不要 one-shot 大功能** — 拆成小 commit、邊跑邊讓 agent 寫 test，避免被「看似能跑但無法維護」的 code 淹沒；(2) **重複指令立刻變 rule / prompt** — 看到自己第二次打同樣的「請用 X linter、import 順序這樣排」，就該存進 Warp Drive 或 `CLAUDE.md`。「卡十分鐘要回報」這條對個人開發者太嚴格，但精神是「不要靜默掙扎，馬上換策略或記下來下次改」。

## 原文連結

[How Warp Uses Warp to Build Warp](https://notion.warp.dev/How-Warp-uses-Warp-to-build-Warp-21643263616d81a6b9e3e63fd8a7380c)
