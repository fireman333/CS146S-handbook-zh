---
week: 1
title: "Deep Dive into LLMs"
source_url: "https://www.youtube.com/watch?v=7xTGNNLPyMI"
source_type: "youtube"
fetched_at: "2026-05-02"
status: complete
---

# Deep Dive into LLMs

> **一句話摘要**：（基於既有知識的高層摘要，未抓取逐字稿）Karpathy 用 3.5 小時把 LLM 從 raw text 變成可用 chatbot 的整條 pipeline 拆給非專家看，重點是「LLM 是 token-level autocomplete + 後天 RLHF 微調出來的 helpful assistant」這個世界觀。

## 核心論點（150-200 字繁中）

Karpathy 主張要真正用好 LLM，必須先理解它**怎麼被造出來的**。整部影片把 ChatGPT 級別模型的生成過程拆成三段：(1) **pre-training（預訓練）**——抓網路 scale 的文本（FineWeb 等 dataset）做 next-token prediction，這階段產出的是 base model，本質上是「網路文件補全器」；(2) **post-training（後訓練）**——supervised fine-tuning（SFT）用人工標註的 conversation data 把 base model 變成會「對話」的 assistant；(3) **RLHF（reinforcement learning from human feedback，人類回饋強化學習）**——用 reward model 進一步把回答品質拉上來。理解這個 stack 後，hallucination（幻覺）、knowledge cutoff（知識截止）、tokenization 怪象、為什麼 LLM 不會數字母都變得可預測。Karpathy 也強調 LLM 在 capability spectrum 上分布極不均勻：某些任務遠超人類、某些任務（簡單算術、字元計數）卻離譜地差。

## 關鍵概念

1. **Pre-training（預訓練）** — 對網路 scale 的文本資料做 next-token prediction，產出 base model
2. **Post-training（後訓練）** — 用人工 conversation data 做 SFT，把 base model 轉成 assistant
3. **RLHF（reinforcement learning from human feedback，人類回饋強化學習）** — 用 reward model 進一步優化回答品質
4. **Hallucination（幻覺）** — Model 編造看似合理但不存在的內容，是 statistical pattern matching 的副產物
5. **Tokenization** — 把文字切成 token 的步驟，造成「數字母」「拼字」這類任務反常困難
6. **Capability spectrum（能力光譜）** — LLM 在不同任務上能力分布極不均勻，不能假設整體強就每件事都強

## 對 CS146S 的意義

W1 用這部影片建立 LLM 的 mental model — 後續所有 prompt engineering 技巧都建立在「LLM = pre-trained autocomplete + RLHF aligned assistant」這個底層認知上。沒有這層基礎，後面 prompt 技巧只會淪為 cargo cult。

## 對 Vibe Coder 的 Takeaway

知道 LLM 是 token-level next-token predictor 後，能解釋很多 weirdness：為什麼長 context 後段會掉資訊、為什麼 prompt 順序影響輸出、為什麼要 few-shot examples。寫 prompt 時把它想成「補全網路上會出現的下一段文字」比想成「跟人對話」更準確。

## 原文連結

[Deep Dive into LLMs](https://www.youtube.com/watch?v=7xTGNNLPyMI)
