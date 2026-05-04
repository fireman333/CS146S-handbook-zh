---
week: 9
title: "Week 9：Agents Post-Deployment"
title_zh: "Agent 上線之後"
dates:
  - "Mon 2025-11-17"
  - "Fri 2025-11-21"
topics:
  - "Monitoring and observability for AI systems"
  - "Automated incident response"
  - "Triaging and debugging"
guest_speaker:
  name: "Mayank Agarwal + Milind Ganjoo"
  title: "CTO + Technical Staff"
  org: "Resolve"
status: complete
---

> **本週你會學到什麼**：把 AI agent 推上 production 之後的世界 — observability、incident response、SRE（Site Reliability Engineering）。當你的服務出事，AI agent 怎麼自動 triage、debug、甚至自動修復？Friday 由 Resolve.ai 的 CTO Mayank Agarwal + Technical Staff Milind Ganjoo 開講（Resolve 在做 AI-native on-call）。
>
> 💡 **對非資工背景讀者**：本週很多概念來自 production engineering 世界（Kubernetes、observability、SRE），如果你只做 side project 沒上 production，可以挑「核心概念導讀」+「對 vibe coder 的應用」讀就好。本週會大量用醫療類比（observability ≈ 病歷 + 生命徵象 + 影像、incident response ≈ 急救流程、postmortem ≈ M&M conference、on-call ≈ night float）幫你建立直覺。

## 學習目標

完成本週後，你應該能：

1. **解釋** SRE 的核心三角（SLI/SLO/SLA）以及為什麼 observability ≠ monitoring
2. **辨識** AI agent 的特殊 observability 需求（token usage、tool call latency、hallucination rate、context drift）
3. **設計** 一個 incident response workflow 含 AI auto-triage step
4. **評估** Resolve.ai / PagerDuty AI / Datadog AI agent 在 on-call 場景的能力差異

## 核心概念導讀

### 一、SRE 入門：把營運當軟體工程問題解

W1-W8 講的都是「把 code 寫出來」。但 production system 的真正挑戰不在寫，而在「上線之後」 — 7×24 小時持續運轉、流量會起伏、依賴會壞、客戶會抱怨、半夜會被 page。在這個世界裡，Google 提出的 **SRE（Site Reliability Engineering，網站可靠度工程）** 是業界共識的解法。SRE 的核心不是「找一群運維」，而是「找軟體工程師來設計營運團隊，把 manual operation 當成 bug 來自動化掉」。

[Google SRE Book](../readings/w9_introduction_to_sre.md) 列了三個基礎紀律，所有 production system 都適用：

1. **SLI / SLO / SLA（service level indicator / objective / agreement）** — SLI 是測量值（如 p99 latency = 187 ms）、SLO 是內部目標（99.9% 請求 < 200 ms）、SLA 是對客戶的合約承諾（達不到要賠錢）。三者依序由內而外、由緊而鬆。
2. **Error budget（錯誤預算）** — 既然 100% availability 既不可能也無價值（每加一個 9 成本指數成長），就明訂 SLO（例：99.99%），剩下 0.01% 是「可以拿來冒險的預算」。新功能上線會吃預算，預算用完就停止 release。
3. **50% rule** — 工程師花在 toil（重複瑣事）的時間不得超過一半，另一半必須做工程改善。違反這條 SRE 團隊就會隨流量線性膨脹，跟傳統 sysadmin 一樣。

> 💡 **譯解（醫療類比）**：SLO 像住院病人的「目標生命徵象」 — 不是要把 BP 維持在 120/80 不准動，是「BP 維持在 100-140/60-90 之間就算 ok」。Error budget 就是「下緣到目標之間的容忍空間」 — 病人 BP 在 105 還是 ok，可以做 challenging 的事（早期 ambulation、調藥），如果預算用光（BP 已經在 100），就先別動。Blame-free postmortem 就像 M&M（morbidity & mortality conference）— 不是要找哪個住院醫師簽錯醫囑，是要找系統性漏洞（為什麼 EHR 沒擋下這個 dose？為什麼交班沒講到 allergy？）。

把 SRE mindset 套到 LLM agent：你的 agent 也會壞 — hallucination、tool call timeout、context overflow、prompt injection。關鍵是先**量化什麼叫「ok」**（例：hallucination rate < 0.5%、p95 response time < 5 s、tool success rate > 95%），然後用 error budget 管理 release 風險（這個 prompt 改完 hallucination rate 飆到 1%，立刻 rollback）。

### 二、Observability 三柱：logs / metrics / traces

[Observability Basics](../readings/w9_observability_basics.md) 釐清一個常被混用的概念：**monitoring（監控）只告訴你「什麼壞了」**（CPU 高、5xx 多）；**observability（可觀測性）要回答「為什麼壞」**。在 microservices（微服務）架構下，一個 user request 可能跨 10+ 個 service，光看單一 service 的 metrics 完全不知道哪一段慢。Observability 的三柱各司其職，缺一不可：

| 柱 | 是什麼 | 醫療類比 | LLM agent 場景例 |
|----|--------|---------|------------------|
| **Logs（日誌）** | 離散文字事件記錄（誰、何時、做了什麼） | 病歷紀錄 — 每個診間、每次處置的逐筆紀錄 | "User asked X, agent called tool Y, got result Z" |
| **Metrics（指標）** | 時間序列數值（QPS、p99 latency、error rate） | 生命徵象 — HR / BP / SpO₂ 持續監測 | "average tokens per request"、"tool call success rate" |
| **Traces（追蹤）** | 一個 request 從進入點到回應的完整路徑 | 影像檢查（CT / MRI）— 一次性看全身結構與問題位置 | "user query → LLM call → MCP tool → DB → 第二次 LLM call" 整條路徑 |

Trace 由多個 **span（區段）** 組成，每個 span 是一個工作單位（一次 DB query、一次 RPC call、一次 LLM call），spans 用 parent-child 關係組成階層。關鍵是 **context propagation（上下文傳播）** — trace ID 必須跨 service 傳遞才能串成完整路徑。**OpenTelemetry（OTel）** 是業界中立的 instrumentation 標準，所有大廠（Datadog、New Relic、Honeycomb、Grafana）都支援，意味著你 instrument 一次、可以隨時換 vendor。

> 💡 **譯解**：你想 debug 一個 LLM agent「怎麼會回這個怪答案」 — 看 logs 像翻一頁頁病歷找線索（耗時、容易漏）、看 metrics 像看 vital sign trend chart（知道某時段惡化但不知為何）、看 traces 像直接拉出那次 request 的「全身 CT」 — 從 user query 進來到 response 出去的每一步、每一步的 input / output / 耗時都看得到。Production agent 沒有 traces 等於 debug 黑箱。

三柱必須**相互關聯**才有用 — trace ID 要寫進 log line、metric 要帶 trace exemplar，這樣你看到 metric spike 時能一鍵跳到那個時段的 traces，看到 trace 異常時能一鍵看相關 logs。

### 三、AI agent 的特殊 observability 需求

傳統 observability 三柱足夠看 web service。但 LLM agent 多了幾個維度，傳統工具看不到：

1. **Token usage（token 消耗）** — 每個 request 用了多少 input / output token、累計成本多少。沒看會被 OpenAI / Anthropic 帳單嚇到。
2. **Tool call latency（工具呼叫延遲）** — Agent 一次任務可能 chain 5-10 個 tool call，每個 tool 的耗時、成功率、failure mode 必須個別 instrument。某個慢 tool 會拖垮整個 agent 的 p95。
3. **Hallucination rate（幻覺率）** — 這個最難量化但最重要。常見做法：(a) 對 critical claim 跑 fact-check pipeline、(b) 抽樣人工審核、(c) 用 LLM-as-judge（另一個 model 當審查員）。
4. **Context drift（上下文漂移）** — 長對話 / 多輪 agent loop 中，context window 累積到後期 model 會偏離 system prompt 的指示（俗稱 "agent 走鐘"）。需 instrument 每輪的 prompt 大小、context 中各部分占比。
5. **Tool selection accuracy（工具選擇準確率）** — Agent 有 N 個 tool 可用時，它選對了嗎？常見指標：選對率、平均嘗試次數、wrong tool 後恢復率。

> 💡 **譯解**：傳統 web service 的 observability 像加護病房的 monitor — 量 BP / HR / SpO₂ / EtCO₂ 就大致知道病人狀況。LLM agent 多了「精神狀態」這條軸 — 即使 vital sign 都正常，他可能 confused / disoriented / hallucinating。你需要額外的 GCS（Glasgow Coma Scale）、CAM-ICU（confusion assessment method）那種專門 instrument 才測得到。Hallucination rate 與 context drift 就是 LLM agent 的「精神狀態評估」。

工具上 [Langfuse](https://langfuse.com/)、[Helicone](https://www.helicone.ai/)、[Arize Phoenix](https://phoenix.arize.com/) 是專做 LLM observability 的開源/商用方案，本質上把 trace 模型擴充支援 LLM call 與 tool call，再加上 token / cost / hallucination eval 維度。

### 四、Multi-agent system 在 SRE：MDT 會議模式

[Multi-Agent Systems for AI-Native Engineering](../readings/w9_multi_agent_systems_ai_native.md) 提出一個關鍵 observation：**single agent 在 production debugging 是 sequential bottleneck（序列瓶頸）** — 它一次只能調查一個假設，但 production incident 的時間壓力要求並行假設驗證。

解法是 multi-agent 架構，讓專業 agent 各司其職並行運作。一個典型的 incident response multi-agent system 長這樣：

| Agent | 專長 | 輸出 |
|-------|------|------|
| **Trace agent** | 追跨 service 的 distributed trace | 「latency spike 出現在 service B 的 DB call」 |
| **DB agent** | 分析 DB performance、slow query | 「過去 10 分鐘有一支 N+1 query」 |
| **Deployment agent** | review 最近 CI/CD 部署紀錄 | 「30 分鐘前 service B 上了 commit abc123」 |
| **Code diff agent** | 看那個 commit 的 code change | 「abc123 移除了 query 的 index hint」 |
| **Customer impact agent** | 估算影響範圍 | 「過去 10 分鐘有 12,000 user 受影響」 |
| **Coordinator agent** | merge 上述發現給結論 | 「root cause: abc123 commit 的 query regression，建議 rollback」 |

> 💡 **譯解（MDT 會議類比）**：這個架構就是醫院 MDT（multidisciplinary team）會議的軟體版 — 一個 lung cancer 病人的 case，心臟科評估手術風險、腫瘤科出 chemo 方案、放射科出 RT 計畫、病理科確認 diagnosis、社工評估家庭支持，最後 lead physician（coordinator）綜合所有意見開會 merge 結論。每個專家獨立、並行作業，最後一次 merge — 比一個 generalist 順序問每個專家快得多。Production incident 也是多 domain 問題，multi-agent 並行調查比 single agent sequential 快數倍。

但並行的代價是需要 **formal coordination protocol** 來避免 race condition 與 deadlock — 這也是 MDT 會議要有 chair 主持、有 agenda、有 timing 規則的原因。把這套作出 production-ready 需要罕見的雙重專業：深度 production domain knowledge + sophisticated AI architecture，缺一邊就會做出「會調查但調查錯方向」的系統。Resolve.ai 的賣點就是兩邊都有。

## Monday Lecture（11/17）：Incident response and DevOps

- **Slides**: [Google Slides（需 Stanford 帳號）](https://docs.google.com/presentation/d/1Mfe-auWAsg9URCujneKnHr0AbO8O-_U4QXBVOlO4qp0/edit?usp=sharing)
- **講者**: Mihail Eric

> Slides 需 Stanford 帳號，依 lecture title + SRE / DevOps 業界共識重建：

這節是 W9 的 framing lecture — 從傳統 DevOps / SRE 切入，再連到 AI agent 怎麼介入這個 workflow。預期內容：

1. **Incident response 流程拆解** — 從 alert 觸發到 incident closure 的完整 lifecycle：detect（alert / SLO breach）→ triage（嚴重度評估、page 對的人）→ investigate（找 root cause）→ mitigate（止血）→ resolve（永久修）→ postmortem（檢討）。每個階段的 KPI（MTTD / MTTA / MTTR）與常見痛點
2. **DevOps 在 AI 時代的轉型** — 從「自動化部署」進化到「自動化營運」。CI/CD 自動化解決了 deployment friction、observability 解決了 visibility friction，現在 AI agent 解決 investigation / decision friction
3. **AI 在 incident response 各階段的介入點** — Detect 階段：anomaly detection model 取代 static threshold；Triage 階段：LLM 分類 severity / 路由到對的人；Investigate 階段：multi-agent 並行查 root cause；Mitigate 階段：suggest 或自動跑 rollback / restart；Postmortem 階段：自動產生 timeline 與 lesson learned 草稿
4. **DevOps 文化的核心 — 不究責檢討（blame-free postmortem）** — Mihail 應該會強調這點：自動化只是工具，沒有 blame-free 文化、incident learning 不會發生
5. **AI 的限制與 human-in-the-loop 設計** — 哪些動作 agent 可以自動執行（read-only investigation、report generation），哪些必須人類授權（rollback production、刪資料、call third-party API 花錢）

**Key takeaway**：Incident response 是個成熟工作流，AI agent 不是要重新發明它，是要在 detect / triage / investigate 三個階段大幅縮短時間，把工程師從 firefighter 升級成 architect。

## Friday Lecture（11/21）：Mayank Agarwal + Milind Ganjoo（Resolve）

- **Speakers**:
  - [Mayank Agarwal](https://www.linkedin.com/in/mayank-ag/), CTO of [Resolve](https://resolve.ai/)
  - [Milind Ganjoo](https://www.linkedin.com/in/mganjoo/), Technical Staff at Resolve
- **Slides**: [Drive 連結](https://drive.google.com/file/d/11WnEbMGc9kny_WBpMN10I8oP8XsiQOnM/view?usp=sharing)

> Slides 需 Stanford 帳號，依 Resolve.ai 公開 blog（W9 reading 全 6 篇有 4 篇來自 Resolve）+ 講者背景重建：

Resolve.ai 是 2024 年成立的 AI-native on-call startup，創辦團隊來自 Google / Meta / Datadog 的 SRE / observability 老將。他們的論點是：**production engineering 是 AI agent 的 killer app，因為它需要 multi-source data fusion + structured reasoning + tool use，三項都是 LLM 強項**。預期講者會 cover：

1. **Resolve 創立故事** — 為什麼 2024 才有人做這件事？三個 enabler 同時成熟：(a) GPT-4 / Claude 級別 model 終於有能力跨 domain reasoning、(b) MCP / function calling protocol 標準化讓接 observability platform 變簡單、(c) Kubernetes / cloud-native 把 system 複雜度推到 single human 看不完的層級
2. **Product 核心：dynamic knowledge graph** — 不是預寫 runbook，是接 Grafana / Datadog / Jenkins / GitHub 持續抓即時資料建一張動態 graph。Alert 觸發時 agent 在這張 graph 上做 reasoning，不是從零開始 query
3. **Just-in-time runbook 的設計哲學** — Static SOP 一定會過時（新 service、新 dependency 一加就失效）。Resolve 的 agent 是 incident 當下根據 context 動態生成調查腳本 — 看 alert 是哪個 service、最近有什麼 deployment、依賴的 downstream 健康狀況，組合成這次 incident 專屬的 investigation plan
4. **Multi-agent architecture 在 Resolve 的具體實作** — 對應 [Multi-Agent Systems blog](../readings/w9_multi_agent_systems_ai_native.md)：trace agent / DB agent / deployment agent / customer impact agent 並行跑，coordinator merge。講者可能會 demo 一個真實 incident 的 walkthrough — 從 PagerDuty alert 進來到 Slack 出 root cause hypothesis 的全流程
5. **Real-world deployment lessons** — 跟早期客戶（如 Salesforce、Stripe-tier 公司）部署的教訓：(a) 客戶最初不信任 agent 的判斷，要先讓 agent 「watch only」幾週累積信任；(b) hallucination 在 read-only investigation 是可接受的（人類 review），但在 remediation 是 disaster — 所有破壞性動作必須 human-authorize；(c) postmortem 自動化是最受歡迎的功能（沒人愛寫），但要讓工程師能 edit
6. **Future direction** — 從 reactive incident response 進化到 proactive resolution（[Top 5 Benefits](../readings/w9_benefits_of_agentic_ai_in_oncall.md) 第五點）— agent 不只等 alert，主動掃 metrics / log pattern 找尚未爆發的潛在問題

**Key takeaway**：Resolve 是「為 SRE 場景重新設計 LLM agent」的具體商業案例。它示範了從 prompt engineering 到 production agent 中間的所有工程細節 — knowledge graph 怎麼維護、multi-agent 怎麼協調、human-in-the-loop 怎麼設計、信任怎麼累積。對想做 vertical AI startup 的人是必看 case study。

## Reading 摘要

| 篇名 | 來源 | 一句話重點 |
|------|------|-----------|
| [Introduction to SRE](../readings/w9_introduction_to_sre.md) | Google SRE Book | SRE = 把營運當軟體工程問題；error budget 量化 dev/ops 衝突，blame-free postmortem 找系統漏洞 |
| [Observability Basics](../readings/w9_observability_basics.md) | last9.io | Observability 三柱：logs（病歷）+ metrics（生命徵象）+ traces（影像）；context propagation 是關鍵 |
| [Kubernetes Troubleshooting with AI](../readings/w9_kubernetes_troubleshooting_with_ai.md) | resolve.ai | K8s 三大痛點（alert fatigue、ephemeral context、observability fragmentation）由 AI agent + knowledge graph 解 |
| [Your New Autonomous Teammate](../readings/w9_your_new_autonomous_teammate.md) | resolve.ai | Resolve 產品深度導覽：dynamic knowledge graph + just-in-time runbook + 1 分鐘 root cause + 自動 postmortem |
| [Multi-Agent Systems for AI-Native Engineering](../readings/w9_multi_agent_systems_ai_native.md) | resolve.ai | Single agent 是 sequential bottleneck；multi-agent 並行查 root cause 是 AI-native 工程的核心 |
| [Top 5 Benefits of Agentic AI in On-call](../readings/w9_benefits_of_agentic_ai_in_oncall.md) | resolve.ai | 五大好處：消 alert fatigue、活知識、調查一致性、證據式協作、主動找潛在問題 |

**閱讀優先順序**：先讀 [Introduction to SRE](../readings/w9_introduction_to_sre.md)（建立 mental model）→ [Observability Basics](../readings/w9_observability_basics.md)（基礎工具觀念）→ [Multi-Agent Systems](../readings/w9_multi_agent_systems_ai_native.md)（agent 架構）→ [Your New Autonomous Teammate](../readings/w9_your_new_autonomous_teammate.md)（具體商業案例），時間有限的話前三篇必讀。

## Assignment

> 本週原 syllabus 沒列 weekly assignment。建議自學者用 Sentry 或 Better Stack 給自己的 side project 設定 observability 當練習：(1) 開一個帳號（兩家都有 free tier）→ (2) 接到自己的 side project（npm/pip 裝 SDK，5 分鐘）→ (3) 故意製造一個 error 看 dashboard 抓得到嗎 → (4) 設一個 alert（例：error rate > 1%）發到 Discord / email → (5) 觸發後跑一次完整 incident response 流程（看 trace 找 root cause → fix → 寫 postmortem）。預估 2-3 hr，會建立完整 production-ready 的肌肉記憶。

## 對 Vibe Coder 的應用

W9 是 vibe coder 最容易跳過、但跳過後悔最大的一週。多數人 ship side project 時根本沒 observability，等到出 bug 才發現自己什麼都看不到、只能憑直覺猜。這週的概念套到日常工作流：

1. **第一個 production project 立刻接 Sentry** — Sentry 對 vibe coder 是 P1 夯。Free tier 給每月 5K event，足夠 hobby project 用。npm install 後 3 行 code 就接好，自動抓 unhandled exception、含 stack trace、含 source map（看到原 TypeScript 而不是 minified JS）。沒有 Sentry 等於沒儀表板開車
2. **三選一：Sentry / Better Stack / Vercel Analytics** —
   - **Sentry** 主攻 error tracking + performance traces，all-rounder。最 P1，預設選它
   - **Better Stack**（原 Logtail + Better Uptime）主攻 log aggregation + uptime monitoring，介面漂亮、SQL-like log query 強。如果你 log 量大選它
   - **Vercel Analytics** 只在 deploy 到 Vercel 時用、focus 在 web vitals + page view，是「最低限觀測」。配 Sentry 用不衝突
3. **Day 1 就加 structured logging** — 別用 `console.log("user clicked")`，用 JSON log 含 request ID / user ID / timestamp / event：`logger.info({ user_id, action: "click", item: "checkout" })`。Sentry / Better Stack 都會自動 parse JSON log 的 field 變成可篩選的 metadata。改寫 0 成本、回收高得驚人
4. **LLM app 加 Langfuse / Helicone** — 如果你 side project 用了 OpenAI / Anthropic API，標準 observability 看不到 token usage / hallucination。Langfuse 開源、self-host 免費、5 分鐘接 SDK，給你完整的 prompt + response + tool call + cost 紀錄。一個月後回頭看，會發現 80% 的 cost 來自你想不到的 5% request — 沒這個資料無法 optimize
5. **Production-ready 的觸發點不是「有用戶」是「你會半夜被 page」** — 多數 vibe project 永遠不會到那個點，所以**別過度工程化**。只要 (a) error tracking、(b) basic uptime check（Better Stack free tier 給 10 個 monitor），就涵蓋 90% 的 production-ready 需求。Kubernetes、Datadog、PagerDuty 全是 over-engineering — 等到你的 side project 真的有 paying customer 再上
6. **Postmortem 文化套到自己 side project** — 每次 production bug 寫 30 字 postmortem（root cause + fix + lesson）存進 repo 的 `POSTMORTEMS.md`。半年後看會發現自己一直在重蹈覆轍同類 bug，這個 doc 就是個人版的 dynamic knowledge graph

> 💡 **vibe coder 的 Day-1 Quick Win**：今天去 [sentry.io](https://sentry.io) 開帳號（30 秒）、選你最在意的那個 side project、跟著 5 分鐘 setup wizard 接好 SDK、deploy。下次 bug 不必再從 user 抱怨「我點了沒反應」開始 debug — Sentry 會直接 email 你 stack trace + 出錯時的 user / request context，可能還沒等 user 抱怨就已經修好。這個 ROI 是所有 dev tool 中最高的之一。

---

**上一週**：[W8 Automated UI and App Building](08_automated_ui_app_building.md) | **下一週**：[W10 What's Next](10_whats_next.md)
