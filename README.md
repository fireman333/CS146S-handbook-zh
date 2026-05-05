# CS146S: The Modern Software Developer 繁中講義

> Stanford 計算機科學系 Fall 2025 全新開的「現代軟體工程師」課程，繁中化教材包。
>
> 📖 線上版：https://fireman333.github.io/CS146S-handbook-zh/
>
> ⚠️ **非官方獨立翻譯**：本講義是社群繁中化教材，與 Stanford 大學 / Mihail Eric / 任何 industry guest speaker 無從屬關係。原版課程素材公開在 [themodernsoftware.dev](https://themodernsoftware.dev)。本工作以 [CC BY-NC-SA 4.0](LICENSE) 授權；所有原始素材版權歸原作者所有。

## 著作權與引用原則

本講義遵循以下原則以尊重原作者：

- **所有 lecture 摘要為繁中 paraphrase**（200-500 字 / 篇）— 不含 verbatim 英文 transcript
- **所有 reading 摘要為繁中 paraphrase**（200-400 字 / 篇）— 每篇均含原文連結，讀者應優先閱讀原文
- **未公開的 slides / 受權限保護內容** 一律標記 `best-effort 重建` 並聲明非逐字引用
- **所有 industry guest speaker 名稱、公司、頭銜** 均依公開資料引用，不含內部 / 私下談話內容
- **任何被引用的原作者若希望移除引用，請透過 GitHub Issue 聯絡 WLK，會立即處理**

## 是什麼

把 [Stanford CS146S](https://themodernsoftware.dev)（Mihail Eric 主講，industry guests: Cognition、Warp、Semgrep、Graphite、Vercel、Resolve、a16z）的全部公開素材消化成繁中 mini handbook：

- **10 週講義** 每週含學習目標 / 核心概念 / Mon lecture / Fri guest speaker / Reading 摘要 / Assignment / 對 vibe coder 的應用
- **50+ 篇 reading 中文摘要** 每篇 200-400 字 + 關鍵概念 + CS146S 意義 + Vibe coder takeaway
- **9 個 weekly assignment 自學者可行性評估**
- **PDF 印製版**（透過 Quarto + Typst 渲染）

## 怎麼用

### 線上閱讀
從 [00_index.md](00_index.md) 開始，依興趣選讀路線：
- **Track A — Vibe Coder 速成**：W1 → W2 → W3 → W4 → W8（最短路徑）
- **Track B — 完整軟體工程**：W1 → W10 依序
- **Track C — Tech Lead / PM 視角**：W1 → W4 → W6 → W7 → W9 → W10

### 渲染 PDF
```bash
# 確認已裝 Quarto 1.5+
quarto --version

# 渲染整本（HTML + PDF）
quarto render

# PDF 會在 pdf/ 目錄
open pdf/CS146S_handbook_zh.pdf
```

## 結構

```
.
├── 00_index.md           # 總目錄 + 三條學習路徑
├── 01_overview.md        # 課程簡介 + 自學建議
├── weeks/                # 10 週講義
├── readings/             # 50+ 篇 reading 中文摘要
├── assignments/          # 9 個 assignment 評估
├── pdf/                  # render 產出
└── _quarto.yml           # Quarto book config
```

## 已知限制

1. Google Slides（Mon lecture 與部分 Fri speaker slides）需 Stanford 帳號 → Mon lecture 內容是基於 topics + speaker context 做的 best-effort 重建
2. Friday industry speaker 部分 slides 未公開 → 只能依 speaker bio + 公司產品做高層摘要
3. W8 與 W10 沒有原始 reading list → 內容偏延伸思考 + 推薦資源
4. YouTube reading 沒有 transcript 時改用既有知識做高層摘要，會明確標註 `status: best-effort`

## 授權

本講義為個人學習筆記與社群繁中化教材。原版課程素材版權屬 Stanford CS / Mihail Eric / 各 reading 作者。引用任何內容請回到原文連結確認。

## 致謝

- [Mihail Eric](https://github.com/mihail911) — 開課與整套 syllabus
- 所有 industry guest speakers — Silas Alberti, Boris Cherny, Zach Lloyd, Isaac Evans, Tomas Reimers, Gaspar Garcia, Mayank Agarwal, Milind Ganjoo, Martin Casado
- 所有 reading 作者 — 感謝你們把知識公開
