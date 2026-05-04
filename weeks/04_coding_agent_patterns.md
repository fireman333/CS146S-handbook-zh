---
week: 4
title: "Week 4：Coding Agent Patterns"
title_zh: "Coding Agent 工作模式"
dates:
  - "Mon 2025-10-13"
  - "Fri 2025-10-17"
topics:
  - "Managing agent autonomy levels"
  - "Human-agent collaboration patterns"
guest_speaker:
  name: "Boris Cherny"
  title: "Creator"
  org: "Anthropic"
  product: "Claude Code"
status: complete
---

> **本週你會學到什麼**：當你用 Claude Code 寫東西時，agent 應該多自動 vs 你應該插手到什麼程度？本週講 agent autonomy levels（從「打 autocomplete」到「全自動接管」5 個層級）和 human-agent collaboration patterns。Friday 由 Claude Code 的創造者 Boris Cherny 親自開講。

## 學習目標

完成本週後，你應該能：

1. **辨識** agent autonomy 5 個層級（suggest → preview → execute-with-review → autonomous-with-checkpoints → fully autonomous）
2. **應用** Claude Code best practices（CLAUDE.md、custom slash commands、hooks、subagents）
3. **設計** human-agent handoff 流程（什麼任務該全自動、什麼該停下來問）
4. **評估** Claude Code、Cursor agent mode、Codex 在 agent management 哲學上的差異

## 核心概念導讀

### 一、Agent Autonomy 5 個層級 — 從 autocomplete 到 fully autonomous

W3 用 Devin 的 4 代分類描述了「世代」演化（autocomplete → copilot → chatbot → agent）。Week 4 把鏡頭拉到「同一個 agent 在不同任務下，autonomy 應該調到哪一級」 — 因為實務上你不會永遠用同一個 mode。Mihail 在 lecture 會用 5 個層級的 autonomy spectrum 教這件事：

| Level | 名稱 | 介入頻率 | 適用任務 |
|-------|------|---------|---------|
| **L1** | Suggest | 每 token / 每行 | 補完一段 boilerplate、寫 docstring |
| **L2** | Preview | 每 diff | 改一個 function、加一個 test |
| **L3** | Execute-with-review | 每個 tool call 前 ack | 跨檔案 refactor、跑 destructive command |
| **L4** | Autonomous-with-checkpoints | 每 phase 邊界 review | feature implementation、含 plan / test / commit |
| **L5** | Fully autonomous | task end review only | scoped bug fix、依 clear acceptance criteria 跑 |

關鍵 insight：**autonomy 不是越高越好** — 反而要依任務類型動態調整。Exploratory（不知道答案、需要 user judgment）→ L2/L3；scoped 且有 verification（type / test / lint 全綠就算對）→ L4/L5。Claude Code 的 default 在 L3（每 destructive command 問），auto mode 把它推到 L4，背後是 classifier 自動審 risky operation。Devin 的 default 是 L5。Cursor agent mode 是 L4。

從 [Devin: Coding Agents 101](../readings/w3_devin_coding_agents_101.md) 來的 80% rule 在這裡發揮：**對大型任務 expect ~80% 時間節省**，剩下 20% 是 you-as-manager 的 review / re-direct 成本，跟 autonomy level 無關。Level 拉得再高也省不掉這 20%。

### 二、Anthropic 自己怎麼用 Claude Code

[How Anthropic Uses Claude Code](../readings/w4_how_anthropic_uses_claude_code.md) 是這週最 grounded 的 reading — 不是 marketing pitch，是 Anthropic 內部 10 個團隊的真實使用報告。共通 pattern 有三個：

1. **非技術人員大量使用** — finance、legal、growth marketing、product design 都是 power user。**他們的工作流是「用 plain text 描述流程 → 餵給 Claude Code 自動執行」**。Legal 團隊用它生成法規 mapping、growth marketing 用它跑 cohort analysis、design 用它把 Figma spec 翻成 production code
2. **Screenshot-driven debugging** — Kubernetes pod IP 耗盡、Google Cloud UI 導覽都靠截圖 + 自然語言描述就能 diagnose。這不是 demo，是 on-call engineer 真實 workflow
3. **Skill-gap bridging** — 工程師可以 vibe-code 出設計稿、設計師可以改 production code、legal 自動生成法規 mapping。**過去要排工程 sprint 的事，現在自己用 Claude Code 跑**

對 CS146S 學生的核心訊息：Claude Code 不是「coding assistant」是「team multiplier」。瓶頸從「會不會寫 code」轉成「能不能描述清楚需求」 — 這正好接回 W3 的 spec-driven 命題。

### 三、Claude Code 的 4 種擴充 primitive：CLAUDE.md / Skill / Subagent / Hook

[Claude Best Practices](../readings/w4_claude_best_practices.md) 把 Claude Code 的擴充機制整理成 4 種 primitive，每個解決不同層級的問題。理解這個分工是用好 Claude Code 的關鍵：

| Primitive | 何時 load | 解決什麼問題 | 用途範例 |
|-----------|----------|-------------|---------|
| **CLAUDE.md** | 每次對話 auto load | persistent context（永遠該記得的事） | repo 命名慣例、業務邏輯、絕不做的事 |
| **Skill** | 按需 load（trigger 詞 / 路由） | domain knowledge / workflow | NCCN guideline、IRB 表格、統計 pipeline |
| **Subagent** | spawn 獨立 context window | context isolation（避免污染主對話） | grep 大 codebase、跑 long-horizon research |
| **Hook** | deterministic trigger（pre/post tool） | 必須每次發生的動作 | lint、block migration 寫入、auto git commit |

重要原則 — **「必須每次發生」走 hook，不是 CLAUDE.md**。CLAUDE.md 是 prompt 給 model 看，model 偶爾會忽略；hook 是 deterministic script，harness 強制執行。「想做但不確定」走 skill / subagent，按需 load 不污染主 context。

[Peeking Under the Hood of Claude Code](../readings/w4_peeking_under_the_hood_of_claude_code.md) 用 LiteLLM proxy 攔截 Claude Code 真實送出的 API call，逆向工程出 4 個 internal pattern：(1) **context front-loading** session 開頭主動濃縮對話 / 判斷主題切換、(2) **`<system-reminder>` tag** 散布在多層 prompt 抵抗 long-context drift、(3) **prompt-based safety** 用專門 prompt 偵測 command injection 而非 hardcoded rule、(4) **conditional sub-agent reminder** 預設不注入 reminder 保持 focus、行為偏離才注入。**結論**：Claude Code 的成功不是 model 優勢，是系統化的 context scaffolding。

> 💡 **譯解**：Claude Code 的「魔法」其實全是 prompt engineering 紀律 — 每個 session 開頭都把目標壓成 50 字 title、每個 tool result 都包進 system reminder、每個 subagent 都隔離 context。這意味著你在自己的 long workflow 上也能模仿 — 在關鍵步驟前手動重述目標，比期待 model 自己記得可靠。

### 四、Community Framework 的兩種路線：specialized agent zoo vs meta-framework

社群已經沉澱出兩種主流的 Claude Code 擴充路線。

**路線 1：Specialized agent zoo**（[Awesome Claude Agents](../readings/w4_awesome_claude_agents.md)） — 把 24 個 specialized subagent 分四層編成「虛擬開發團隊」：(1) Orchestrators 3 個（Tech Lead、Project Analyst、Team Configurator）做路由、(2) Framework Specialists 13 個（Laravel、Django、Rails、React、Vue 各自的 backend / API / ORM 三組）、(3) Universal Experts 4 個跨棧、(4) Core Team 4 個（code reviewer、performance optimizer、documentation specialist、code archaeologist）做 QA。內建 auto-configurator 偵測 stack 自動派 specialist。命題是「specialized expertise + division of labor 勝過 solo Claude」。

**路線 2：Meta-framework**（[SuperClaude](../readings/w4_super_claude.md)） — 不是換 agent，是在 Claude Code 上層疊加 30 個 slash command + 20 個 specialized agent + 7 個 behavioral mode + 8 個 MCP server。Behavioral mode 是 SuperClaude 最獨到的概念 — 不是 agent 也不是 command，是「整段對話的操作脈絡」（Brainstorming Mode 讓所有後續回應變成 Q&A 探索風格、Token-Efficiency Mode 強制簡短）。設計哲學強調「framework footprint 要小，把 context window 留給 project code」。

兩條路線的 trade-off：specialized agent zoo 邊界清楚但 maintenance 成本高（24 個 agent 要維護）；meta-framework 整合度高但 lock-in 強（會跟你既有 CLAUDE.md / skill 衝突）。

[Good Context Good Code](../readings/w4_good_context_good_code.md)（標題即論點） — agent 寫不好 code，瓶頸不在 model 而在 context 品質。**寫不好時先別罵 model 也別重寫 prompt — 先問三個問題**：(a) 我有給它 reference file 嗎？(b) 我有給它 verification（test / expected output）嗎？(c) CLAUDE.md / skill 裡有沒有相關 domain knowledge？三個都做了還錯，再考慮其他原因。這跟臨床 history-taking 同構：問診（context）做不好，鑑別診斷（output）一定不會準。

## Monday Lecture（10/13）：How to be an agent manager

- **Slides**: [Google Slides（需 Stanford 帳號）](https://docs.google.com/presentation/d/19mgkwAnJDc7JuJy0zhhoY0ZC15DiNpxL8kchPDnRkRQ/edit?usp=sharing)
- **講者**: Mihail Eric

> Slides 需 Stanford 帳號，依 lecture title + reading 主題 best-effort 重建：

這節的核心是 mindset shift — 從「pair programmer 跟 agent 並肩寫 code」變成「agent manager 委派 + 驗收」。預期內容：

1. **The mindset shift** — 為什麼用 Claude Code 還用 pair programming 思維會卡？因為你會不停插手，agent 沒機會 iterate。Manager mode 的反直覺：放手讓 agent 跑錯一輪，從 error trace 自己 recover，比你介入更快
2. **Autonomy spectrum revisit** — 把 5 個 level 套到具體任務上 demo：「補一個 typo」L1、「加一個 React component」L2、「跨檔案 refactor」L3、「實作完整 feature」L4、「fix scoped bug + 跑 CI」L5。Level 不是 agent 屬性是 task 屬性
3. **Context design for agent manager** — 你給 agent 的 context 不是越多越好，是「**剛好讓它能 self-verify**」。包含三件事：goal（驗收標準）、constraint（不能做什麼）、verification（怎麼知道做完）。少了 verification，agent 就只能丟回給你問
4. **When to interrupt vs when to let it run** — 紅燈：agent 重複犯同一個錯（context poisoning）、agent 在 loop 卡住（distraction）、agent 開始改不該改的 file（confusion）。綠燈：agent 在 plan 階段、agent 寫 test、agent 跑 long search
5. **Live demo: managing 3 parallel agents** — 用 git worktree 同時跑 3 個 Claude Code session 解 3 個獨立 task。展示 fan-out 工作流、context isolation、最後合併到 main 的工作流
6. **Common manager anti-pattern** — micromanagement（每個 tool call 都打斷）、abdication（完全不 review 直接 merge）、context overload（一個 session 做太多事）

**Key takeaway**：成為 agent manager 不是技術升級，是 mindset 升級。從「我跟 agent 寫 code」變成「我設計任務 + 驗收 agent 產出」。能不能放手是 vibe coder 升級的天花板。

## Friday Lecture（10/17）：Boris Cherny（Claude Code creator）

- **Speaker**: [Boris Cherny](https://www.linkedin.com/in/bcherny/), Creator of [Claude Code](https://www.anthropic.com/claude-code)
- **Slides**: [Google Slides（需 Stanford 帳號）](https://docs.google.com/presentation/d/1bv7Zozn6z45CAh-IyX99dMPMyXCHC7zj95UfwErBYQ8/edit?usp=sharing)

> Slides 需 Stanford 帳號，依 Boris Cherny 公開訪談 / blog / Anthropic best practice 文件 best-effort 重建：

**Boris Cherny 與 Claude Code 背景**：Boris Cherny 在 Anthropic 主導打造 Claude Code，2024 年起以「research preview」形式釋出。他的設計哲學跟同期 IDE-based agent（Cursor、Windsurf）形成明顯對比 — Claude Code 走 CLI-first 路線，宣稱「terminal is the operating system for engineers」。Boris 在多個 podcast / blog 談過為什麼選這條路。

預期 lecture 走向：

1. **Why CLI, not IDE?** — IDE plugin 受限於 IDE 的 UI metaphor（buffer / panel / shortcut），CLI 反而是「universal interface」，所有 dev tool（git、npm、kubectl、SSH）都跑在 CLI。Claude Code 在 CLI 內等於擁有完整 dev environment 的存取權，IDE plugin 永遠隔一層
2. **Anthropic 自己 dogfood 的故事** — Boris 會講 Claude Code 在 Anthropic 內部的 evolution。從 internal tool → research preview → public product 的反直覺路徑：先讓「會用 LLM 的工程師」每天用，再放給外部
3. **設計取捨：minimal harness, maximal model leverage** — Claude Code 的 design principle 是「harness 做的事越少越好，把 leverage 留給 model」。對比 Devin / Cursor 那種「重 framework + 多 fallback」哲學
4. **Subagent / hook / skill 的設計演化** — 為什麼這 4 個 primitive 各自存在？（CLAUDE.md / Skill / Subagent / Hook）。Boris 會講每個 primitive 的設計討論、被砍掉的 alternative、未來方向
5. **Reverse-engineering 別人逆向他的回應** — [Peeking Under the Hood](../readings/w4_peeking_under_the_hood_of_claude_code.md) 揭露的 `<system-reminder>` tag、context front-loading 之類 implementation detail，Boris 會公開講設計動機（Anthropic 從不藏 prompt 是 unique culture）
6. **What Claude Code is NOT** — Boris 通常會強調 Claude Code 不是 IDE 替代品、不是 Devin 替代品、不是 SuperClaude / Awesome Claude Agents 那種 framework 替代品。它是 *primitive*，社群在上面 build 才是健康生態
7. **Q&A 預期熱點** — 為什麼不做 multi-agent orchestration？plugin marketplace 路線圖？Anthropic 內部最有趣的 Claude Code use case？Claude Code 的 unit economics？

**Key takeaway**：Claude Code 是「opinionated primitive」 — 設計哲學是把 power user 的 leverage 最大化，而非把 onboarding 簡化。理解這個 thesis 才知道為什麼它的 UX 看起來「不夠 polished」其實是刻意的。

## Reading 摘要

| 篇名 | 來源 | 一句話重點 |
|------|------|-----------|
| [How Anthropic Uses Claude Code](../readings/w4_how_anthropic_uses_claude_code.md) | Anthropic PDF | 內部 10 個團隊（含 legal、design、growth marketing）都用 Claude Code，是 team multiplier 不是 coding assistant |
| [Claude Code Best Practices](../readings/w4_claude_best_practices.md) | Anthropic engineering | 4 種 primitive（CLAUDE.md / Skill / Subagent / Hook）+ Explore→Plan→Implement→Commit 工作流 |
| [Awesome Claude Agents](../readings/w4_awesome_claude_agents.md) | github.com/vijaythecoder | 24 個 specialized subagent 編成「虛擬開發團隊」(orchestrator + specialist + universal + core team) |
| [SuperClaude Framework](../readings/w4_super_claude.md) | github.com/SuperClaude-Org | Meta-framework：30 command + 20 agent + 7 mode + 8 MCP 疊加在 Claude Code 上層 |
| [Good Context, Good Code](../readings/w4_good_context_good_code.md) | Stock app blog | Code quality ∝ context quality；agent 寫不好先檢查 context，不是 prompt 措辭 |
| [Peeking Under the Hood of Claude Code](../readings/w4_peeking_under_the_hood_of_claude_code.md) | OutsightAI Medium | LiteLLM 攔截逆向工程出 4 個 pattern（front-loading / `<system-reminder>` / prompt-based safety / conditional sub-agent） |

**閱讀優先順序**：先讀 [How Anthropic Uses Claude Code](../readings/w4_how_anthropic_uses_claude_code.md)（看真實使用樣貌建立期待）→ [Claude Code Best Practices](../readings/w4_claude_best_practices.md)（4 primitive 是核心教科書）→ [Peeking Under the Hood](../readings/w4_peeking_under_the_hood_of_claude_code.md)（理解設計哲學）→ [Good Context, Good Code](../readings/w4_good_context_good_code.md)（debug mindset）→ [Awesome Agents](../readings/w4_awesome_claude_agents.md) / [SuperClaude](../readings/w4_super_claude.md) 兩個 community framework 看興趣選讀。

## Assignment：Coding with Claude Code

- **Source**: [github.com/mihail911/modern-software-dev-assignments/blob/master/week4/assignment.md](https://github.com/mihail911/modern-software-dev-assignments/blob/master/week4/assignment.md)
- **任務描述**: 在你選的 repo 裡完整實踐 Claude Code 4 種 primitive：(1) 寫一份精簡 `CLAUDE.md`（每行可審）、(2) 建一個 custom slash command（`.claude/commands/<name>.md`）、(3) 寫一個 subagent definition（`.claude/agents/<name>.md`）做 expensive search、(4) 設一個 hook（`.claude/settings.json`）強制 lint 或 block 危險命令。再用這套配置完成一個 non-trivial 的 feature 或 refactor，產出含 `plan.md` + `verification.md` + 最終 PR 的完整 trace。重點是體驗「Explore → Plan → Implement → Commit」工作流的 friction 與 ROI。
- **自學者可行性**: ⭐⭐⭐⭐⭐ 100% 可做。Claude Code 有 free tier，配 GitHub free repo 就能跑完。預估 4-6 hr，含 setup（1 hr）+ 寫 4 種 primitive（1.5 hr）+ 跑完整工作流（2.5 hr）。

> 💡 **不知道用什麼 repo 練？** 拿你既有的 side project（哪怕只有 50 行 code）就好。重點不是 codebase 大小，是把 4 個 primitive 各寫一個跑過一次的肌肉記憶。沒 side project 的話，從 scratch 開個 todo list app 也行。

## 對 Vibe Coder 的應用

W4 是 vibe coder 整個 10 週課程裡 **ROI 最高**的一週 — 把 Claude Code 4 個 primitive 練熟，後續 6 週的所有工具（Modern Terminal、CI/CD、Production Ops）都會省一半時間。實戰建議：

1. **CLAUDE.md 三層結構** — 不是流水帳，要有結構：(a) repo 在做什麼（一段話）、(b) **絕不做的事**（最重要、列 5-8 條）、(c) 命名 / 風格慣例。每行都問「刪掉會不會出錯」 — 會的留下、不會的刪。Boris Cherny 自己在 podcast 講過 Anthropic 內部 CLAUDE.md 平均才 30-50 行，越短越有效
2. **Custom slash command 從「你最常打的同一段 prompt」開始** — 你發現自己每次都打「先讀 X、再分析 Y、最後輸出 Z」？把它寫成 `.claude/commands/<name>.md`，下次 `/<name>` 就跑完。對醫學研究 workflow 特別有用 — 「`/table1`」「`/km-curve`」「`/oe-search`」這類重複任務都該是 slash command
3. **Subagent 處理 expensive 探索** — 主對話開始爆 context 前就派 subagent。三個 typical use case：(a) 探索陌生 codebase（`code-archaeologist` 風格 agent）、(b) 跨 repo grep + summarize、(c) long literature search。主對話只接 subagent 的 summary，乾淨太多
4. **Hook 處理「必須每次發生」的事** — 不要把「commit 前要跑 lint」寫進 CLAUDE.md（model 會忘），寫成 PreToolUse hook 強制執行。常見 hook：(a) auto git commit after Edit、(b) lint after Write、(c) block dangerous command（`rm -rf` / `git push --force` / `DROP TABLE`）、(d) auto-format on save。Hook 是 deterministic，永遠會跑
5. **Skill 系統 = domain knowledge as plugin** — 比 CLAUDE.md 更進階的 reuse 機制。你已經有的 `clinical-scores` / `openevidence` / `kaplan-meier` 都是 skill 範例：trigger 詞觸發、按需 load、不污染預設 context。寫 skill 的甜蜜點：(a) 跨 project 重複用、(b) 有明確 trigger、(c) 需要 domain knowledge 才寫得對
6. **Community framework 選擇性引入，不要無腦 install** — [SuperClaude](../readings/w4_super_claude.md) / [Awesome Agents](../readings/w4_awesome_claude_agents.md) 有 inspiration 價值但會跟你既有 CLAUDE.md / skill 衝突。建議：抄 1-2 個你會真的用的 agent / command 進自己的 `.claude/`，不要 full install

**Vibe coder 進階一級的徵兆**：當你發現自己花在「寫 spec + plan + 設 verification」的時間 > 「打 prompt」的時間 — 你已經是 agent manager 不是 pair programmer 了。這個 ratio 翻轉是 W4 想灌輸的核心 mindset shift。

> 💡 **vibe coder 的 Day-1 Quick Win**：今天就在你最常用的 repo 加 `.claude/commands/plan.md`，內容寫「請讀 spec.md（如有），分析 codebase，產出 plan.md（含 file-level step + verification 策略），先不要 implement」。下次任何 non-trivial task 開始前打 `/plan`，跑完 review，再說「按 plan 執行」。3 行 markdown 就把你的工作流升級到 ACE-FCA 三段式。比裝整套 SuperClaude 有效 10 倍。

---

**上一週**：[W3 The AI IDE](03_the_ai_ide.md) | **下一週**：[W5 The Modern Terminal](05_modern_terminal.md)
