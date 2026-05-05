---
week: 6
title: "Context Rot: Understanding Degradation in AI Context Windows"
source_url: "https://research.trychroma.com/context-rot"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# Context Rot: Understanding Degradation in AI Context Windows

> **一句話摘要**：Chroma 對 18 個 SOTA LLM 跑擴展版 NIAH benchmark 證實 context rot — 即使 context window 號稱百萬 token，模型在第 10,000 token 的可靠度顯著低於第 100 token，且 distractor、coherent narrative、low semantic similarity 都會加劇衰減。

## 核心論點（150-200 字繁中）

Chroma Research 挑戰業界「context window 變大 = 模型一樣可靠」的假設，對 GPT-4.1、Claude 4、Gemini 2.5 等 18 個 SOTA 模型跑系統化測試，發現 **context rot（上下文腐爛）**：input 越長、performance 越不穩，即使是極簡任務也一樣。實驗在傳統 NIAH（Needle in a Haystack，大海撈針）基礎上加入四個新維度：(1) **Needle-question similarity** — 語意相似度低的 query/needle pair 衰減更快；(2) **Distractor impact** — 即使一個 distractor（干擾項）就會降效，且不同 distractor 影響不一致；(3) **Haystack structure** — 反直覺地，coherent 有邏輯的 haystack 反而比 shuffled 雜亂版讓模型表現更差，暗示 attention 機制被結構性敘事干擾；(4) **Repeated words** — 超過 2,500 字的 exact replication task 開始出現拒答、亂寫、位置錯置。LongMemEval 對話實驗也顯示「給整段對話 history」比「只給相關片段」表現顯著差，即使開 reasoning mode 也無法補。結論：context engineering（如何排版、置入相關資訊）比 context length 本身更重要。

## 關鍵概念

1. **Context rot（上下文腐爛）** — LLM 在長 input 下 performance 隨 token 數量非均勻衰減的現象，即使任務簡單也會發生。
2. **NIAH（Needle in a Haystack）benchmark** — 把一句已知 fact「needle」藏進大段不相關文本「haystack」，測模型能否在末尾正確回答關於 needle 的問題。
3. **Needle-question similarity** — Needle 與 query 的語意相似度；低相似度需要 inferential reasoning，是衰減重災區。
4. **Distractor** — 與 needle 相關但非答案的混淆項；單一 distractor 就足以拉低 performance。
5. **Context engineering** — 透過 prompt 結構、資訊排序、片段選取主動降低 context rot 的工程實踐，是 RAG（Retrieval-Augmented Generation）系統的關鍵設計變數。

## 對 CS146S 的意義

這篇是上一篇 Semgrep 文中 non-determinism 現象的根因解釋。對 AI security testing 而言，context rot 直接威脅 audit 完整性 — 大 codebase 一次餵給 LLM，後段被掃過的 file 可能根本沒被「真的看到」。設計 AI 安全 pipeline 必須假設 context 是 lossy 的，要有 chunking 與多次採樣策略。

## 對 Vibe Coder 的 Takeaway

別把整個 repo 一次塞給 Claude / Cursor。實務原則：(1) 一個 prompt 只解一個 task、context 給最相關的 3-5 個檔案；(2) 對話越長越不可靠 — 進入 debug 階段考慮開新 session；(3) RAG 系統不是「retrieve 越多越好」，retrieve 5 個高相關片段勝過 retrieve 50 個包山包海；(4) 如果發現 model 開始亂答，先懷疑 context 太長，clear 後重來。

## 原文連結

[Context Rot: Understanding Degradation in AI Context Windows](https://research.trychroma.com/context-rot)
