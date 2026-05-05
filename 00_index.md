---
title: "CS146S: The Modern Software Developer 繁中講義"
subtitle: "Stanford CS, Fall 2025 — 全 10 週完整講義 + 50 篇 reading 中文摘要"
author: "繁中譯解：康瑋麟（WLK）"
date: "2026-05-02"
source: "https://themodernsoftware.dev"
---

# CS146S: The Modern Software Developer

> Stanford 計算機科學系 Fall 2025 全新開的「現代軟體工程師」課程，主軸為 AI-assisted coding（LLM 基礎、coding agents、MCP、AI IDE、Claude Code、Warp、AI testing/security、code review、app building、observability、未來趨勢）。

本講義將原版英文 syllabus 譯成繁中，並補上對非資工背景讀者的譯解、對 vibe coder 的應用建議、以及 50+ 篇 reading 的中文摘要。

---

## 課程資訊

| 項目 | 內容 |
|------|------|
| 開課單位 | Stanford University Computer Science |
| 學期 | Fall 2025 |
| 課號 | CS146S |
| 修課時數 | 10-12 hrs/week |
| 先備知識 | CS111 equivalent programming experience；CS221/229 recommended |
| 評分 | Final Project 80% / Weekly Assignments 15% / Class Participation 5% |
| 上課模式 | 每週 Mon = 主講課程 + Fri = industry guest speaker |

詳見 [01_overview.md](01_overview.html)。

---

## 10 週課程地圖

| Week | 主題 | Mon Lecture | Fri Guest Speaker | 連結 |
|------|------|-------------|-------------------|------|
| W1 | Introduction to Coding LLMs and AI Development | Introduction and how an LLM is made | Power prompting for LLMs | [weeks/01](weeks/01_intro_to_coding_llms.html) |
| W2 | The Anatomy of Coding Agents | Building a coding agent from scratch | Building a custom MCP server | [weeks/02](weeks/02_anatomy_of_coding_agents.html) |
| W3 | The AI IDE | From first prompt to optimal IDE setup | Silas Alberti（Cognition / Devin） | [weeks/03](weeks/03_the_ai_ide.html) |
| W4 | Coding Agent Patterns | How to be an agent manager | Boris Cherny（Claude Code creator） | [weeks/04](weeks/04_coding_agent_patterns.html) |
| W5 | The Modern Terminal | How to Build a Breakout AI Developer Product | Zach Lloyd（Warp CEO） | [weeks/05](weeks/05_modern_terminal.html) |
| W6 | AI Testing and Security | AI QA, SAST, DAST, and Beyond | Isaac Evans（Semgrep CEO） | [weeks/06](weeks/06_ai_testing_security.html) |
| W7 | Modern Software Support | AI code review | Tomas Reimers（Graphite CPO） | [weeks/07](weeks/07_modern_software_support.html) |
| W8 | Automated UI and App Building | End-to-end apps with a single prompt | Gaspar Garcia（Vercel） | [weeks/08](weeks/08_automated_ui_app_building.html) |
| W9 | Agents Post-Deployment | Incident response and DevOps | Mayank Agarwal + Milind Ganjoo（Resolve） | [weeks/09](weeks/09_agents_post_deployment.html) |
| W10 | What's Next for AI Software Engineering | Software development in 10 years | Martin Casado（a16z） | [weeks/10](weeks/10_whats_next.html) |

---

## 三條學習路徑（依興趣選讀）

### Track A — Vibe Coder 速成路線（最短路徑）
> 給已經在用 Claude Code / Cursor 想做出 side project 的讀者。

`W1 LLM 基礎` → `W2 agents + MCP` → `W3 AI IDE + context` → `W4 Claude Code patterns` → `W8 UI/app building` → 動手做。

### Track B — 完整軟體工程路線
> 給想全面理解 AI 時代軟體工程的讀者（推薦修課順序）。

依序 W1 → W10，每週讀講義 + 至少 2 篇 reading + 嘗試 assignment。

### Track C — Tech Lead / PM 視角
> 給想了解「AI 怎麼改變整個 SDLC」的非開發角色。

`W1 LLM` → `W4 agent autonomy` → `W6 security` → `W7 code review` → `W9 observability` → `W10 industry trends`。

---

## 子目錄索引

- 課程簡介與學習建議：[01_overview.md](01_overview.html)
- 10 週講義：[weeks/](weeks/)
- 50+ 篇 reading 摘要：[readings/_index.md](readings/_index.html)
- 9 個 weekly assignment + 自學者可行性評估：[assignments/_index.md](assignments/_index.html)
- PDF 印製版：[pdf/CS146S_handbook_zh.pdf](pdf/CS146S_handbook_zh.pdf)（Stage 6 完成後產生）

---

## 使用須知

1. **本講義是社群繁中化教材**，非 Stanford 官方產出。原版 syllabus 在 https://themodernsoftware.dev
2. **所有 reading 摘要均含原文連結**，請優先讀原文，摘要僅作快速參考。
3. **Google Slides 與部分 industry guest speaker 投影片需登入 Stanford 帳號**，本講義對拿不到的素材會明確標註 `[需登入]` 並用 topic context 做 best-effort 重建。
4. **技術名詞依「英文為主、首次出現附中文」的規範**（同 medical_terminology_format）。例：Model Context Protocol（模型上下文協定，MCP），後續直接用 MCP。
