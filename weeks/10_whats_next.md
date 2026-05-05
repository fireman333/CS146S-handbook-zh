---
week: 10
title: "Week 10：What's Next for AI Software Engineering"
title_zh: "AI 軟體工程的未來"
dates:
  - "Mon 2025-12-01"
  - "Fri 2025-12-05"
topics:
  - "Future of software development roles"
  - "Emerging AI coding paradigms"
  - "Industry trends and predictions"
guest_speaker:
  name: "Martin Casado"
  title: "General Partner"
  org: "a16z"
status: complete
---

> **本週你會學到什麼**：10 年後軟體工程師長什麼樣？「junior dev」會被 AI 取代嗎？emerging paradigm 有哪些（agentic CI/CD、formal spec、autonomous open-source contribution）？本週由 a16z（Andreessen Horowitz，矽谷指標 VC）的 General Partner Martin Casado 開講，從投資人視角看產業 10 年。
>
> 💡 **本週特別說明**：W10 原 syllabus 沒有 reading list、Mon lecture 也沒公開 slides — 內容偏 forward-looking speculation + 講者個人 thesis。本講義以 W1-W9 學到的 9 週素材為基礎、結合 a16z 公開 essays 與業界共識做延伸寫作，所有預測都標註「（基於既有知識的延伸寫作）」並避免聲稱「Stanford 課堂這樣講」。

## 學習目標

完成本週後，你應該能：

1. **辨識** software dev role 在 AI 時代的 5 種可能演化路徑（augmentation / specialization / abstraction / replacement / new roles）
2. **解釋** emerging paradigms（spec-driven dev、formal verification × AI、autonomous repo maintenance）的技術前提
3. **評估** 自己的 skill stack 在未來 5 年的相對價值（哪些 skill 會 commoditize、哪些會更值錢）
4. **預測** AI dev tool 市場的下一個 winner pattern（platform vs vertical、open vs closed）

## 核心概念導讀

### 一、Software Dev Role 的 5 種演化路徑

「AI 會不會取代軟體工程師？」這個問題問了 3 年，答案從來不是 yes/no — 是 role 會分裂成幾種典型形態。從 W1-W9 的素材抽絲剝繭，可以看到 5 條互不互斥的演化路徑：

1. **Augmentation（增強）— 大多數人會走的路** — 不換工作，把 Claude Code / Cursor / Warp 整合進現有工作流，產出 / 時間提升 30-100%。需要的新 skill：context engineering、agent management（W4）、prompt-driven debugging（W6/W7）。這條路最 boring 但 ROI 最高
2. **Specialization（專業化）— 變成「某類 AI tool 的世界級用戶」** — 例：成為 Claude Code subagent / skill 系統的專家、或 v0 prompting 的世界級操作者、或 Vercel AI SDK 的 community contributor。這條路有「先發優勢」但會被後來者追平
3. **Abstraction Up（抽象上層）— 從 implementer 轉 architect / agent manager** — 不再寫 code，全心做 spec design、acceptance criteria、verification 設計、人機分工策略。對應 W3 的 spec-driven 命題與 W4 的 agent manager mindset
4. **Replacement（取代）— 真實但範圍有限** — 不是取代「軟體工程師」這個 role，是取代「**寫 boilerplate / 補測試 / 改格式 / 做 routine refactor**」這些 task。受影響最大：junior dev 在 boilerplate-heavy 公司、外包 contract programmer。受影響最小：產品經理、tech lead、staff+ engineer
5. **New roles（新角色）— 已經出現** — AI Engineer（W2-W4 的 agent / MCP 操作者）、Forward Deployed Engineer（在客戶端配合 AI 解決方案的工程師）、AI Reliability Engineer（W9 的 AI-native SRE）、Prompt Architect（資深 prompt 設計師）、Eval Engineer（評測 AI system 的專家）

對使用者個人 strategic（醫學生 + RA + vibe coding hobby）的對應：路徑 1 是基本盤（Claude Code 整合進醫學研究 workflow）、路徑 2 可選（成為「醫學 + AI tool」的早期專家）、路徑 5 跨領域（醫學 AI engineer、clinical AI ops 都是 emerging niche）。（基於既有知識的延伸寫作）

### 二、Emerging Paradigms：Spec-driven Dev / Formal Verification × AI / Autonomous Repo Maintenance

W3 已經提了 spec-driven dev 的概念，W10 把它放進更大的 paradigm shift 圖裡。3 個正在浮現的範式變化值得注意：

**1. Spec-driven Development（規格驅動開發）走向主流**
- W3 的 [Specs Are the New Source Code](../readings/w3_specs_are_the_new_source_code.html) 是先驅論文。實際走勢：未來 5 年大公司（Google、Meta）會把 PRD / design doc 轉成可被 agent 直接 implement 的 formal spec
- 副作用：PM 跟 designer 的工作會變硬 — 寫得糊的 spec 直接沒結果，逼大家寫得精準
- Vibe coder 對應：把寫 PRD 當 first-class skill 練（不是 nice-to-have）

**2. Formal Verification × AI 的二度興起**
- 2010 年代 formal verification 因為手寫太難失敗。2025-2030 年 LLM 把證明重擔自動化，formal methods 在 safety-critical（醫療、金融、自駕、aerospace）領域會大爆發
- W6 的 [Vulnerability Prompt Analysis with O3](../readings/w6_vulnerability_prompt_analysis_with_o3.html) 是早期信號 — LLM 已經能做 formal-ish vulnerability analysis
- 對醫療 AI 的長尾影響：FDA 過審 AI 醫材會強制要 formal verification step

**3. Autonomous Open-source Maintenance**
- 已有早期跡象：Dependabot、Renovate（dependency 自動 upgrade）、CodeRabbit / Diamond（W7 PR review）、Devin（Cognition 的自動 PR 機器人）。下一步：autonomous bug fix、autonomous feature backport、autonomous release management
- 風險：低品質 / spam PR 暴增，maintainer 變成「reviewer of reviewers」
- Vibe coder 對應：你的 side project repo 提早設定 AI reviewer + auto upgrade，用得越早越熟

（基於既有知識的延伸寫作）

### 三、AI Dev Tool 市場的 Winner Pattern

W2-W9 串連起來看，AI dev tool 市場已經分成 4 個 layer，每層的 winner pattern 不同：

| Layer | 範例（2026 強者） | Winner Pattern |
|-------|-----------------|---------------|
| **Foundation models** | Anthropic（Claude）、OpenAI（GPT）、Google（Gemini） | 寡占 — 訓練成本高、moat 在 model 與 evals |
| **Coding agents / IDE** | Claude Code、Cursor、Devin、Warp | 寡占走向碎片化 — 每個 niche（CLI / IDE / autonomous）會有 1-2 強者 |
| **Vertical tools** | Graphite（W7 code review）、Resolve（W9 SRE）、v0（W8 UI） | Vertical SaaS — 每個 vertical 1-2 個專業玩家 |
| **Infrastructure** | Vercel（AI SDK + Gateway）、Cloudflare、Modal | Platform-led — 跟 cloud provider 整合越深越強 |

幾個跨層 trend：
- **Vertical 比 horizontal 賺錢** — 一個 code review 公司（Graphite）、一個 on-call 公司（Resolve）、一個 UI 公司（v0）能各自撐 unicorn valuation；做「all-in-one AI dev tool」的反而難變現
- **Open source 是漲粉、不是商業模式** — Claude Code / Cursor 都不開源核心，但開放擴充（subagent、skill、extension）；MCP 協定開源（吸引 ecosystem），客戶端產品閉源（保 monetization）
- **Foundation model 是 commoditizing** — Anthropic / OpenAI / Google 三家差距在縮小，wrapper 產品（Cursor、Devin）會越來越用 router 在三家間切換以降本（W6 的 Context Rot 也說明 model 之間差距已經不大）

對使用者個人決策的 takeaway：別把學習投資押在單一 model（Claude vs GPT 之爭已經 boring），押在**跨 model abstraction 層**（MCP、Vercel AI SDK、LangChain）跟**vertical workflow**（你的醫學研究 pipeline、阿摩錯題迴圈、IRB 自動化）— 這兩層的價值不會被 model 變遷洗掉。（基於既有知識的延伸寫作）

### 四、a16z 的 AI Dev Tool 投資 Thesis

Martin Casado 在 a16z 主導 American Dynamism + Infrastructure / AI 的投資組合。從他公開 essays（"The End of Cloud Computing"、"AI 50" series）和 a16z 對 Cognition（Devin）、Cursor（Anysphere）、各 AI dev tool 公司的投資紀錄，可以推出他的 4 條 thesis：

1. **Infrastructure layer 比 application layer 大** — Cloud computing 的 winner 是 AWS / GCP / Azure 而非 SaaS 應用。同理 AI 時代的 winner 不會是 chatbot 應用，是 Vercel / Cloudflare / Modal 這類 AI infra
2. **Agentic platform = 下一個 unicorn factory** — 不只是「AI 寫 code」，是「**AI 自主完成 task 並付費**」。Devin（autonomous coding）、Resolve（autonomous on-call）都在這條軸線上
3. **Vertical AI > horizontal AI** — 醫療 AI、法律 AI、code review AI、SRE AI 各自會出 unicorn，比通用 chatbot 更穩
4. **Talent geography 大洗牌** — AI 解放 talent 不必住 SF Bay。a16z 的 American Dynamism 主題押注是「全美都會有 AI startup」。對台灣 / 亞洲：英文良好的 AI engineer 在 remote / async 模式下能直接接美國公司 contract，門檻變低

對使用者長期 career bet 的對應：
- **押 vertical AI**（醫學 + AI 的交集）而非 generic AI
- **押 infra layer 工具**（會用 MCP / Vercel AI SDK / observability 三件套）而非單一 wrapper 產品
- **遠端 / 自由 contracting** 比 traditional FTE 路線在 AI 時代 ROI 更高

（基於既有知識的延伸寫作）

## Monday Lecture（12/1）：Software development in 10 years

- **Slides**: 未公開
- **講者**: Mihail Eric

> Slides 未公開，依 lecture title + W1-W9 累積的素材 best-effort 推測：

這節是課程收尾的個人 prediction 演講。預期內容：

1. **Recap：W1-W9 串成一條線** — 從「LLM 是什麼」（W1）到「LLM 在 production 怎麼跑」（W9）的 9 週技術疊加，最後落到「10 年後是什麼樣」
2. **3 個 ten-year prediction** — Mihail 應該會給幾個具體預測（例：「10 年後 80% 的 PR 是 AI 開的」「software engineer 平均薪水降但人數不變」「formal verification 變必修」），每個附 reasoning chain
3. **What stays valuable** — 哪些 skill 不會被 commoditize：spec design、agent management、cross-domain knowledge、taste / judgment、organizational influence
4. **What gets cheap** — 哪些 skill 會被 AI 接手：boilerplate generation、test coverage、style enforcement、documentation、basic refactoring
5. **教育與 onboarding 的衝擊** — 沒有 boilerplate 練習，junior dev 怎麼從 zero 上手？大學 CS 教育要怎麼改？
6. **Open Q&A** — 這類課程末尾的 reflection lecture 通常會留大量時間給學生問問題

**Key takeaway**：10 年後的軟體工程不是「沒有工程師」，是「工程師的工作 mix 變了」 — 寫 code 比例下降、設計 / 審 / 管理 agent 比例上升。早一年 adapt 比晚一年值很多。（基於既有知識的延伸寫作）

## Friday Lecture（12/5）：Martin Casado（a16z General Partner）

- **Speaker**: [Martin Casado](https://a16z.com/author/martin-casado/), General Partner at [a16z](https://a16z.com/)
- **Slides**: 未公開

> Slides 未公開，依 Casado 公開 essays + a16z 投資組合 best-effort 重建：

Casado 的研究背景（Lawrence Livermore National Lab、Stanford CS PhD、Nicira 創辦人，後賣給 VMware $1.26B）讓他擅長把工程深度與 VC thesis 串接。預期演講：

1. **Cloud → AI 的 historical analogy** — 把 2007-2015 的 cloud computing winner pattern 套到 2023-2030 的 AI dev tool。哪些教訓直接適用、哪些不適用
2. **Why infrastructure wins** — 為什麼 AWS / GCP / Azure 在 cloud 是 winner？為什麼 Casado 認為 AI infra（Vercel / Modal / Replicate / Cloudflare）會是下一波 winner，而非 application 層
3. **Devin / Cursor / Anysphere 投資 case** — a16z 投了 Cognition（Devin）、Anysphere（Cursor）、其他 AI dev tool 公司。每個 case 的 thesis（為什麼這個 team / 這個 timing / 這個市場）
4. **Agentic AI 的 trillion-dollar opportunity** — Agent 不只是工具，是「能自主完成 task 並付費」的 economic actor。這個轉變創造的市場是傳統 SaaS 的 10 倍
5. **What founders should build now** — 給 Stanford 學生的建議：哪些 niche 還空著、哪些 problem 真的值得解、什麼樣的 founder background 在這波會贏
6. **a16z 招募 founder 的訊號** — Casado 應該會 implicit 招手 — 這類演講常常是「you should build, talk to me」

**Key takeaway**：AI 不是泡沫也不是炒作，是 cloud-scale 的 platform shift。這次的 platform 是 agent，winner 是有深度技術 + 工程 craft 的人。對 vibe coder 個人：把現在當成 1995 年（網際網路啟動）或 2007 年（cloud computing 啟動）— 早一年 commit 後面差很多。（基於既有知識的延伸寫作）

## Reading

> 本週原 syllabus 沒列 reading list。本講義延伸推薦資源：
>
> - [Martin Casado on a16z author page](https://a16z.com/author/martin-casado/) — 看他過去 essays，特別是 "The End of Cloud Computing" 與 AI infra 系列
> - [a16z American Dynamism / AI portfolio](https://a16z.com/portfolio/) — 看 Cognition、Cursor、Anysphere 等 AI dev tool 投資
> - [Gartner Hype Cycle for AI 2025](https://www.gartner.com/en/research/methodologies/gartner-hype-cycle) — 對照 emerging paradigm 的 hype vs reality
> - [Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/) — 看 dev 對 AI tool 的 adoption / sentiment

## Assignment

> 本週原 syllabus 沒列 weekly assignment（Final Project 應該已進入 demo 階段）。

## 對 Vibe Coder 的應用

W10 不是 actionable week，是 strategic week — 思考「3 年後我要在哪」而不是「今天我做什麼」。給自己的問題：

1. **挑 3-year skill bet** — 哪 3 個 skill 你會 deeply 投資 1000+ 小時？建議：(a) **context engineering**（W3/W4 的 spec / CLAUDE.md / subagent 紀律 — 跨 model 都受用）、(b) **vertical workflow design**（你的醫學研究 / 阿摩 / IRB 自動化 pipeline — 別人複製不了的領域知識）、(c) **agent observability**（W9 的 LLM eval / hallucination 監控 — 任何 production AI 都需要的）
2. **挑 3 件不再學的事** — 隨意：(a) 手寫 boilerplate（讓 v0 / Claude Code 處理）、(b) 追每個新 framework（鎖定 1-2 套深用就好）、(c) 跟 model 比快（你比 LLM 慢但比 LLM 有 taste）
3. **Side project future-proofing** — 你的 vibe coding side project 要做到「3 年後不會被 AI tool 進化淘汰」。原則：(a) 不做純技術 demo（會被新 model 立刻超越），(b) 要做「**跟你個人 taste / 領域知識 / niche 結合**」的東西，(c) 接 MCP / 走標準 protocol 而非 vendor-locked
4. **Portfolio 差異化** — 純會用 Cursor / Claude Code 已經不是差異化（人人會）。差異化來自：deep cross-domain（醫學 + AI）、open source contribution（社群影響力）、production-grade product（不是 demo）三個方向選 1-2 個押
5. **Geographic optionality** — Casado 的 American Dynamism thesis 對台灣有解放性影響：英文良好 + 遠端 + AI fluent 的 engineer 能直接接美國 contract / remote FTE。把英文寫作 / 同步溝通練好，是 ROI 最高的 non-technical skill
6. **時程管理：每年 review 一次** — Tech 變化太快，3-year plan 會過時。建議每年生日或新年做一次「skill bet 復盤」，砍掉不對的 bet、加新興 bet

> 💡 **vibe coder 的 Day-1 Quick Win**：今天花 30 分鐘做兩件事：(a) 寫一份「2029 年的我長什麼樣」的 1-page note，列 5 個你想擁有的能力 / portfolio item / 影響力 KPI；(b) 反推回今天，列 3 個本週可以做的小事讓你接近那個未來。寫下來，半年後再看一次。這個 exercise 讓 W10 不只是 reading week，而是 strategic week。

---

**上一週**：[W9 Agents Post-Deployment](09_agents_post_deployment.html) | **總目錄**：[00_index.md](../00_index.html)
