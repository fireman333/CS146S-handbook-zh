---
week: 5
title: "Migrate to Warp from Claude Code (Warp vs Claude Code)"
source_url: "https://www.warp.dev/university/getting-started/warp-vs-claude-code"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# Migrate to Warp from Claude Code (Warp vs Claude Code)

> **一句話摘要**：Warp 不把 Claude Code 當對手，而是定位成「跑在 Warp terminal 裡的 first-class CLI agent」— 使用者可以選擇繼續用 Claude Code 享受 Warp 的 IDE-level wrapper，或乾脆切到 Warp 內建 Agent Mode。

## 核心論點（150-200 字繁中）

這篇 doc 開宗明義說：Claude Code 不是 terminal emulator，而是「跑在任何 terminal 裡的 CLI agent」，Warp 則是 agentic IDE，所以兩者不是競品而是 stack 的不同層。Warp 給使用者兩條 migration path：(1) **在 Warp 裡跑 Claude Code** — 自動偵測 `claude` 指令後解鎖 rich input editor（Ctrl+G 多行 prompt + `@` mention + 語音）、agent notification、inline code review、vertical tabs with agent metadata、remote control 等 IDE 級功能；(2) **切到 Warp Agent Mode** — `⌘+Enter` 進入後直接自然語言下指令；最關鍵的 migration 提示是「把 `CLAUDE.md` 改名為 `AGENTS.md` 或 `WARP.md` 放專案 root，Warp 會自動讀取，不必重寫」。Codebase Context、Rules、Warp Drive、Agent Mode Context、MCP 五個 context source 共同組成 Warp agent 的「該讀什麼檔」決策。

## 關鍵概念

1. **Third-Party CLI Agent Integration** — Warp 對 Claude Code / Codex / OpenCode 提供 first-class wrapper，不是放任它在 dumb terminal 裡跑。
2. **Rich Input Editor (Ctrl+G)** — 把 CLI agent 的 single-line prompt 升級成多行 + `@` mention + voice + slash command 的 IDE-style 輸入。
3. **AGENTS.md / WARP.md** — Warp 版的 `CLAUDE.md`，repo root 會被自動拾取；rename 即可遷移。
4. **Agent Mode（⌘+Enter）** — Warp 內建 agent 模式，用 `⌘+I` 在 terminal mode 與 agent mode 間切換。
5. **Bracketed Paste** — Warp 預設啟用，多行 paste 進 Claude Code 不會誤觸發送。
6. **Codebase Context Indexing** — 開資料夾後 Warp 自動 index Git-tracked 檔案，agent 可直接 search，不用人工貼 snippet。

## 對 CS146S 的意義

直接示範「terminal 是 agent 的 host」這個課程主軸 — 同一個 Claude Code agent 在不同 terminal 跑會有完全不同的 UX。Warp 把 IDE 級 affordance（notification、code review panel、tab metadata）下沉到 terminal 層，正是 modern terminal 的設計核心。`AGENTS.md` 的命名標準化也是社群在收斂 multi-agent ecosystem 的具體案例。

## 對 Vibe Coder 的 Takeaway

如果已經用 Claude Code 順手且有寫好的 `CLAUDE.md`，遷移到 Warp 幾乎零成本：rename 成 `AGENTS.md` 即可。立刻能拿到的好處是 desktop notification（agent 等你輸入時彈通知）、`Ctrl+G` 多行 prompt 編輯、vertical tab 同時管多個 Claude Code session。不必選邊站 — Warp 把 Claude Code 包進來而非取代。

## 原文連結

[Migrate to Warp from Claude Code](https://www.warp.dev/university/getting-started/warp-vs-claude-code)
