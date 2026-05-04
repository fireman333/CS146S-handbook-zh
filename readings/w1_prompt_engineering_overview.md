---
week: 1
title: "Prompt Engineering Overview"
source_url: "https://cloud.google.com/discover/what-is-prompt-engineering"
source_type: "blog"
fetched_at: "2026-05-02"
status: complete
---

# Prompt Engineering Overview

> **一句話摘要**：Google Cloud 的 prompt engineering 入門頁，定義 prompt 為「給 AI 的輸入」、prompt engineering 為「設計與優化 prompt 引導 LLM 產出期望結果的藝術與科學」，並列出 prompt 設計四要素與五種常見 prompt 類型。

## 核心論點（150-200 字繁中）

這篇 Google Cloud 文章把 prompt engineering 定位為**「為 AI 設計 roadmap」**——透過精心設計 context、instructions、examples 來引導 LLM 產出期望輸出。文章主張有效 prompt 取決於四個要素：(1) **prompt format（格式）**——自然語言問句、直接指令或結構化輸入，須配合 model 偏好；(2) **context and examples（情境與範例）**——提供任務背景與少量示範，能顯著提升輸出品質；(3) **fine-tuning and adapting（微調與適應）**——根據 model 回饋持續優化 prompt；(4) **multi-turn conversations（多輪對話）**——設計能保持 context-aware 的連續對話。文章把 prompt 分成 zero-shot（直接問）、one/few/multi-shot（給範例）、chain-of-thought（要求逐步推理）、zero-shot CoT（CoT + 直接問的混合）四大類，並用 creative writing、summarization、translation、dialogue、open-ended Q&A 等具體 use case 示範如何套用。

## 關鍵概念

1. **Prompt** — 給 AI model 的輸入（問題、指令、範例都算）；prompt 品質直接決定 output 品質
2. **Zero-shot prompting（零樣本提示）** — 直接給指令、不給範例，靠 model 內建知識回答
3. **Few-shot prompting（少樣本提示）** — 在 prompt 內塞 1～多個 input-output pair 當示範
4. **Chain-of-Thought prompting（思維鏈提示，CoT）** — 引導 model 把複雜推理拆成中間步驟
5. **Zero-shot CoT** — 不給範例但加「let's think step by step」之類指示，混合兩者優點
6. **Multi-turn conversations** — 設計能維持 context 的連續對話結構

## 對 CS146S 的意義

W1 用這篇建立 prompt engineering 的標準詞彙表 — zero-shot / few-shot / CoT 是後續所有討論的基本構件，也讓沒接觸過的學生對「prompt 是可被工程化的物件」有初步認知。

## 對 Vibe Coder 的 Takeaway

寫 Claude / Gemini prompt 時心裡先過四個 checklist：format 對不對、有沒有給 context 與 example、需不需要 CoT 拆步驟、是否多輪。光是養成「給範例 + 拆步驟」的習慣，產出品質就會明顯提升。

## 原文連結

[What is prompt engineering?](https://cloud.google.com/discover/what-is-prompt-engineering)
