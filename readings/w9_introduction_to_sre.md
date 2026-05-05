---
week: 9
title: "Introduction to Site Reliability Engineering"
source_url: "https://sre.google/sre-book/introduction/"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# Introduction to Site Reliability Engineering

> **一句話摘要**：SRE（Site Reliability Engineering，網站可靠度工程）是 Google 把營運當成軟體工程問題的解法 — 用 error budget 把開發速度與系統穩定的衝突量化、用自動化避免團隊隨服務量線性膨脹。

## 核心論點（150-200 字繁中）

傳統 sysadmin（系統管理員）模式把 dev 與 ops 分家，導致兩派目標互斥（dev 想快速上線、ops 想穩定不動）、團隊隨流量線性擴張。Google 提出：找軟體工程師來設計營運團隊，把 manual operation 當成 bug 來自動化掉。SRE 的核心紀律是 **50% 規則** — 工程師花在 toil（重複瑣事）的時間不得超過一半，另一半必須做工程改善；以及 **error budget**（錯誤預算）— 既然 100% availability（可用性）既不可能也無價值，那就明訂目標（如 99.99%），剩下 0.01% 是「可以拿來冒險的預算」。新功能上線會吃掉預算，預算用完就停止 release。這把原本主觀的「能不能上線」變成可量化的決策，徹底化解 dev/ops 衝突。其餘關鍵紀律包含：blame-free postmortem（不究責檢討）、on-call 一班最多 2 個 incident、monitoring 只通知需要人介入的事件。

## 關鍵概念

1. **SLI / SLO / SLA（service level indicator / objective / agreement，服務水準指標／目標／協議）** — SLI 是測量值（如 latency p99），SLO 是內部目標（99.9% 請求 < 200ms），SLA 是對客戶的合約承諾。
2. **Error Budget（錯誤預算）** — 1 減去 SLO 的容忍失效空間；用來分配給新功能 release 的風險「額度」。
3. **Toil（瑣事）** — 重複、可自動化、無工程價值的營運工作；SRE 必須壓在 50% 以下。
4. **Blame-free Postmortem（不究責事後檢討）** — incident 後檢討聚焦 systemic root cause，不指責個人，鼓勵透明回報。
5. **On-call** — 工程師輪班待命處理 production incident；Google 規定一個 8-12 小時班最多收 2 個 paging。

## 對 CS146S 的意義

Agent post-deployment 階段就是 SRE 場景。LLM agent 上線後不會「寫完就結束」，而是要 monitoring、incident response、postmortem。Error budget 概念可直接套用 agent — 例如「allow 0.5% 的 hallucination rate」，超過就觸發回滾或停止部署新 prompt 版本。

## 對 Vibe Coder 的 Takeaway

別追求 100% perfect，那是無底洞。先決定可接受的失敗率（error budget），用它做 release 決策。寫 monitoring 時問自己「這個 alert 響了，人需要做什麼？」如果答案是「沒事」就不該是 alert（應該是 log 或 ticket）。Postmortem 不是找戰犯，是找系統性漏洞。

## 原文連結

[Introduction to Site Reliability Engineering](https://sre.google/sre-book/introduction/)
