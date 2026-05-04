---
week: 2
title: "Sample MCP Server Implementations"
source_url: "https://github.com/modelcontextprotocol/servers"
source_type: "github"
fetched_at: "2026-05-02"
status: complete
---

# Sample MCP Server Implementations

> **一句話摘要**：`modelcontextprotocol/servers` repo 是官方維護的 MCP server reference implementation 集合，用多種程式語言示範如何把 LLM 安全、可控地接到外部工具與資料源。

## 核心論點（150-200 字繁中）

這個 GitHub repo 是 MCP 生態系最重要的「教學樣本庫」。Repo 把 server 分兩大類：(1) **reference servers**，由 MCP steering group 維護，做為各 SDK 的標準範例；(2) **archived servers**，過去由官方維護但已轉交社群的整合（如 GitHub、PostgreSQL）。Reference 範例涵蓋日常開發者最會遇到的場景 — Filesystem（檔案讀寫）、Git（repo 操作）、Memory（knowledge graph 持久記憶）、Sequential Thinking（多步推理輔助）、Fetch（HTTP 抓取）、Time（時區換算）、Everything（功能展示用 demo）。Repo 強調這些是「reference implementation」而非 production 解決方案，使用者部署前必須自行評估安全需求。除了官方 server 外，repo README 還大量索引社群框架（FastMCP、EasyMCP、Spring AI MCP）、client implementation、與第三方 management platform。

## 關鍵概念

1. **Reference server（參考實作）** — 由 MCP 官方維護的標準範例，目的是教學而非生產用。
2. **Filesystem server** — 提供「configurable access controls 的安全檔案操作」，可限定可讀寫的路徑範圍。
3. **Memory server** — knowledge graph-based 的持久記憶系統，讓 LLM 跨對話保留結構化記憶。
4. **Sequential Thinking server** — 引導模型做多步推理的輔助 tool。
5. **FastMCP / EasyMCP** — 社群開發的高階框架，封裝 SDK 細節讓 server 開發更快。
6. **Servers-archived repo** — 過去官方整合（GitHub、GitLab、Google Drive、Brave Search、PostgreSQL）的歸檔位置，現由社群接手。

## 對 CS146S 的意義

這個 repo 是動手做 MCP server 的最佳起點 — 上課作業要實作 server 時，先 clone 一個 reference（如 Filesystem 或 Memory），對照 SDK 文件改成自己的需求，比從零寫快非常多。

## 對 Vibe Coder 的 Takeaway

想把家教題庫、研究資料庫、或自己寫的 R script 包成 Claude 可呼叫的 tool？先讀 Memory server 的 source code（最短、最完整、TypeScript 寫的），抄它的結構就能跑出第一個 prototype。Production 部署再考慮 access control 與 audit log。

## 原文連結

[Sample MCP Server Implementations](https://github.com/modelcontextprotocol/servers)
