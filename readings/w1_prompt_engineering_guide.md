---
week: 1
title: "Prompt Engineering Guide (Techniques)"
source_url: "https://www.promptingguide.ai/techniques"
source_type: "blog"
fetched_at: "2026-05-02"
status: complete
---

# Prompt Engineering Guide (Techniques)

> **一句話摘要**：DAIR.AI 維護的 Prompt Engineering Guide「Techniques」總覽頁，把當前 18 種主流 prompting 技巧整理成單一 catalog，從基本的 zero-shot 一路涵蓋到 ReAct、Reflexion、Graph Prompting 等 agent 級別技巧。

## 核心論點（150-200 字繁中）

這頁不是線性教學，而是一份**「prompting 技巧分類目錄」**——把社群與學界發表的 18 種技巧並列，定位為「進階 prompting 技巧，能完成更複雜任務、提升 LLM 可靠性與效能」。整體分布大致可分四層：(1) **基礎層**——zero-shot、few-shot；(2) **推理層**——Chain-of-Thought、Self-Consistency、Tree of Thoughts、Generate Knowledge Prompting；(3) **工具與外部資源層**——Retrieval Augmented Generation（RAG）、Automatic Reasoning and Tool-use（ART）、Program-Aided Language Models（PAL）、ReAct；(4) **自動化與 meta 層**——Automatic Prompt Engineer（APE）、Active-Prompt、Directional Stimulus Prompting（DSP）、Reflexion、Meta Prompting、Prompt Chaining、Multimodal CoT、Graph Prompting。讀者用法是「想解某類問題 → 翻 catalog 找對應技巧 → 點進子頁看 paper 與範例」，等同於 prompting 的 reference manual。

## 關鍵概念

1. **Chain-of-Thought（CoT，思維鏈）** — 要求 model 逐步推理而非直接給答案
2. **Self-Consistency（自洽）** — 同 prompt 跑多次取多數票，降低推理 variance
3. **Tree of Thoughts（ToT，思維樹）** — 把推理擴展成樹狀搜索，允許回溯
4. **ReAct** — Reasoning + Acting 交錯，讓 LLM 邊推理邊呼叫外部工具
5. **Reflexion** — Agent 對自己的 failure 做 self-critique，下一輪改進
6. **RAG（Retrieval-Augmented Generation，檢索增強生成）** — 先檢索外部文件再生成，降低 hallucination
7. **PAL（Program-Aided Language Models）** — 把 reasoning 委託給 generated code，避開 LLM 算術弱點
8. **Meta Prompting** — 用 prompt 去產生或優化另一個 prompt

## 對 CS146S 的意義

W1 用這頁當「prompting 技巧 map」，幫學生建立後續課程查表用的 mental index。後面幾週深入講解的技巧都能對應回這個 catalog。

## 對 Vibe Coder 的 Takeaway

把這頁 bookmark 起來當 cheat sheet — 遇到 model 答不好時先掃一遍 18 種技巧、挑一個最像對症的試。實務上 zero-shot → few-shot → CoT → RAG 這條升級路徑能解 80% 的問題。

## 原文連結

[Prompt Engineering Guide — Techniques](https://www.promptingguide.ai/techniques)
