---
week: 3
title: "Specs Are the New Source Code"
source_url: "https://blog.ravi-mehta.com/p/specs-are-the-new-source-code"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# Specs Are the New Source Code

> **一句話摘要**：當 AI 把實作速度推到極致，真正的「source of truth」不再是 code，而是描述意圖的 specification（規格書），spec-writing 因此成為 PM 與工程師最關鍵的技能。

## 核心論點（150-200 字繁中）

Ravi Mehta 借 Sean Grove 的話比喻：傳統世界是 source code（人讀）→ binary（機器讀），AI 時代等於「把 source 撕碎，反而謹慎 version control 那個 binary」— 因為 code 只是 intent 的 lossy projection（有損投射），spec 才是完整需求。AI 把 implementation（實作）的時間從週縮到分鐘，但「理解 customer 需要什麼」仍是人類速度的工作，這個 gap 讓 spec 變成最有價值的 artifact（產物）。Spec 的功能是雙向的：對人，是團隊對齊與辯論的依據；對 AI agent，是執行的精確指令。Workflow 也跟著反轉 — 過去是 idea → spec → prototype → 痛苦修改；現在是先 rapid prototype 拿真實 customer feedback，再回頭把學到的東西寫成精確 spec。寫得糊的 spec 會產生糊的 code，這個關係比以前更直接、更殘酷。

## 關鍵概念

1. **Specification（規格書）** — 描述 user-facing 行為與意圖的 artifact，AI 時代的真正 source of truth；code 只是 spec 的有損投射。
2. **Lossy Projection（有損投射）** — Code 相對於 intent 是壓縮過的結果，丟失了「為什麼這樣做」的完整 context；spec 保留完整需求才能讓 AI 重現相同產出。
3. **Spec-Driven Alignment（規格驅動對齊）** — Spec 同時對齊人與 AI 系統，是 PM、工程師、designer 共同辯論的 single source。
4. **Prototype-Then-Spec（先 prototype 再 spec）** — Workflow 反轉：用便宜的 prototype 收集 customer feedback，再凝結成 crystal-clear spec，避免「想像中的需求」被直接打成 code。
5. **Non-Technical Contribution（非工程師也能 contribute）** — 清楚的 spec 讓 PM、designer 不寫 code 也能 directly 影響 codebase（透過 AI assistant 把 spec 翻成 code）。

## 對 CS146S 的意義

這篇定義了整個 Week 3 的概念基底：The AI IDE 的核心不是「補完更快」，而是「intent → executable」的鏈條被重組。CS146S 教 PRD（product requirement document）、context engineering、spec-driven development 三件事的共通底層 — spec 才是 AI 時代的 contract，PRD 是 spec 的一個變體。

## 對 Vibe Coder 的 Takeaway

醫學生做 vibe coding 時，最常見的失敗是「腦袋裡有畫面但沒寫下來」就直接叫 AI 寫 code，結果改 N 次都不對。先寫 1 頁 spec（user 是誰、要做什麼、成功長怎樣），再丟給 AI agent — 5 分鐘 spec 換 2 小時 debug 不值得跳過。把 spec 當 artifact 維護，下次想加功能直接改 spec 重生 code，比逐行改 code 划算。

## 原文連結

[Specs Are the New Source Code](https://blog.ravi-mehta.com/p/specs-are-the-new-source-code)
