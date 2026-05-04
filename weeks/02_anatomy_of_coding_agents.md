---
week: 2
title: "Week 2：The Anatomy of Coding Agents"
title_zh: "Coding Agent 的解剖學"
dates:
  - "Mon 2025-09-29"
  - "Fri 2025-10-03"
topics:
  - "Agent architecture and components"
  - "Tool use and function calling"
  - "MCP (Model Context Protocol)"
status: complete
---

> **本週你會學到什麼**：拆解 coding agent（Claude Code、Cursor、Devin、Codex）的內部結構，理解 LLM + tool use + memory + planning 怎麼組合成一個會自己寫 code 的 agent。並動手做出一個 custom MCP（Model Context Protocol）server。

## 學習目標

完成本週後，你應該能：

1. **拆解** coding agent 的核心組成（LLM、tool registry、planner、memory、observer）
2. **解釋** function calling / tool use 在 LLM API 層面的運作機制
3. **設計** 一個 MCP server 把外部資料源接進 Claude / Cursor
4. **比較** Claude Code、Cursor、Devin 三種 agent 在架構決策上的差異

## 核心概念導讀

### 一、Agent ≠ LLM + 一個 while loop

W1 把 LLM 講成「讀過全網路的 contractor」，但只有 contractor 沒有手腳，做不了事。**Agent = LLM + 能執行動作的能力 + 會記得自己做過什麼的記憶**。最小可用 agent 的架構長這樣：

```
loop:
  1. 讀取當前 context（系統訊息 + 對話 + 上次 tool result）
  2. LLM 推理 → 決定要 call 哪個 tool 還是直接回答
  3. 若 call tool：執行 → 拿 result 塞回 context
  4. 重複直到 LLM 認為任務完成
```

這個 loop 的每一個環節都是一個設計決策：

| 元件 | 設計問題 |
|------|---------|
| **LLM** | 用哪家？OpenAI / Anthropic / Google / open-source？跨 model 兼容嗎？ |
| **Tool registry** | Tool 怎麼定義？Tool 數量多少會 overload model？怎麼分組？ |
| **Tool execution** | Tool 跑在哪？sandbox 還是直接 host shell？怎麼處理 long-running task？ |
| **Memory** | Context window 撐不下時怎麼壓縮？要不要外掛 vector DB？對話跨 session 嗎？ |
| **Planner** | 直接 reactive 還是先 plan 再 act？Plan 出錯怎麼回滾？ |
| **Observer / Reflexion** | Agent 跑錯時誰來糾正？人類介入還是 self-critique？ |

Claude Code、Cursor agent、Devin、Codex 的差異全在這六個槽位的決策上。例如 Devin 強調 autonomous（少人介入）、Claude Code 強調 interactive（人類隨時打斷），對應的 memory 與 observer 設計就差很多。

### 二、Tool use / Function calling 的底層機制

Tool use 是 agent 的「手腳」。在 LLM API 層面，function calling 的 protocol 大致長這樣：

1. **API request** 同時送 prompt 和 tool schema（JSON 格式描述每個 tool 的 name、description、parameters）
2. **LLM 回應** 不是直接回答而是回 `tool_use` block，含 tool name + 參數
3. **Client（你的 agent loop）** 看到 `tool_use` 就執行對應 tool function
4. **Tool result** 包成 `tool_result` 塞回 context，再呼一次 LLM
5. LLM 看到 tool result 後決定：再 call 一次 tool（多步驟）還是給最終 answer

關鍵設計細節：
- **Tool description 是給 LLM 看的 prompt** — 寫得越清楚，model 越會在對的時機 call
- **Parameter schema 用 JSON Schema / Zod / Pydantic** — 強制 model 產生可被 parse 的結構化參數
- **Tool result 的格式直接影響下一輪推理** — Reilly Wood 在 [MCP Food-for-Thought](../readings/w2_mcp_food_for_thought.md) 裡實測「同樣資訊用 CSV 比 JSON 省一半 token」
- **Error handling** — Tool 失敗時要回 model「可恢復的錯誤訊息」，不要只 throw exception

### 三、MCP — 為什麼要再發明一個協定

Function calling 的 protocol 各家不同（OpenAI 的 `tools` schema、Anthropic 的 `tool_use` block、Google 的 `functionDeclarations`），意味著你寫的每個 tool 要為每個 LLM client 重做一次。**MCP（Model Context Protocol，模型上下文協定）** 就是要解決這個問題 — 讓 tool 寫一次，Claude Desktop、Cursor、Continue.dev、所有 MCP-compatible client 都能用。

> 💡 **譯解**：MCP 之於 LLM tools，就像 USB-C 之於充電線。以前每個工具廠都有自己的接頭（OpenAI plugin / Cursor extension / Claude artifact），MCP 讓你用一個統一接口接所有外部工具（Slack、GitHub、Google Drive、你自己的資料庫）。

[Stytch 的 MCP Introduction](../readings/w2_mcp_introduction.md) 把 MCP 拆成三類 capability：

| Capability | 用途 | 範例 |
|-----------|------|------|
| **Tools** | 可被 LLM 呼叫執行動作的函式 | `send_email`, `query_database`, `create_pr` |
| **Resources** | 模型可讀取的 context 資料 | 檔案內容、DB 紀錄、API 回傳 |
| **Prompts** | 預先定義的任務模板 | "/code-review"、"/explain-this" |

底層用 **JSON-RPC 2.0** 做 message format，**transport** 分 local（stdio）和 remote（HTTP/SSE）兩種。Local stdio transport 開發成本最低，原型階段不必處理 OAuth；要做 multi-user 服務再上 [Cloudflare Workers + OAuth](../readings/w2_mcp_server_auth.md)。

[MCP Registry](../readings/w2_mcp_registry.md)（2025 年 9 月推出）解決「server 找不到、寫的人沒地方掛」的問題，採 federation-friendly 設計（中央 registry + sub-registry 共存），不做 app store 壟斷。

### 四、寫 MCP server 的兩個核心 trap

[MCP Food-for-Thought](../readings/w2_mcp_food_for_thought.md) 給了非常實際的反思：別把 OpenAPI spec 機械式包成 MCP tool。理由：

1. **Tool proliferation（工具擴增）** — Tool 數量在 128 之前就會明顯惡化 agent 的選 tool 準確率
2. **Context 浪費** — API 回的 wide record 含一堆用不到的 field、JSON 重複 key 名稱浪費 token
3. **錯失 agent 原生能力** — 為 agent 設計的 tool 應該回 free-form text + 引導 next step，不是 strict schema dump
4. **冗餘** — Claude Code 之類現代 agent 本來就會自己寫 code 直接 call API

實務原則：
- 把多支相關 API 合併成一個彈性 tool（含 `fields` 參數讓 caller 自選欄位）
- Response 用 markdown table 或 CSV，別 dump 整坨 JSON
- 在 description 裡寫「這個 tool 適合在 X 情境用，後續通常呼叫 Y」幫 agent routing
- 做 layered tool chaining：response 引導 next step

## Monday Lecture（9/29）：Building a coding agent from scratch

- **Slides**: [Google Slides（需 Stanford 帳號）](https://docs.google.com/presentation/d/11CP26VhsjnZOmi9YFgLlonzdib9BLyAlgc4cEvC5Fps/edit?usp=sharing)
- **Completed Exercise**: [Drive 連結](https://drive.google.com/file/d/1YtpKFVG13DHyQ2i3HOtwyVJOV90nWeL2/view?usp=drive_link)
- **講者**: Mihail Eric

> Slides 需 Stanford 帳號，依 lecture title + topics 重建：

這節的 hands-on 重點是「動手用 100 行 code 寫一個會跑的 coding agent」。預期流程：

1. **Setup** — 用 Anthropic / OpenAI SDK，model 選 Claude Sonnet 4.6 或 GPT-5
2. **第一個 tool: read_file** — 定義 JSON schema、實作 tool function、把 result 塞回 context
3. **第二個 tool: write_file + bash** — 加上能改檔案、能執行 shell 的能力
4. **Agent loop** — `while True: response = llm.call(messages, tools); if response.stop_reason == "tool_use": execute tool, append; else: break`
5. **觀察 model 行為** — 看它怎麼自己 chain tool（先 read 再 write）、怎麼處理 error
6. **加入 planning** — 在 system prompt 加「先思考再動手」的指示，看 reasoning 變化

**Key takeaway**：Coding agent 的本質就是 LLM + 幾個基本 tool（read / write / bash / search）+ while loop，不到 100 行 code 就能跑起來。後面所有商用 agent（Claude Code、Cursor、Devin）都是在這個骨架上加細節。

## Friday Lecture（10/3）：Building a custom MCP server

- **Slides**: [Google Slides（需 Stanford 帳號）](https://docs.google.com/presentation/d/1zSC2ra77XOUrJeyS85houg1DU7z9hq5Y4ebagTch-5o/edit?usp=drive_link)
- **Completed Exercise**: [Drive 連結](https://drive.google.com/file/d/1J6lgZWcxPzpCpjujJSnW1aAkCYF6Yxv3/view?usp=drive_link)
- **講者**: Mihail Eric

> Slides 需 Stanford 帳號，依 lecture title + reading materials 重建：

這節從 [TypeScript MCP SDK](../readings/w2_mcp_server_sdk.md) 出發，動手寫一個能在 Claude Desktop 跑的 server。預期內容：

1. **Setup** — `npm init`、裝 `@modelcontextprotocol/sdk`、定義 `Server` instance
2. **註冊 tool** — 用 `server.tool(name, schema, handler)` 定義一個 tool（例：query 一個假 user database）
3. **Local stdio transport** — `new StdioServerTransport()`，連到 `server.connect(transport)`
4. **接到 Claude Desktop** — 改 `claude_desktop_config.json` 把 server command 加進 mcpServers
5. **Debug & inspect** — 用 [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) GUI 測 server response
6. **進階：加 resources / prompts** — 不只是 tool，也用 resources 餵模型 context

**完成後你能做什麼**：把任何外部資料（你的 RemNote、PubMed、阿摩錯題庫、Google Calendar）包成 MCP server，Claude Desktop / Cursor 都能直接呼叫，不需 plugin 不需 extension。

## Reading 摘要

| 篇名 | 來源 | 一句話重點 |
|------|------|-----------|
| [MCP Introduction](../readings/w2_mcp_introduction.md) | Stytch | MCP = AI 應用與外部系統之間的 universal adapter，client-server + JSON-RPC 架構 |
| [Sample MCP Server Implementations](../readings/w2_mcp_sample_servers.md) | GitHub | 官方 reference servers（filesystem、GitHub、Slack、Postgres 等），抄來改最快 |
| [MCP Server Authentication](../readings/w2_mcp_server_auth.md) | Cloudflare | OAuth 2.0 加在 remote MCP server，hobby → production 必經之路 |
| [MCP Server SDK](../readings/w2_mcp_server_sdk.md) | GitHub | TypeScript SDK README，寫 server 的 starting point |
| [MCP Registry](../readings/w2_mcp_registry.md) | blog.modelcontextprotocol.io | 官方中央目錄 + federation-friendly sub-registry 設計 |
| [MCP Food-for-Thought](../readings/w2_mcp_food_for_thought.md) | reillywood.com | 別把 OpenAPI 機械式包成 MCP，要為 agent 重新設計 tool |

**閱讀優先順序**：先 [MCP Introduction](../readings/w2_mcp_introduction.md)（建立 mental model）→ [MCP Food-for-Thought](../readings/w2_mcp_food_for_thought.md)（設計品味）→ [MCP Server SDK](../readings/w2_mcp_server_sdk.md)（動手）→ 其他依需求補。

## Assignment：First Steps in the AI IDE

- **Source**: [github.com/mihail911/modern-software-dev-assignments/tree/master/week2](https://github.com/mihail911/modern-software-dev-assignments/tree/master/week2)
- **任務描述**: 在 Cursor / Claude Code / VS Code GitHub Copilot 之一的 AI IDE 內完成一系列 hands-on 練習，建立 IDE 工作流的肌肉記憶。
- **自學者可行性**: ⭐⭐⭐⭐⭐ 完全可做。需 Cursor 14 天 trial 或 Claude Code 訂閱（前者免費試用、後者 free tier 有限額）。預估 3-5 hr。

## 對 Vibe Coder 的應用

W2 是 vibe coder 應該重投入時間的一週 — 學會寫 MCP server 之後，Claude Code 的能力上限會直接拉一個 level。實戰建議：

1. **第一個 MCP server 從「自己最常查的資料」開始** — 你可能查最多的：自己的 Obsidian / RemNote 筆記、PubMed、特定 API（你習慣用的天氣、台股、健保碼）。挑一個，寫成 MCP server，接到 Claude Desktop。20 分鐘就能跑起來。
2. **Tool description 比 implementation 重要** — Description 是給 LLM 讀的 prompt，寫得清楚 model 才會在對的時機 call。例：別寫 `"description": "Query database"`，要寫 `"description": "Search the user's Obsidian vault for notes by keyword. Use this when user asks about their personal notes, journals, or saved knowledge. Returns markdown content with file paths."`
3. **永遠加 `fields` / `limit` 參數** — 別讓 tool 一次回 1000 筆，給 caller 自選 page size。對 token 經濟學至關重要
4. **Local stdio 先做，OAuth 之後再說** — 90% 的 vibe coding use case 是個人用，stdio transport 配 Claude Desktop 就夠。要開放給朋友再上 Cloudflare Workers + OAuth
5. **善用 [Sample servers](../readings/w2_mcp_sample_servers.md)** — 官方 repo 有 filesystem、GitHub、Slack、Postgres 等 reference 實作，抄一份來改是最快路徑
6. **裝完 server 第一件事去 [Registry](../readings/w2_mcp_registry.md) 提交** — 免費、無審核延遲，別人能在 Claude Desktop 內搜到你的 server

> 💡 **vibe coder 的 Day-1 Quick Win**：今天裝 Claude Desktop，從 [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) 挑一個你會用到的 server（filesystem、GitHub、brave-search 都好），改 `~/Library/Application Support/Claude/claude_desktop_config.json` 加進去，重啟 Claude Desktop，立刻就有外部能力。再來才是寫自己的 server。

---

**上一週**：[W1 Introduction](01_intro_to_coding_llms.md) | **下一週**：[W3 The AI IDE](03_the_ai_ide.md)
