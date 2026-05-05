---
week: 9
title: "Your New Autonomous Teammate"
source_url: "https://resolve.ai/blog/product-deep-dive"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# Your New Autonomous Teammate

> **一句話摘要**：Resolve.ai 的 AI Production Engineer 把 incident response 全流程自動化 — 持續維護整個系統的 dynamic knowledge graph、alert 觸發後自動跑 just-in-time runbook 並在 1 分鐘內提出 root cause hypothesis、最後自動寫 postmortem。

## 核心論點（150-200 字繁中）

工程師時間應該花在「建造」而非「救火」。Resolve.ai 的 product 把自己定位成 autonomous teammate（自主隊友），核心架構是一個會持續更新的 **dynamic knowledge graph** — 接 Grafana / Datadog 抓 observability 資料、接 Jenkins 抓 CI/CD 部署紀錄、接 GitHub 抓 code change，把整個系統的依賴與狀態建成一張即時更新的圖。Alert 觸發後 agent 自動執行四步驟：(1) 跑 **just-in-time runbook**（即時生成的調查腳本）抓相關 metrics / log / dashboard / 最近 deployment / code diff；(2) 通常 1 分鐘內提出 root cause theory（不論是 config error、code change、downstream service 故障或 deployment 問題）；(3) 給可執行的 remediation step（rollback、restart pod 等），人類可在 Slack 對話中追問或授權執行；(4) incident 結束後自動產生 detailed post-incident review。關鍵設計哲學：agent 不是取代工程師，而是「teammate」— 提供推理與動手能力，最終決策仍由人控制。

## 關鍵概念

1. **Dynamic Knowledge Graph（動態知識圖譜）** — 持續更新的系統元件依賴圖，是 agent reasoning 的基礎。
2. **Just-in-time Runbook（即時 runbook）** — 不靠預寫的 SOP，而是 incident 當下根據 context 動態產生的調查步驟。
3. **Incident Response（事件應變）** — 從 alert 觸發到問題解決的整套流程。
4. **Root Cause Theory（根因假設）** — agent 提出的可能 root cause 候選清單，附證據與信心度。
5. **Post-Incident Review / Postmortem（事後檢討）** — incident 結束後紀錄 timeline、root cause、教訓的文件。
6. **Conversational Delegation（對話式委派）** — 工程師透過 Slack / UI 自然語言指派 agent 執行 rollback、restart 等動作。

## 對 CS146S 的意義

這是 W9 主題「agent post-deployment」的具體商業案例。展示一個 production-grade agent 必備元素：(1) 持續更新的 world model（knowledge graph）、(2) tool use（observability platforms、CI/CD、code repo）、(3) human-in-the-loop（不全自動執行破壞性動作）、(4) 自動化文檔產生（postmortem）。

## 對 Vibe Coder 的 Takeaway

「Autonomous teammate」是 agent 設計的好心法 — 不要做「按一下執行 100 步」的黑箱，要做「在每個關鍵節點停下來解釋、讓人類確認」的協作者。寫 agent 時就算只有自己一個 user 也要設計 conversational interface（解釋為什麼這樣做、提出多個 option），這比 fully autonomous 的 agent 更實用、更安全。

## 原文連結

[Your New Autonomous Teammate](https://resolve.ai/blog/product-deep-dive)
