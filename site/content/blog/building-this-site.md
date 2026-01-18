---
title: Building this site (with AI)
date: 2026-01-12
summary: A deep dive into the stack behind briananderson.xyz—SvelteKit, Tailwind, Catppuccin, and Agentic workflows.
tags: ["SvelteKit", "AI", "Tailwind", "CI/CD", "GCP"]
---

### The Stack

I wanted a personal site that felt like *me*—technical, minimal, and functional. The choice of **SvelteKit** was primarily an exploration using a new technology, balancing static site generation (SSG) for performance with dynamic capabilities where needed.

- **Framework:** SvelteKit (`adapter-static`)
- **Styling:** Tailwind CSS + Typography
- **Content:** Markdown (mdsvex) + YAML (resume) + Decap CMS
- **Hosting:** Google Cloud Storage (Bucket) + Cloud CDN
- **Auth Proxy:** Google Cloud Run (for Decap CMS GitHub OAuth)
- **AI Assistants:** Gemini 3 & OpenCode (Implementation & Refactoring)

### Theming & UX

The aesthetic starts with a nod to my daily environment—the terminal—but has evolved to be more flexible.

- **Terminal Mode:** Deep blacks (`#0c0c0c`) and neon greens (`#4af626`) with CRT scanlines.
- **Catppuccin Mode:** A softer, pastel-based dark theme for better readability, which now defaults for users with system-wide dark mode.
- **Print Optimization:** The resume page is heavily optimized for print-to-PDF, automatically removing navigation, changing fonts to **Lato** for readability, and adjusting margins for a perfect one-page layout.

### CI/CD & Infrastructure

This isn't just a static bucket upload. The site uses a robust **GitHub Actions** pipeline:

1. **Build:** Compiles the SvelteKit app into static HTML/JS.
2. **Deploy:** Syncs the `build/` directory to a Google Cloud Storage bucket.
3. **Cache:** Optimizes delivery via Cloud CDN (with manual cache invalidation triggers).
4. **CMS:** A separate pipeline builds and deploys a Go-based authentication proxy to **Cloud Run**, allowing me to manage content via **Decap CMS** without needing a dedicated backend server.

### Built with AI Agents

What makes this project unique is the workflow. I utilized a CLI-based AI agent to handle the heavy lifting of scaffolding, refactoring, and infrastructure configuration.

Instead of writing every CSS class or Terraform resource by hand, I acted as the **Architect**, directing the agent with structured, intent-based instructions:

> "Implement a theme initialization script in `app.html` that detects system preference. Default to 'Catppuccin' if `prefers-color-scheme: dark` is true and no local storage override exists; otherwise fall back to standard light/dark logic."

> "Refactor the `deploy-static.yml` workflow. Add a boolean input `invalidate_cache` that conditionally executes a `gcloud compute url-maps invalidate-cdn-cache` command for the GCS backend."

> "Diagnose the 404 error on page refresh. If this is due to S3/GCS lacking extensionless file mapping, modify `svelte.config.js` or `+layout.ts` to enforce `trailingSlash = 'always'` so directory indices are generated."

This approach allowed me to focus on the *design and content strategy* while the AI handled the implementation details. It’s a glimpse into the future of development—where we curate and direct rather than just type.