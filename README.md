# blog.mattbis.com

Static Astro blog, styled to match mattbis.com. Deploys to Cloudflare Pages.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs static site to ./dist
npm run preview    # preview the built site
```

## Writing a post

Drop a Markdown file in `src/content/posts/`. The filename becomes the URL
slug (`my-post.md` → `blog.mattbis.com/my-post/`). Frontmatter:

```md
---
title: "Your title"
description: "One-sentence summary — shows on the index and in meta tags."
pubDate: 2026-05-22
tags: ["AI Automation", "Architecture"]   # optional
draft: false                              # true = excluded from production build
updatedDate: 2026-05-24                   # optional
---

Body in Markdown.
```

Drafts (`draft: true`) show in `npm run dev` but are stripped from the
production build, so you can stage posts in the repo without publishing them.

## Deploying to Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → select this repo.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - (Root directory: leave as `/` — this is a standalone repo.)
4. Deploy. You get a `*.pages.dev` URL.

## Pointing blog.mattbis.com at it

mattbis.com is already a Cloudflare zone, so do NOT add a DNS record by hand —
that causes a 522. Instead:

1. Open this Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter `blog.mattbis.com`, confirm.
3. Cloudflare writes the CNAME and provisions SSL automatically. Wait for
   "Active" (usually a few minutes).

## Notes

- `public/styles/global.css` holds the design tokens ported from mattbis.com.
  If you change the palette on the main site, mirror it here to stay in sync.
- RSS feed at `/rss.xml`, sitemap at `/sitemap-index.xml` (both auto-generated).
