---
week: 3
title: "Getting AI to Work In Complex Codebases (ACE-FCA)"
source_url: "https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md"
source_type: "github"
fetched_at: "2026-05-02"
status: "complete"
---

# Getting AI to Work In Complex Codebases (ACE-FCA)

> **一句話摘要**：AI 在 production codebase 表現差不是 model 不夠強，是 context engineering 不夠好；用 research → plan → implement 三段式 + frequent intentional compaction，才能在 brownfield 專案 ship 真正的 feature。

## 核心論點（150-200 字繁中）

humanlayer 團隊提出 ACE-FCA（Advanced Context Engineering for Coding Agents）的核心命題：「**context window 的內容是你影響 output 品質的唯一槓桿**」（agent 是 stateless function）。優先順序是 correctness → completeness → size → trajectory。框架核心是 **Frequent Intentional Compaction（FIC，頻繁主動壓縮）** 三段式 workflow：(1) **Research phase** — 主 agent 不寫 code，先了解 codebase、依賴關係、潛在 failure point，產出結構化 markdown；(2) **Plan phase** — file-level 精度的 implementation step、verification 策略、可平行產生多版 plan 比較 trade-off；(3) **Implement phase** — 照 plan 執行、每階段間 compact、context 維持 40-60% 使用率、在 isolated git worktree 工作。Subagent 用來隔離 expensive 操作（grep、檔案搜尋），避免污染主 reasoning。最關鍵的是 **high-leverage human review**：人類審查重心放在 research 與 plan 階段，**不是 code review** — 因為「plan 一行壞 = code 100 行壞」。實際成果：300k LOC 不熟的 Rust repo 幾小時內 fix bug、35k LOC feature 在 7 小時 pairing 完成。

## 關鍵概念

1. **Context Engineering（脈絡工程）** — 主動 curate 進入 agent context window 的內容，把 context 當 first-class artifact 管理而非副作用。
2. **Frequent Intentional Compaction（FIC，頻繁主動壓縮）** — 在每個 phase 邊界把過程資訊壓成結構化 summary，丟掉 raw exploration 的雜訊。
3. **Research → Plan → Implement** — 三段式 workflow；前兩段不寫 code，只有最後一段才產 code。
4. **Subagent Context Isolation（子代理隔離）** — Grep、檔案搜尋這類會產生大量 token noise 的操作派 subagent，主 agent 只接收 summary。
5. **High-Leverage Human Review（高槓桿人類審查）** — 人力放在 research / plan 而非 code，因為錯誤在前段被攔截 cost 最低。
6. **Spec-First Thinking（規格優先思維）** — 跟 Sean Grove / Ravi Mehta 同源：spec 是 source code，不是探索的副產品。

## 對 CS146S 的意義

這篇是 Week 3 最 actionable 的 reading — 把「context engineering」從口號落地成可執行 workflow。其他 reading 講為什麼（Specs Are New Source、Long Contexts Fail），ACE-FCA 講怎麼做。是貫穿 PRD / spec / tool design 三主題的橋樑。

## 對 Vibe Coder 的 Takeaway

醫學生做 vibe coding 最常掉的坑是「跳過 research / plan 直接讓 Claude Code 開寫」，遇到 brownfield（已有 codebase）就崩。三個落地動作：(1) 任何 non-trivial task 強迫先產 `plan.md`，自己 review 完才 implement；(2) grep / 找檔案派 subagent 跑，不要在主 session 做；(3) Claude Code session context 用到 60% 就 compact，不要硬撐到爆。對統計分析也適用 — 先寫 analysis plan、review、再讓 agent 跑 R script。

## 原文連結

[Getting AI to Work In Complex Codebases (ACE-FCA)](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md)
