# briananderson.xyz — SvelteKit + Markdown + Decap CMS (Stable)

- SvelteKit 2 + Svelte 4 (stable)
- adapter-static (fully prerender)
- mdsvex (Markdown) — content lives in `/content`
- Dynamic routes render Markdown from `/content` (so CMS can write there)
- Blog + Projects sections
- Dark mode toggle (localStorage)
- RSS at `/rss.xml`, sitemap at `/sitemap.xml`
- Decap CMS at `/admin` (GitHub backend via OAuth proxy)

## Dev
```bash
pnpm i
pnpm dev
```

## Build
```bash
pnpm build
```

## Deploy
Upload `build/` to a GCS bucket (public or behind a CDN).

## Configure CMS
- Deploy the auth proxy (see `auth-proxy/` in repo root) and set its URL in `static/admin/config.yml` as `base_url`.
