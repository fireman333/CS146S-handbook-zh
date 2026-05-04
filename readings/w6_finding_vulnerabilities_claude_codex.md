---
week: 6
title: "Finding Vulnerabilities in Modern Web Apps Using Claude Code and OpenAI Codex"
source_url: "https://semgrep.dev/blog/2025/finding-vulnerabilities-in-modern-web-apps-using-claude-code-and-openai-codex/"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# Finding Vulnerabilities in Modern Web Apps Using Claude Code and OpenAI Codex

> **一句話摘要**：Semgrep 對 11 個真實 Python web app（>800k LoC）跑 Claude Code 與 OpenAI Codex 找漏洞，找到真正 vulnerability 但 false positive 率 80%+、且結果 non-deterministic，結論是 LLM 不是 silver bullet，要與傳統 SAST 混合用。

## 核心論點（150-200 字繁中）

Semgrep 團隊用 Anthropic Claude Code（Sonnet 4）與 OpenAI Codex（o4-mini）對 11 個 actively maintained 的開源 Django/Flask/FastAPI 專案（共 >800,000 LoC）跑 security audit，鎖定 6 類漏洞：authentication bypass、IDOR、path traversal、SQL injection、SSRF、XSS。結果 Claude Code 找到 46 個真實漏洞、Codex 找到 21 個，但兩者 false positive 率分別高達 86% 與 82%。Claude 強在 IDOR（22% TPR）、Codex 反而強在 path traversal（47% TPR），但兩者都嚴重缺乏 inter-procedural taint flow tracking 能力，injection 類漏洞偵測極差。最警訊的是 non-determinism — 同一份 code 跑三次，發現 3、6、11 個不同 bug，源於 LLM 的 lossy context compaction。結論：LLM 已經能找真實 bug，但需與傳統 rule-based SAST tool 結合，不能單獨用。

## 關鍵概念

1. **IDOR（Insecure Direct Object Reference，不安全直接物件參照）** — API 沒檢查 user 權限就回傳指定 ID 的資料，攻擊者改 ID 即可看別人的資料。
2. **SSRF（Server-Side Request Forgery，伺服器端請求偽造）** — 騙 server 對內部網路或 metadata service 發 HTTP request。
3. **Inter-procedural taint flow** — 追蹤 user input（被「污染」的資料）跨多個 function、檔案流動到 dangerous sink 的能力，是傳統 SAST 強項、LLM 弱項。
4. **False positive rate** — 報告為 vulnerability 但實際不是的比例；80%+ 表示十個警報只有兩個是真。
5. **Context rot / non-determinism** — LLM 處理大 codebase 時做 lossy summarization，同 prompt 跑多次結果不一致。

## 對 CS146S 的意義

這是一篇實證打臉「LLM 取代 SAST」狂熱的實驗。它清楚示範 LLM 在哪類任務有用（contextual reasoning、跨檔案 architectural pattern）、在哪類任務拉胯（taint tracking、deterministic coverage），對 W6 的 AI security tooling 討論提供關鍵的 baseline data。也順帶引出下一篇 context rot 的延伸閱讀。

## 對 Vibe Coder 的 Takeaway

請 Claude Code 「幫我 audit 這個 repo」可能找到真 bug，但別以為跑一次就安全。實務上：(1) 跑多次（≥3）取聯集；(2) 把警報當「嫌疑名單」而非結論，每條都人工 verify；(3) 仍要跑 Semgrep/CodeQL 等 deterministic tool 補強 injection 類盲區；(4) 把 prompt 鎖定特定 vulnerability class 而非「找所有漏洞」可降 false positive。

## 原文連結

[Finding Vulnerabilities in Modern Web Apps Using Claude Code and OpenAI Codex](https://semgrep.dev/blog/2025/finding-vulnerabilities-in-modern-web-apps-using-claude-code-and-openai-codex/)
