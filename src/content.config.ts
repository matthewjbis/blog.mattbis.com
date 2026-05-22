import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Posts live in src/content/posts/*.md
// Frontmatter is validated against this schema at build time — a missing
// title or malformed date fails the build loudly instead of shipping broken.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // tags render as the mono chips used across the site
    tags: z.array(z.string()).default([]),
    // set draft: true to keep a post out of the production build
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
