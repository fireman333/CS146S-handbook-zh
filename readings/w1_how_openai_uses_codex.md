---
week: 1
title: "How OpenAI Uses Codex"
source_url: "https://cdn.openai.com/pdf/6a2631dc-783e-479b-b1a4-af0cfbd38630/how-openai-uses-codex.pdf"
source_type: "pdf"
fetched_at: "2026-05-02"
status: complete
---

# How OpenAI Uses Codex

> **一句話摘要**：OpenAI 內部訪談 + 使用數據彙整，分享 Security / Product Engineering / Frontend / API / Infrastructure / Performance 等團隊每天怎麼用 Codex 加速軟體開發，並歸納出 7 個 use case 與 5 條 best practice。

## 核心論點（150-200 字繁中）

這份 12 頁文件把 Codex 從「demo 級 AI coding assistant」拉到**「OpenAI 內部跨團隊日常工具」**的真實使用樣貌。整理出 7 個 use case：(1) **code understanding（程式理解）**——快速摸熟陌生 repo、追資料流、on-call incident response；(2) **refactoring and migrations（重構與遷移）**——跨多個檔案的一致性改動（例：把 callback 全換成 async/await）；(3) **performance optimization（效能優化）**——找 hot path、批次化 DB query；(4) **improving test coverage（補測試）**——對低覆蓋模組產 unit/integration test；(5) **increasing development velocity（提升開發速度）**——scaffold boilerplate、收尾 last-mile；(6) **staying in flow（保持心流）**——在 meeting / on-call 碎片時間 fire-and-forget 任務；(7) **exploration and ideation（探索與發想）**——找替代方案、辨識潛在 regression。Best practice 強調：先 Ask Mode 出計畫再切 Code Mode、用 GitHub Issue 風格寫 prompt、靠 AGENTS.md 提供持久 context、Best-of-N 探索多解、把 task queue 當 backlog。

## 關鍵概念

1. **Ask Mode vs Code Mode** — 先 Ask 產 implementation plan，再切 Code 落地，避免 model 跳過設計
2. **AGENTS.md** — Repo 內 persistent context 檔，放命名慣例、業務邏輯、quirks
3. **Best-of-N** — 同 task 同時產多個版本，挑或合併最佳結果
4. **Task queue as backlog** — 把 drive-by fix、雜想丟進 queue，不必當下完成 PR
5. **Well-scoped task** — Codex 最佳適用範圍：人類約 1 小時 / 數百行程式碼
6. **Environment iteration** — Startup script、env var、internet access 設好能顯著降低 error rate
7. **GitHub Issue-style prompt** — 含檔案路徑、模組名、diff、doc snippet 的 prompt 效果最好

## 對 CS146S 的意義

W1 用這篇當「LLM 在真實工程組織怎麼被使用」的 case study — 不是理論技巧、不是 demo，而是 OpenAI 自己怎麼把 LLM 嵌進日常 workflow，給學生一個 production-grade 的對標。

## 對 Vibe Coder 的 Takeaway

把這 7 個 use case 當 vibe-coding playbook 直接抄：寫新功能前先 Ask 產 plan、repo 加 AGENTS.md（或 CLAUDE.md）、把碎想丟 task queue、把 prompt 當 GitHub Issue 寫。這幾招套上去 Claude Code 用起來會立刻不一樣。

## 原文連結

[How OpenAI Uses Codex (PDF)](https://cdn.openai.com/pdf/6a2631dc-783e-479b-b1a4-af0cfbd38630/how-openai-uses-codex.pdf)
