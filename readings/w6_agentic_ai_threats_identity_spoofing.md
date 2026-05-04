---
week: 6
title: "Agentic AI Threats: Identity Spoofing and Impersonation Risks"
source_url: "https://unit42.paloaltonetworks.com/agentic-ai-threats/"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# Agentic AI Threats: Identity Spoofing and Impersonation Risks

> **一句話摘要**：Palo Alto Unit 42 示範 agentic AI 的 identity spoofing 攻擊 — 攻擊者可透過 prompt injection 騙 agent 從 cloud metadata service 偷 service account token、或藉 BOLA 越權讀他人資料；漏洞 framework-agnostic，源於 insecure design 而非 framework 本身。

## 核心論點（150-200 字繁中）

Unit 42 研究指出 agentic AI（autonomous 軟體 agent + LLM + 外部工具/API/DB）大幅擴張 attack surface，identity spoofing 成為新興 critical risk。研究員示範兩條主要攻擊路徑：(1) **Service account token exfiltration** — 攻擊者用惡意 prompt 操控 agent 的 code interpreter 去 query GCP metadata endpoint，把 service account access token 偷出來，等同拿到 cloud infra 的萬用鑰匙；(2) **BOLA（Broken Object Level Authorization，物件層級授權失敗）** — 直接請 agent「給我 user X 的交易紀錄」，underlying tool 沒檢查權限就回傳，達成跨 user 越權讀取。關鍵發現：以 CrewAI 與 AutoGen 兩個不同 framework 實作同樣 app，漏洞同樣存在 — 證明問題出在 insecure design pattern、misconfiguration、unsafe tool integration，而非 framework 本身。建議 layered defense：prompt hardening、code executor sandboxing、tool input sanitization、runtime content filtering。

## 關鍵概念

1. **Agentic AI（代理型 AI）** — 自主收集資料、做決策、呼叫外部 tool 達成多步驟目標的 AI 系統，與只回答 query 的 chatbot 不同。
2. **Identity spoofing / impersonation（身份偽冒）** — 攻擊者讓 agent 以 legitimate user 或 system 的身份發動操作，常透過偷取 credential 達成。
3. **BOLA（Broken Object Level Authorization）** — OWASP API Top 10 第一名漏洞；server 沒檢查使用者是否有權存取特定 object（如 user_id=123 的訂單）。
4. **Service account token / cloud metadata service** — 雲端 VM 內可從特定 IP（如 `169.254.169.254`）抓到自身 service account 的 access token，被偷走等同拿到該 service account 全部權限。
5. **Defense in depth（縱深防禦）** — Prompt hardening + sandbox + input sanitization + runtime filtering 多層疊加，沒有單一 mitigation 夠用。

## 對 CS146S 的意義

把 W6 的討論從「LLM 本身會講錯話」推進到「LLM agent 操作 enterprise infra 會被劫持」。它把 OWASP 等傳統 web security 概念（BOLA、SSRF）移植到 agentic AI 場景，提供具體 threat model 與 defense layering，是設計企業級 AI agent 必讀的 case。

## 對 Vibe Coder 的 Takeaway

自己寫 agent app 時：(1) tool 的 input 一律要 sanitize、authorization check 別假設 LLM 會幫你做；(2) code interpreter / shell tool 要關 outbound network 或 whitelist domain，特別封掉 metadata IP（`169.254.169.254`）；(3) system prompt 明確禁止 disclose credential；(4) 別把 production 級 token 放進 dev agent 的 env var。

## 原文連結

[Agentic AI Threats: Identity Spoofing and Impersonation Risks](https://unit42.paloaltonetworks.com/agentic-ai-threats/)
