---
title: "Reading 摘要總目錄"
parent: "00_index.md"
---

CS146S 的 9 週共 45 篇 reading（W8、W10 原 syllabus 沒列 reading）。每篇 200-400 字繁中摘要，含核心論點 / 關鍵概念 / 對 CS146S 的意義 / 對 vibe coder 的 takeaway / 原文連結。

## 統計

| 狀態 | 篇數 | 說明 |
|------|------|------|
| ✅ Complete | 43 | 抓到原文後做的繁中摘要 |
| 🟡 Best-effort | 1 | 原文取得受限（access code），用主題脈絡做高層摘要 |
| 🔴 Failed | 1 | 原文無法抓取（X/Twitter 需登入），只放連結 + disclaimer |

## 來源類型分布

| 類型 | 篇數 | 範例 |
|------|------|------|
| Blog post | 33 | Anthropic, Stytch, Cloudflare, Splunk, OWASP, ... |
| GitHub README | 6 | MCP servers, MCP SDK, Awesome Claude Agents, Super Claude, ACE-FCA, O3 prompt |
| YouTube | 3 | Karpathy Deep Dive, Anthropic Prompt Engineering, AI Code Review Lessons |
| PDF | 2 | OpenAI Codex use cases, Anthropic uses Claude Code |
| arXiv | 1 | AI-Assisted Assessment of Coding Practices |
| Twitter/X | 1 | How FAANG Vibe Codes（failed） |

---

## Week 1：Introduction to Coding LLMs and AI Development

| # | 標題 | 來源類型 | 狀態 |
|---|------|---------|------|
| 1 | [Deep Dive into LLMs](w1_deep_dive_into_llms.md) | YouTube | 🟡 高層摘要 |
| 2 | [Prompt Engineering Overview](w1_prompt_engineering_overview.md) | Blog (Google Cloud) | ✅ |
| 3 | [Prompt Engineering Guide](w1_prompt_engineering_guide.md) | Blog (promptingguide.ai) | ✅ |
| 4 | [AI Prompt Engineering: A Deep Dive](w1_ai_prompt_engineering_deep_dive.md) | YouTube (Anthropic) | 🟡 高層摘要 |
| 5 | [How OpenAI Uses Codex](w1_how_openai_uses_codex.md) | PDF | ✅ |

## Week 2：The Anatomy of Coding Agents (MCP)

| # | 標題 | 來源類型 | 狀態 |
|---|------|---------|------|
| 6 | [MCP Introduction](w2_mcp_introduction.md) | Blog (Stytch) | ✅ |
| 7 | [Sample MCP Server Implementations](w2_mcp_sample_servers.md) | GitHub | ✅ |
| 8 | [MCP Server Authentication](w2_mcp_server_auth.md) | Blog (Cloudflare) | ✅ |
| 9 | [MCP Server SDK (TypeScript)](w2_mcp_server_sdk.md) | GitHub | ✅ |
| 10 | [MCP Registry](w2_mcp_registry.md) | Blog | ✅ |
| 11 | [MCP Food-for-Thought](w2_mcp_food_for_thought.md) | Blog | ✅ |

## Week 3：The AI IDE

| # | 標題 | 來源類型 | 狀態 |
|---|------|---------|------|
| 12 | [Specs Are the New Source Code](w3_specs_are_the_new_source_code.md) | Blog (Ravi Mehta) | ✅ |
| 13 | [How Long Contexts Fail](w3_how_long_contexts_fail.md) | Blog | ✅ |
| 14 | [Devin: Coding Agents 101](w3_devin_coding_agents_101.md) | Blog (Cognition) | ✅ |
| 15 | [Getting AI to Work In Complex Codebases (ACE-FCA)](w3_getting_ai_to_work_in_complex_codebases.md) | GitHub | ✅ |
| 16 | [How FAANG Vibe Codes](w3_how_faang_vibe_codes.md) | Twitter/X | 🔴 無法抓取 |
| 17 | [Writing Effective Tools for Agents](w3_writing_effective_tools_for_agents.md) | Blog (Anthropic) | ✅ |

## Week 4：Coding Agent Patterns (Claude Code)

| # | 標題 | 來源類型 | 狀態 |
|---|------|---------|------|
| 18 | [How Anthropic Uses Claude Code](w4_how_anthropic_uses_claude_code.md) | PDF | ✅ |
| 19 | [Claude Code Best Practices](w4_claude_best_practices.md) | Blog (Anthropic) | ✅ |
| 20 | [Awesome Claude Agents](w4_awesome_claude_agents.md) | GitHub | ✅ |
| 21 | [Super Claude Framework](w4_super_claude.md) | GitHub | ✅ |
| 22 | [Good Context, Good Code](w4_good_context_good_code.md) | Blog (StockApp) | 🟡 高層摘要 |
| 23 | [Peeking Under the Hood of Claude Code](w4_peeking_under_the_hood_of_claude_code.md) | Medium | ✅ |

## Week 5：The Modern Terminal (Warp)

| # | 標題 | 來源類型 | 狀態 |
|---|------|---------|------|
| 24 | [Warp University](w5_warp_university.md) | Blog | ✅ |
| 25 | [Warp vs Claude Code](w5_warp_vs_claude_code.md) | Blog | ✅ |
| 26 | [How Warp Uses Warp to Build Warp](w5_how_warp_uses_warp_to_build_warp.md) | Notion | ✅ |

## Week 6：AI Testing and Security

| # | 標題 | 來源類型 | 狀態 |
|---|------|---------|------|
| 27 | [SAST vs DAST](w6_sast_vs_dast.md) | Blog (Splunk) | ✅ |
| 28 | [Copilot RCE via Prompt Injection](w6_copilot_rce_via_prompt_injection.md) | Blog | ✅ |
| 29 | [Finding Vulnerabilities Using Claude Code and OpenAI Codex](w6_finding_vulnerabilities_claude_codex.md) | Blog (Semgrep) | ✅ |
| 30 | [Agentic AI Threats: Identity Spoofing](w6_agentic_ai_threats_identity_spoofing.md) | Blog (Palo Alto Unit 42) | ✅ |
| 31 | [OWASP Top Ten](w6_owasp_top_ten.md) | Blog (OWASP) | ✅ |
| 32 | [Context Rot: Degradation in AI Context Windows](w6_context_rot.md) | Blog (Chroma) | ✅ |
| 33 | [Vulnerability Prompt Analysis with O3 (CVE-2025-37899)](w6_vulnerability_prompt_analysis_with_o3.md) | GitHub | ✅ |

## Week 7：Modern Software Support (AI Code Review)

| # | 標題 | 來源類型 | 狀態 |
|---|------|---------|------|
| 34 | [Code Reviews: Just Do It](w7_code_reviews_just_do_it.md) | Blog (Coding Horror) | ✅ |
| 35 | [How to Review Code Effectively (GitHub Staff Engineer)](w7_how_to_review_code_effectively.md) | Blog (GitHub) | ✅ |
| 36 | [AI-Assisted Assessment of Coding Practices in Modern Code Review](w7_ai_assisted_assessment_coding_practices.md) | arXiv | ✅ |
| 37 | [AI Code Review Implementation Best Practices](w7_ai_code_review_implementation_best_practices.md) | Blog (Graphite) | ✅ |
| 38 | [Code Review Essentials for Software Teams](w7_code_review_essentials_for_software_teams.md) | Blog | ✅ |
| 39 | [Lessons from millions of AI code reviews](w7_lessons_from_millions_of_ai_code_reviews.md) | YouTube (Graphite) | ✅ |

## Week 8：Automated UI and App Building

> 本週原 syllabus 沒列 reading list。延伸推薦資源見 [W8 講義](../weeks/08_automated_ui_app_building.md)。

## Week 9：Agents Post-Deployment (SRE / Observability)

| # | 標題 | 來源類型 | 狀態 |
|---|------|---------|------|
| 40 | [Introduction to Site Reliability Engineering](w9_introduction_to_sre.md) | Blog (Google SRE Book) | ✅ |
| 41 | [Observability Basics You Should Know](w9_observability_basics.md) | Blog (last9.io) | ✅ |
| 42 | [Kubernetes Troubleshooting with AI](w9_kubernetes_troubleshooting_with_ai.md) | Blog (Resolve) | ✅ |
| 43 | [Your New Autonomous Teammate](w9_your_new_autonomous_teammate.md) | Blog (Resolve) | ✅ |
| 44 | [Role of Multi Agent Systems in Making Software Engineers AI-native](w9_multi_agent_systems_ai_native.md) | Blog (Resolve) | ✅ |
| 45 | [Top 5 Benefits of Agentic AI in On-call Engineering](w9_benefits_of_agentic_ai_in_oncall.md) | Blog (Resolve) | ✅ |

## Week 10：What's Next for AI Software Engineering

> 本週原 syllabus 沒列 reading list。延伸推薦資源見 [W10 講義](../weeks/10_whats_next.md)。

---

## 高優先閱讀清單（給時間有限的讀者）

如果只有時間讀 5-10 篇，建議這份精選：

1. **[How OpenAI Uses Codex](w1_how_openai_uses_codex.md)** — 最 actionable 的 production case study
2. **[MCP Introduction](w2_mcp_introduction.md)** — vibe coder 必須建立的 MCP mental model
3. **[MCP Food-for-Thought](w2_mcp_food_for_thought.md)** — 寫 MCP server 的設計品味
4. **[Specs Are the New Source Code](w3_specs_are_the_new_source_code.md)** — 理解 PRD 在 agent 時代的角色
5. **[Writing Effective Tools for Agents](w3_writing_effective_tools_for_agents.md)** — Anthropic 官方的 tool design 心法
6. **[How Anthropic Uses Claude Code](w4_how_anthropic_uses_claude_code.md)** — Anthropic 內部使用真實樣貌
7. **[Claude Code Best Practices](w4_claude_best_practices.md)** — Anthropic 官方 best practice
8. **[How Long Contexts Fail](w3_how_long_contexts_fail.md)** — 4 種 context failure mode + fix
9. **[Lessons from millions of AI code reviews](w7_lessons_from_millions_of_ai_code_reviews.md)** — Graphite Diamond 的 52% action rate 定義 AI reviewer 達成 human parity
10. **[Introduction to Site Reliability Engineering](w9_introduction_to_sre.md)** — Google SRE Book 經典開頭

## 延伸主題群

把跨週相關 reading 整在一起：

- **MCP 完整系列**（W2 全 6 篇）— 從 protocol 介紹 → server 實作 → auth → registry → 設計反思
- **Claude Code 系列**（W4 全 6 篇 + W2 #6 MCP servers）— Claude Code 的內部實作、用法、生態系
- **AI security 系列**（W6 全 7 篇）— 從 SAST/DAST 基礎 → prompt injection 攻擊 → 真實 CVE 案例 → 防禦
- **Agent observability 系列**（W9 全 6 篇）— 從 SRE 入門 → observability 三柱 → Resolve.ai 的 AI-native incident response
- **Code review 系列**（W7 全 6 篇）— 從人類 review 哲學 → AI reviewer 實證 → Graphite Diamond
