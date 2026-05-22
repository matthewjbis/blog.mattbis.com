import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static build — Cloudflare Pages serves the generated /dist directory.
export default defineConfig({
  site: 'https://blog.mattbis.com',
  output: 'static',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
