---
week: 3
title: "Devin: Coding Agents 101"
source_url: "https://devin.ai/agents101#introduction"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# Devin: Coding Agents 101

> **一句話摘要**：Coding agent 跟 autocomplete / copilot / chatbot 是不同物種 — 它能 end-to-end 從 description 走到 PR，工程師的角色從「寫 code」變成「engineering manager 委派並驗收」。

## 核心論點（150-200 字繁中）

Devin 團隊把開發者 AI tool 的演化分成四代：10 年前的 autocomplete（method 級）、4 年前的 copilot（多行）、2 年前的 generative chatbot（檔案級）、今天的 autonomous agent（end-to-end task）。agent 跟 assistant 的關鍵差異不是「更會寫 code」，而是三件事：(1) **autonomy** — 對 test、linter、CI/CD 自我 iterate；(2) **error recovery** — 自己 debug 自己的錯，不需要人類每步介入；(3) **multi-task** — 工程師可同時委派多個 agent，自己變 engineering manager。但作者明確降溫：對大型任務 expect ~80% 時間節省，**不是完全自動化**，仍需多輪 feedback 與人類 verify before merge。Prompt strategy 的重點是 architecture-first — 講 *how* 不只是 *what*、提供 starting point（檔案路徑、文件）、defensive prompting 預期 agent 會困惑的地方、給 agent 強 feedback system（type、test、lint）。

## 關鍵概念

1. **Autonomous Coding Agent（自主編程 agent）** — 能從 description 跑到 PR、自我 iterate 對 test 與 CI、不需逐步指令的 AI 系統。
2. **Levels of Autonomy（自主層級）** — autocomplete → copilot → chatbot → agent 的能力光譜；autonomy 越高人類介入頻率越低、單次任務 surface 越大。
3. **Engineering Manager Mode（工程主管模式）** — 工程師同時 supervise 多個 agent，自己不寫多數 code，而是定義任務、review plan、merge PR。
4. **Architecture-First Prompting（架構優先提示）** — Prompt 重點在 *how*（指定設計方向、檔案位置、約束）而非只給 *what*（功能描述）。
5. **Defensive Prompting（防禦性提示）** — 預先告訴 agent 哪些地方容易誤解、哪些 path 不要碰、哪些假設要 challenge。
6. **Feedback Loop Quality（回饋迴圈品質）** — Agent 表現上限取決於環境給它的 type / test / lint signal 是否準確即時。

## 對 CS146S 的意義

這是 Week 3 的 autonomy spectrum 教材。理解 agent vs assistant 的分界，才能在 Week 4+ 的 PRD / spec 設計時知道「這個 spec 要寫到多細」— 給 assistant 的 prompt 跟給 agent 的 spec 顆粒度差很多。

## 對 Vibe Coder 的 Takeaway

醫學生用 Claude Code 已經是在用 agent，不是 chatbot — 對應的工作習慣要跟著換：(1) 不要逐行盯 agent 寫 code，要 review plan 跟 final diff；(2) build feedback loop（type check、test command）讓 agent 自己 iterate，不要當人肉 linter；(3) 接受 80% 自動化、20% 人工驗收這個 ratio，期望 100% 會失望。

## 原文連結

[Devin: Coding Agents 101](https://devin.ai/agents101#introduction)
