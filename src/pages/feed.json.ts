import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "Karen M Vinod | Blog",
    home_page_url: "https://karen-vinod-02.github.io",
    feed_url: "https://karen-vinod-02.github.io/feed.json",
    items: posts.map((post) => ({
      id: post.id,
      url: `https://karen-vinod-02.github.io/blog/${post.id}`,
      title: post.data.title,
      summary: post.data.excerpt,
      date_published: post.data.date.toISOString(),
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}