# briananderson.xyz — SvelteKit + Markdown

- SvelteKit 2 + Svelte 5 (stable)
- adapter-static (fully prerender)
- mdsvex (Markdown) — content lives in `/content`
- Dynamic routes render Markdown from `/content`
- Blog + Projects sections
- Dark mode toggle (localStorage)
- RSS at `/rss.xml`, sitemap at `/sitemap.xml`, robots.txt at `/robots.txt`

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
