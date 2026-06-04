import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://karen-vinod-02.github.io',
  base: '/',

  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },

  integrations: [sitemap()],
});