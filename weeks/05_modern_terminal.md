---
week: 5
title: "Week 5：The Modern Terminal"
title_zh: "現代終端機"
dates:
  - "Mon 2025-10-20"
  - "Fri 2025-10-24"
topics:
  - "AI-enhanced command line interfaces"
  - "Terminal automation and scripting"
guest_speaker:
  name: "Zach Lloyd"
  title: "CEO"
  org: "Warp"
status: complete
---

> **本週你會學到什麼**：傳統 terminal（bash/zsh）是 1970 年代設計，2025 年的 AI terminal（Warp、Wave、Claude Code CLI、Codex CLI）長什麼樣？本週講 AI-enhanced CLI 與 terminal automation。Friday 由 Warp CEO Zach Lloyd 親自開講。

## 學習目標

完成本週後，你應該能：

1. **辨識** AI terminal 與傳統 terminal 在 input、output、history、collaboration 四個維度的差異
2. **應用** Warp 的 AI features（natural language → command、AI agents、workflows、shared workspaces）
3. **比較** Warp、Claude Code CLI、Codex CLI 三種 CLI agent 的設計取捨
4. **設計** 一個 terminal-first 工作流（含 AI-assisted scripting、history search、命令解釋）

## 核心概念導讀

### 一、Terminal 演化簡史 — 為什麼 1970 年代的設計會撐到現在

要理解 modern terminal（如 Warp、Wave、Ghostty）為什麼會冒出來，得先看清楚我們現在用的這個 terminal 是什麼東西。今天你打開 macOS 內建的 Terminal.app 或 iTerm2，看到的本質上是 **VT100 terminal emulator** — 一個模擬 1978 年 DEC VT100 硬體終端機的軟體。VT100 的設計目標是讓打字機式硬體裝置能跟 mainframe 通訊：input 是一行 text、output 是一行 text，所有狀態存在「螢幕緩衝區（screen buffer）」這個一維 character grid 裡。

這套設計撐了 50 年沒被換掉的原因有兩個：(1) 它「夠用」— 工程師寫 shell script、跑 git、看 log 都不需要更花俏的 UI；(2) **生態鎖死** — bash、zsh、vim、tmux、ssh、所有 CLI tool 都假設輸出是 line-buffered text、控制是 ANSI escape code，要換 terminal 就得讓上萬個既有工具相容。所以即使 GitHub 在 2017 推出 Hyper、Microsoft 在 2019 推出 Windows Terminal，本質都還是「比較好看的 VT100」。

**真正的轉折點是 2022 年的 Warp**。Warp 第一次在 terminal 層做兩件激進的事：(a) 把 line-buffered output 重構成 **block**（每條 command + output 是一個獨立物件，可選取、複製、分享、搜尋），(b) 把 LLM 直接縫進 input editor（自然語言轉 command、執行錯誤即時解釋）。這讓 terminal 從「字符串 I/O 通道」進化成「結構化 agent runtime」。後續 Wave、Ghostty、Claude Code CLI、Codex CLI 都在這個賽道上展開。

> 💡 **譯解**：你可以把傳統 terminal 想成「醫院 1970 年代的紙本病歷」— 一切都是 free-text、沒結構、難搜尋；modern terminal 就像「電子病歷系統」— 每個 progress note 是有 metadata 的物件，可以 query、tag、跨病人比對。介面長得像但底層資料結構完全不同。

### 二、AI Terminal 的四個價值主張

[Warp University](../readings/w5_warp_university.md) 把 Warp 自我定位從「modern terminal」升級為 **Agentic Development Environment（代理式開發環境，ADE）**。對使用者來說，AI terminal 比傳統 terminal 多出四個 affordance：

| 維度 | 傳統 terminal | AI terminal（Warp 為例） |
|------|--------------|------------------------|
| **Input** | 單行 text、按 ↑ 翻 history | Natural language → command、`Ctrl+G` 多行編輯、`@` mention 檔案、語音輸入 |
| **Output** | Line-buffered text、ANSI escape | Block（可分享、搜尋、附 metadata）、agent 自動解釋 error |
| **History** | Per-shell `.zsh_history` 檔 | Cloud-synced、可 query「上週那個 docker build 怎麼下的」 |
| **Collaboration** | 截圖丟 Slack | Block 一鍵分享 link、shared workspace、cloud agent 跑非同步任務 |

關鍵概念是 **block-based terminal** — 每條 `command + output` 是一個 first-class object，不再是 line buffer 裡的一坨 text。這個 mental model 變化的影響極大：你能對單一 block 做「重跑」「分享」「丟給 agent 解釋」「轉成 workflow 模板」等動作，這些在傳統 terminal 裡需要先把輸出複製出來、貼進別處才能做。

[Warp University](../readings/w5_warp_university.md) 還提出 **Warp（local terminal）+ Oz（cloud agent orchestration）** 的雙產品架構：local agent 是 interactive、人在 loop 裡審 diff；cloud agent 是 background、被 webhook / cron 觸發、可大規模並行（PR review、issue triage、dependency update）。兩端共用同一個 agent core 與 **Warp Drive**（rules / prompts / env var / workflow 的 persistent context layer），所以「雲端開工、local 接手」是 seamless 的。

### 三、CLI Agent vs IDE Agent — 設計取捨

W3 講 IDE agent（Cursor、Continue.dev），W4 講 CLI agent（Claude Code、Codex），W5 把兩個放在同一個 terminal 裡。三種 agent 的取捨可這樣比：

| 設計面向 | IDE Agent（Cursor） | CLI Agent（Claude Code） | Terminal Agent（Warp Agent Mode） |
|---------|---------------------|------------------------|--------------------------------|
| **Host** | VS Code fork | 任何 terminal | Warp 本身 |
| **Context source** | Editor open files、selection | `CLAUDE.md` + 工作目錄 | Codebase index + `WARP.md` + Warp Drive + MCP |
| **互動模式** | 在 editor 旁邊 chat panel | 純 CLI prompt | Block-based、Ctrl+G 多行、 `⌘+I` mode 切換 |
| **Tool access** | Editor command + shell | Shell + file system | Shell + file system + 整套 Warp affordance |
| **長 task** | 中等（chat panel 易斷） | 強（CLI 天生 async） | 強（cloud agent 可背景跑） |
| **Multi-file refactor** | 強（diff view 內建） | 中（需 review CLI diff） | 強（內建 code review panel） |

[Warp vs Claude Code](../readings/w5_warp_vs_claude_code.md) 文中講得很直白：Warp 不把 Claude Code 當對手而是當 first-class CLI agent host — 你可以在 Warp 裡跑 `claude`，自動拿到 rich input editor、agent notification、inline code review、vertical tabs 等 IDE 級 affordance。或者你也可以直接用 Warp 內建的 Agent Mode（`⌘+Enter`）。最關鍵的 migration 提示：**把 `CLAUDE.md` 改名為 `AGENTS.md` 或 `WARP.md` 放專案 root，Warp 會自動讀取，不必重寫**。

### 四、為什麼 Vibe Coder 該認真考慮換 Terminal

[How Warp Uses Warp to Build Warp](../readings/w5_how_warp_uses_warp_to_build_warp.md) 揭露 Warp 公司內部的 **Coding Mandate** — 每個 coding task 都從在 Warp 裡 prompt 起手，連續卡關 10 分鐘才能 fallback 到別的工具。這條規則對個人開發者太嚴格，但精神對非資工背景的 vibe coder 反而更重要：

1. **Prompt-first 強迫你想清楚需求** — 用 natural language 描述「我要的是什麼」比直接寫 code 更容易發現需求模糊
2. **Block 化讓你能回頭審視** — 不再是滾動的 line buffer，每個操作都是可被 review、re-run、share 的物件
3. **Persistent context 取代碎片記憶** — Warp Drive 的 Rules / Prompts / Workflow 等同 Claude Code 的 `CLAUDE.md`，重複指令不必每次重打
4. **Cloud agent 解放等待時間** — 大 task（跑完整 test suite、build、deploy）丟去 background，不必盯著 terminal

對台大醫學系背景轉 vibe coder 的讀者，這個對應關係特別有用：Warp Drive 之於 terminal，等於 RemNote 之於知識管理 — 都是「把碎片化的 context 沉澱成可重用 artifact」。學會一邊就能類推另一邊。

## Monday Lecture（10/20）：How to Build a Breakout AI Developer Product

- **Slides**: [Google Slides 公開連結](https://docs.google.com/presentation/d/1Djd4eBLBbRkma8rFnJAWMT0ptct_UGB8hipmoqFVkxQ/edit?usp=sharing)
- **講者**: Mihail Eric（用 Warp 當 demo 工具）

> 以下基於 Google Slides 公開內容（TXT export）整理的繁中摘要：

這節從產品策略角度拆「**為什麼 AI dev tool 在 2024-2025 出現史上最快的採用速度**」。Mihail 用 7 條產品設計原則作為主軸，每條都對應 Warp 等成功 AI dev tool 的具體決策：

1. **Start with what developers know** — 從既有 interface 過渡而非另起爐灶。每個 segment 都接到 developer 已熟的 metaphor：Cursor 接 IDE、Warp 接 terminal、Bolt 接 chat。範例：[explainshell.com](https://explainshell.com/explain) 是把「`tar -czvf`」這種公認痛點當切入點，逐步把使用者從 raw command line 解放，能在 code 與自然語言間自由切換。
2. **Configuration flexibility** — 對 average user 零設定就能展示價值；power user 拿到完整 configurability：seamless 切換 model、prompts、project rules、MCP、Warp profiles per user。
3. **Focus on developer ergonomics** — 「**If you can shave off a single keystroke, do it.**」keyboard hotkey、零 onboarding friction（「5 minutes to WOW」是 Warp 內部目標）、tab / enter 等小動作的黏著度。
4. **Chat as a first-class citizen** — Code 本來就是 human intent 的 contrived representation，工具進化到一定程度後，更多互動會直接變自然語言。Demo Warp 內 debug error 流程就是用聊天替代 grep。
5. **MCP integration** — MCP 已成為 LLM 與真實世界互動的 lingua franca。可擴展工具生態給 LLM 任何資源 / 動作。Demo：用 context7 給 Warp 抓最新 BrainTrust 文件。
6. **Rapid feedback loops** — 改完立刻看到效果。Bolt / Lovable 的 real-time canvas、Warp 的 take action + immediate reaction 都在這個範式。可解釋性是 first-class citizen。「entire projects committed to just reducing build time」是這條原則的最強佐證。
7. **Agent workflows** — 對實質任務給 full autonomy。「agent-take-the-wheel」的接受度逐月上升，但要支援不同等級的 human-in-the-loop（agent 問 clarifying question、YOLO mode）。Demo Warp 的 YOLO mode。

最後 Mihail 拋出**未來 open question**：

- 會不會看到大規模整合？code review / app building / monitoring 等 point solution 會被 all-in-one platform 吞掉嗎？
- AI IDE 會不會演化成 AI terminal、再演化成 AI browser-replit？
- 像 Warp / Cursor 會不會 verticalize 變成「full-stack 開發專用」之類？
- 給 coding agent 個人化 / project-specific rule 的 universal standard 會是什麼？目前 fragmented（`.cursorrules` / `CLAUDE.md` / `AGENTS.md`），AGENTS.md 是首個 step in that direction。

**Key takeaway**：AI dev tool 爆紅不是「把 chatbot 黏在編輯器旁邊」 — 它需要從 (1) 接既有 mental model 開始、(2) 對 power user 開全部 configurability、(3) 偷每一個 keystroke 的 ergonomic 紀律、(4) 把 chat 當 first-class、(5) MCP 接通生態、(6) feedback loop 越快越好、(7) 對實質任務放 autonomy 同時保留人類介入點。這 7 條原則是 vibe coder 評估「該不該換工具」的 checklist。

## Friday Lecture（10/24）：Zach Lloyd（Warp CEO）

- **Speaker**: [Zach Lloyd](https://www.linkedin.com/in/zachlloyd/), CEO of [Warp](https://www.warp.dev/)
- **Slides**: [Figma Slides（公開連結）](https://www.figma.com/slides/kwbcmtqTFQMfUhiMH8BiEx/Warp---Stanford--Copy-?node-id=9-116&t=oBWBCk8mjg2l2NR5-1)

> 以下基於 slide deck 公開內容（PDF 39 張 slide vision OCR）整理的繁中摘要。Slide 結構為六段：(1) The world is changing、(2) From development by hand to by prompt、(3) What is Warp、(4) Warp tour、(5) Using agents to go from prompt to production、(6) The business of agentic development，最後 Q&A。

1. **論點主軸 — 從 by-hand 到 by-prompt 的 dev paradigm shift**：Lloyd 開場用 Greylock 的引言定錨「為 code generation 與 engineering workflow 解鎖 high-fidelity、reliable AI 是巨大機會」。整場演講的核心張力是「**Current: Development by hand → Future: Development by prompt**」，而 prompt-driven development 又分兩支：使用者主動觸發的 **interactive agent**，以及由 webhook / cron / event 觸發的 **ambient agent**。Warp 的賭注是同時做好這兩端的開發者體驗，把產品定位為 **ADE（Agentic Development Environment，代理式開發環境）**。

2. **為什麼是 terminal — 三個結構性理由**：Lloyd 認為 command line 是 agent 最自然的住所。理由：(a) **Lowest tool in the dev stack**（在開發堆疊最底層、其他工具都跑在它上面）；(b) **Leverages CLI ecosystem**（git、docker、gcloud、curl 全都已經 CLI 化，不必重造）；(c) **Already set up for orchestrating long-running tasks**（terminal 從第一天就是非同步、process-spawning friendly）。但他立刻補一句「**terminal needs to be modernized**」— terminal 是對的介面，VT100 是錯的實作。

3. **Warp's history（2020 → 2025 timeline）**：Lloyd 用一條時間軸 walk through 公司演化，每年加上對應的產品里程碑：**2020 spring** had an idea，**2020 fall** started building，**2021** Warp MVP + Private Beta（強調 "Better UX"），**2022** Mac Public Release，**2023** Warp Drive + AI Chat + AI Command Search 三件 AI feature 一次推出，**2024** velocity 暴增（Linux、Agent Mode、Session Sharing），**2025** Windows release + ADE 重新定位。後面接一張密密麻麻的 feature grid（Split Panes、Markdown Viewer、Command Search、Block Sharing、Secret Redaction、SSO、Active AI…），標題就叫「**Warp continues to grow**」。Mission 寫得很短：「**Empower all developers to deliver great software, quickly and reliably.**」

4. **Product Design Roadmap — 四大 pillar 與 Agent Quality 三角**：Warp 把 ADE 拆成四個 product surface：**Terminal**（modern intelligent terminal）、**Code**（在真實 codebase 裡跑 coding agent，原生 review/edit）、**Agents**（同時部署多 agent、集中追蹤）、**Drive**（centralize knowledge / context）。對應 slide 上 4 張產品截圖（git rebase block、code review diff、agent 跑 eval、Drive folder tree）。Ambient agent 線路另外講：**API / Hosting / Management / Integrations** 四件事讓 agent 能「從任何環境呼叫 Warp 的 agent runtime」「跑在 Warp server 或 self-hosted」「跨 session 追蹤」「跟常用 app 一鍵串接」。最後拋出 **Agent Quality = Models + Harness + Dev Ex** 公式 — model 由 Warp 動態挑（resilient to provider outage）、harness 做 prompt tuning + context summarization + A/B eval、dev ex 把 agent 做成「不用滑鼠、不用 text edit、能 reuse / share context、能接 MCP」的純文字介面。

5. **How Warp uses Warp to build Warp（內部 5 條 coding mandate）**：(1) **Start with a prompt**（描述「怎麼做」而不只是「做什麼」、附上 file/image context）、(2) **Iterate on a plan**（先和 agent 把問題搞清楚、把方案 script 出來再放手讓它跑）、(3) **Steer the agent**（不要 set-and-forget、邊跑邊 re-prompt + review diff、必要時手 edit）、(4) **Engineers own the PR**（送 review 的 PR 作者必須能像自己寫的一樣解釋每一行）、(5) **Document context for the next PR**（每次學到的東西回寫到 `WARP.md` 或其他 rules 檔，下次 agent 直接拿）。這條清單是整場演講最具體的可操作守則。

6. **Business 與市場定位 — 2×2 framework**：Lloyd 用一張 2×2 圖把 dev tool 市場分成 X 軸 Code by hand ↔ Code by prompt、Y 軸 Editor-first ↔ Terminal-first；JetBrains / VS Code 在左下、Cursor 在中下、Windsurf / Augment 在右下、**Warp 與 Claude Code 同坐右上（Code by prompt + Terminal-first）**。Lloyd 強調 Warp vs AI IDE 的差異是：橫跨整個 setup → production 生命週期、跨多 project、原生支援多個 long-running agent；vs CLI tool 的差異是：原生 in-app 編輯（不用 context switch）、有 codebase embedding、有 multi-agent 通知 UX。市場判斷：**huge market**（automating development = 11m+ 開發者）、**not winner-take-all**（dev 喜歡 try new thing、公司也願意 honor preference）、**still early**（最大玩家還沒進場、model 還在進步）；風險端坦誠 **competitive market**（Cursor 等對手錢多）、**inference expensive**（usage-based 成本壓邊際）、**complex relation with labs**（Anthropic / OpenAI 既是供應商也是競爭者）。

7. **給學生的 closing — What's next**：「Keep studying CS！」Lloyd 認為不論 model 怎麼進化，**深度 CS 知識 + problem solving skill** 永遠值得投資；「**It's never been a better time to be a builder**」是他對 Stanford 學生的結語，呼應 W1 Karpathy 講的「軟體開發民主化」。

**Key takeaway**：Warp 的 thesis 不是「terminal + AI 黏一黏」，而是把 command line 當作下一代 agent runtime 的最佳 host。產品設計圍繞「interactive agent + ambient agent」雙軌，agent 品質拆成 model / harness / dev ex 三件可獨立優化的事；對 vibe coder 的啟示是 **prompt-first、own your PR、把 learning 寫回 `WARP.md` / `AGENTS.md`** 這條 dogfooding 紀律比換不換 terminal 重要。

## Reading 摘要

| 篇名 | 來源 | 一句話重點 |
|------|------|-----------|
| [Warp University](../readings/w5_warp_university.md) | warp.dev | Warp = 「Agentic Development Environment」= local terminal + cloud agent platform（Oz）+ Warp Drive 跨端 context |
| [Warp vs Claude Code](../readings/w5_warp_vs_claude_code.md) | warp.dev/university | Warp 與 Claude Code 不是競品而是 stack 兩層，把 `CLAUDE.md` rename 成 `AGENTS.md` 即可零成本遷移 |
| [How Warp Uses Warp to Build Warp](../readings/w5_how_warp_uses_warp_to_build_warp.md) | notion.warp.dev | Warp 內部 Coding Mandate：每個 task 從 prompt 起手、卡 10 分鐘要回報、bug 一律先變 eval 不直接 patch |

**閱讀優先順序**：先讀 [Warp University](../readings/w5_warp_university.md) 建立 ADE 心智模型 → 再讀 [Warp vs Claude Code](../readings/w5_warp_vs_claude_code.md) 看 Warp 與 Claude Code 怎麼共存 → 最後 [How Warp Uses Warp](../readings/w5_how_warp_uses_warp_to_build_warp.md) 看 dogfooding 紀律 — 三篇加起來不到 30 分鐘但能拿到完整圖像。

## Assignment：Agentic Development with Warp

- **Source**: [github.com/mihail911/modern-software-dev-assignments/tree/master/week5](https://github.com/mihail911/modern-software-dev-assignments/tree/master/week5)
- **任務描述**: 安裝 Warp，跑一系列 hands-on 練習：(a) 用 Agent Mode 對陌生 repo 做 codebase exploration，(b) 寫 `WARP.md`（或 rename 既有 `CLAUDE.md`）讓 agent 拿到 persistent context，(c) 用 Warp Drive 把重複指令存成 workflow，(d) 在 Warp 內跑 Claude Code CLI 體驗 first-class wrapper（Ctrl+G 多行、agent notification、code review panel），(e) 設一個 cloud agent task 跑 background test。
- **自學者可行性**: ⭐⭐⭐⭐⭐ 完全可做。Warp 個人 free tier 包含 AI quota，足以跑完作業。預估 3-5 hr。需 macOS 13+ / Windows 11 / Ubuntu 22.04+。

> 💡 **不想換 terminal 的替代方案**：可以只在練習期間裝 Warp、做完 export workflow 後 uninstall。Warp 不會 hijack 你 default shell，只是另一個 GUI app。

## 對 Vibe Coder 的應用

對 Claude Code 重度用戶（也就是這份講義的目標讀者）來說，「該不該換 terminal」是個值得認真評估的問題。決策框架：

1. **如果你已經把 Claude Code 用得很順** — 不必勉強切，**至少把 `CLAUDE.md` 複製一份成 `AGENTS.md`** 放專案 root。這個檔在 Cursor、Warp、Codex CLI、未來 MCP-aware agent 都會被自動讀取，等於同一份 context 投入多家工具，零 lock-in
2. **若你 daily 主力是 iTerm2 + Claude Code** — 評估 Warp 主要看 (a) 你常開幾個並行 agent session？三個以上 Warp 的 vertical tabs + agent metadata 真的會省心；(b) 你有沒有「碎片時間想跑 background task」的需求？有則 cloud agent 直接打到痛點
3. **絕對先學會的 Warp feature** — `Ctrl+G` 多行 prompt（給 Claude Code 寫長 prompt 不再要逃跳脫換行）、block share link（把錯誤訊息一鍵丟同事比截圖好十倍）、Warp Drive Rules（重複指令 / 風格規範一次寫、永久套用）
4. **Warp Drive vs `CLAUDE.md` 的分工** — `AGENTS.md` 放專案層級 context（這 repo 是什麼、命名慣例、業務邏輯）；Warp Drive 放跨專案的個人 preference（總是用 pnpm、commit message 用英文、push 前必跑 lint）。兩層不重疊
5. **不要打開 YOLO mode** — Warp 也有「全自動 approve all tool」選項，跟 W6 會講到的 Copilot RCE 是同一種風險。Vibe coding 速度再快也別省這個 confirm
6. **Cloud agent 適合的 task 類型** — 跑完整 test suite、build production bundle、跑 dependency audit、批次 rename file、每週一鍵更新 lock file。**不適合**：實際邏輯改動（你沒在現場 review diff、跑出來的 code 你不知道對不對）

> 💡 **vibe coder 的 Day-1 Quick Win**：今天裝 Warp、把現有 `CLAUDE.md` 複製成 `AGENTS.md`、在 Warp 內 `cd` 進你的 side project、按 `⌘+Enter` 進 Agent Mode 問「what does this repo do?」。20 秒內你會看到 Warp 自動 index codebase 並回給你一份比 README 還完整的 architectural summary — 這是傳統 terminal 永遠做不到的事，體驗一次你就會知道值不值得遷移。

---

**上一週**：[W4 Coding Agent Patterns](04_coding_agent_patterns.md) | **下一週**：[W6 AI Testing and Security](06_ai_testing_security.md)
