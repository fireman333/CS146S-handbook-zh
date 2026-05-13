// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeMermaid from 'rehype-mermaid';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z_]+):\s*["']?(.+?)["']?\s*$/);
    if (kv) out[kv[1]] = kv[2];
  }
  return out;
}

function loadWeekSidebar() {
  return readdirSync(resolve(REPO_ROOT, 'weeks'))
    .filter((f) => /^\d+_.+\.md$/.test(f))
    .sort()
    .map((f) => {
      const fm = parseFrontmatter(readFileSync(resolve(REPO_ROOT, 'weeks', f), 'utf8'));
      const n = fm.week ?? f.match(/^(\d+)_/)[1];
      const titleRaw = fm.title_zh || fm.title || f.replace(/\.md$/, '');
      const title = titleRaw.slice(0, 24) + (titleRaw.length > 24 ? '…' : '');
      return {
        label: `W${String(n).padStart(2, '0')} · ${title}`,
        slug: `weeks/${f.replace(/\.md$/, '')}`,
      };
    });
}

function loadReadingSidebar() {
  const files = readdirSync(resolve(REPO_ROOT, 'readings'))
    .filter((f) => /^w\d+_.+\.md$/.test(f))
    .sort();
  const byWeek = new Map();
  for (const f of files) {
    const wMatch = f.match(/^w(\d+)_/);
    const w = wMatch ? parseInt(wMatch[1], 10) : 0;
    if (!byWeek.has(w)) byWeek.set(w, []);
    byWeek.get(w).push(f);
  }
  return Array.from(byWeek.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([w, fs]) => ({
      label: `W${String(w).padStart(2, '0')} reading`,
      collapsed: true,
      items: fs.map((f) => {
        const fm = parseFrontmatter(readFileSync(resolve(REPO_ROOT, 'readings', f), 'utf8'));
        const titleRaw = fm.title_zh || fm.title || f;
        const title = titleRaw.slice(0, 28);
        return { label: title, slug: `readings/${f.replace(/\.md$/, '')}` };
      }),
    }));
}

export default defineConfig({
  site: 'https://fireman333.github.io',
  base: '/CS146S-handbook-zh',
  integrations: [
    starlight({
      title: 'CS146S 繁中講義',
      description:
        'Stanford CS146S "The Modern Software Developer" Fall 2025 繁中講義 + 46 篇 reading 摘要',
      logo: { src: './src/assets/logo.svg', alt: 'CS146S' },
      defaultLocale: 'root',
      locales: { root: { label: '繁體中文', lang: 'zh-TW' } },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/fireman333/CS146S-handbook-zh',
        },
        {
          icon: 'external',
          label: '原版課程',
          href: 'https://themodernsoftware.dev',
        },
      ],
      sidebar: [
        {
          label: '課程總覽',
          items: [{ label: '課程簡介', slug: '01_overview' }],
        },
        {
          label: '學習路徑',
          items: [
            { label: 'Track A — Vibe Coder 速成', slug: 'tracks/a' },
            { label: 'Track B — 完整軟體工程', slug: 'tracks/b' },
            { label: 'Track C — Tech Lead / PM 視角', slug: 'tracks/c' },
          ],
        },
        { label: '10 週講義', items: loadWeekSidebar() },
        {
          label: 'Reading 摘要',
          collapsed: true,
          items: loadReadingSidebar(),
        },
        {
          label: 'Assignments',
          items: [{ label: 'Index', slug: 'assignments/_index' }],
        },
      ],
      components: {
        Footer: './src/components/SiteFooter.astro',
      },
      customCss: ['./src/styles/global.css'],
      pagefind: true,
      lastUpdated: true,
    }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [rehypeMermaid, { strategy: 'pre-mermaid' }],
      rehypeKatex,
    ],
  },
});
