# Agents Notes

This file contains notes for AI agents working on this repository.

## Site Development

The SvelteKit site is located in the `site/` directory.

### Building and Previewing

To build the site:
```bash
cd site
npm run build
```

To preview the site locally:
```bash
cd site
npm run preview -- --host
```

**Important:** Always use the `--host` flag when running the preview server to ensure it's accessible via Tailscale URLs (e.g., `http://brian-media.tailcfcb40.ts.net:4173/`).

When making changes to the site:
1. Stop any running preview server: `pkill -f "vite preview"`
2. Build the site: `cd site && npm run build`
3. Start preview with host flag: `cd site && npm run preview -- --host &`

**Note:** You may see a warning: `Cannot find base config file "./.svelte-kit/tsconfig.json"`. This is expected and harmless - the `.svelte-kit` directory is generated during the build process and is listed in `.gitignore`.

### Key Files

- `site/content/resume.yaml` - Resume data source (name, title, tagline, mission, summary, skills, experience, etc.)
- `site/src/routes/+page.svelte` - Home page
- `site/src/routes/resume/+page.svelte` - Resume page
- `site/src/lib/types.ts` - TypeScript type definitions

### Type Definitions

When adding new fields to `resume.yaml`, update the `Resume` interface in `site/src/lib/types.ts` to avoid TypeScript errors.
