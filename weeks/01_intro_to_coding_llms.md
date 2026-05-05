---
week: 1
title: "Week 1：Introduction to Coding LLMs and AI Development"
title_zh: "Coding LLM 與 AI 開發入門"
dates:
  - "Mon 2025-09-22"
  - "Fri 2025-09-26"
topics:
  - "Course logistics"
  - "What is an LLM actually"
  - "How to prompt effectively"
status: complete
---

> **本週你會學到什麼**：理解 LLM（Large Language Model，大型語言模型）到底是什麼、它怎麼被訓練出來、以及如何寫 prompt 讓它做你想做的事。這是後續 9 週所有 agent / IDE / coding 工具的基礎。

## 學習目標

完成本週後，你應該能：

1. **解釋** LLM 從原始文字資料 → 預訓練 → 後訓練 → instruction tuning → RLHF 的完整製造流程
2. **辨識** 一個 LLM 在哪些任務上會強、哪些會弱（hallucination、context window、reasoning chains）
3. **應用** 5 種以上的 prompt engineering 技巧（few-shot、chain-of-thought、role prompting、structured output、prompt chaining）
4. **比較** 不同 LLM provider（OpenAI、Anthropic、Google）的 API 與 coding 場景表現

## 核心概念導讀

### 一、LLM 的「製造流程」決定它的能力與盲點

要看懂這門課後續九週講的所有工具（Claude Code、Cursor、Devin、Warp），你必須先理解 LLM 不是黑盒子，它是一條三段式生產線的產物：

1. **Pre-training（預訓練）** — 把整個網際網路 scale 的文本（Common Crawl、Wikipedia、書籍、GitHub code、論壇）餵進 transformer 做 next-token prediction。產出的 base model 本質上是「網路文件補全器」 — 給它一段開頭，它會猜下一個 token、再下一個、再下一個。Karpathy 在 [Deep Dive into LLMs](../readings/w1_deep_dive_into_llms.md) 裡把 base model 比喻成「整個網路的有損壓縮」。
2. **Post-training（後訓練）— Supervised Fine-Tuning（SFT，監督式微調）** — 用人工標註的對話資料（人問什麼、helpful assistant 應該怎麼回）對 base model 做 fine-tune，把「網路補全器」轉成「會對話的 assistant」。
3. **RLHF（Reinforcement Learning from Human Feedback，人類回饋強化學習）** — 用人類偏好訓練一個 reward model，再用 PPO / DPO 之類演算法把 LLM 的回答品質拉上來。這階段決定了 LLM「願不願意拒絕請求」「會不會諂媚」「邏輯是否一致」。

**為什麼這個 mental model 重要**？因為 LLM 的所有奇怪行為都能從這三段推得：
- **Hallucination（幻覺）** = pre-training 時把「合理的下一個 token」當目標，statistical pattern 偶爾會生成看似合理但事實錯誤的內容
- **Knowledge cutoff（知識截止）** = pre-training data 截止日之後的事它不知道（除非接 web search tool）
- **算術 / 字元計數失敗** = tokenization 把文字切成 BPE token，模型看到的不是「字母」是 token id
- **Capability spectrum（能力光譜）不均勻** = 某些任務（寫 React component）強到嚇人，某些任務（畫 ASCII art、簡單算術）爛到爆

> 💡 **譯解**：你可以想成「LLM = 一個讀過全網路的學生 + 經過 RLHF 公司新訓練的客服」。它對網路上常見的東西超熟（程式、論文、Wikipedia 主題），但對訓練後才出現的事（你公司的 codebase、你昨天 commit 的程式）一無所知 — 必須透過 prompt 把那些 context 餵給它。

### 二、Prompt Engineering 是「給 contractor 的 brief」

[Anthropic 的圓桌討論](../readings/w1_ai_prompt_engineering_deep_dive.md) 裡有個比喻最精準：寫 prompt 像「請一個聰明但完全不認識你公司的 contractor 做一件事」。好 prompt 的本質不是奇技淫巧，是清楚的技術寫作。

[Google Cloud 的 prompt engineering overview](../readings/w1_prompt_engineering_overview.md) 把這件事拆成可操作的四要素：

1. **Format（格式）** — 自然語言問句 vs 結構化指令 vs JSON schema，依任務選
2. **Context and examples（情境與範例）** — 提供任務背景與 1-3 個 input-output pair（few-shot）
3. **Fine-tuning（微調 prompt）** — 看 model 失敗 case 反推 prompt 該補什麼
4. **Multi-turn conversations（多輪對話）** — 設計能維持 context 的對話流程

[Prompt Engineering Guide](../readings/w1_prompt_engineering_guide.md) 列了 18 種主流技巧，分四層：

| 層級 | 技巧 | 何時用 |
|------|------|--------|
| 基礎 | zero-shot / few-shot | 80% 場景的起手式 |
| 推理 | Chain-of-Thought (CoT) / Self-Consistency / Tree of Thoughts | 多步驟問題、數學、邏輯 |
| 工具 | RAG / ReAct / PAL / ART | 需要外部資料或執行 code |
| Meta | APE / Reflexion / Meta Prompting / Prompt Chaining | 把 prompting 本身自動化 |

實務升級路徑通常是：`zero-shot` → 不行就 `few-shot` → 還是不行加 `CoT` → 還是不行接 `RAG`。80% 的問題在第三步前就解掉。

### 三、Coding LLM 的真實工業使用樣貌

OpenAI 自家的 [How OpenAI Uses Codex](../readings/w1_how_openai_uses_codex.md) 是這週最重要的 case study。它不是 demo 也不是 marketing，是 OpenAI 內部 6 個團隊（Security、Product Engineering、Frontend、API、Infrastructure、Performance）每天怎麼用 Codex 的真實使用報告。歸納出 7 個高 ROI use case：

1. **Code understanding** — 摸熟陌生 repo、追資料流、on-call incident triage
2. **Refactoring & migrations** — 跨多檔案的一致性改動（callback → async/await）
3. **Performance optimization** — 找 hot path、批次化 DB query
4. **Improving test coverage** — 補 unit / integration test
5. **Increasing dev velocity** — scaffold boilerplate、收尾 last-mile
6. **Staying in flow** — 在 meeting / on-call 碎片時間 fire-and-forget 任務
7. **Exploration & ideation** — 找替代方案、辨識潛在 regression

更重要的是 5 條 best practice，是這 1-2 年才被工業界沉澱出來的：

- **Ask Mode 先於 Code Mode**：先讓 model 出 implementation plan，你 review 後再讓它寫 code（避免寫完才發現方向錯）
- **`AGENTS.md` / `CLAUDE.md`** 放 repo-level persistent context（命名慣例、業務邏輯、quirks）
- **Best-of-N**：同 task 同時跑多個版本，挑或合併
- **Task queue as backlog**：把碎想丟 queue，不必當下完成 PR
- **GitHub Issue-style prompt**：含檔案路徑、模組名、diff、doc snippet 的 prompt 效果最好

這 12 頁 PDF 是這週最該認真讀的，它把後續 W2-W4 要講的所有 agent 工具用法都濃縮成一份 production-tested 守則。

## Monday Lecture（9/22）：Introduction and how an LLM is made

- **Slides**: [Google Slides 公開連結](https://docs.google.com/presentation/d/1zT2Ofy88cajLTLkd7TcuSM4BCELvF9qQdHmlz33i4t0/edit?usp=sharing)
- **講者**: Mihail Eric（course instructor，Stanford undergrad/grad、前 Amazon Alexa 早期 LLM 團隊、ML 教育新創創辦人、YC-backed AI coding company 創辦人）

> 以下基於 Google Slides 公開內容（TXT export）整理的繁中摘要：

第一節要校準兩件事：(1) 這門課**不是 vibe coding 課**、不是教非工程背景使用者怎麼避開請工程師；(2) **LLM 不是黑盒子**，理解它的製造流程才能用好它。Mihail 把 lecture 切成三段：

1. **State of the world 與軟體業現況** — 軟體工程行業正在被 AI 重塑，CS 主修申請數已下滑 20%。但 Mihail 的核心命題是：「**You won't be replaced by AI. You'll be replaced by a competent engineer who knows how to use AI.**」如果你的 value-add 只剩會 copy-paste Stack Overflow，就會被取代；但若能想 system architecture、抓 business context、設計可維運的 abstraction，AI 反而會把你的生產力推到 10 倍。
2. **這門課的核心命題：human-agent engineering**（取代 vibe coding 的標準說法）— 包括 (a) 聚焦尚未被 AI 取代的能力（business understanding、tech lead 思維、好的 taste）、(b) 「LLMs are only as good as you are，good context leads to good code，if you can't understand your codebase, neither will an LLM」、(c) 大量讀 code、激進實驗。Mihail 強調目前沒有定型的 software pattern，整個業界都在摸索。
3. **5 張投影片速講 LLM 製造流程**（給工程師的版本）—
   - **Basics**：LLM 是 autoregressive next-token predictor。Tokenize → embedding（1-3K 維）→ 12-96+ 層 transformer + causal self-attention → 下個 token 機率分布
   - **三階段訓練**：(a) **Pretraining** 用 100B-1T+ token（Common Crawl / Wikipedia / StackExchange / GitHub）做 self-supervised next-token prediction、(b) **SFT** 用數萬到數十萬筆人工 prompt-response pair 教 model 跟 instruction、(c) **Preference tuning** 收集成對 output 訓練 reward model 對齊 helpfulness / correctness / readability
   - **資料量級對照**：GPT-3 ~300B token / 570 GB，PaLM 780B token，LLaMA-65B 1.4T token；code-specific 像 Codex 額外吃幾十 GB GitHub code，StarCoder 吃 3.1 TB（English Wikipedia 才 3B token 當作參考點）
   - **Reasoning model**：在 SFT/RLHF 之上加 chain-of-thought trace + tool use + 對 reasoning step 收集人類偏好。Model size：Claude 3.5 Sonnet ~175B、LLaMA 3.1 405B、GPT-4 reportedly 1.8T
4. **In practice 的 strengths vs limitations** — 強：expert-level code completion、code understanding、code fixing。弱：hallucination（在 less-represented language 更嚴重）、context window 雖然 100-200K 但有 primacy/recency bias 與 lost-in-the-middle、latency（秒到分）、cost（最頂模型 input ~$1-3/M token、output $10+/M token，但每年降約 10×）

**Key takeaway**：把 LLM 當「讀過全網路的工程實習生」而非魔法 — 它在 pre-training 看過的 pattern（常見 framework、open source code）很強，但 SFT/RLHF 沒看過的（你公司 codebase、你昨天的 commit）必須透過 prompt 餵 context。後續九週所有工具都是把這個 mental model 的不同瓶頸拆開來解決。

## Friday Lecture（9/26）：Power prompting for LLMs

- **Slides**: [Google Slides 公開連結](https://docs.google.com/presentation/d/1MIhw8p6TLGdbQ9TcxhXSs5BaPf5d_h77QY70RHNfeGs/edit?usp=drive_link)
- **講者**: Mihail Eric

> 以下基於 Google Slides 公開內容（TXT export）整理的繁中摘要：

Mihail 借用 Karpathy 的觀點開場：**prompting 是 programming language 演化的下一階段**。就像搜尋引擎的 query 從 boolean algebra 演化成自然語言，prompting 也越來越自然語言化。但「自然」不代表「隨便」 — prompt 是 art + science 的混合體：LLM 的 black-box 本質讓它有「whispering」的玄學成分，但業界已經沉澱出一套 empirically improved 的技巧。Lecture 系統地走過這套技巧 catalog：

1. **Zero-shot prompting** — 直接 ask，沒範例。例：「Make me a heap allocator in C」。適合 LLM 已熟的 well-known library / general coding task。
2. **K-shot prompting（in-context learning）** — 給 1 / 3 / 5 個 example（empirical 上這幾個數字最有用）。**用在**：domain-specific API、enterprise 內部風格、命名慣例。**不用在**：well-known library、過度約束。Demo 用「在我們 repo 命名風格下寫 for-loop」，先 naive 提問再用 `<example>` 標籤包進兩段公司 convention 範例，立刻看到輸出差異。
3. **Chain-of-Thought（CoT）** — 顯式 show reasoning step。兩種變體：(a) **Multi-shot CoT** 提供 worked-out reasoning trace，(b) **Zero-shot CoT** 用 "Let's think step-by-step" 觸發。是 reasoning model 的主力技術。適合 multi-step logic / programming / math。
4. **Self-consistency prompting** — 同 prompt sample 多次（通常配 CoT）後取 majority vote，相當於 model ensembling，能降 hallucination。Demo 用「用 5 次取多數」debug 一個 IndexError。
5. **Tool use** — 讓 LLM 把無法獨自完成的事 delegate 給外部系統。最重要的 hallucination 緩解技術之一，也是 autonomy 的基礎。Demo 用 `<tools>` 標籤列出 `pytest -s ...` / `pytest -v ...` 給 model 自己決定何時 call。
6. **Retrieval Augmented Generation（RAG）** — 把 contextual data 注入 prompt。優點：保持 up-to-date、可解釋、自帶 citation、降 hallucination。Demo 把 `UserAuthService` 既有 code snippet + `requests-oauthlib` 文件 URL 一起塞進 prompt。Cursor / Windsurf 的 `@context` 就是 RAG。
7. **Reflexion（self-critique）** — 多輪：Turn 1 model 出第一版 → Turn 2 加「critique your answer, was it correct?」讓 model 自我修正。Mihail 說這是 modern coding agent 完整 agentic 行為的 workhorse。
8. **System / user / assistant prompt 三段結構** — 用 Claude 4.1 Opus 的真實 system prompt 當教材（「鬆散版的 Asimov 三大機器人定律」）。System prompt 通常 user 看不到，是 persona / 規則 / output style 的設定處。
9. **Best practice 收尾** — (a) 給 prompt 給沒有背景的人看，他困惑 LLM 也會困惑；(b) 激進使用 role prompting（「You are a helpful assistant that loves programming...」vs「You are a Gen Z digital bestie...」展示巨大差異）；(c) 用結構化標籤包 data：`<log>...<log>` `<error>...<error>`；(d) explicit 寫出 language / stack / library / constraint；(e) decompose task。

**Key takeaway**：Prompt 是可被工程化的物件，不是奇技淫巧。實務 escalation path：zero-shot → 不行用 few-shot → 還不行加 CoT → 還不行接 RAG / tool use。Reflexion 與 self-consistency 是當代 coding agent autonomy 的底層機制，理解這幾招就能看懂 Claude Code / Cursor 內部的 prompting layer 在做什麼。

## Reading 摘要

| 篇名 | 來源 | 一句話重點 |
|------|------|-----------|
| [Deep Dive into LLMs](../readings/w1_deep_dive_into_llms.md) | Karpathy YouTube 3.5hr | LLM = pre-training + post-training + RLHF 三段生產線，所有 weirdness 都從這裡推 |
| [Prompt Engineering Overview](../readings/w1_prompt_engineering_overview.md) | Google Cloud | Prompt 設計四要素 + 5 種 prompt 類型（zero/one/few/multi-shot, CoT） |
| [Prompt Engineering Guide](../readings/w1_prompt_engineering_guide.md) | promptingguide.ai | 18 種 prompting 技巧 catalog，分基礎 / 推理 / 工具 / meta 四層 |
| [AI Prompt Engineering: A Deep Dive](../readings/w1_ai_prompt_engineering_deep_dive.md) | Anthropic 圓桌 | 寫 prompt = 給聰明 contractor 的清楚 brief，不是奇技淫巧 |
| [How OpenAI Uses Codex](../readings/w1_how_openai_uses_codex.md) | OpenAI 內部 PDF | 7 個 production use case + 5 條 best practice，最該讀的一篇 |

**閱讀優先順序**：時間有限的話，先讀 [How OpenAI Uses Codex](../readings/w1_how_openai_uses_codex.md)（最 actionable）→ 再讀 [Anthropic deep dive](../readings/w1_ai_prompt_engineering_deep_dive.md)（業界視角）→ 有時間補 Karpathy YouTube（基礎理論）。

## Assignment：LLM Prompting Playground

- **Source**: [github.com/mihail911/modern-software-dev-assignments/tree/master/week1](https://github.com/mihail911/modern-software-dev-assignments/tree/master/week1)
- **任務描述**: 練習用不同 prompting 技巧（zero-shot、few-shot、CoT、structured output）解決一系列 task，比較 output 差異，培養「prompt 是可工程化物件」的直覺。
- **自學者可行性**: ⭐⭐⭐⭐⭐ 完全可做。需要 OpenAI 或 Anthropic API key（前者有 $5 免費額度、後者有 free tier）。預估 2-4 hr。

> 💡 **沒有 API key 的替代方案**：用 [Anthropic console](https://console.anthropic.com/workbench) 或 [OpenAI playground](https://platform.openai.com/playground) 直接在 web UI 操作，免錢上手。

## 對 Vibe Coder 的應用

這週的概念怎麼套到你日常用 Claude Code / Cursor 的工作流？

1. **建立 LLM 心智模型** — 下次 Claude 給你錯答案，先問自己「這是 hallucination（pre-training 沒學到）還是 context 沒給夠（post-training 沒看過你 codebase）？」前者要 RAG 或網路搜尋，後者要把 context 餵清楚
2. **養成「Ask Mode 先於 Code Mode」習慣** — 用 Claude Code 寫新功能前先問「請幫我列出實作計畫，先不要寫 code」，等你 review 完再讓它落地。這一招會省超多 rollback 時間
3. **Repo 加 `CLAUDE.md`** — 把專案的命名慣例、業務邏輯、常見 quirks 寫進去（同 OpenAI 內部的 `AGENTS.md`）。Claude Code 每次都會讀，等於 persistent context
4. **Few-shot examples 不只給格式** — 給 example 時挑「你期望它怎麼推理」的 case，不只是「你期望它輸出什麼格式」。這個差異對 reasoning task 特別大
5. **Structured output 走 XML tag** — Claude 對 `<output>` `<thinking>` 之類 XML 比 JSON 配合度更高，逼它產 structured data 時用 XML 比較穩

> 💡 **vibe coder 的 Day-1 Quick Win**：今天就在你的 side project repo 加 `CLAUDE.md`，內容寫 (a) 這個 repo 在做什麼（一段話）、(b) 命名慣例（snake_case / camelCase / PascalCase）、(c) 任何「Claude 容易搞錯的事」（例：用 pnpm 不是 npm、用 Tailwind v4 syntax 不是 v3）。你會發現 Claude Code 的輸出立刻變得不一樣。

---

**上一週**：（無 — 本週是第 1 週） | **下一週**：[W2 The Anatomy of Coding Agents](02_anatomy_of_coding_agents.md)
