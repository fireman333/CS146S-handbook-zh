---
week: 4
title: "How Anthropic Uses Claude Code"
source_url: "https://www-cdn.anthropic.com/58284b19e702b49db9302d5b6f135ad8871e7658.pdf"
source_type: "pdf"
fetched_at: "2026-05-02"
status: "complete"
---

# How Anthropic Uses Claude Code

> **一句話摘要**：Anthropic 內部 10 個團隊（含非工程部門如 legal、growth marketing、design）都把 Claude Code 當作日常工作流的核心，技術門檻被大幅壓低，跨領域協作的瓶頸從「能不能寫 code」轉成「能不能描述清楚需求」。

## 核心論點（150-200 字繁中）

這份 PDF 是 Anthropic 內部 power users 的訪談合輯，涵蓋 data infrastructure、product development、security engineering、inference、data science、API、growth marketing、product design、RL engineering、legal 共 10 個團隊。共通模式有三個：(1) **非技術人員大量使用** — finance、legal、design 透過 plain text workflow 把例行流程交給 Claude Code 自動執行，不必再請工程師寫 script；(2) **debugging 透過螢幕截圖 + 自然語言描述就能完成** — Kubernetes pod IP 耗盡、Google Cloud UI 導覽都能靠 Claude Code 一步步診斷；(3) **跨技能 gap 被填平** — 工程師可以 vibe-code 出設計稿、設計師可以改 production code、legal 團隊自動生成法規 mapping。文件強調 Anthropic 把 Claude Code 視為「team multiplier」而非「coding assistant」。

## 關鍵概念

1. **Plain text workflow** — 把流程用自然語言寫成 .txt 檔，丟給 Claude Code 執行，等同無 code 的 automation。
2. **Screenshot-driven debugging** — 把 dashboard / error UI 截圖丟給 Claude Code，由它逐步引導排查。
3. **Skill-gap bridging** — 非工程師（finance、legal、design）能完成過去需委外給工程師的 task。
4. **Agentic autonomy** — Claude Code 不只回答問題，而是自主探索、執行命令、迭代修正。
5. **Cross-functional adoption** — 採用率不限於 R&D，growth marketing、legal 等部門也是 power users。

## 對 CS146S 的意義

這篇是 Week 4「Coding Agent Patterns」的 first-hand evidence：Anthropic 自己怎麼吃自己的 dog food。對課程而言，它具體展示了 coding agent 不只是 productivity tool，而是組織內部 capability 重新分配的槓桿 — 工程資源從「寫 boilerplate」釋放到「設計 system」，非工程資源從「等工程師排程」變成「自己用 Claude Code 跑」。

## 對 Vibe Coder 的 Takeaway

非資工背景的人（如使用者本人）可以直接從這份 PDF 抓到三個 actionable pattern：(1) 把重複性流程寫成 plain text spec 而非學 Python；(2) 遇到 infra / debugging 卡關直接截圖丟 Claude Code；(3) 別預設「這超出我的技術範圍」— 試了再說。對醫學生 / RA 而言，把研究 pipeline、資料清理、文獻整理當成 plain text workflow 是最低門檻的切入點。

## 原文連結

[How Anthropic Uses Claude Code](https://www-cdn.anthropic.com/58284b19e702b49db9302d5b6f135ad8871e7658.pdf)
