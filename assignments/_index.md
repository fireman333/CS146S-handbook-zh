---
title: "9 Weekly Assignments — 自學者可行性評估"
parent: "00_index.md"
---

CS146S 共有 9 個 weekly assignment（W10 沒有，因為到了 final project demo 階段）。所有 assignment 在 [github.com/mihail911/modern-software-dev-assignments](https://github.com/mihail911/modern-software-dev-assignments)。

下表評估每個 assignment 對自學者的可行性（不是 Stanford 學生也能做嗎？需要什麼前置？）。

| Week | 標題 | 連結 | 預估時間 | 自學者可行性 | 前置需求 |
|------|------|------|----------|--------------|----------|
| W1 | LLM Prompting Playground | [week1](https://github.com/mihail911/modern-software-dev-assignments/tree/master/week1) | 2-4 hr | ⭐⭐⭐⭐⭐ 完全可做 | OpenAI 或 Anthropic API key |
| W2 | First Steps in the AI IDE | [week2](https://github.com/mihail911/modern-software-dev-assignments/tree/master/week2) | 3-5 hr | ⭐⭐⭐⭐⭐ 完全可做 | Cursor 或 Claude Code 安裝 |
| W3 | Build a Custom MCP Server | [week3](https://github.com/mihail911/modern-software-dev-assignments/blob/master/week3/assignment.md) | 4-8 hr | ⭐⭐⭐⭐ 完全可做（需 Node/TS 基礎） | Node.js + TypeScript SDK |
| W4 | Coding with Claude Code | [week4](https://github.com/mihail911/modern-software-dev-assignments/blob/master/week4/assignment.md) | 4-6 hr | ⭐⭐⭐⭐⭐ 完全可做 | Claude Code 訂閱 |
| W5 | Agentic Development with Warp | [week5](https://github.com/mihail911/modern-software-dev-assignments/tree/master/week5) | 3-5 hr | ⭐⭐⭐⭐⭐ 完全可做 | Warp 安裝（macOS/Linux/Windows） |
| W6 | Writing Secure AI Code | [week6](https://github.com/mihail911/modern-software-dev-assignments/blob/master/week6/assignment.md) | 4-6 hr | ⭐⭐⭐ 可做但偏深 | Semgrep CLI + 基礎 web security 知識 |
| W7 | Code Review Reps | [week7](https://github.com/mihail911/modern-software-dev-assignments/tree/master/week7) | 3-5 hr | ⭐⭐⭐⭐ 可做（需 GitHub PR 經驗） | GitHub account + Graphite 試用 |
| W8 | Multi-stack Web App Builds | [week8](https://github.com/mihail911/modern-software-dev-assignments/tree/master/week8) | 6-12 hr | ⭐⭐⭐⭐⭐ 完全可做 | v0 / Lovable / Bolt 任一 + Vercel deploy |
| W9 | （無，建議自製） | — | — | — | 自選 observability tool |

> Stage 4 完成後，每個 assignment 會有獨立的中文化任務說明文件 + step-by-step solution outline（不給 spoiler 答案，但會引導你怎麼開始）。

---

## 推薦做題順序（給自學者）

### 短時間（2 週內）讀完課
做 W1 + W2 + W4 — 涵蓋 LLM 基礎 / agent / Claude Code，CP 值最高。

### 中時間（1 個月）讀完課
做 W1 + W2 + W3 + W4 + W8 — 多了 MCP server + UI 生成，可以做出可展示的 side project。

### 完整跟課（10 週）
9 個全做，並用 W1-W9 的工具棧整合到 final project（自選一個你想做的東西，從 prompting → agent → MCP → testing → deploy → observability 全跑一輪）。

---

## Final Project 建議

CS146S 的 final project 占 80% 評分，但對自學者來說沒有 mentor 指導。建議改成：

1. **挑一個你 vibe coding 想做的 side project**（例：個人 dashboard、學習工具、生產力 app）
2. **用 W1-W8 的工具棧做完整實作**：W1 prompt → W2 MCP → W3 PRD → W4 Claude Code → W5 Warp → W6 security check → W7 code review → W8 UI deploy
3. **公開放上 GitHub** + 寫一篇「我用 CS146S 學到的東西做了什麼」blog post，當作學習成果

這比交一份 Stanford 教授不會看的作業更有 ROI。
