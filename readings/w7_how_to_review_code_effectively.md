---
week: 7
title: "How to Review Code Effectively: A GitHub Staff Engineer's Philosophy"
source_url: "https://github.blog/developer-skills/github/how-to-review-code-effectively-a-github-staff-engineers-philosophy/"
source_type: "blog"
fetched_at: "2026-05-02"
status: "complete"
---

# How to Review Code Effectively: A GitHub Staff Engineer's Philosophy

> **一句話摘要**：GitHub staff engineer Sarah Vessels 把 code review 視為對話而非把關，強調「以提問取代命令、明示阻擋與否、給具體例子」三原則，讓 review 同時達成 quality control 與 knowledge transfer。

## 核心論點（150-200 字繁中）

Vessels 把 review 拉高到「shape the product's implementation」的高度 — review 不是末端的 quality gate，而是設計階段的延伸。她的 philosophy 圍繞三個操作原則：(1) **Ask questions over issuing demands**：與其說「this won't work」，不如問「will this perform well? how does this handle unexpected data?」，把 reviewer 的疑慮轉成 author 自己思考的契機；(2) **Separate substance from preference**：明確區分 blocker（會弄壞 production）與 nit（個人偏好），不該為了 nit 卡住 PR；(3) **Provide specific examples**：抽象的「I don't like this」要換成具體的替代寫法 + relevant issue / 既有 PR 連結。她也提倡 self-review first、affirmation alongside critique（讚賞與批評並存）、draft PR 標示未完成、welcome post-merge review 為 learning opportunity，以及用 code-owner team 控制 reviewer fatigue。

## 關鍵概念

1. **Ask Questions Over Demands（提問代替命令）** — 用疑問句框架 review comment，降低 author 防衛心並引導自我思辨。
2. **Blocker vs Nit（阻擋級 vs 偏好級）** — 明確標示哪些是非改不可、哪些是可選 polish。
3. **Self-review First（自審先行）** — 開 PR 前自己先 diff 走一次，省掉 reviewer 抓 trivial 問題的時間。
4. **Reviewer Fatigue（審閱疲勞）** — 用 code-owner team 與 notification filter 避免 reviewer 被同時 ping 爆。
5. **Knowledge Transfer Side Effect** — Review 順帶讓 reviewer 同步 codebase 知識，不只是抓 bug。

## 對 CS146S 的意義

這篇是 Week 7 的 **human side** baseline — 提醒在討論 AI reviewer 之前，先把「人類 reviewer 該怎麼留好 comment」這件事搞清楚。Vessels 的「ask questions over demands」「specific examples」「blocker vs nit」三原則，恰恰是 AI reviewer（Diamond、CodeRabbit）目前還抓不準的 social nuance — Tomas（Graphite）演講中提到的「only 50% of human comments lead to action」也與 Vessels 提到的 nit-vs-blocker 不分有關。AI reviewer 設計時若 import 這些原則（例：自動標 nit prefix、用問句而非命令句），就能複製人類 reviewer 的 social capital。

## 對 Vibe Coder 的 Takeaway

接到 AI reviewer 的 comment 時也適用同樣的 filter：(1) 它是 blocker 還是 nit？（自己判斷，不要 100% follow）(2) 它有沒有給具體 example 而非抽象說法？(3) 「ask questions」這招也能反向用 — 你 prompt AI reviewer 時改用「what could go wrong with this?」而非「is this correct?」，會得到更可行動的回覆。

## 原文連結

[How to Review Code Effectively: A GitHub Staff Engineer's Philosophy](https://github.blog/developer-skills/github/how-to-review-code-effectively-a-github-staff-engineers-philosophy/)
