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

- **Slides**: [Google Slides（需 Stanford 帳號）](https://docs.google.com/presentation/d/1zT2Ofy88cajLTLkd7TcuSM4BCELvF9qQdHmlz33i4t0/edit?usp=sharing)
- **講者**: Mihail Eric（course instructor）

> Slides 需 Stanford 帳號，內容依 lecture topic 與課程脈絡 best-effort 重建：

開課第一節要建立 mental model — LLM 不是魔法，是一條 pre-training → SFT → RLHF 的工業生產線。Mihail 在這節會：

1. **過 course logistics** — 評分（80% final / 15% weekly / 5% participation）、prereq、weekly assignment 流程、final project 期待
2. **拆 LLM 製造流程**（核心 30 分鐘）— 用圖示走一次 base model → instruction-tuned → aligned model 三段。重點是 base model 的 next-token prediction 本質、為什麼 SFT 能改變模型行為、RLHF 怎麼用 reward model 引導
3. **解釋 capability spectrum** — 為什麼 GPT-5 / Claude Opus 級別模型能寫複雜 React app 但會數錯字母。Tokenization、context window、knowledge cutoff 三個常見限制
4. **Coding 為什麼是 LLM 最 hot 的應用** — 程式碼有明確語法、可被 unit test 驗證、有大量 GitHub training data，三項條件讓它成為 LLM 最早 commercialize 的領域

**Key takeaway**：把 LLM 當「讀過全網路的 contractor」而非「魔法」，後續所有 prompt / agent / IDE 設計決策都會自然推導出來。

## Friday Lecture（9/26）：Power prompting for LLMs

- **Slides**: [Google Slides（需 Stanford 帳號）](https://docs.google.com/presentation/d/1MIhw8p6TLGdbQ9TcxhXSs5BaPf5d_h77QY70RHNfeGs/edit?usp=drive_link)
- **講者**: Mihail Eric

> Slides 需 Stanford 帳號，依 topic + Anthropic prompt engineering 業界共識重建：

第二節聚焦「power prompting」— 不是基礎介紹，是進階技巧 + 實戰。預期內容包括：

1. **Prompt 槽位設計** — system prompt（persistent rules）vs user prompt（task）vs few-shot examples vs structured output 四個槽位該放什麼
2. **CoT 與 thinking 的進化** — 從 "Let's think step by step" 到 Claude `<thinking>` block / OpenAI o1 的 reasoning effort，把 reasoning 顯式化的趨勢
3. **Structured output 工程化** — XML tag、JSON schema、Pydantic model、Zod schema 強制 model 產出可被下游 parse 的格式
4. **Prompt chaining** — 把一個複雜任務拆成多個 prompt，每個專注一件事
5. **Common failure modes 與 debug 法** — model 漏指令、過度諂媚、edge case 處理失敗時怎麼從 prompt 著手

實務上 Mihail 應該會 demo 用 OpenAI / Anthropic playground 當場改 prompt 看效果，演示「prompting 是可被工程化的物件」這個核心概念。

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
