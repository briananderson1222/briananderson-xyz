import { PUBLIC_SITE_URL } from '$env/static/public';

export const prerender = true;
const site = PUBLIC_SITE_URL;
export const GET = async () => {
  const modules = import.meta.glob('/content/blog/**/*.md', { eager: true });
  const items = Object.entries(modules).map(([path, mod]: any) => ({
    title: mod.metadata?.title ?? 'Untitled',
    date: new Date(mod.metadata?.date ?? Date.now()).toUTCString(),
    url: site + path.replace('/content', '').replace('.md', '') + '/',
    summary: mod.metadata?.summary ?? ''
  })).sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Brian Anderson — Blog</title>
      <link>${site}</link>
      <description>Writing by Brian Anderson</description>
      ${items.map(i => `
        <item>
          <title><![CDATA[${i.title}]]></title>
          <link>${i.url}</link>
          <pubDate>${i.date}</pubDate>
          <description><![CDATA[${i.summary}]]></description>
          <guid>${i.url}</guid>
        </item>`).join('')}
    </channel>
  </rss>`;
  return new Response(feed, { headers: { 'Content-Type': 'application/xml' } });
};
