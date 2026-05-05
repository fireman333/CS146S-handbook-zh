---
week: 6
title: "Week 6：AI Testing and Security"
title_zh: "AI 測試與資安"
dates:
  - "Mon 2025-10-27"
  - "Fri 2025-10-31"
topics:
  - "Secure vibe coding"
  - "History of vulnerability detection"
  - "AI-generated test suites"
guest_speaker:
  name: "Isaac Evans"
  title: "CEO"
  org: "Semgrep"
status: complete
---

> **本週你會學到什麼**：vibe coding（用 AI 一句話生整個 app）的最大盲點 = 資安。本週講 secure vibe coding、vulnerability detection 的歷史（SAST/DAST/SCA）、prompt injection 攻擊面、以及怎麼用 AI 自動產生 test suites。Friday 由 Semgrep CEO Isaac Evans 親自開講。
>
> 💡 **對非資工背景讀者**：本週是 10 週裡最 technical 的一週。可以用醫療類比理解 — vulnerability ≈ 病灶，SAST ≈ 預防醫學（驗血），DAST ≈ 臨床檢查（影像），prompt injection ≈ 社交工程詐騙。

## 學習目標

完成本週後，你應該能：

1. **辨識** SAST（Static Application Security Testing）vs DAST（Dynamic Application Security Testing）的適用情境
2. **解釋** prompt injection 怎麼攻擊 coding agent（含 GitHub Copilot RCE 的真實 case）
3. **應用** Semgrep / Snyk / GitHub Advanced Security 對 vibe-coded 專案做 security audit
4. **評估** OWASP Top 10 在 LLM 應用上的對應風險（OWASP LLM Top 10）

## 核心概念導讀

### 一、Vibe Coding 的五大資安盲點 — 為什麼速度越快越危險

W1-W5 教你怎麼用 LLM 把開發速度拉到 10x，這週要回頭算帳：**速度的另一面是 attack surface 同步擴張**。對非資工背景的 vibe coder（醫學生、生科研究者、設計師），五個最常踩的盲點是：

1. **API key 直接寫進 code** — Claude Code 跑出來的 demo 常常把 OpenAI API key、AWS credential、DB password 直接放在 source file 裡，commit 上 GitHub 等於把鑰匙公開貼在 7-11 門口
2. **User input 直接拼 SQL / shell / HTML** — Vibe coding 一句「做個搜尋 page」生出的 code 99% 沒做 input sanitization，給點機會就是 SQL injection（注入式攻擊）/ XSS（cross-site scripting，跨站腳本攻擊）/ command injection
3. **Authentication 自己寫** — 真正該用 Auth0、Clerk、Supabase Auth 之類成熟方案，但 vibe coder 常被 LLM 忽悠寫個自製 JWT（JSON Web Token）系統，sign / verify 做錯就是直接登入別人帳號
4. **Dependency 來路不明** — `npm install something-vibe-good` 之前沒人 audit，惡意 package 偷 env var、安裝 backdoor 是常態
5. **Agent 的全自動 approve mode** — Claude Code / Cursor / Warp 都有「all tool calls auto-approve」選項，打開 = 把 shell 鑰匙交給可被 prompt injection 劫持的 LLM（見下方 [Copilot RCE](../readings/w6_copilot_rce_via_prompt_injection.md) 案例）

> 💡 **譯解（醫療類比）**：Vibe coding 的 security 風險就像「治療速度太快、沒做完整 history taking」 — 你救了當下的 acute 症狀（功能 work 了），但漏掉的 underlying disease（漏洞）會在後面爆掉。SAST 對應預防醫學的全套 lab work（驗血、尿液、影像 — 看靜態指標），DAST 對應 stress test（運動心電圖、心導管 — 對運作中的系統打壓力測試），prompt injection 對應社交工程詐騙（騙病人本人說出密碼、騙醫護越權給藥）。

### 二、SAST、DAST、SCA — 漏洞檢測的三角

[SAST vs DAST](../readings/w6_sast_vs_dast.md) 把 application security testing 拆成兩種互補典範。實務上要再加上 SCA（Software Composition Analysis，軟體成分分析），合稱檢測三角：

| 工具類別 | 看什麼 | 何時跑 | 醫療類比 | 實務工具 |
|---------|-------|-------|---------|---------|
| **SAST**（靜態應用程式安全測試） | Source code / binary（不執行） | Commit 前、IDE 內、CI early stage | **預防醫學** — 看 lab 數值找潛在病灶 | Semgrep、CodeQL、SonarQube |
| **DAST**（動態應用程式安全測試） | Running app（送 malicious request 觀察反應） | Staging deploy 後、scheduled scan | **臨床檢查** — 對活體做運動測試找症狀 | OWASP ZAP、Burp Suite、Nuclei |
| **SCA**（軟體成分分析） | `package.json` / `requirements.txt` 等 dependency 清單 | 每次 `npm install` 後、weekly cron | **流行病學監測** — 看你吃進的「藥」（package）有沒有已知 contraindication | Dependabot、Snyk、Renovate |

三者的 trade-off：
- **SAST 早期便宜但 false positive 高** — 一掃幾秒、commit 前就能跑，但會誤報一堆「理論上有風險但實際 unreachable」的 code path（醫療類比：腫瘤 marker 偽陽性多，需臨床判斷複核）
- **DAST 貼近真實攻擊但發現晚** — 等 app 跑起來才能掃，bug 修復成本高（醫療類比：到 ER 時 acute MI 已經發作，治療成本比預防高 100 倍）
- **SCA 是 prerequisite** — 你寫得再安全，npm 套件帶後門也沒救（醫療類比：自己生活作息再好，吃到污染食品照樣中毒）

[OWASP Top Ten](../readings/w6_owasp_top_ten.md) 是這個檢測三角的「分類字典」 — A01 Broken Access Control、A03 Injection、A05 Security Misconfiguration 是 vibe coder 最常踩的三類，每寫一個 endpoint 自問「這條對 Top Ten 哪幾項有曝險？」是基本紀律。

### 三、Prompt Injection — Coding Agent 時代的全新攻擊面

傳統 web app 的攻擊面 OWASP 列在 Top Ten 裡，但 **prompt injection（提示詞注入）是 LLM 時代才出現的新類別**。原理：把惡意指令藏在 LLM 會 ingest 的內容（code comment、GitHub issue、web page、PDF、image OCR），讓它覆蓋原本的 system instruction。

[Copilot RCE via Prompt Injection](../readings/w6_copilot_rce_via_prompt_injection.md) 是這類攻擊的教科書級案例。研究員 Johann Rehberger 發現 **CVE-2025-53773**（CVE = 全球漏洞身份證編號）：攻擊鏈為 (1) malicious instruction 藏進 source code 或 GitHub issue → (2) Copilot 讀進 context → (3) injection 指示 Copilot 自行寫入 `.vscode/settings.json` 開啟 `chat.tools.autoApprove: true`（YOLO mode）→ (4) 從此 Copilot 任何 shell command 都不再向 user 確認 → (5) 達成 **RCE（Remote Code Execution，遠端任意程式執行）**。

> 💡 **譯解（醫療類比）**：Prompt injection 像「social engineering 詐騙打電話到護理站、聲稱是主治醫師、指示護士改某病人的醫囑」— 系統本身（電話、HIS）沒漏洞，但 trust boundary 設計錯了：你不能把「會講人話的東西」自動當成有權限的人。Coding agent 的 prompt injection 之所以致命，是因為它能把「文字攻擊」轉成「真的執行 shell command」，從詐騙電話升級為直接動手簽醫囑單。

[Agentic AI Threats](../readings/w6_agentic_ai_threats_identity_spoofing.md) 把這個攻擊面再往前推：agentic AI 操作 enterprise infra（GCP、AWS、internal API）會被劫持去偷 service account token（cloud metadata service 的 `169.254.169.254` IP 是經典攻擊目標），或藉 BOLA（Broken Object Level Authorization，物件層級授權失敗）越權讀其他 user 資料。Defense 必須是 layered：prompt hardening + sandbox + tool input sanitization + runtime filtering，沒有單一 mitigation 夠用。

### 四、AI-generated Test 與 AI Find Vulnerabilities — 實證告訴我們什麼

LLM 不只是攻擊面，它也是新工具。但這個工具好不好用？[Finding Vulnerabilities with Claude Code & Codex](../readings/w6_finding_vulnerabilities_claude_codex.md)（Semgrep blog）給了一份冷靜的實證：對 11 個真實 Python web app（>800,000 LoC）跑 Claude Code（Sonnet 4）與 OpenAI Codex（o4-mini）做 security audit，結果：

- Claude 找到 46 個真實漏洞、Codex 找到 21 個 — **真的能找到 bug**
- 但 false positive 率分別 **86% 與 82%** — 十條警報只兩條是真
- 同一份 code 跑三次得到 3 / 6 / 11 個不同 bug — **嚴重 non-deterministic**

Non-determinism 的根因在 [Context Rot](../readings/w6_context_rot.md)：Chroma Research 對 18 個 SOTA LLM 做擴展版 NIAH（Needle in a Haystack）測試，發現 input 越長 performance 越不穩，即使是百萬 token context window 也一樣 — distractor、coherent narrative、low semantic similarity 都會加劇衰減。所以 LLM 掃大 codebase 時，後段檔案可能根本沒被「真的看到」。

對照組是 [Vulnerability Prompt Analysis with O3](../readings/w6_vulnerability_prompt_analysis_with_o3.md) 的 success case — Sean Heelan 用嚴格的 system prompt（三階段：code path → conditional analysis → contradiction detection；強制原則「**寧可漏報也不誤報**」）驅動 OpenAI o3 在 Linux kernel 找出 **CVE-2025-37899**（一個真實的 use-after-free 漏洞）。差別在哪？**Scope 窄**（一類漏洞、特定模組）、**紀律嚴**（強制 step-by-step trace、禁止 hypothetical）、**反幻覺**（allow「no findings」是合法輸出）。

歸納：LLM 找 bug 不是 silver bullet，但配對 (a) 鎖定特定 vulnerability class、(b) 多次採樣取聯集、(c) 仍跑傳統 SAST 補 taint tracking 盲區、(d) 把 LLM 警報當「嫌疑名單」而非結論，可以變成有用的補強層。

## Monday Lecture（10/27）：AI QA, SAST, DAST, and Beyond

- **Slides**: [Google Slides 公開連結](https://docs.google.com/presentation/d/1C05bCLasMDigBbkwdWbiz4WrXibzi6ua4hQQbTod_8c/edit?usp=sharing)
- **講者**: Mihail Eric

> 以下基於 Google Slides 公開內容（TXT export）整理的繁中摘要：

Mihail 開場切入點直接：「軟體錯誤可以毀掉使用者對產品 / 公司的信任、造成巨大金錢成本。當 LLM 在寫你大部分 code 時，需要強而廣的 guardrail 才不會出包。」

1. **既有 threat landscape 速覽** — SQL injection、Cross-site scripting（XSS）、broken authentication、insecure direct object reference、security misconfiguration、sensitive data exposure 六大類。
2. **Vulnerability detection 三角：SAST / DAST / SCA** —
   - **SAST（Static Application Security Testing）**：白箱、看 binary + source code、SDLC 早期跑（修 bug 最便宜）。Pattern matching scan codebase。可抓 SQL injection、command injection、XSS。工具範例：Bandit、Semgrep、ESLint + extensions。
   - **DAST（Dynamic Application Security Testing）**：黑箱、模擬真實 hacker 攻 running app、SDLC 全程都可跑（false positive 比 SAST 少）。技術：input fuzzing、session token manipulation、config / header testing、brute force rate limit。
   - **SCA（Software Composition Analysis）**：深度分析 OSS package。技術：分析 package metadata、transitive dependency resolution、跟 vulnerability DB 比對、binary / artifact scanning。
   - 三者 cover 三層：code（SAST）+ runtime（DAST）+ dependency（SCA）。
3. **What's changed: Bad — 新 AI agent attack vector** —
   - **Prompt injection**：藏 hidden / 誤導指令在 LLM ingest 的內容裡讓它偏離原本行為。Slide 引用 AMP code 案例：用 prompt injection 從 AI agent 提取 system prompt。
   - **Tool misuse**：用欺騙 prompt 讓 agent 濫用整合的 tool。引用 [embracethered.com 的 AMP escape blog](https://embracethered.com/blog/posts/2025/amp-agents-that-modify-system-configuration-and-escape/) — agent 修改 system configuration 並 escape sandbox。
   - **Code attacks**：利用 agent 的 code execution 能力獲得執行環境的未授權存取。
   - **Intent breaking**：操縱 agent 的 plan，讓 action 偏離原本目的。
   - **Identity spoofing**：用 compromised authentication 假冒合法 agent。
4. **What's changed: Good — 新 SAST/DAST/SCA 增強技術** —
   - **「Shift left」security 比以前更可及** — LLM 可被嵌入 workflow 抓問題
   - **Automated penetration testing**
5. **LLM 在 security testing 的限制** —
   - **AI SAST 的 false positive 率高得驚人** — Claude Code / Codex 對某些漏洞類別 50-100% false positive，比傳統 SAST（50+%）還糟
   - **既有 benchmark 不貼近真實情境**，難 evaluate LLM
   - **Non-deterministic**：同 prompt 多跑得不同結果，怎麼確認 catch 完所有 vulnerability？
   - **Context rot**：not all context is created equal；compaction（壓縮 context）會讓資訊變形
6. **Open question** —
   - 怎麼降 vulnerability detection 的 false positive 與 hallucination？
   - 怎麼 verify LLM 生的 patch 真的安全、不引入 regression？
   - 怎麼讓 LLM 解釋它為什麼 flag 這個 vulnerability、為什麼 propose 這個 fix？
   - 衡量 LLM AppSec 表現的對的 benchmark 是什麼？
   - LLM 怎麼嵌進 CI/CD 不淹沒 team 的告警雜訊？
   - AI 生成的 patch 引入新 vulnerability 時誰要負責？

**Key takeaway**：AI 沒讓 QA / Security 變不需要 — **反而讓它變更重要**。SAST + DAST + SCA 的三角依然是基礎，加上對 prompt injection / tool misuse / code attack 三類 AI-era attack vector 的特別防護才完整。LLM 找漏洞能力有但 false positive 高、非確定性、context rot 三個根本問題還沒解 — 把 LLM 警報當「嫌疑名單」處理而非結論。

## Friday Lecture（10/31）：Isaac Evans（Semgrep CEO）

- **Speaker**: [Isaac Evans](https://www.linkedin.com/in/isaacevans/), CEO of [Semgrep](https://semgrep.dev/)
- **Slides**: 未公開

> Slides 未公開，依 Isaac 公開訪談 + Semgrep 公開技術文件 + 同期 Semgrep blog（[Finding Vulnerabilities with Claude Code](../readings/w6_finding_vulnerabilities_claude_codex.md)）best-effort 重建：

Isaac Evans 是 MIT Lincoln Laboratory cybersecurity researcher 出身，2017 年創立 Semgrep（前身 r2c）— 把學術界的 program analysis 技術做成 developer-friendly 的 SAST 工具。Semgrep 的 unique stance 是「rule-as-code」：每條 security rule 寫成 YAML pattern，跟 grep 一樣好懂但比 grep 強得多（語法樹層級的 pattern matching）。預期演講內容：

1. **Semgrep origin story** — 為什麼從 r2c rebrand 成 Semgrep、為什麼選擇 open-source rule registry（任何人能寫 rule、社群共享）這個 distribution model
2. **Static analysis 的歷史** — 從 lint（1979 Bell Labs）→ Coverity（commercial SAST 開山）→ FindBugs / SpotBugs（學術界 Java tool）→ CodeQL（GitHub 收購、query language 取向）→ Semgrep（pattern matching + 開源 rule registry）
3. **為什麼 LLM 不會取代 SAST** — 對應 reading 那篇實證：LLM 缺 inter-procedural taint flow 能力、non-deterministic、context rot；rule-based SAST 反而在 injection 類 deterministic 偵測強。兩者是互補不是取代
4. **AI 怎麼增強 SAST** — Semgrep 自己怎麼用 AI：(a) 用 LLM 自動生 rule（看一個 CVE patch 反推可掃同類問題的 rule）、(b) 用 LLM 做 false positive triage（rule 報的警報先讓 LLM 篩一輪）、(c) 用 LLM 自動 suggest fix（不只報 bug 還給 patch suggestion）
5. **AI Coding 對 Semgrep 的衝擊** — AI 寫的 code 是不是 less secure？實證上是的（Stanford 2023 study 已經證實），所以 vibe coding 浪潮反而擴大 SAST 市場
6. **企業導入經驗** — Semgrep 服務的客戶（Snowflake、Slack、Figma 等）怎麼把 SAST 整進 dev workflow、怎麼平衡 false positive 與 dev velocity、security team 怎麼跟 AI dev tool 共處
7. **Roadmap** — Supply chain security（SCA + SAST 融合）、prompt injection-aware rule、LLM-aware threat model

**Key takeaway**：Static analysis 沒被 LLM 殺掉，反而因為 vibe coding 浪潮變得更重要。Semgrep 的 stance 是「rule-based + AI-augmented」混合方法 — rule 給 deterministic、AI 給 contextual reasoning，兩者各取所長。對 vibe coder 的 implication：別以為「找 Claude 幫我 audit」就夠了，必須加上 deterministic SAST（Semgrep 有 free tier）才能蓋住 LLM 的 taint tracking 盲區。

## Reading 摘要

| 篇名 | 來源 | 一句話重點 |
|------|------|-----------|
| [SAST vs DAST](../readings/w6_sast_vs_dast.md) | Splunk blog | SAST（白箱、看 source）+ DAST（黑箱、跑 runtime）+ 可加 RASP 形成多層防禦，現代 pipeline 必整合兩者 |
| [Copilot RCE via Prompt Injection](../readings/w6_copilot_rce_via_prompt_injection.md) | embracethered.com | CVE-2025-53773：prompt injection 騙 Copilot 自寫 `.vscode/settings.json` 開啟 YOLO mode → 完全 RCE |
| [Finding Vulnerabilities with Claude Code & Codex](../readings/w6_finding_vulnerabilities_claude_codex.md) | Semgrep blog | 11 repo / >800k LoC 實測：找到真 bug 但 86% false positive、non-deterministic，LLM 不能取代 SAST |
| [Agentic AI Threats: Identity Spoofing](../readings/w6_agentic_ai_threats_identity_spoofing.md) | Palo Alto Unit 42 | Agent 可被騙去偷 cloud metadata token / 越權讀資料（BOLA），漏洞 framework-agnostic、源於 insecure design |
| [OWASP Top Ten](../readings/w6_owasp_top_ten.md) | owasp.org | 十大 web app 風險清單，2021 版以 incidence rate 排序，是 secure coding 的共同詞彙 |
| [Context Rot](../readings/w6_context_rot.md) | research.trychroma.com | 18 個 SOTA LLM 實證 — context window 越大不等於越可靠，10k token 後 performance 顯著衰減 |
| [Vulnerability Prompt Analysis with O3](../readings/w6_vulnerability_prompt_analysis_with_o3.md) | github.com/SeanHeelan | 三階段 prompt + 寧可漏報原則，o3 真的找到 CVE-2025-37899（Linux kernel UAF） |

**閱讀優先順序**：時間有限的話先讀 [OWASP Top Ten](../readings/w6_owasp_top_ten.md)（建立詞彙）→ [SAST vs DAST](../readings/w6_sast_vs_dast.md)（工具光譜）→ [Copilot RCE](../readings/w6_copilot_rce_via_prompt_injection.md)（prompt injection 教科書 case）→ [Finding Vulnerabilities with Claude Code](../readings/w6_finding_vulnerabilities_claude_codex.md)（LLM 實戰能力 baseline）→ [Vulnerability Prompt with O3](../readings/w6_vulnerability_prompt_analysis_with_o3.md)（怎麼把 LLM 用對）。其他兩篇是延伸 — [Agentic AI Threats](../readings/w6_agentic_ai_threats_identity_spoofing.md) 適合做 enterprise agent app 的人、[Context Rot](../readings/w6_context_rot.md) 是 root-cause 補充。

## Assignment：Writing Secure AI Code

- **Source**: [github.com/mihail911/modern-software-dev-assignments/blob/master/week6/assignment.md](https://github.com/mihail911/modern-software-dev-assignments/blob/master/week6/assignment.md)
- **任務描述**: 對一個 vibe-coded web app（assignment 提供或自帶 side project）做完整 security review：(a) 跑 Semgrep / Snyk 等 SAST tool 並 triage 結果、(b) 對 OWASP Top Ten 每一類盤點 risk、(c) 用 [Vulnerability Prompt with O3](../readings/w6_vulnerability_prompt_analysis_with_o3.md) 的三階段 prompt 範本驅動 Claude 找特定類型漏洞、(d) 模擬 prompt injection attack（在 README 或 comment 藏指令）測試自家 agent 抗性、(e) 寫 fix 並驗證。
- **自學者可行性**: ⭐⭐⭐ 可做但偏深。需要的工具都有 free tier（Semgrep、Snyk free、OWASP ZAP open source），但 OWASP 詞彙與 web security mental model 對非資工背景讀者有學習曲線。預估 5-8 hr。

> 💡 **非資工背景讀者的減量做法**：把 (a)（跑 Semgrep）+ (e)（修出來的 critical bug）做完，其他 task 看 reading 理解就夠。最終目標是建立「每次 commit 前要跑哪些 check」的肌肉記憶，不是變成 pen-tester。

## 對 Vibe Coder 的應用

W6 的內容對非資工背景讀者門檻高，但本節不要求你成為 security expert — 目標是建立**最小可行的 security hygiene**，把高頻、致命的風險擋掉。實戰建議：

1. **API key 管理 — 鐵律三條**
   - **絕不寫進 source code**：用 `.env`（要加進 `.gitignore`）、生產環境用 cloud secret manager（Vercel/Railway env var、AWS Secrets Manager）
   - **公開 repo 第一件事跑 [gitleaks](https://github.com/gitleaks/gitleaks)** 掃 commit history，看有沒有歷史不慎 leak 的 key（醫療類比：每次新工作報到都驗血看有沒有 hidden chronic condition）
   - **API key 一發現外洩立刻 revoke + rotate**，別存僥倖。OpenAI / Anthropic 都有 monitoring，1 小時內可能就被人盜刷數百美金

2. **Vibe-coded side project 的 minimal viable security check**（每次 push 前跑）
   - **SAST**：`semgrep --config=auto` 或 `snyk code test`（兩者皆 free tier）
   - **SCA**：`npm audit` / `pip-audit`，或讓 GitHub Dependabot 自動開 PR
   - **Secret scan**：gitleaks pre-commit hook
   - **OWASP Top Ten 自查**：endpoint 寫完問自己「有沒有 access control？user input 有 sanitize？config secret 有沒有寫 code 裡？」
   
   這四個加起來 5 分鐘以內，是 P3 人上人 等級的最小 viable hygiene

3. **Claude Code / Cursor / Warp 的 security risk pattern — 別做的事**
   - **絕不開 YOLO mode / auto-approve all tools**：對應 [Copilot RCE](../readings/w6_copilot_rce_via_prompt_injection.md) 的 attack chain，這是 single point of failure
   - **clone 別人的 repo 第一件事檢查 `.vscode/`、`.cursor/`、`.claude/`**：這些是 agent config，可能藏 prompt injection
   - **限制 agent 的 file write / shell exec scope**：用 Claude Code 的 `permissions` 設定把可寫範圍鎖在專案資料夾內，別讓它能改 `~/.zshrc` 或 `/etc/`
   - **對外部 untrusted source 抱「假設裡面有 prompt injection」心態**：fetch 來的網頁、PDF、image OCR 都該被視為 hostile input

4. **請 LLM 找 bug 的 4 條紀律**（從 [Vulnerability Prompt with O3](../readings/w6_vulnerability_prompt_analysis_with_o3.md) 提煉）
   - **Scope 要窄**：指定一類漏洞（如 SQL injection）、一個檔案，而非「找所有漏洞」
   - **強制三階段輸出**：code path → conditional analysis → contradiction detection，不要只要結論
   - **明確說「找不到回 no findings、別亂掰」**：寧可漏報不要誤報這條紀律會大幅降 false positive
   - **跑多次（≥3）取聯集**：對應 [Context Rot](../readings/w6_context_rot.md) 與 [Semgrep 實證](../readings/w6_finding_vulnerabilities_claude_codex.md) 的 non-determinism

5. **Authentication / Payment 等 critical path 永遠用成熟方案**
   - Auth：Clerk、Auth0、Supabase Auth、NextAuth — 別自己寫 JWT
   - Payment：Stripe、Paddle — 別自己處理信用卡資料（PCI-DSS 是合規地獄）
   - 上傳檔案：用 cloud storage signed URL（S3、GCS），別讓檔案直接過你的 server
   - **這些東西踩錯一次代價極大（資料外洩、被罰、被盜刷）**，比花時間自製划算太多倍

6. **Claude Code 的好習慣 — 把 security 寫進 `CLAUDE.md`**
   - 加一段 `## Security Guardrails`：禁止把 secret 寫進 code、user input 必須 sanitize、新 endpoint 必加 access control check
   - 加一段 `## Forbidden Patterns`：列出已踩過的雷（例：「絕不用 `eval()`」「絕不直接拼 SQL」），Claude 每次都會讀

> 💡 **vibe coder 的 Day-1 Quick Win**：今天就在你最 active 的 side project 跑這三條 — (1) `npm install -g gitleaks && gitleaks detect`（10 秒看有沒有歷史 leak 的 key），(2) 申請 [Semgrep free account](https://semgrep.dev/) 把 repo 連上、自動跑一次掃描看 finding，(3) 在 `CLAUDE.md` 加上 `## Security Guardrails: never put secrets in source code; sanitize all user input; require auth check on every endpoint`。30 分鐘建好的這三條 hygiene 在 95% 的情境下就贏過大多數 vibe-coded project。

---

**上一週**：[W5 The Modern Terminal](05_modern_terminal.md) | **下一週**：[W7 Modern Software Support](07_modern_software_support.md)
