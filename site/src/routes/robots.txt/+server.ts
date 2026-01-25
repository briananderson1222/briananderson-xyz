export const prerender = true;
const site = import.meta.env.PUBLIC_SITE_URL || 'https://briananderson.xyz';

export const GET = async () => {
  const robots = `User-agent: *
Allow: /
Sitemap: ${site}/sitemap.xml`;
  
  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};
