---
week: 3
title: "Week 3：The AI IDE"
title_zh: "AI 整合開發環境"
dates:
  - "Mon 2025-10-06"
  - "Fri 2025-10-10"
topics:
  - "Context management and code understanding"
  - "PRDs for agents"
  - "IDE integrations and extensions"
guest_speaker:
  name: "Silas Alberti"
  title: "Head of Research"
  org: "Cognition"
  product: "Devin"
status: complete
---

> **本週你會學到什麼**：AI IDE（Cursor、Windsurf、Zed、Continue.dev）怎麼管理 codebase context、怎麼讀懂大型 codebase；以及 spec / PRD 在 agent 時代的角色變化（"specs are the new source code"）。Friday 由 Cognition（Devin 母公司）的 Head of Research Silas Alberti 開講。

## 學習目標

完成本週後，你應該能：

1. **解釋** context window 為什麼是 AI IDE 最關鍵的瓶頸，以及 RAG / chunking / re-ranking 怎麼解決
2. **撰寫** 一份能餵給 agent 的 PRD（Product Requirements Document），含 spec、acceptance criteria、guardrails
3. **設定** Claude Code / Cursor 的 context loading（CLAUDE.md / `.cursorrules`、MCP servers、custom commands）
4. **評估** Devin 跟 Claude Code 的設計哲學差異（autonomous agent vs interactive collaborator）

## 核心概念導讀

### 一、Context Engineering 的三大課題：Selection、Compression、Decay

W2 把 agent 拆成「LLM + tool + while loop」，但只要你實際用 Claude Code 寫過 non-trivial 任務，就會遇到一個 W2 沒講的瓶頸 — **context window 不是越大越好**。Drew Breunig 在 [How Long Contexts Fail](../readings/w3_how_long_contexts_fail.md) 把這件事拆成 4 種具體的 failure mode：

1. **Context poisoning（脈絡中毒）** — Hallucination 一旦寫進對話 context 就會被反覆 self-reference，agent 朝不可能的目標前進。Gemini 玩 Pokémon 的著名 case：模型某輪生成「我已經拿到 X 道館徽章」（其實沒有），之後幾百輪 reasoning 都基於這個錯誤前提。
2. **Context distraction（脈絡分心）** — Context 過長時模型會偏向「重複歷史 action」而非用 train 出來的 reasoning 重新規劃。小模型 ~32k token 後開始崩、大模型 ~100k 後也會。
3. **Context confusion（脈絡混淆）** — Berkeley Function-Calling Leaderboard 顯示 8B 模型給 19 個 tool 還能用、46 個就崩。**tool 越多 ≠ agent 越強**，反而 routing accuracy 直接下降。
4. **Context clash（脈絡衝突）** — Microsoft / Salesforce 研究顯示「分輪餵相同資訊」比「一次性餵」accuracy 下降 39%。多輪對話一旦走偏，回不來。

理解這 4 種 failure 後，**context engineering** 就拆成三件事：

| 課題 | 問題 | 解法 |
|------|------|------|
| **Selection（選擇）** | 從 1M token codebase 裡，這次 task 該餵哪些 file 進 context？ | RAG、grep + re-rank、`@file` reference、CLAUDE.md routing |
| **Compression（壓縮）** | Context 用到 60% 後怎麼濃縮？ | `/compact` summary、subagent isolation、phase-boundary checkpoint |
| **Decay（衰減）** | 長 session 怎麼防 drift？ | `<system-reminder>` 重述目標、`/clear` 重啟、phase-spec re-anchor |

humanlayer 團隊在 [Getting AI to Work In Complex Codebases](../readings/w3_getting_ai_to_work_in_complex_codebases.md) 直接喊出 ACE-FCA（Advanced Context Engineering for Coding Agents）的核心命題：「**context window 的內容是你影響 output 品質的唯一槓桿**」。Agent 是 stateless function — 同樣的 context window 給同樣的 model 永遠產出同樣品質。所以使用者最高槓桿的工作就是 curate 那個 window。

> 💡 **譯解**：context engineering 跟臨床問診同構。問診（context selection）漏問就鑑別診斷漏；問診冗長（context bloat）就抓不到重點；前後病史矛盾（context clash）就推不出結論。Claude Code 寫不好 code 時，先檢查的不是 prompt 措辭，是「我有沒有給它對的 file」。

### 二、Specs Are the New Source Code — 工作流的反轉

W1/W2 還在「prompt 怎麼寫」的層級。Week 3 把視角拉高一階：**當 AI 把 implementation 從週縮到分鐘，瓶頸從「會不會寫 code」變成「能不能描述清楚需求」**。Ravi Mehta 在 [Specs Are the New Source Code](../readings/w3_specs_are_the_new_source_code.md) 借 Sean Grove 的話：傳統世界是 source code（人讀）→ binary（機器讀），AI 時代等於「把 source 撕碎，反而謹慎 version control 那個 binary」 — 因為 code 只是 intent 的 **lossy projection（有損投射）**，spec 才是完整需求。

Workflow 的反轉是這週的核心命題：

| 傳統 workflow | AI agent workflow |
|---|---|
| Idea → Spec → Prototype → 痛苦修改 | **Rapid prototype → 真實 customer feedback → 凝結成 crystal-clear spec → 大量再生** |
| Spec 寫得糊也能補救（人類工程師會問問題） | Spec 寫得糊 = code 寫得糊（agent 不會主動 challenge） |
| Code = single source of truth | **Spec = single source of truth**，code 是 spec 的可重生產出 |
| Code review 抓 bug | **Spec review** 抓 bug（一行 spec 錯 = 100 行 code 錯） |

對 PM、designer 也有解放性影響 — 過去想改一個 button 行為要排工程 sprint，現在寫得清楚的 spec 直接餵給 Claude Code 就能落地。Mihail 在 Monday lecture 會花相當時間講 PRD（Product Requirements Document）怎麼寫成「agent 看得懂的 spec」 — 含 user story、acceptance criteria、guardrails、non-goals 四個 block。

### 三、IDE Integration 的演化：從 autocomplete 到 manager mode

[Devin: Coding Agents 101](../readings/w3_devin_coding_agents_101.md) 把開發者 AI tool 的演化分成四代，每一代的 IDE integration 都不同：

| 世代 | 時期 | 代表 | IDE 整合方式 |
|------|------|------|------------|
| **Autocomplete** | ~2015 | TabNine、Kite | method 級補完，typing 旁邊跳建議 |
| **Copilot** | ~2021 | GitHub Copilot | 多行 inline suggestion，按 Tab 接受 |
| **Generative chatbot** | ~2023 | Cursor Chat、Claude.ai | 檔案級 chat panel，貼 code 改 code |
| **Autonomous agent** | 2024-now | Devin、Claude Code、Cursor agent mode | end-to-end task 委派，從 prompt 到 PR |

每一代的 IDE 都在解決前一代的瓶頸：autocomplete 解決打字慢、copilot 解決 boilerplate、chatbot 解決「跨檔案 context」、agent 解決「多步驟自我 iterate」。但 agent 帶來新問題 — IDE 不再只是 editor，要兼容 background task、long-running process、agent state visualization。Cursor 的 agent panel、Claude Code 的 CLI session、Devin 的 web UI 各有不同設計取捨。

### 四、Devin vs Claude Code 的設計哲學張力

Friday lecture 由 Cognition 的 Silas Alberti 開講，這節的張力預設是「Devin 的 autonomous-first 哲學 vs Anthropic Claude Code 的 interactive-first 哲學」。對比軸向：

| 軸向 | Devin（Cognition） | Claude Code（Anthropic） |
|------|-------------------|------------------------|
| **預設介入頻率** | 低 — 接 task 後 hours 級自跑 | 高 — 每個 tool call 都可被打斷 |
| **UI 形態** | Web app + cloud sandbox VM | CLI / IDE plugin，跑在 user 機器 |
| **錯誤恢復** | 自我 iterate test/CI 直到 green | 多半丟回 user 決定 |
| **適合任務** | scoped、有 clear acceptance criteria | exploratory、需 user judgment |
| **Engineering manager mode** | 強調，sales pitch 是「同時 supervise 5 個 Devin」 | 弱，focus 在「你跟一個 Claude 對話」 |

Devin 強調 **architecture-first prompting**（講 *how* 不只 *what*）、**defensive prompting**（預先告訴 agent 哪些坑）、**feedback loop quality**（type / test / lint signal）。但作者明確降溫：對大型任務 expect **~80%** 時間節省，不是完全自動化。這個誠實的 ratio 是工業界共識。

[Writing Effective Tools for Agents](../readings/w3_writing_effective_tools_for_agents.md)（Anthropic engineering blog）則提供 tool design 的深度原則 — strategic selection（少而精）、meaningful naming（namespace prefix）、contextual response（semantic name 取代 UUID）、token-efficient implementation、descriptive specifications（像跟新進員工解釋）。這些 principle 是 Devin / Claude Code / Cursor 共通的 agent infrastructure layer。

## Monday Lecture（10/6）：From first prompt to optimal IDE setup

- **Slides**: [Google Slides（需 Stanford 帳號）](https://docs.google.com/presentation/d/11pQNCde_mmRnImBat0Zymnp8TCS_cT_1up7zbcj6Sjg/edit?usp=sharing)
- **Design Doc Template**: [Drive 連結](https://drive.google.com/file/d/1MZ0Qx68Vzw4x5x_XcV8XiPLp7fFDe1LJ/view?usp=drive_link)
- **講者**: Mihail Eric

> Slides 需 Stanford 帳號，依 lecture title + reading 主題 best-effort 重建：

這節的主線是「從零開始打造 production-ready 的 AI IDE setup」。預期內容：

1. **Recap：W1/W2 的 prompt + agent 結構** — 為什麼 base prompt + tool calling 不夠應付真實 codebase（context window 飽和、跨檔案 reasoning 失準、tool selection 混淆）
2. **Context engineering 的三層 stack** —
   - Layer 1: **Persistent context** — `CLAUDE.md` / `.cursorrules` / `AGENTS.md`，repo level 永久 load
   - Layer 2: **Session context** — `@file` reference、screenshot、CLI tool output，當下 task 灌入
   - Layer 3: **On-demand context** — MCP server、subagent、`Skills`，按需求載入避免污染主對話
3. **PRD 對 agent 的版本** — 用 design doc template 走一遍：user story、acceptance criteria、guardrail、non-goal、verification 五段。重點是「能不能餵給 Claude Code 直接 implement」
4. **MCP server / custom slash command 配置** — 把 W2 學的 MCP 接到 IDE：Claude Desktop config、Cursor MCP integration、custom slash command 怎麼寫一個
5. **Live demo：從 zero 到 ship 一個小 feature** — 用 Cursor 或 Claude Code 在 demo repo 走一次完整流程：寫 PRD → load context → plan → implement → verify → commit
6. **Common pitfall** — CLAUDE.md 過長導致 important rule 被淹、tool 太多導致 routing accuracy 下降、context decay 在 long session 的徵兆

**Key takeaway**：optimal IDE setup 不是工具越多越好，是「為這個 codebase + 這個 task 量身配置 minimum viable context」。

## Friday Lecture（10/10）：Silas Alberti（Cognition）

- **Speaker**: [Silas Alberti](https://www.linkedin.com/in/silasalberti/), Head of Research at [Cognition](https://cognition.ai/)
- **Slides**: [Google Slides（需 Stanford 帳號）](https://docs.google.com/presentation/d/1i0pRttHf72lgz8C-n7DSegcLBgncYZe_ppU7dB9zhUA/edit?usp=sharing)

> Slides 需 Stanford 帳號，依 Cognition / Devin 的公開資料 best-effort 重建：

**Cognition 與 Devin 背景**：Cognition 是 2023 年成立的 SF AI startup，2024 年 3 月推出 Devin，被定位成「世界第一個 AI software engineer」。早期 demo 在 SWE-bench 拿到當時 SOTA（13.86% resolved rate vs Claude 2 的 4.8%），引發 vibe coding / agent 熱潮。Silas Alberti 是 Head of Research，負責 model post-training 與 agent architecture。

預期 lecture 走向：

1. **Devin 的 design philosophy** — 為什麼選 fully autonomous + cloud sandbox 而不是 IDE plugin？背後的 thesis 是「engineer 應該變 manager，不是 pair programmer」。Devin 用 web UI + persistent VM 強迫 user 進入 manager mode
2. **Cognition 的 agent architecture** — 不是 single-agent loop，是 multi-agent + planner + verifier 的組合。怎麼處理 long-horizon task（需要 hours 級執行）的 state management、context decay、failure recovery
3. **Real-world failure modes & lessons** — Devin 上線後最常見的失敗 case（任務太 open-ended、verification 不充分、人類期待錯位）。為什麼 80% 自動化 ≠ 80% 業務時間節省（review cost 也算）
4. **Comparison：Devin vs Claude Code vs Cursor agent** — 不同 autonomy default 的 trade-off，什麼任務適合哪個工具
5. **Future direction** — Cognition 的 research bet（更長 context、更好 long-horizon planning、reliability over capability）。對 SWE-bench 之類 benchmark 飽和後，下一個 evaluation paradigm 會是什麼
6. **Q&A 預期熱點** — Devin 的 unit economics（一個 task 多少美金）、how to evaluate when to use Devin vs human、open-source agent 對 Cognition 的競爭威脅

**Key takeaway**：「autonomous agent」不是 marketing buzzword，是一條跟「interactive collaborator」並行的設計路線。理解兩種哲學的 trade-off，才能在實務上挑對工具。

## Reading 摘要

| 篇名 | 來源 | 一句話重點 |
|------|------|-----------|
| [Specs Are the New Source Code](../readings/w3_specs_are_the_new_source_code.md) | Ravi Mehta blog | Code 是 intent 的 lossy projection，spec 才是 AI 時代的 single source of truth |
| [How Long Contexts Fail](../readings/w3_how_long_contexts_fail.md) | dbreunig.com | 1M context ≠ 更好答案，4 種 failure mode（poisoning / distraction / confusion / clash）都會搞爛 agent |
| [Devin: Coding Agents 101](../readings/w3_devin_coding_agents_101.md) | devin.ai | Coding agent ≠ autocomplete / copilot / chatbot，是 end-to-end 的不同物種，工程師變 manager |
| [Getting AI to Work In Complex Codebases (ACE-FCA)](../readings/w3_getting_ai_to_work_in_complex_codebases.md) | github.com/humanlayer | Research → Plan → Implement 三段式 + frequent intentional compaction，brownfield codebase 工業級配方 |
| [How FAANG Vibe Codes](../readings/w3_how_faang_vibe_codes.md) | X / Twitter | 原文需登入 X，best-effort 推測：個人 vibe coding workflow 在大型 codebase 不能照搬 |
| [Writing Effective Tools for Agents](../readings/w3_writing_effective_tools_for_agents.md) | Anthropic engineering | Tool 不是 API — 少而精、namespace 命名、semantic output、actionable error，evaluation-driven 迭代 |

**閱讀優先順序**：時間有限的話，先讀 [ACE-FCA](../readings/w3_getting_ai_to_work_in_complex_codebases.md)（最 actionable，三段式 workflow 直接套用）→ [How Long Contexts Fail](../readings/w3_how_long_contexts_fail.md)（理解 failure mode 才知道為什麼三段式有效）→ [Specs Are the New Source Code](../readings/w3_specs_are_the_new_source_code.md)（mindset 翻轉）→ [Writing Effective Tools](../readings/w3_writing_effective_tools_for_agents.md)（自己寫 MCP / skill 時必讀）。

## Assignment：Build a Custom MCP Server

- **Source**: [github.com/mihail911/modern-software-dev-assignments/blob/master/week3/assignment.md](https://github.com/mihail911/modern-software-dev-assignments/blob/master/week3/assignment.md)
- **任務描述**: 用 W2 學的 MCP SDK 實作一個 production-grade MCP server，把外部資料源（資料庫 / API / 檔案系統 / SaaS 工具）包成 Claude Desktop / Cursor 可直接呼叫的 tool。重點是套用 [Writing Effective Tools](../readings/w3_writing_effective_tools_for_agents.md) 的設計原則：strategic tool consolidation（不要把每個 endpoint 都 wrap 成 tool）、semantic output、descriptive specifications、actionable error message。建議的 server 主題：你日常會查的 API（個人筆記、研究資料庫、健保碼、PubMed、Google Calendar），或把 W2 的 MCP server 升級成 production 品質。
- **自學者可行性**: ⭐⭐⭐⭐ 完全可做但比 W2 進階。需要 W2 的 MCP 基礎、能寫 TypeScript 或 Python、有想包的外部資料源（自己的 PubMed query / Obsidian vault / 個人 API key）。預估 4-8 hr，含寫 code + 在 Claude Desktop 實測迭代。

> 💡 **沒有外部資料源也能做**：用 SQLite + 假資料 dump 模擬資料庫，重點是練 tool consolidation 與 description 寫法 — design quality 不需要真實資料才能證明。

## 對 Vibe Coder 的應用

W3 是 vibe coder 從「會用 Claude Code」升級到「能規模化用 Claude Code」的關鍵一週。實戰建議：

1. **任何 non-trivial 任務先寫 1 頁 spec** — 不寫的代價是反覆改 5 次都不對。Spec 含 4 個 block：(a) user 是誰、(b) 要做什麼、(c) 成功長怎樣（驗收標準）、(d) 不做什麼（non-goal）。5 分鐘 spec 換 2 小時 debug 是夯爆的 ROI
2. **採用 Research → Plan → Implement 三段式** — 別讓 Claude Code 一接 task 就開寫。先讓它 research（理解 codebase / 現有 pattern）、產 plan.md（你 review 完才放行）、最後 implement。**人力放在 plan review 而非 code review**，因為一行 plan 錯 = 100 行 code 錯
3. **CLAUDE.md 當 code 維護** — 每行都問「刪掉會不會出錯」。過長會讓重要 rule 被淹（Drew Breunig 的 context distraction）。建議結構：repo 在做什麼（一段話）、命名慣例、業務 quirks、絕不做的事。其他 domain knowledge 走 skill 或 subagent，別塞 CLAUDE.md
4. **Tool / MCP server 不是越多越好** — Berkeley function-calling 數據顯示 tool > 30 個就開始崩。挑你真會用的 5-10 個 MCP server 就好。寫自己的 MCP 時，把「3 個 low-level operation」合併成「1 個 high-level tool」，agent 友善太多
5. **Long session 出現重複錯誤 = context poisoning，立刻 `/clear`** — 不要繼續解釋，會越解越糟。重啟，把正確結論寫進 CLAUDE.md / spec，再開新 session 跑一次
6. **Subagent 處理 expensive exploration** — grep、找檔案、跑長 search 派 subagent 跑，主對話只接 summary。Claude Code 的 Task tool 直接支援，這招會讓主 session 的 context 維持 40-60% 健康水位

> 💡 **vibe coder 的 Day-1 Quick Win**：今天就在你最常用的 side project 試一次完整三段式：(1) 寫 1 頁 spec.md（含 user story + acceptance criteria）、(2) `/clear` 開新 session、(3) 對 Claude Code 說「先讀 spec.md，產出 plan.md，先不要 implement」、(4) review plan、(5) 確認後說「按 plan 執行」。你會發現一次到位的 ratio 從 30% 跳到 80%。從此回不去舊 workflow。

---

**上一週**：[W2 The Anatomy of Coding Agents](02_anatomy_of_coding_agents.md) | **下一週**：[W4 Coding Agent Patterns](04_coding_agent_patterns.md)
