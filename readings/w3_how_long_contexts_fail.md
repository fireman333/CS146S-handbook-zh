---
week: 3
title: "How Long Contexts Fail (and How to Fix Them)"
source_url: "https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# How Long Contexts Fail (and How to Fix Them)

> **一句話摘要**：百萬 token context window 不等於更好的回答 — context 過載會引發四種特定 failure mode（poisoning / distraction / confusion / clash），agentic 系統尤其受傷。

## 核心論點（150-200 字繁中）

Drew Breunig 直接打破「context 越大越好」這個假設。frontier model 雖然支援 1M+ token context，但實際使用時 context 越塞越多反而讓 agent 行為崩壞。他歸納出四種 failure mode，每一種都跟 agentic loop（多輪、長 context）強相關：(1) **context poisoning** — hallucination（幻覺）一旦寫進 context 就會被反覆引用，越錯越深；(2) **context distraction** — context 超過某個 threshold（小模型 ~32k、大模型 ~100k）後，模型會偏向「重複歷史 action」而非用 train 出來的 reasoning 重新規劃；(3) **context confusion** — 跟當前任務無關的資訊（例如過多 tool definition）也會干擾決策，Berkeley Function-Calling Leaderboard 顯示 8B 模型給 19 個 tool 還能用、46 個就崩；(4) **context clash** — 新資訊跟舊 context 衝突時 reasoning 會壞掉，多輪對話「拐錯一個彎就回不來」（Microsoft/Salesforce 研究顯示分輪餵相同資訊比一次性餵下降 39%）。修復方向：dynamic tool loading + context quarantine（隔離區）。

## 關鍵概念

1. **Context Poisoning（脈絡中毒）** — Hallucination 被寫入 context 後反覆 self-reference，agent 朝不可能的目標前進（Gemini Pokémon 例）。
2. **Context Distraction（脈絡分心）** — Context 過長時模型過度依賴歷史，不再用 reasoning，傾向 repeat past action。
3. **Context Confusion（脈絡混淆）** — 不相關資訊（多餘 tool、無關文件）干擾選擇；tool 越多 function-calling accuracy 越差。
4. **Context Clash（脈絡衝突）** — 新舊資訊矛盾時 reasoning 崩潰；多輪對話一旦走偏無法恢復。
5. **Context Quarantine（脈絡隔離區）** — 把易污染或一次性的 context 隔到 sub-agent / 獨立 window，避免污染主 reasoning。

## 對 CS146S 的意義

這篇是 context engineering 的「failure mode catalog」。Week 3 的 PRD / spec / tool design 都是在處理同一件事：**主動管理 context**，而不是把所有東西丟進去讓 model 自己挑。理解四種 failure 才能設計對應 mitigation（subagent、tool 精簡、compaction）。

## 對 Vibe Coder 的 Takeaway

長 session 越改越壞通常不是 model 變笨，是 context 中毒了。三個 quick fix：(1) Claude Code `/clear` 或開新 session；(2) 一個任務只給必要的 file，不要整個 repo 全 attach；(3) 發現 agent 重複犯同一個錯時，**不要繼續解釋**，直接重啟並把正確結論寫進 spec / CLAUDE.md。對寫 statistics analysis script 也同理 — 一個 dataset 一個 session，不要混著做。

## 原文連結

[How Long Contexts Fail (and How to Fix Them)](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html)
