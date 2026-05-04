---
week: 6
title: "OWASP Top Ten (2021)"
source_url: "https://owasp.org/www-project-top-ten/"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# OWASP Top Ten (2021)

> **一句話摘要**：OWASP Top Ten 是社群維護、約四年更新一次的 web application 十大風險清單，2021 版以 incidence rate（發生率）取代 raw frequency 作為排序基準，是 secure coding 的入門共識。

## 核心論點（150-200 字繁中）

OWASP（Open Web Application Security Project，開放網頁應用程式安全計畫）是非營利組織，旗下最具影響力的產出就是 **OWASP Top Ten** — 一份「standard awareness document for developers and web application security」，被全球視為 secure coding 的第一步。2021 版（最新已 finalized 的版本，2025 版進行中）已被翻譯成 9 種語言，包含繁體與簡體中文。方法學上，OWASP 不再只看 raw vulnerability frequency，而是改用 **incidence rate**（每個 app 含至少一個某類 CWE 的機率），並區分「Human-assisted Tools」（高量、來自工具）與「Tool-assisted Human」（低量、來自人工 pen-test）兩類資料來源，搭配 CVSS（Common Vulnerability Scoring System）做嚴重度權重。資料來源涵蓋 security vendor、consultancy、bug bounty platform，accept verified 與 unverified contribution 但清楚標示。其價值在於提供開發團隊一個共同詞彙與排序，幫助 prioritize security effort。

## 關鍵概念

1. **OWASP（Open Web Application Security Project）** — 非營利社群組織，全球數百個 chapter，發布大量 open-source security 資源。
2. **OWASP Top Ten** — 約四年更新一次的 web app 十大風險清單，2021 版十類為 A01 Broken Access Control、A02 Cryptographic Failures、A03 Injection、A04 Insecure Design、A05 Security Misconfiguration、A06 Vulnerable Components、A07 Identification & Authentication Failures、A08 Software & Data Integrity Failures、A09 Security Logging Failures、A10 SSRF。
3. **CWE（Common Weakness Enumeration，共通弱點列表）** — MITRE 維護的弱點分類體系（如 CWE-79 = XSS），Top Ten 的每一類對應一組 CWE。
4. **CVSS（Common Vulnerability Scoring System）** — 0–10 分的漏洞嚴重度標準評分，用於 weighting。
5. **Incidence rate vs frequency** — Incidence rate = 「至少含一個」的 app 比例，避免少數高頻 app 灌水。

## 對 CS146S 的意義

OWASP Top Ten 是討論 application security 的 lingua franca。W6 後續所有 case study（Copilot RCE、agentic AI 攻擊、Semgrep 找的漏洞）都可對應到 Top Ten 的某一類 — A01（Broken Access Control = IDOR、BOLA）、A03（Injection = SQL injection、prompt injection 的類比）、A10（SSRF = agentic AI 偷 metadata token 的攻擊路徑）。掌握這份清單就有能力把零碎漏洞分類歸納。

## 對 Vibe Coder 的 Takeaway

寫 web app 之前花 30 分鐘讀完 Top Ten 每一類的範例。最常踩的三個是：A01 Broken Access Control（API 沒檢查 user 是否能看這筆資料）、A03 Injection（user input 直接拼進 SQL/shell/HTML）、A05 Security Misconfiguration（debug mode 上 production、CORS 全開、default password）。每寫一個 endpoint 自問「這條對 Top Ten 哪幾項有曝險？」。

## 原文連結

[OWASP Top Ten](https://owasp.org/www-project-top-ten/)
