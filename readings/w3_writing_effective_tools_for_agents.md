---
week: 3
title: "Writing Effective Tools for Agents"
source_url: "https://www.anthropic.com/engineering/writing-tools-for-agents"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# Writing Effective Tools for Agents

> **一句話摘要**：給 AI agent 的 tool 不是傳統 API — agent 是 non-deterministic 的 caller，tool 設計要少而精、命名清楚、output 給 agent 看不是給開發者看，並用 evaluation-driven 方式 iterate。

## 核心論點（150-200 字繁中）

Anthropic engineering team 把 tool design 視為「deterministic 系統與 non-deterministic agent 之間的橋樑」— 同樣的輸入 agent 可能給不同回應，所以 tool 設計哲學跟傳統 API 不同。五個核心原則：(1) **Strategic Tool Selection** — 不要把每個 API endpoint 都 wrap 成 tool，agent context 有限，tool 越多反而 confuse（呼應 Drew Breunig 的 context confusion）；ex. 與其給 `list_users` + `list_events` + `create_event` 三個 tool，不如給一個 `schedule_event` 直接處理 availability check + scheduling。(2) **Meaningful Naming** — 用 namespace prefix（`asana_search` / `asana_projects_search`）讓 agent 容易選對 tool。(3) **Contextual Response Design** — output 不要塞 UUID / MIME type 這類 agent 看不懂的 token，換成 semantic 名稱；提供 `response_format=concise|detailed` 讓 agent 自選詳簡。(4) **Token-Efficient Implementation** — pagination、filter、truncation 要有合理 default，截斷時告訴 agent 怎麼拿剩下的。(5) **Descriptive Specifications** — tool description「像在跟新進員工解釋」，把 implicit knowledge 寫明（query format、術語、resource 關係）；用 `user_id` 而非 `user`。Error handling 不要丟 opaque error code，要給 actionable 改善建議。最後是 **evaluation-driven development**：用真實 case 測、跑 eval、看 transcript、用 Claude Code 自己迭代 tool implementation。

## 關鍵概念

1. **Tool（工具）** — 給 agent 用的 callable function，需考慮 non-deterministic caller 的特性，不能照搬 API design。
2. **Strategic Tool Selection（策略性 tool 選擇）** — 少而精、聚焦 high-impact workflow；tool 數量過多會引發 context confusion。
3. **Tool Consolidation（tool 合併）** — 把多個 low-level operation 合併成一個 high-level tool，減少 agent 的 orchestration 負擔。
4. **Semantic Output（語意化輸出）** — Tool output 用 agent 看得懂的 semantic 名稱取代 UUID / MIME type；token 用在 signal 不是 noise。
5. **Response Format Parameter** — 讓 agent 用 `concise` / `detailed` 自選 verbosity，避免不必要的 token 消耗。
6. **Actionable Error Message（可行動錯誤訊息）** — Error 要告訴 agent 怎麼修，不是丟 error code 然後期望 agent 自己 google。
7. **Evaluation-Driven Tool Development** — 用真實 task + agent transcript 衡量 tool 品質，再用 agent 本身迭代 tool 設計。

## 對 CS146S 的意義

Week 3 三主題（PRD / context engineering / tool design）裡，tool design 是最 concrete 的工程議題。這篇直接給工程 best practice，是 Week 4+ 學生自己實作 agent / MCP server 時的 reference。連結到 Drew Breunig 的 context confusion failure mode — 給 19 個 tool agent 還能用、46 個就崩，這篇就是教怎麼避免變成那 46 個。

## 對 Vibe Coder 的 Takeaway

寫自己的 MCP server / Claude skill 時三個立刻能用的原則：(1) 不要每個 function 都 export 成 tool，先想 user 的真正 workflow，合併成 1-3 個高層 tool；(2) tool description 寫到「我新進的 RA 看完就會用」的程度，不要假設 Claude 比 RA 聰明；(3) error 訊息給 fix instruction，不要丟 stack trace。對醫療 statistics tool 也適用 — 與其給 `load_data` + `clean_data` + `run_cox` 三個 tool，給一個 `cox_regression(data_path, time_col, event_col, ...)` 對 agent 友善太多。

## 原文連結

[Writing Effective Tools for Agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
