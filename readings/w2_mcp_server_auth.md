---
week: 2
title: "MCP Server Authentication"
source_url: "https://developers.cloudflare.com/agents/guides/remote-mcp-server/#add-authentication"
source_type: "blog"
fetched_at: "2026-05-02"
status: complete
---

# MCP Server Authentication

> **一句話摘要**：Cloudflare 這篇文件示範如何在 remote MCP server 加上 OAuth 2.0 認證，讓 server 從「人人可用」升級成「user 登入後才能呼叫 tool」的多租戶服務。

## 核心論點（150-200 字繁中）

Remote MCP server（部署在 Cloudflare Workers 上的 HTTP server）一旦對外開放，就需要回答「誰能呼叫我的 tool？」這個問題。Cloudflare 提出兩條路：(1) **Cloudflare Access OAuth**，把 GitHub / Google 等 identity provider 的驗證委託給 Cloudflare 平台，policy 在 request 層執行；(2) **第三方 OAuth provider**（文中以 GitHub 為例），讓開發者自己整合任何 OAuth 2.0 服務。整個架構由 `OAuthProvider` class 統籌，配置四個關鍵 endpoint：API route（`/mcp`）、authorization endpoint、token endpoint、client registration endpoint。`defaultHandler` 負責把未認證的請求導向 OAuth flow，認證通過才能進入 tool 呼叫。實作上需建 OAuth app、設環境變數、用 Wrangler CLI 存 secret、設 KV namespace 管 session；測試則靠 MCP Inspector 走完 OAuth flow 驗證 token 有效性。

## 關鍵概念

1. **OAuth 2.0** — 業界標準的授權協定，讓 user 不交密碼也能授權第三方 app 存取資源。
2. **OAuthProvider** — Cloudflare Workers 提供的 class，集中管理 authorization / token / client registration endpoint。
3. **defaultHandler** — 攔截未認證請求並導向 OAuth flow 的 gateway 角色。
4. **Cloudflare Access** — Cloudflare 的 identity aggregation 平台，可串接 GitHub / Google 等 IdP（identity provider，身分提供者）。
5. **Wrangler CLI** — Cloudflare Workers 的部署工具，用來把 OAuth secret 安全存進 production 環境。
6. **KV namespace** — Cloudflare 的 key-value 儲存，用來持久化 OAuth session 與 token。
7. **MCP Inspector** — 官方測試工具，提供 GUI 走完 OAuth flow 並驗證 authenticated tool 呼叫。

## 對 CS146S 的意義

這篇補上了「MCP server 從 hobby project 走向 production」的關鍵環節。Local stdio server 不用考慮 auth，但只要做 remote server，OAuth 就是繞不開的議題。CS146S 課程要設計 multi-user MCP 服務的話，這套 pattern 是基準。

## 對 Vibe Coder 的 Takeaway

如果你的 vibe coding 作品想讓朋友/同事用，又不想全世界都能呼叫 — 用 Cloudflare Workers + OAuthProvider 是門檻最低的 hosting 方案。免費 tier 夠跑大部分 prototype，且 GitHub OAuth 30 分鐘就能設好。**不要**把 secret 寫進 source code，永遠用 Wrangler `secret put` 注入。

## 原文連結

[MCP Server Authentication](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#add-authentication)
