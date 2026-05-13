import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

const courseSchema = z.object({
  week: z.number().int().optional(),
  title_zh: z.string().optional(),
  subtitle: z.string().optional(),
  author: z.string().optional(),
  parent: z.string().optional(),
  source: z.string().optional(),
  date: z.string().optional(),
  dates: z.array(z.string()).optional(),
  topics: z.array(z.string()).optional(),
  status: z.string().optional(),
  source_url: z.string().optional(),
  source_type: z.string().optional(),
  fetched_at: z.string().optional(),
  reading_for_week: z.number().int().optional(),
  original_url: z.string().optional(),
  guest_speaker: z
    .object({
      name: z.string(),
      title: z.string().optional(),
      org: z.string().optional(),
    })
    .passthrough()
    .optional(),
});

export const collections = {
  docs: defineCollection({
    loader: glob({
      pattern: [
        '{weeks,readings,assignments,tracks}/**/*.{md,mdx}',
        '01_overview.{md,mdx}',
        'index.{md,mdx}',
      ],
      base: '..',
    }),
    schema: docsSchema({ extend: courseSchema.partial() }),
  }),
};
