---
week: 2
title: "MCP Server SDK (TypeScript)"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/tree/main?tab=readme-ov-file#server"
source_type: "github"
fetched_at: "2026-05-02"
status: complete
---

# MCP Server SDK (TypeScript)

> **一句話摘要**：MCP TypeScript SDK 用 `McpServer` class 把 server 開發收斂成「初始化 → 註冊 tool/resource/prompt → 選 transport → 啟動」四步驟，搭配 Zod 等 schema 庫做 type-safe 的輸入驗證。

## 核心論點（150-200 字繁中）

TypeScript SDK 是官方維護的 MCP server 開發 SDK 之一，README 的 Server 章節展示最小可運行範例。核心 API 是 `McpServer` class — 開發者初始化時帶 server 名稱與版本（這些 metadata 之後會回給 client 做 discovery），然後用 `registerTool()` 之類的 method 把功能掛上去。每個 tool 註冊需要三個元件：tool name、設定物件（含 description 與 inputSchema）、async handler function。SDK 採用 Standard Schema 介面，可自由換 Zod v4、Valibot、ArkType 等驗證庫。Transport 層支援 stdio（local 開發最常用）與 streamable HTTP（remote 部署）；後者另有 Express / Hono / Node HTTP middleware adapter 方便整合既有 web 框架。文件附 weather server quickstart、完整 server guide、與 `examples/` 資料夾。值得注意：v2 SDK 為 pre-alpha 但官方推薦新專案直接用，v1 receive 6 個月維護期。

## 關鍵概念

1. **McpServer** — TypeScript SDK 的核心 class，server 實例的 entry point。
2. **registerTool()** — 註冊一個可被 LLM 呼叫的工具，三參數為 name、config（含 description + inputSchema）、async handler。
3. **Standard Schema** — 跨 schema 庫的統一介面，讓 SDK 不綁定特定驗證實作。
4. **Zod** — 最常見的 TypeScript schema 庫，用 chainable API 描述 input 結構並自動產生 type。
5. **stdio transport** — 透過標準輸入輸出與 client 通訊，最適合 local development 與 Claude Desktop 整合。
6. **Streamable HTTP transport** — Web-based 通訊，適合 remote server 部署，可搭配 Express/Hono middleware。
7. **Server-initiated request** — Server 主動向 client 發請求的能力（如 sampling，請 client 端 LLM 幫 server 做 inference）。

## 對 CS146S 的意義

這是寫 MCP server 作業的實作層 reference。比起讀 spec 文件，直接抄 SDK README 的 weather server 範例改成作業需求，能在最短時間跑出 working prototype。

## 對 Vibe Coder 的 Takeaway

TypeScript 是 vibe coding 寫 MCP server 性價比最高的選擇 — type system 抓 bug、Zod schema 自動生 JSON schema、stdio transport 直接接 Claude Desktop 不用部署。第一個 server 只要 50 行：`new McpServer({...})` → `registerTool(...)` → `server.connect(new StdioServerTransport())`。Python SDK 也有同等 API 但 type checking 較弱。

## 原文連結

[MCP Server SDK (TypeScript)](https://github.com/modelcontextprotocol/typescript-sdk/tree/main?tab=readme-ov-file#server)
