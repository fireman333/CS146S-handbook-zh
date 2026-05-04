---
week: 2
title: "MCP Registry"
source_url: "https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/"
source_type: "blog"
fetched_at: "2026-05-02"
status: complete
---

# MCP Registry

> **一句話摘要**：MCP Registry 是 2025 年 9 月推出的官方 server discovery 中央目錄，採開源 + sub-registry 模式，避免單一 app store 壟斷又能維持跨生態系一致性。

## 核心論點（150-200 字繁中）

Registry 解決的是 MCP 生態系成長後最迫切的問題：「想用 server 的人找不到、寫 server 的人沒地方掛」。在沒有官方目錄前，server 散在 GitHub repo、社群清單、各 client 自家 directory，缺一個 single source of truth。MCP Registry（registry.modelcontextprotocol.io）以 open API + OpenAPI spec 形式提供，server 維護者照 quickstart 提交，client 維護者透過 documented API 抓資料。Registry 刻意**不**做 app store — 不做 pre-screening、不收費、不壟斷分發，反而鼓勵 sub-registry 架構：MCP client 可以在 upstream registry 之上做 curated marketplace（精選清單）、企業可建 private sub-registry 維持 internal compliance。Moderation 採社群驅動：使用者 flag 違規 → registry maintainer 審核後 denylist。這個 federation-friendly 設計保留多元解讀空間，又靠共享 schema 維持一致性。

## 關鍵概念

1. **MCP Registry** — registry.modelcontextprotocol.io，官方中央目錄，2025-09-08 進入 preview。
2. **Sub-registry（子目錄）** — 基於 upstream registry 的衍生目錄，可 public（curated marketplace）或 private（企業內網）。
3. **OpenAPI spec** — Registry 對外開放的 API schema，任何人可基於此做 compatible 工具。
4. **Single source of truth（單一事實來源）** — Registry 的設計目標：所有 server metadata 以此為準。
5. **Community moderation** — 不做 pre-screening，靠 user 提 issue → maintainer denylist 的 reactive 模式。
6. **Namespace** — Server 在 registry 裡的命名空間，避免名稱衝突並標示維護者。
7. **Federation 模式** — 不把所有人都收進中央，而是讓 sub-registry 分擔 curation 與 hosting。

## 對 CS146S 的意義

理解 MCP 的 distribution layer。Server 寫得再好，沒人找得到也沒用 — Registry 是 ecosystem 從「protocol」走到「marketplace」的關鍵基礎建設。CS146S 討論 platform design 時，這個 federation vs centralization 對比是經典案例。

## 對 Vibe Coder 的 Takeaway

寫完 MCP server 第一件事：到 Registry 提交。免費、無審核延遲、提交完別人就能在 Claude Desktop 之類的 client 內搜到。但記得：Registry 是 metadata catalog，不是 hosting — server 還是要自己跑（local stdio 或 Cloudflare Workers 之類的 remote）。

## 原文連結

[MCP Registry](https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/)
