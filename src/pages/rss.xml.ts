import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  
  
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'Karen M Vinod • Blog',
    description: 'Projects, research notes, technical write-ups, and lessons from building software and AI systems.',
    site: context.site || 'https://karen-vinod-02.github.io',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}