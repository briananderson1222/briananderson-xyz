import { PUBLIC_SITE_URL } from '$env/static/public';

export const prerender = true;

export const GET = async () => {
  const robots = `User-agent: *
Allow: /
Sitemap: ${PUBLIC_SITE_URL}/sitemap.xml`;
  
  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};
