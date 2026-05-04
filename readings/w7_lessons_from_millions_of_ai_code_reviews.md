---
week: 7
title: "Lessons from Millions of AI Code Reviews"
source_url: "https://www.youtube.com/watch?v=TswQeKftnaw"
source_type: "youtube"
fetched_at: "2026-05-02"
status: "complete"
---

# Lessons from Millions of AI Code Reviews

> **一句話摘要**：Graphite co-founder Tomas Reimers 用 2x2 quadrant（LLM 能否 catch × human 是否 want to receive）解釋為什麼 AI code reviewer 必須只留「右上象限」comment，並以「comment 是否導致 code 改動」當作 metric，把 Diamond 推到與 human reviewer 並駕齊驅的 52% action rate。

## 核心論點（150-200 字繁中）

Reimers 的演講源自 Graphite 開發 Diamond（AI code reviewer）的實戰經驗。他先承認 raw LLM review 的失敗模式：模型會自信地留下「revert this code」「CSS doesn't work this way（其實會）」這類錯誤 comment，徹底耗損 user trust。關鍵 insight 是用 2x2 quadrant 把 comment 分類：縱軸 = LLM 能否 reliably catch、橫軸 = human 是否 want to receive。**只有右上象限**（LLM 能 catch 且 human 想收）的 comment 該被留下。LLM 不擅長：codebase-specific convention（住在資深工程師腦中、沒文件）。Human 不想收但 LLM 愛留：add test、extract function、comment this 等 always-correct-but-unwelcome nit。Metric 設計也是核心：他們選用「**comment 是否導致 author 改 code**」當作 success metric，因為 thumbs-up/down 收集率太低（<4% 下票率沒區辨力）。Human reviewer 的 comment 約 50% 帶來 action，Diamond 經過調校到 March 已達 52%，等同 human baseline。

## 關鍵概念

1. **Diamond** — Graphite 的 AI code reviewer 產品，串 GitHub PR 自動找 bug。
2. **LLM-Capability × Human-Wantedness Quadrant** — 把 comment 分類的 2x2 框架，只留右上象限。
3. **Action Rate Metric（行動率指標）** — Comment 是否導致 author 在該 PR 中改 code，比 thumbs-up/down 更有區辨力的 success metric。
4. **Codebase-Specific Convention Blind Spot** — LLM 對「住在資深工程師腦中、沒寫成文件」的 convention 完全抓不到。
5. **Always-Correct-But-Unwelcome Comment** — 「add test / extract function」這類技術上沒錯但 reviewer 不該無腦留的 comment，是 LLM 的常見 over-call。
6. **52% vs 50% Parity** — Diamond 的 action rate 已追平 human reviewer baseline，是 Reimers 的核心 claim。

## 對 CS146S 的意義

這是 Week 7 最 practical 的 industry talk — 給 Diamond 內部 metric 與 prompt evolution 的 first-hand 故事。Reimers 的 quadrant 框架是課程整合 5 篇 reading 的最佳工具：Atwood / Vessels / Smith 講的 human review 原則 → 對應到 quadrant 的「human-wantedness 軸」；AutoCommenter / Graphite guide 講的 false positive 控制 → 對應「LLM-capability 軸」。Action rate 52% 也提供了一個可量化的「AI reviewer 何時算成功」門檻，比模糊的 user satisfaction 更可被 benchmark。

## 對 Vibe Coder 的 Takeaway

評估自己的 AI reviewer 設定時，問兩個問題：(1) 它留的 comment 我有沒有真的去改？（< 30% 就該調 prompt 或換工具）(2) 它有沒有對 codebase-specific convention 留錯 comment？有 → 加 system prompt 把該 convention 寫進去（這就是 LLM 的 blind spot 補強法）。也別期待 AI reviewer 100% 對 — 50% action rate 是 human baseline，Diamond 也才剛追平。

## 原文連結

[Lessons from Millions of AI Code Reviews](https://www.youtube.com/watch?v=TswQeKftnaw)
