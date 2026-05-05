---
week: 4
title: "Good Context, Good Code"
source_url: "https://blog.stockapp.com/good-context-good-code/"
source_type: "blog"
fetched_at: "2026-05-02"
status: "best-effort"
---

# Good Context, Good Code

> **一句話摘要**：標題即論點 — AI coding agent 的輸出品質與「給的 context 品質」線性相關，所以「context engineering」是使用者端最高槓桿的技能，而非 prompt engineering 或 model selection。

## 核心論點（150-200 字繁中）

> **Note**: 原文網址（StockApp Engineering blog）需要 access code 才能讀全文，本檔以標題、URL slug、與課程脈絡（Week 4: Coding Agent Patterns）做高層摘要，未直接抽取原文。讀者建議：以 access code 取得原文後再核對細節。

依標題與 Week 4 主題推論，這篇文章的核心命題與 Anthropic best practices 一致：coding agent（如 Claude Code）能不能寫出可用的 code，瓶頸不在 model 而在 context。「Good Context, Good Code」是 Garbage In, Garbage Out 的 agent 版本 — 給 agent 的 file reference、CLAUDE.md、example pattern、verification criteria 越完整、越具體，輸出品質越高。對應的反向命題是：當 Claude 寫出爛 code，第一個該檢查的不是 prompt 措辭，而是「我有沒有給它看對的 file、有沒有提供可執行的 test」。文章預期論及的 context 來源：existing codebase pattern、style guide、test fixture、past PR convention，以及 user 端用 `@file` reference、screenshot、CLI tool output 餵進去的 rich context。

## 關鍵概念

1. **Context engineering** — 比 prompt engineering 高一階的技能，重點在「餵什麼進 context」而非「怎麼措辭」。
2. **Code quality ∝ context quality** — agent 不會無中生有；輸出風格 / 正確性都是 context 中既有素材的重組。
3. **Verification as context** — test case、screenshot、expected output 也是 context 的一種，而且是最高槓桿的一種。
4. **Reference patterns** — 在 prompt 裡指出「跟這個 file 一樣的 pattern」比抽象描述更可靠。
5. **Garbage in, garbage out（agent 版）** — 不完整的 context 不只是減速，會主動誘發 hallucination。

## 對 CS146S 的意義

對 Week 4 而言，這篇（依標題判讀）是把「context engineering」抬升為論述主軸的代表。與 Anthropic 官方 best practices、Peeking Under the Hood 形成同一論述軸線：coding agent 的 alpha 在於 context discipline，不在 model size 或 prompt trick。

## 對 Vibe Coder 的 Takeaway

對非工程使用者最 actionable 的訊息是：當 Claude 寫的 code 不對，先別罵 model 也別重寫 prompt — 先問三個問題：(1) 我有給它 reference file 嗎？(2) 我有給它 verification（test / expected output）嗎？(3) CLAUDE.md / skill 裡有沒有相關的 domain knowledge？三個都做了還錯，再考慮其他原因。這跟臨床醫學的 history-taking 同構：問診（context）做不好，鑑別診斷（output）一定不會準。

## 原文連結

[Good Context, Good Code](https://blog.stockapp.com/good-context-good-code/)
