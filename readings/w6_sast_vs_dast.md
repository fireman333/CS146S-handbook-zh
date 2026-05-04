---
week: 6
title: "SAST vs DAST"
source_url: "https://www.splunk.com/en_us/blog/learn/sast-vs-dast.html"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# SAST vs DAST

> **一句話摘要**：SAST（白箱、看 source code）與 DAST（黑箱、跑 runtime 攻擊）是兩種互補的 application security testing 方法，現代 pipeline 應整合兩者並可加入 RASP 形成多層防禦。

## 核心論點（150-200 字繁中）

文章把 application security testing 分成兩大典範：**SAST（Static Application Security Testing，靜態應用程式安全測試）** 是 white-box 方法，在不執行程式的情況下掃描 source code 或 binary，於 SDLC（software development lifecycle）早期就可揪出 SQL injection、XSS（cross-site scripting，跨站腳本攻擊）、buffer overflow（緩衝區溢位）等 coding flaw；**DAST（Dynamic Application Security Testing，動態應用程式安全測試）** 則為 black-box 方法，對 running application 模擬真實外部攻擊，可抓出 server misconfiguration、authentication（驗證）漏洞等只在 runtime 才會浮現的問題。SAST 早期便宜但 false positive 率高，DAST 較貼近真實攻擊但發現晚、修復成本高。最佳實務是把兩者整合進 CI/CD pipeline，並可進一步加入 RASP（Runtime Application Self-Protection，執行期自我保護）形成全生命週期的多層防禦。

## 關鍵概念

1. **SAST（Static Application Security Testing，靜態應用程式安全測試）** — White-box；不執行程式、直接掃描 source code 或 binary 找漏洞，常用 pattern matching、data flow analysis、control flow analysis。
2. **DAST（Dynamic Application Security Testing，動態應用程式安全測試）** — Black-box；對 running application 從外部送入 malicious request、觀察回應，模擬真實攻擊者視角。
3. **RASP（Runtime Application Self-Protection，執行期自我保護）** — 嵌進 application server 內部，runtime 監控行為並即時 block 惡意動作，是 SAST/DAST 的補充。
4. **False positive vs false negative** — SAST 常有大量 false positive 需人工 review；DAST false positive 少，但漏抓深層 code-level bug 的 false negative 風險高。
5. **CI/CD integration** — SAST 接 IDE 與 commit hook 即時 feedback；DAST 在 staging 環境跑，兩者皆可自動化進 pipeline。

## 對 CS146S 的意義

這篇是 W6 「AI Testing and Security」的入門背景，建立 vulnerability（系統病灶）的兩大檢測典範詞彙。後續所有 AI-assisted security tooling（Semgrep + Claude Code、O3 找 CVE）都仍落在 SAST／DAST 框架的延伸上，理解原本的 trade-off（早期/晚期、深度/廣度、白箱/黑箱）才能看出 LLM 帶來什麼新東西。

## 對 Vibe Coder 的 Takeaway

別以為 commit 前用 IDE 跑一次 lint 就算「測過 security」。Push 之前至少跑一次 SAST tool（Semgrep、CodeQL、SonarQube 都有 free tier），deploy 後再用 DAST（OWASP ZAP）對 staging 打一輪。Vibe coding 最容易踩的是把 user input 直接拼進 SQL 或 shell command，這類 injection bug 是 SAST 的強項，幾秒鐘就可掃出來。

## 原文連結

[SAST vs DAST](https://www.splunk.com/en_us/blog/learn/sast-vs-dast.html)
