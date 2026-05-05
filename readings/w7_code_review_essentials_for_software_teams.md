---
week: 7
title: "Code Review Essentials for Software Teams"
source_url: "https://blakesmith.me/2015/02/09/code-review-essentials-for-software-teams.html"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# Code Review Essentials for Software Teams

> **一句話摘要**：Blake Smith 把 code review 重新定義成「保持團隊心智模型同步」的對齊工具，而非單純的 quality gate，並用「scalpel-driven development」框架主張小而精準的 PR 才能維持 review 的高品質。

## 核心論點（150-200 字繁中）

Smith 的核心 framing 把 code review 視為 hierarchy of needs，最底層是**團隊對齊**（alignment）：「當 Bob 提交 accounting subsystem 的 PR，Amy 在 review 中同步更新她對該 system 的 mental model」。這個 framing 把 review 從「擋 bug」升級為「擴散知識 + 降低未來修改的 onboarding 成本」。實務面分三段：(1) **Before coding** — 寫 code 前先確認 priority 與 design 共識，把改動拆成「scalpel-like」小 cut；(2) **Pull request descriptions** — 提供 problem statement、high-level structural change、testing verification，不要逼 reviewer 自己解碼；(3) **Reviewer tone** — 用 clarifying question 取代 judgment，「how does this handle edge cases?」而非「this design is broken」，維持 psychological safety。Smith 也提醒不要 over-index 在 style nitpick 上，formatting 應交給 automation 處理，review 本身專注在 architectural alignment。

## 關鍵概念

1. **Mental Model Synchronization（心智模型同步）** — Review 的首要功能是讓團隊對 codebase 維持共同理解，bug detection 反而是 side effect。
2. **Scalpel-Driven Development（手術刀式開發）** — 把 PR 切成小而精準的 cut，避免 machete-like 大刪除，是高品質 review 的前提。
3. **PR Description Discipline（PR 說明書紀律）** — Problem + structural change + testing 三段，省 reviewer 解碼成本。
4. **Clarifying Question Tone（澄清式提問語氣）** — 用問句框架 critique，維持 psychological safety。
5. **Automate the Style, Review the Architecture** — 把 formatting 交給 linter / formatter，review 專注在設計層面。

## 對 CS146S 的意義

這篇 2015 年的文章是 Week 7 的「**為什麼 review 不能完全交給 AI**」基礎論述。Smith 強調的 mental model synchronization 是 AutoCommenter / Diamond 等 AI reviewer 目前完全無法替代的 — LLM 可以指出 N+1 query，但無法讓你的隊友因為讀 PR 而學到「這個 subsystem 為什麼這樣設計」。Tomas（Graphite）演講中提到 LLM 可以 catch 但 human 不想收的 comment（add test、extract function），恰恰對應 Smith 說的「don't over-index on nitpicks」。**AI 處理 mechanical layer，human review 處理 alignment layer**，是 Week 7 整體的整合論述。

## 對 Vibe Coder 的 Takeaway

即使是一人專案也要寫 PR description — 把「這次改了什麼、為什麼、怎麼測」寫清楚，三個月後的自己（與接手的 AI agent）會感謝你。第二個 takeaway：**不要做超大 PR**，500 行以上的 PR 不論 human 還是 AI reviewer 都會 skim 過去；切成 5 個 100 行 PR 的 review 品質會好 5 倍。

## 原文連結

[Code Review Essentials for Software Teams](https://blakesmith.me/2015/02/09/code-review-essentials-for-software-teams.html)
