---
week: 1
title: "AI Prompt Engineering: A Deep Dive"
source_url: "https://www.youtube.com/watch?v=T9aRN5JkmL8"
source_type: "youtube"
fetched_at: "2026-05-02"
status: complete
---

# AI Prompt Engineering: A Deep Dive

> **一句話摘要**：（基於既有知識的高層摘要，未抓取逐字稿）Anthropic 內部 prompt engineer 圓桌討論，主張寫 prompt 的本質是「清楚思考並把任務說清楚給一個沒有上下文的聰明同事」，並透過實戰故事拆解 system prompt、example、structured output、edge case 等實務細節。

## 核心論點（150-200 字繁中）

Anthropic 這場圓桌（Alex Albert 主持，Amanda Askell、David Hershey、Zack Witten、Sander Schulhoff 參與）把 prompt engineering 重新框成**「精確思考與技術寫作的混合工作」**——好 prompt 的關鍵不是奇技淫巧，而是把任務要求講清楚到「一個聰明但完全不認識你公司、不知道你資料、沒看過你產品的 contractor」也能照做。實務上他們強調幾個重點：(1) **靠近 model 的直覺**——多跟 model 對話、看它怎麼讀你的 prompt；(2) **read the model output as data**——把 model 失敗 case 當 debug 訊號而非 bug；(3) **system prompt vs user prompt 分工**——persistent context、規則放 system，task-specific 放 user；(4) **few-shot 不只是給格式**——examples 同時定義「你期望什麼樣的推理路徑」；(5) **enterprise prompting 與 research prompting 不同**——前者要處理 edge case 與 long tail，後者追究極限能力；(6) **prompt 要為未來的 model 設計**——把「現在 model 蠢所以加 hack」與「描述任務本質」分開寫。

## 關鍵概念

1. **System prompt** — 跨對話 persistent 的角色與規則設定
2. **Multi-shot / few-shot examples** — 用範例同時傳遞格式與推理風格
3. **Structured output** — 用 XML tag、JSON schema 等強制 model 產出可被下游解析的格式
4. **Honest failure mode** — 與其逼 model 假裝會，不如教它在不確定時明說
5. **Edge case enumeration** — Enterprise 場景必須窮舉 long-tail 異常輸入
6. **Chain-of-Thought scratchpad** — 讓 model 在 `<thinking>` 區塊先推理再給答案
7. **Prompt as documentation** — 寫 prompt 等於寫「如何完成這個任務」的 SOP

## 對 CS146S 的意義

W1 用這部當「業界一線 prompt engineer 怎麼想 prompt」的視角，補足 Karpathy 偏 model 內部的視角，讓學生看到 prompt engineering 在工業實務中是什麼樣子。

## 對 Vibe Coder 的 Takeaway

寫 prompt 卡住時，問自己「如果今天請一個聰明 contractor 做這事，我會怎麼寫 brief？」答案通常就是好 prompt。把 system / user / examples / structured output 四個槽位填好再去調語氣。

## 原文連結

[AI Prompt Engineering: A Deep Dive](https://www.youtube.com/watch?v=T9aRN5JkmL8)
