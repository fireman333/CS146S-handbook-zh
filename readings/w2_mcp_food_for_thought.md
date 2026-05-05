---
week: 2
title: "MCP Food-for-Thought (APIs don't make good MCP tools)"
source_url: "https://www.reillywood.com/blog/apis-dont-make-good-mcp-tools/"
source_type: "blog"
fetched_at: "2026-05-02"
status: complete
---

# MCP Food-for-Thought (APIs don't make good MCP tools)

> **一句話摘要**：把現有 REST API 機械式包成 MCP tool 雖然技術上可行，但會撞上 tool proliferation、context window 浪費、與錯失 agent 原生能力三大問題；好的 MCP tool 必須為 agent 重新設計，而非單純轉接。

## 核心論點（150-200 字繁中）

Reilly Wood 提出對 MCP 開發的 contrarian take：別把 OpenAPI spec 自動轉成 MCP tool。理由四點：(1) **Tool proliferation** — agent 在 tool 數量遠未達到 128 之前就會 call 錯，每多一個 tool 就吃 context window 額度；多數 API 設計時根本沒考慮這限制。(2) **Context window 浪費** — API 回 wide record 含一堆 field，agent 不需要的也都吃 token；JSON 又是低效格式，作者實測 CSV 同樣資料只用 JSON 一半的 token。(3) **錯失 agent 原生能力** — 為 agent 量身打造的 tool 可以回 free-form text、做 layered tool chaining、混搭 structured 與 suggestive output；機械轉換 API 全失。(4) **冗餘** — Claude Code 之類的現代 agent 本來就會寫 code 直接 call API，多一層 MCP wrapper 反而是負擔。建議：把多支相關 API 合併成一個彈性 tool、加 field projection 與 result filtering、用 CSV/YAML 取代 JSON、在 response 裡指引下一步。

## 關鍵概念

1. **Tool proliferation（工具擴增）** — Tool 數量越多，agent 選錯的機率越高；實務上 128 之前就明顯惡化。
2. **Context window** — LLM 一次能處理的 token 數上限，每個 tool 定義與每筆 response 都吃額度。
3. **Field projection（欄位投影）** — 讓 caller 指定只回傳需要的欄位，借自 SQL `SELECT` 概念。
4. **Layered tool chaining（分層工具串接）** — 設計 tool 時考慮「呼叫完這個之後 agent 通常會 call 什麼」，在 response 引導 next step。
5. **Free-form response** — 不被嚴格 schema 綁住的回應，給 agent 用自然語言推理空間。
6. **Token efficiency** — 同樣資訊用 CSV / YAML 比 JSON 省 token，因為不需重複 key 名稱。
7. **API-vs-agent design mismatch** — API 為 code consumer 設計（精確、完整、結構化）；agent 需要的是 contextual reasoning（精簡、引導、可解釋）。

## 對 CS146S 的意義

這是 Week 2 的「反思題」— 前 5 篇教你**怎麼**寫 MCP server，這篇逼你想**該不該**這樣寫。對課程作業設計層面的批判性討論很有用：別只看 server 能不能跑，要看 agent 用起來順不順。

## 對 Vibe Coder 的 Takeaway

Vibe coding 最容易踩這個雷 — 拿到 OpenAPI spec 用 generator 一鍵變 MCP server，看似 productive 其實做出 agent 用不順手的東西。實務原則：(1) 先想清楚 agent 用這個 tool 會問什麼問題，再設計 tool 介面；(2) 永遠加 `fields` 參數讓 agent 自選欄位；(3) response 用 markdown table 或 CSV，別 dump 整坨 JSON；(4) 在 description 裡寫「這個 tool 適合在 X 情境用，後續通常呼叫 Y」，幫 agent 做 routing。

## 原文連結

[MCP Food-for-Thought (APIs don't make good MCP tools)](https://www.reillywood.com/blog/apis-dont-make-good-mcp-tools/)
