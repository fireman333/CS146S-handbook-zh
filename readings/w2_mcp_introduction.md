---
week: 2
title: "MCP Introduction"
source_url: "https://stytch.com/blog/model-context-protocol-introduction/"
source_type: "blog"
fetched_at: "2026-05-02"
status: complete
---

# MCP Introduction

> **一句話摘要**：Model Context Protocol（MCP，模型上下文協定）是一個基於 JSON-RPC 2.0 的開放標準，讓 LLM 應用透過統一介面接上外部工具與資料源，取代過去每個 API 都要客製整合的做法。

## 核心論點（150-200 字繁中）

Stytch 這篇 blog 把 MCP 定位為「AI 應用與外部系統之間的 universal adapter（通用轉接頭）」。傳統上，每個 LLM 應用要接 Slack、Gmail、internal database 都得寫一份客製整合，代碼重複且難以維護。MCP 用 client-server 架構解決這問題：MCP client 嵌在 AI 應用裡（chatbot、IDE assistant），MCP server 用標準化的 JSON-RPC 訊息暴露能力；client 透過 handshake → discovery → invocation 五步驟流程呼叫 server 端的 tool 或讀取 resource。MCP 比 ChatGPT plugin 更開放（非專屬）、比 LangChain 更標準（formal protocol），且近期加入 OAuth 2.0 + Dynamic Client Registration 解決多 user 環境的認證問題。

## 關鍵概念

1. **MCP client（協定客戶端）** — 嵌在 AI 應用內，負責與 server 對話、把 tool/resource 暴露給 LLM。
2. **MCP server（協定伺服器）** — 對外暴露 tools、resources、prompts 三類 capability，回應 client 的 JSON-RPC 請求。
3. **Tools** — 可被 LLM 呼叫執行動作的函式（如「發送 email」「查詢資料庫」）。
4. **Resources** — 模型可讀取的 context 資料或文件（檔案、DB 紀錄）。
5. **Prompts** — 預先定義的任務模板，讓 server 提供建議的對話起手式。
6. **JSON-RPC 2.0** — 訊息格式標準，固定的 request/response schema 確保跨 server 一致性。
7. **Transport** — 通訊管道，分 local（stdio）與 remote（HTTP/SSE stream）兩類。
8. **Dynamic Client Registration（DCR，動態客戶端註冊）** — OAuth 2.0 擴充，讓新 client 自動註冊不需手動設定。

## 對 CS146S 的意義

這篇是 Week 2 MCP 主題的入門 baseline：建立「為什麼需要協定、protocol 解決什麼整合問題」的心智模型，後續的 server SDK、authentication、registry 各篇都建立在這個架構上。

## 對 Vibe Coder 的 Takeaway

要把自己的 app（例如資料分析 dashboard、阿摩錯題解析器）接到 Claude，與其手刻 plugin，不如包成 MCP server — 一次寫完，Claude Desktop、Cursor、其他支援 MCP 的 client 都能直接用。Local stdio transport 開發成本最低，原型階段不必處理 OAuth。

## 原文連結

[MCP Introduction](https://stytch.com/blog/model-context-protocol-introduction/)
