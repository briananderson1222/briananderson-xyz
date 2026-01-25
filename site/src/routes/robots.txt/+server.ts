import { env } from '$env/dynamic/public';

export const prerender = true;

export const GET = async () => {
  const robots = `User-agent: *
Allow: /
Sitemap: ${env.PUBLIC_SITE_URL}/sitemap.xml`;
  
  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};
