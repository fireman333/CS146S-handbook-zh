---
week: 7
title: "Code Reviews: Just Do It"
source_url: "https://blog.codinghorror.com/code-reviews-just-do-it/"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# Code Reviews: Just Do It

> **一句話摘要**：Jeff Atwood 引用 Steve McConnell《Code Complete》的數據力證 peer code review 是性價比最高的 software quality practice，呼籲團隊「別再爭辯做不做、直接開始做」。

## 核心論點（150-200 字繁中）

Atwood 的核心主張很直接：peer code review（同儕程式碼審查）是單一一個能夠最有效提升 code quality（程式品質）的實務做法，沒做就等於把唾手可得的 ROI 丟在桌上。他援引 McConnell 的 industry data 指出 design + code inspection 平均能抓到 55-60% 的 defect（缺陷），遠高於各種 testing method（25-45%）。實證案例包括：某 maintenance 組織導入 review 後 error rate 從 55% 降到 2%；另一團隊 error 從每 100 行 4.5 降至 0.82；AT&T 因 review 取得 14% productivity 增益與 90% defect 減少；JPL 的 inspection 每場省下約 $25,000。Atwood 的結論是：review 形式（over-the-shoulder、email pass-around、pair programming、tool-assisted、formal Fagan inspection）並非關鍵，**有做就贏**。他用一句話收尾：「every minute you spend in a code review is paid back tenfold」。

## 關鍵概念

1. **Peer Code Review（同儕程式碼審查）** — 程式碼提交前由另一位 developer 檢視，是 Atwood 主張影響最大的單一實務。
2. **Defect Detection Rate（缺陷偵測率）** — Inspection 55-60% vs. testing 25-45%，是 review 優勢的量化證據。
3. **Lightweight Review（輕量化審查）** — 不需要 Fagan-style 重型流程，over-the-shoulder 或 tool-assisted 即可開始。
4. **Fagan Inspection（Fagan 形式審查）** — IBM 1976 年提出的正式審查流程，是 defect detection 數據的歷史源頭。
5. **ROI of Review（審查投資報酬率）** — Atwood 用「paid back tenfold」框架說服 manager 撥出時間做。

## 對 CS146S 的意義

這是 Week 7「Modern Software Support / AI Code Review」單元的歷史定位文章 — 在進入 AI reviewer（Diamond、CodeRabbit、Copilot Code Review）的討論前，先確立**為什麼 code review 本身值得做**。Atwood 2008 年的論點到 2026 年依然成立：AI reviewer 取代的是 review 過程中的部分 mechanical work，而非取代 review 本身的價值主張。理解 inspection 55-60% defect detection 這個 baseline 數據，後續才有辦法評估 AI reviewer 的 incremental contribution。

## 對 Vibe Coder 的 Takeaway

對非資工背景的 vibe coder 來說，這篇是「**為什麼我該幫自己寫的 code 做 review，即使是一人專案**」的最簡入門。實務上：(1) 用 AI reviewer（Diamond / CodeRabbit）當作沒有同事時的替代 reviewer；(2) git commit 前自己 self-review 一次 diff，等於 over-the-shoulder review；(3) 不要追求 Fagan-level 嚴謹，**有做就贏**。

## 原文連結

[Code Reviews: Just Do It](https://blog.codinghorror.com/code-reviews-just-do-it/)
