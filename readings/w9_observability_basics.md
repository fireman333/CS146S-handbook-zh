---
week: 9
title: "Observability Basics You Should Know"
source_url: "https://last9.io/blog/traces-spans-observability-basics/"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# Observability Basics You Should Know

> **一句話摘要**：Observability（可觀測性）= 用 logs（日誌）、metrics（指標）、traces（追蹤）三柱看穿系統內部狀態，traces 特別適合找出 distributed system 中的瓶頸。

## 核心論點（150-200 字繁中）

Monitoring（監控）只告訴你「**什麼**壞了」（CPU 高、5xx 多）；observability 要回答「**為什麼**壞」。在 microservices（微服務）架構下，一個 user request 可能跨 10+ 個 service，光看單一 service 的 metrics 完全不知道哪一段慢。observability 三柱各司其職：**logs** 記錄離散事件（誰在某時做了什麼）、**metrics** 是聚合數值（QPS、p99 latency、error rate），**traces** 把整個 request 從進入點到回應的完整路徑串起來。Trace 由多個 span（區段）組成，每個 span 是一個工作單位（一次 DB query、一次 RPC call），spans 用 parent-child 關係階層組織。文章強調 traces 的關鍵是 **context propagation**（上下文傳播）— trace ID 必須跨 service 傳遞才能串成完整路徑。OpenTelemetry 是業界中立標準。三柱要相互關聯（trace ID 寫進 log、metric 帶上 trace exemplar），單看任一柱都不夠。

## 關鍵概念

1. **Logs（日誌）** — 離散文字事件記錄，類似醫院的病歷紀錄（誰、何時、做了什麼、結果）。
2. **Metrics（指標）** — 時間序列數值（CPU usage、request count），類似生命徵象（HR、BP、SpO₂）持續監測。
3. **Traces（追蹤）** — 請求流經各 service 的完整路徑，類似影像檢查（CT / MRI）— 一次性看到全身結構與問題位置。
4. **Span（區段）** — Trace 的最小單位，代表一次具名的工作（如「query DB」「call payment API」）。
5. **OpenTelemetry（OTel）** — 廠商中立的 observability instrumentation 標準。
6. **Context Propagation（上下文傳播）** — Trace ID 在 service 之間傳遞，確保跨服務 request 能被串成同一條 trace。

## 對 CS146S 的意義

LLM agent 系統就是典型的 distributed system — 一個 user query 可能觸發 LLM call → tool call → DB query → 另一個 LLM call。沒有 tracing 等於 debug 黑箱。Agent post-deployment 必備 observability stack，特別是 traces 來看 token cost、latency、tool failure 在哪一步發生。

## 對 Vibe Coder 的 Takeaway

寫 app 時從第一天就加 structured logging（JSON log，含 request ID）。Vibe coding side project 不必上 Datadog，用 Sentry / OpenTelemetry SDK 就能撈 80% 價值。Traces 比想像中重要 — 你以為「app 慢」往往是某個 third-party API 慢，traces 一眼看到。

## 原文連結

[Observability Basics You Should Know](https://last9.io/blog/traces-spans-observability-basics/)
