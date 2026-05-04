---
week: 4
title: "Peeking Under the Hood of Claude Code"
source_url: "https://medium.com/@outsightai/peeking-under-the-hood-of-claude-code-70f5a94a9a62"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# Peeking Under the Hood of Claude Code

> **一句話摘要**：OutSight AI 透過 LiteLLM proxy 監聽 Claude Code 的 API call，逆向工程出四個核心 pattern — context front-loading、`<system-reminder>` 標籤、embedded safety、conditional sub-agent — 結論是 Claude Code 的「魔法」不在 model，而在系統化的 context scaffolding。

## 核心論點（150-200 字繁中）

OutSight AI 用 LiteLLM proxy 攔截 Claude Code 真實送出的 API call，揭開四個 pattern。**(1) Context Front-Loading**：session 一開始就先把對話濃縮成 < 50 字元 title、判斷是否新主題，建立清晰的 task framing。**(2) `<system-reminder>` Tag 滲透**：最重要的發現 — 這個特殊 tag 散布在 system prompt、user message、tool result 各層，「tiny reminders, at the right time, change agent behavior」，用以對抗 long-context drift。**(3) Embedded Safety**：權限不是 hardcode 規則，而是用專門的 prompt 偵測 command injection — 抽 command prefix 比對 policy spec、標記 backtick injection / pipe 外洩等可疑 pattern。**(4) Conditional Sub-Agent**：Task tool spawn 出的 subagent 預設不帶 TodoWrite reminder（保持 focus），但若 agent 一段時間沒用 tool，系統會 conditionally 注入 reminder — 在 specialization 與 capability awareness 之間做動態平衡。**結論**：Claude Code 的成功來自 systematic context scaffolding，不是隱藏的 model superiority，這個 pattern 可移植到其他 agentic system。

## 關鍵概念

1. **`<system-reminder>` tag** — 散布在多層 prompt 裡的微提醒，用來抵抗 context drift；最關鍵的逆向工程發現。
2. **Context front-loading** — session 開頭主動濃縮對話、判斷主題切換，建立 framing。
3. **Prompt-based safety** — command injection 偵測用專門 prompt 而非 hardcoded rule，policy 是可演化的 spec。
4. **Conditional reminder injection** — subagent 預設無 reminder，行為偏離才注入，動態維持 focus 與 capability。
5. **Adaptive complexity** — sub-agent 依任務複雜度收到不同 instruction set。
6. **Tool result as context** — tool 回傳值不是 plain output，會被包進 system reminder，維持跨對話 focus。

## 對 CS146S 的意義

對 Week 4 而言，這篇是唯一從「實作層」反推 Claude Code 設計哲學的文章，補足官方 best practice 文件留白的 implementation detail。對課堂討論「為什麼 Claude Code 比同期 agent 框架穩定」提供 concrete answer：是 context engineering pattern 而非 model 優勢。也呼應 Good Context, Good Code 的論點 — 連 Anthropic 自己都用 context scaffolding 撐起 agent，更不用說 user 端。

## 對 Vibe Coder 的 Takeaway

兩個可移植的 pattern：(1) 自己寫長 workflow 時，模仿 `<system-reminder>` 概念 — 在關鍵步驟前重述當前目標，比期待 model「自己記得」可靠；(2) 對 long session，主動 framing（「我們現在在處理什麼」）能顯著降低 drift。對使用者醫學研究 workflow 的啟發：在多階段 pipeline（如 meta-analysis 9 stages）裡，每個 stage 開頭明寫「我們在 stage N，input 是 X，output 是 Y」，效果接近 Claude Code 的 system reminder 機制。

## 原文連結

[Peeking Under the Hood of Claude Code](https://medium.com/@outsightai/peeking-under-the-hood-of-claude-code-70f5a94a9a62)
