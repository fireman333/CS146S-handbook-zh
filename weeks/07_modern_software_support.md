---
week: 7
title: "Week 7：Modern Software Support"
title_zh: "現代軟體支援工具"
dates:
  - "Mon 2025-11-03"
  - "Fri 2025-11-07"
topics:
  - "What AI code systems can we trust"
  - "Debugging and diagnostics"
  - "Intelligent documentation generation"
guest_speaker:
  name: "Tomas Reimers"
  title: "CPO"
  org: "Graphite"
status: complete
---

> **本週你會學到什麼**：AI code review、AI-assisted debugging、智慧型文件生成。當你的 codebase 被 AI 寫出 70% 之後，code review 的意義變了 — 不是「同事看人寫的 code」而是「人類審 AI 寫的 code」。Friday 由 Graphite CPO Tomas Reimers 開講（Graphite 是頂尖的 AI code review 平台）。

## 學習目標

完成本週後，你應該能：

1. **辨識** AI code review 在 catch bug、style enforcement、knowledge transfer 三個面向的能力與盲點
2. **應用** Graphite / CodeRabbit / GitHub Copilot Code Review 設定 PR review 流程
3. **設計** 一個「AI 寫 + AI review + 人類最終 approve」的 PR workflow
4. **評估** 哪些 code review 任務適合全自動 vs 哪些必須留給人類

## 核心概念導讀

### 一、Code review 從「品管把關」到「心智模型同步」的歷史轉折

要看懂為什麼 2026 年大家還在認真討論 code review（明明 AI 都會寫 code 了），你必須先理解 review 在過去 50 年的角色變遷。早期 IBM 1976 年提出的 Fagan inspection（Fagan 形式審查）是一套重型流程，目的單純：在 code ship 出去之前再多一雙眼睛抓 defect（缺陷）。Steve McConnell 在《Code Complete》整理的 industry data 給了這個流程量化背書 — design + code inspection 平均能抓到 55-60% 的 defect，遠高於各種 testing method（25-45%）。Jeff Atwood 2008 年寫的 [Code Reviews: Just Do It](../readings/w7_code_reviews_just_do_it.md) 把這個論點直接搬上檯面：別爭辯做不做、有做就贏，每一分鐘 review 投資都會 paid back tenfold（十倍奉還）。

但 review 真正的價值很快超越「抓 bug」。Blake Smith 2015 年 [Code Review Essentials](../readings/w7_code_review_essentials_for_software_teams.md) 把 review 重新 framing 成 **mental model synchronization（心智模型同步）** — 「當 Bob 提交 accounting subsystem 的 PR，Amy 在 review 中同步更新她對該 system 的 mental model」。Bug 被擋下來只是 side effect，真正的 ROI 是團隊知識擴散、降低未來修改的 onboarding 成本。GitHub staff engineer Sarah Vessels 在 [How to Review Code Effectively](../readings/w7_how_to_review_code_effectively.md) 進一步把 review 拉高到「shape the product's implementation」 — review 不是末端 quality gate，是設計階段的延伸。

> 💡 **譯解**：把 code review 當「品管站」是 1980 年代的思維。2020 年代的 framing 是「review = 一場結構化對話」，bug detection、knowledge transfer、architectural alignment 三件事一起發生。理解這個轉變，後面看 AI reviewer 才不會誤以為「AI 會抓 bug 就能取代 review」 — 它取代的只是其中一層。

### 二、AI code review 能做什麼、做不到什麼：兩軸四象限框架

進入 LLM 時代，code review 被拆成兩種勞力：mechanical layer（機械層）跟 alignment layer（對齊層）。Google 2024 年發在 AIware '24 的論文 [AI-Assisted Assessment of Coding Practices](../readings/w7_ai_assisted_assessment_coding_practices.md) 提供了第一份 academic baseline — Google 內部 AutoCommenter 對數萬名 developer 部署，覆蓋 C++ / Java / Python / Go，能涵蓋 **68% 的 human reviewer 常引用 best practice**，而且其中 **66% 是傳統 linter 抓不到的**（comment clarity、justified naming exception、context-dependent 慣例）。Comment resolution rate（評論解決率）約 40%，與 human reviewer 的 ~50% 接近。

Graphite co-founder Tomas Reimers 在 [Lessons from Millions of AI Code Reviews](../readings/w7_lessons_from_millions_of_ai_code_reviews.md) 提出更實用的 **2x2 quadrant（兩軸四象限）框架**：

| | LLM 能 reliably catch | LLM 抓不準 |
|---|---|---|
| **Human 想收** | ✅ 右上：留 comment | ❌ 左上：人類 reviewer 守備 |
| **Human 不想收** | ❌ 右下：always-correct-but-unwelcome（add test / extract function） | ❌ 左下：別碰 |

只有右上象限的 comment 該被 AI 留下。Reimers 點出兩個典型失敗模式：

- **左上盲區**：LLM 抓不到 codebase-specific convention（公司命名慣例、業務 domain 邏輯、住在資深工程師腦中沒寫成文件的 tribal knowledge）
- **右下過度發言**：LLM 愛留「你應該加 test」「這應該 extract function」這類技術上沒錯但 reviewer 不該無腦留的 comment，留多了 author 直接 ignore 整個 reviewer

Graphite 的 [AI Code Review Implementation Best Practices](../readings/w7_ai_code_review_implementation_best_practices.md) 把這個 insight 翻譯成商業 framework — AI reviewer 應走 **human-in-the-loop（人類介入式）** 路線，AI 跑 first pass、human 驗證並 approve。signal-to-noise ratio（訊號雜訊比）是首要指標，三個操作槓桿：(1) per-issue-type sensitivity tuning（敏感度調校）、(2) false-positive feedback loop（讓 developer 標 false positive 訓練系統）、(3) priority level（火力集中在 security + obvious bug，nit / style 暫時關掉）。

### 三、為什麼 millions of reviews 教我們的事比任何 paper 都重要

Graphite 的 Diamond AI reviewer 跑在數百萬個 production PR 上，沉澱出三條關鍵 lesson，是任何 academic benchmark 都看不到的：

1. **Metric 設計決定產品命運**：傳統 thumbs-up / thumbs-down 收集率太低（<4% 下票率沒區辨力）。Graphite 改用「**action rate**」 — comment 是否導致 author 在後續 commit 改 code — 當作 success metric。這個 metric 直接 align 商業價值（comment 沒被 act on = 浪費 reviewer 時間 = 浪費 LLM API call）。

2. **52% vs 50% parity 的意義**：Human reviewer 的 comment 約 50% 帶來 action，Diamond 經過調校到 2025 March 已達 52% — 等同 human baseline。這個數字翻譯成白話：AI reviewer 已經追平人類 reviewer 的 actionability，剩下的是「哪些象限該留給誰」的分工問題，不是「能不能用」的問題。

3. **False positive 比 model size 重要**：Google AutoCommenter 與 Graphite Diamond 不約而同得出同一結論 — production 成功的關鍵不是 model quality，是「**承認 LLM 會錯、留出 retract 通道**」。Google 用 URL suppression（per-rule mute），Graphite 用 false-positive feedback loop。一個 false positive 比例高的 reviewer，再準的部分也會被 developer 一起 ignore。

> 💡 **譯解**：商用 AI reviewer 像一個「永遠在試用期的新員工」。它技術力到位，但說話會 over-commit、會踩公司潛規則。產品設計的關鍵不是讓它變更聰明，是給它「不知道就閉嘴」的機制。Diamond 的 quadrant 框架本質上是教 LLM 自己 self-censor。

### 四、AI 寫 + AI review + 人類 approve 的 PR workflow

把 W7 所有概念整合起來，2026 年 vibe coder 的標準 PR workflow 應該長這樣：

```
1. Author（你 + Claude Code / Cursor）寫 code → 自動 commit
2. 自己 self-review diff（Vessels 原則）→ 切成 scalpel-like 小 PR（Smith 原則）
3. 寫 PR description：problem + structural change + testing（Smith 原則）
4. 開 PR → AI reviewer（Diamond / CodeRabbit）跑 first pass
5. AI reviewer 留右上象限 comment（mechanical layer：bug / security / style violation）
6. 你決定哪些是 blocker / nit / false positive，回應或標記
7. False positive 標 thumbs-down 訓練 reviewer
8. 自己再過一輪 — 確認 alignment layer（這個改動跟 codebase 整體設計合不合）
9. 人類最終 approve（在團隊裡是 reviewer / 一人專案就是你自己延後一天再看一次）
10. Merge
```

每一步對應一篇 reading 的核心 insight：1-3 步是 Atwood / Smith 的 review fundamentals；4-7 步是 AutoCommenter / Graphite 的 AI reviewer engineering；8-9 步是 Vessels 強調的 mental model synchronization、AI 永遠取代不了的部分。

## Monday Lecture（11/3）：AI code review

- **Slides**: [Google Slides（需 Stanford 帳號）](https://docs.google.com/presentation/d/1NkPzpuSQt6Esbnr2-EnxM9007TL6ebSPFwITyVY-QxU/edit?usp=sharing)
- **講者**: Mihail Eric

> Slides 需 Stanford 帳號，依 lecture topic 與課程脈絡 best-effort 重建：

這節 Mihail 把第一個小時花在「為什麼 code review 在 AI 時代反而變得更重要而不是更不重要」。預期內容包括：

1. **Code review 的角色變遷** — 從 Fagan inspection（1976）→ GitHub PR review（2008）→ AI-augmented review（2024+）三個世代的對比，搭配 McConnell 55-60% defect detection 數據鋪墊「review 的歷史 ROI」
2. **AI 寫 code 後 review 為什麼更重要** — 當 70% code 是 AI 寫的，author 對 code 的 mental model 會比過去淺，**review 變成 author 自己跟 codebase 對齊的最後機會**。Bug detection 反而退到次要
3. **三大 AI reviewer 商品化現況** — Graphite Diamond、CodeRabbit、GitHub Copilot Code Review 的功能對比、定價、整合方式（GitHub App / GitLab webhook / 自架）
4. **AutoCommenter 的 Google 內部數據解讀** — 68% best practice coverage、66% beyond linter、40% resolution rate 三個數字的工程意涵
5. **企業導入路徑** — 從 hobby 一人專案 → 5 人新創 → 100 人公司 → 數千人企業，每個 stage 該選哪種 reviewer 配置
6. **demo 段** — Mihail 應該會 live demo 在他自己的 repo 開 PR，跑 Diamond / CodeRabbit 看 comment 品質

**Key takeaway**：AI 寫得越多，review 越不能省。Mechanical layer 交給 AI（風格、明顯 bug、security），alignment layer 留給人（架構、業務邏輯、心智模型同步）。

## Friday Lecture（11/7）：Tomas Reimers（Graphite CPO）

- **Speaker**: [Tomas Reimers](https://www.linkedin.com/in/tomasreimers/), CPO of [Graphite](https://graphite.dev/)
- **Slides**: [Drive 連結](https://drive.google.com/file/d/1hwF-RIkOJ_OFy17BKhzFyCtxSS7Pcf7p/view?usp=drive_link)

> Slides 為 Drive 連結（需 Stanford 帳號），依 [YouTube 演講](../readings/w7_lessons_from_millions_of_ai_code_reviews.md) + Graphite 公開資料 best-effort 重建：

Reimers 是 Graphite 共同創辦人 + CPO，這場演講的核心素材就是他在 YouTube 那場 "Lessons from Millions of AI Code Reviews"。預期內容：

1. **Graphite 的起點：stacked PR 的設計哲學** — 在 GitHub 預設一個 PR 就是一段 branch 的世界裡，Graphite 推 stacked PR（堆疊式 PR）— 把一個大 feature 拆成多個 small PR，每個 PR 依賴前一個。對應 Smith 的「scalpel-driven development」原則。Tomas 會解釋為什麼 stacked PR 是 AI-augmented review 的天然搭配 — 小 PR + AI reviewer = signal-to-noise 最高的組合
2. **Diamond 的 product evolution** — V1 用 raw GPT-4 + simple system prompt → 一堆 false positive、user trust 崩盤。V2 引入 quadrant 框架、加入 codebase context retrieval。V3 換 metric 到 action rate、做 per-rule sensitivity tuning
3. **2x2 quadrant 框架現場推導** — 講過為什麼 thumbs-up/down 失敗、為什麼選 action rate、52% vs 50% parity 的故事
4. **LLM 的兩個 systemic 盲區** — codebase-specific convention（左上）+ always-correct-but-unwelcome（右下）。會給具體例子：「revert this code」「CSS doesn't work this way（其實會）」
5. **What's next: review 之後** — Diamond 的下一步是不是 auto-fix？是不是直接生成 follow-up PR？AI reviewer 跟 AI coding agent 的邊界該畫在哪？
6. **Q&A 重點預期**：學生會問 self-host vs 商業服務、prompt evolution 細節、Graphite 怎麼處理 IP / source code 安全

**Key takeaway**：AI code reviewer 不是讓它「變更聰明」，是讓它「知道自己不該開口的時候」。Quadrant 框架 + action rate metric 是這個工程問題的 dual key。

## Reading 摘要

| 篇名 | 來源 | 一句話重點 |
|------|------|-----------|
| [Code Reviews: Just Do It](../readings/w7_code_reviews_just_do_it.md) | Coding Horror（Atwood, 2008） | Review 是性價比最高的 quality practice，inspection 抓 55-60% defect 遠勝 testing 25-45%，有做就贏 |
| [How to Review Code Effectively](../readings/w7_how_to_review_code_effectively.md) | GitHub blog（Vessels） | 三原則：ask questions over demands、separate substance from preference、provide specific examples |
| [AI-Assisted Assessment of Coding Practices](../readings/w7_ai_assisted_assessment_coding_practices.md) | arXiv 2405.13565（Google AIware '24） | AutoCommenter 覆蓋 68% best practice，66% 是 linter 做不到的，40% resolution rate |
| [AI Code Review Implementation Best Practices](../readings/w7_ai_code_review_implementation_best_practices.md) | Graphite | Human-in-the-loop + sensitivity tuning + false-positive feedback loop = 可用的 AI reviewer |
| [Code Review Essentials for Software Teams](../readings/w7_code_review_essentials_for_software_teams.md) | blakesmith.me（2015） | Review 的核心是 mental model synchronization，scalpel-driven 小 PR + clarifying tone |
| [Lessons from Millions of AI Code Reviews](../readings/w7_lessons_from_millions_of_ai_code_reviews.md) | YouTube（Tomas Reimers, Graphite） | 2x2 quadrant：只留「LLM 能 catch × human 想收」象限；action rate 52% 已追平 human |

**閱讀優先順序**：時間有限的話，先讀 [Tomas Reimers YouTube](../readings/w7_lessons_from_millions_of_ai_code_reviews.md)（最具體的 industry insight）→ 再讀 [Google AutoCommenter paper](../readings/w7_ai_assisted_assessment_coding_practices.md)（academic baseline）→ 補 [Vessels GitHub blog](../readings/w7_how_to_review_code_effectively.md)（human-side 原則）。Atwood / Smith 兩篇是經典背景，建立完 mental model 再回頭讀。

## Assignment：Code Review Reps

- **Source**: [github.com/mihail911/modern-software-dev-assignments/tree/master/week7](https://github.com/mihail911/modern-software-dev-assignments/tree/master/week7)
- **任務描述**: 練習 AI code review 的完整 loop — 拿一個有 bug 的 starter repo、用 Cursor / Claude Code 寫 fix、開 PR、跑 Diamond 或 CodeRabbit、評估 AI reviewer 的 comment 品質（用 Reimers 的 quadrant 框架打分）、回應 comment、merge。重點是建立「你能判斷哪些 comment 該收、哪些該 dismiss」的肌肉記憶。
- **自學者可行性**: ⭐⭐⭐⭐ 完全可做。需 GitHub 帳號 + 一個 AI reviewer service（Graphite 有 free tier、CodeRabbit 個人 plan 約 $15/月、GitHub Copilot Code Review 內含於 Copilot 訂閱）。預估 4-6 hr — 比 W1-W2 assignment 重，因為要實際開 PR 跑完整 loop 而非沙盒練習。

> 💡 **沒有付費訂閱的替代方案**：(1) GitHub Copilot 學生方案免費，包含 Copilot Code Review；(2) Graphite Diamond 個人 free tier 每月有 review quota；(3) 用 Claude Code 在 local 模擬：自己 commit 後對 Claude 說「你現在是 senior code reviewer，請對這個 diff 留 comment，限 mechanical layer，不要留 architectural 建議」。

## 對 Vibe Coder 的應用

W7 是把 vibe coder 從「寫得出來」升級到「**寫得對且維持得住**」的關鍵一週。實戰建議：

1. **side project 馬上裝一個 AI reviewer** — 推薦順序：GitHub Copilot Code Review（免費學生方案 / 已訂 Copilot 直接內含）→ Graphite Diamond（free tier 夠個人專案用）→ CodeRabbit（功能多但要付費）。裝完先別期待奇蹟，先觀察 false positive 比例兩週

2. **PR description 永遠寫三段** — 即使一人專案：(a) 這次解決什麼問題、(b) 改了哪幾個 file 跟整體結構變化、(c) 怎麼測（手測 / unit test / 跑哪個 script）。三個月後的自己跟 AI agent 都會感謝你

3. **學會用 Reimers quadrant 篩 comment** — AI reviewer 留 comment 後，先問自己兩問：(a) 它抓的這件事 LLM 真的能可靠判斷嗎？（如果是 codebase-specific convention 直接 dismiss）(b) 我願意收這類 comment 嗎？（如果是「請加 test」這種 always-correct-but-unwelcome，當下 dismiss、之後 batch 處理）

4. **PR 永遠切 scalpel-like 小 cut** — 500 行以上 PR 不論 human 還是 AI reviewer 都會 skim 過去；切成 5 個 100 行 PR 的 review 品質會好 5 倍。Graphite stacked PR 工具就是為此設計

5. **跟 Claude Code 的對話加一層 review reflex** — 每次 Claude 寫完 code，固定問一句「請以 senior code reviewer 角度檢視剛才的改動，列出 3 個你會留 comment 的點，並標記是 blocker / nit / false positive」。這等於把 review 內建進 Claude Code 的 loop，配合 W6 學的 testing 一起，能擋掉大量 bug

6. **codebase 的 tribal knowledge 寫進 `CLAUDE.md`** — Reimers 點出 LLM 最大盲區是 codebase-specific convention。把你專案的命名慣例、業務邏輯、奇怪的 quirk 寫進 `CLAUDE.md`（同 W1 學的），AI reviewer 會自動讀到（如果工具支援），等於把左上象限的盲區補起來

> 💡 **vibe coder 的 Day-1 Quick Win**：今天就在你 main side project 開一個小 PR（隨便重構一個 function 也好），裝 Graphite Diamond 或 GitHub Copilot Code Review，看 AI reviewer 留什麼 comment，用 Reimers 的 quadrant 對每條 comment 標籤（右上 / 左上 / 右下 / 左下）。你會發現大部分 comment 落在右下（always-correct-but-unwelcome）— 那就是你該調 sensitivity 的訊號。一輪下來 30 分鐘，你對 AI code review 的直覺會完全不一樣。

---

**上一週**：[W6 AI Testing and Security](06_ai_testing_security.md) | **下一週**：[W8 Automated UI and App Building](08_automated_ui_app_building.md)
