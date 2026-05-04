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

- **Slides**: [Google Slides（需 Stanford 帳號）](https://docs.google.com/presentation/d/1Djd4eBLBbRkma8rFnJAWMT0ptct_UGB8hipmoqFVkxQ/edit?usp=sharing)
- **講者**: Mihail Eric

> Slides 需 Stanford 帳號，依 lecture title + Warp 公開資料 best-effort 重建：

這節跳脫純技術，從「產品策略」角度拆 AI dev tool 怎麼做出 breakout 級成長。Warp 是 2022 上線、2024 年估值破 10 億美元、2025 年成功從「modern terminal」轉型「Agentic Development Environment」的範例，是這節的 case study 主角。預期 Mihail 會 cover：

1. **AI dev tool market segmentation** — IDE（Cursor、Windsurf）、CLI agent（Claude Code、Codex）、terminal（Warp、Wave）、cloud agent（Devin、Cognition）四個賽道誰打誰、誰跟誰互補
2. **「比較好看的 X」陷阱** — 為什麼 Hyper、Windows Terminal 沒爆紅而 Warp 爆紅？因為 Warp 重新設計 input/output 的資料結構，不只是換皮
3. **Wedge product → expansion** — Warp 從「terminal」這個極窄 wedge 切入，逐步擴張到 IDE、agent runtime、cloud orchestration（Oz），這個 sequencing 怎麼設計
4. **Distribution flywheel** — Developer tool 怎麼靠 dogfooding、open source、social proof（[How Warp Uses Warp to Build Warp](../readings/w5_how_warp_uses_warp_to_build_warp.md)）做 organic growth
5. **AI-era product moat** — 在 LLM 是 commodity 的時代，moat 不在 model 而在 (a) UX 設計、(b) context system（Warp Drive）、(c) 整合廣度（MCP、Claude Code、Codex 都接得上）
6. **與 Friday lecture 對齊** — 為 Zach Lloyd 的演講鋪 mental model

**Key takeaway**：AI dev tool 不是「把 chatbot 黏在 editor 旁邊」就能爆紅，需要重構底層資料結構（block）、做出 persistent context system（Warp Drive）、設計清楚的 wedge → expansion 路徑。Warp 是這個 playbook 教科書級的範例。

## Friday Lecture（10/24）：Zach Lloyd（Warp CEO）

- **Speaker**: [Zach Lloyd](https://www.linkedin.com/in/zachlloyd/), CEO of [Warp](https://www.warp.dev/)
- **Slides**: [Figma Slides](https://www.figma.com/slides/kwbcmtqTFQMfUhiMH8BiEx/Warp---Stanford--Copy-?node-id=9-116&t=oBWBCk8mjg2l2NR5-1)

> Figma slides 公開但內容是 Warp 對 Stanford 客製，依 Zach 公開訪談 + Warp 產品文件 best-effort 重建：

Zach Lloyd 在 Google 待過 8 年（前 Google Docs 共同創辦人之一，後升 Principal Engineer），2020 年離職創立 Warp，主因是「他在 Google 看遍最頂級的內部開發工具，回到 open source terminal 突然覺得倒退 30 年」。預期演講重點：

1. **Origin story** — 為什麼從零打造 terminal 而不是寫個 plugin？因為 VT100 protocol 的 line-buffered 架構先天限制太多，要做 block 必須自己寫 renderer。技術選擇 Rust + GPU-accelerated rendering（Metal on macOS、Vulkan on Linux），效能比 Electron-based terminal 好一個 order of magnitude
2. **Block 是怎麼想出來的** — Zach 在多次訪談提過，block 概念來自「為什麼我複製 terminal output 永遠包含 prompt 和錯誤的換行」這個小痛點，往下挖才意識到 line buffer 本身就是問題
3. **AI features 的 sequencing** — Warp 的 AI features 其實是 2022 年 GPT-3.5 之後才加的，最早的 v1 是純粹的「modern terminal without AI」。Block 化先做完，再上 AI，這個順序是關鍵 — 沒有 block 就沒有「對單一 command 做 AI 解釋」這個自然 affordance
4. **Agent Mode 的設計取捨** — `⌘+I` 在 terminal mode 與 agent mode 間切，為什麼不像 Claude Code 那樣全 CLI？因為 Zach 認為 (a) 大多數時候你還是要直接打 git command，(b) 切換成本要極低（一個 shortcut）才會被真的用
5. **Oz（cloud agent platform）roadmap** — 為什麼 2025 年要做 cloud agent？因為 local agent 的根本限制是「人在等」，cloud agent 解放長 task（PR review、dependency upgrade、issue triage）讓開發者可平行多 task
6. **與 Claude / Anthropic 的關係** — Warp 把 Claude Code 當 first-class CLI agent 而非競品，這個 stance 怎麼來？商業上 Warp 賺 IDE 訂閱、Claude 賺 model API，不衝突。Anthropic 也樂見 Claude Code 在 better terminal 裡跑
7. **未來方向** — Multi-modal terminal（語音 input、影片 output）、team workspace（class room collaboration）、enterprise（自家機房跑 Oz）

**Key takeaway**：Warp 不是「terminal + AI」，是把 terminal 重新想成 agent runtime 的 ground-up rebuild。block 是這個重構的最小單位，AI 與 cloud agent 是後續的自然延伸。對 vibe coder 的 implication：選 terminal 不再只是 cosmetic 偏好，而是選 agent 工作流的 host。

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
