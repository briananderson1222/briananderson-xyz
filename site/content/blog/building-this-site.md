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
- **Content:** Markdown (mdsvex) + YAML (resume)
- **Hosting:** Google Cloud Storage (Bucket) + Cloud CDN
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
4. **Terraform:** Infrastructure as code provisions GCS buckets, WIF provider, and CI service account via Workload Identity Federation.

### Built with AI Agents

What makes this project unique is the workflow. I utilized a CLI-based AI agent to handle the heavy lifting across testing, infrastructure, and UX optimization.

Instead of writing every CSS class or Terraform resource by hand, I acted as the **Architect**, directing the agent with structured, intent-based instructions:

> "Implement E2E smoke tests using Playwright. Verify homepage loads with correct title, navigation to resume works, and resume page renders properly. Run tests after each deploy with automatic rollback on failure."

> "Set up Workload Identity Federation for GitHub Actions. Configure OIDC provider with attribute mapping, restrict access to specific repo/branch, and create CI service account with Storage Admin role for secure deployments without long-lived keys."

> "Optimize the resume page for print-to-PDF. Hide navigation and scanlines with `@media print`, switch to Lato serif font family, adjust margins to 0.5in, and restructure layout for single-page A4 output with smaller text sizes."

This approach allowed me to focus on the *design and content strategy* while the AI handled the implementation details. It’s a glimpse into the future of development—where we curate and direct rather than just type.