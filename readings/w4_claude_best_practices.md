---
week: 4
title: "Claude Code Best Practices"
source_url: "https://www.anthropic.com/engineering/claude-code-best-practices"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# Claude Code Best Practices

> **一句話摘要**：Claude Code 的所有 best practice 都圍繞同一個核心約束 — context window 會被填滿、performance 會隨 context 增加而下降，所以使用者的工作就是主動管理 context、提供可驗證的 success criteria，並善用 subagent / `/clear` / Plan Mode 來保持上下文乾淨。

## 核心論點（150-200 字繁中）

Anthropic 官方總結出的 Claude Code 高效使用模式分四大類。第一類是「給 Claude 驗證自己的方法」 — 提供 test、screenshot、expected output，讓 agent 自己檢查而非靠人類做唯一 feedback loop。第二類是「Explore → Plan → Implement → Commit」四階段工作流 — 用 Plan Mode 隔離研究與執行，避免直接 code 解錯問題。第三類是 environment 配置 — 寫精簡的 CLAUDE.md（每行都問「刪掉會不會出錯」）、用 `/init` 起手、設定 permission allowlist 或 auto mode、連 MCP server、用 hook 強制必跑步驟、用 skill 與 subagent 補充 domain knowledge。第四類是 session 管理 — `/clear` 切 task、`/rewind` 回退、`claude --continue` 接續、用 subagent 探索以保持主對話乾淨。最後也教 non-interactive mode（`claude -p`）做 CI 整合與 fan-out 批次處理。

## 關鍵概念

1. **CLAUDE.md** — 每次對話自動載入的 persistent context；要短、可審、可 prune；過長會讓重要規則被淹沒。
2. **Skills** — 放在 `.claude/skills/` 的 SKILL.md，Claude 按需載入 domain knowledge / workflow，不污染預設 context。
3. **Subagents** — 在獨立 context window 跑的特化 agent，研究類任務的首選工具，避免主對話被 file read 灌爆。
4. **Hooks** — 寫在 `.claude/settings.json` 的 deterministic script，「必須每次發生」的動作（如 lint、block migrations 寫入）走 hook 而非 CLAUDE.md。
5. **Plan Mode** — 純讀檔規劃、不做修改的 mode，作為 Explore-then-Code 的安全閘。
6. **Auto mode** — 用 classifier 自動審核 command，僅擋 risky 操作以減少 permission 中斷。
7. **Verification loop** — test、screenshot、Bash check 作為 agent 自我驗證的 ground truth。

## 對 CS146S 的意義

這篇是 Week 4 的「正規教科書」。它把分散的 feature（CLAUDE.md / skills / hooks / subagents / MCP）整合成一套使用紀律，並提出 context engineering 是使用者最重要的技能。對課程設計而言，這篇定義了「會用 Claude Code」的行為基準 — 不是會打字，而是會管 context、會寫 verification、會分工到 subagent。

## 對 Vibe Coder 的 Takeaway

非資工背景使用者最直接的兩個操作改變：(1) 永遠提供 verification（醫學研究就是 unit test：「這段 SQL 跑出來該有 X 筆」「這個 figure 該有 Y 個 group」）；(2) 任務切換就 `/clear`，不要省那幾秒。第三個是 CLAUDE.md 要當 code 維護 — 出錯時先檢查 CLAUDE.md 有沒有衝突或過長。對使用者既有的醫學 / 統計 workflow，把可重複流程做成 skill 而非塞進 CLAUDE.md，是長期可規模化的關鍵。

## 原文連結

[Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
