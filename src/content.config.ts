import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/posts',
  }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    userId: z.number(),
    userName: z.string(),
    userAvatarUrl: z.string(),
    published: z.boolean(),
  }),
});

export const collections = {
  posts,
};
