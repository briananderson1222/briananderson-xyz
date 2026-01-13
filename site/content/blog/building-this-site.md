---
title: Building this site (with AI)
date: 2026-01-12
summary: A look at the stack behind briananderson.xyz—SvelteKit, Tailwind, and a Terminal theme—built using an Agentic AI workflow.
tags: ["SvelteKit", "AI", "Tailwind", "DX"]
---

### The Stack

I wanted a personal site that felt like *me*—technical, minimal, and functional. The choice of **SvelteKit** was primarily an exploration using a new technology that I hadn't used before, balancing static site generation (SSG) for performance with dynamic capabilities.

- **Framework:** SvelteKit (Static Adapter)
- **Styling:** Tailwind CSS + Typography
- **Content:** Markdown (mdsvex) + YAML (for the resume data)
- **Hosting:** Google Cloud Storage (Bucket) behind Cloudflare CDN
- **AI Assistants:** Gemini 3 (Design), OpenCode + Z.AI (SvelteKit Implementation)

### The Theme

The aesthetic is a nod to my daily environment: the terminal.
- **Font:** Monospace (Fira Code / JetBrains Mono)
- **Colors:** Deep blacks (`#0c0c0c`) and neon greens (`#4af626`)
- **Details:** CRT scanlines, "directory" navigation, and status bar footers.

### Built with AI Agents

What makes this project interesting is the workflow. I utilized a CLI-based AI agent to handle the heavy lifting of scaffolding, refactoring, and data entry.

Instead of writing every CSS class by hand, I acted as the **Architect**, directing the agent to:
1. "Theme this site to look like a terminal."
2. "Convert my resume PDF into a structured YAML data source."
3. "Refactor the homepage to pull data dynamically."

This approach allowed me to focus on the *design and content strategy* while the AI handled the implementation details. It’s a glimpse into the future of development—where we curate and direct rather than just type.

### What's Next?

I'll be using this space to document my experiments with **Agentic AI** and **Cloud Native platforms**. Stay tuned.
