## Development Server

> [!IMPORTANT]
> **ALWAYS** check for an existing running development server before attempting to start a new one.

- **Check Process**: Run `tasklist` or similar to see if `node` or `vite` is already running.
- **Hot Reload**: The development server (`pnpm dev`) supports Hot Module Replacement (HMR). **DO NOT** restart the server for standard code changes. Only restart if you modify `vite.config.ts`, `svelte.config.js`, or `.env` files.
- **Location**: The dev server should run from the `site` directory.

## Project Structure

This is a **SvelteKit 2** project using **Svelte 5** and **Tailwind CSS**.

- **Root**: `e:\dev\briananderson.xyz\sveltekit`
- **Site Code**: Most application code resides in `site/`.
    - `site/src/`: Svelte components and routes.
    - `site/content/`: Markdown and YAML content files (handled by mdsvex and custom loaders).
    - `site/static/`: Static assets.
- **Content**:
    - Resume data is structured in `site/content/resume-builder.yaml`.
    - Blog posts and projects are markdown files in `site/content/`.

## Workflow & Tools

### CI/CD Pipelines
- **Debugging**: Use the GitHub CLI (`gh`) to inspect pipeline failures without leaving the terminal.
    - View run status: `gh run view <run-id>`
    - Watch a run: `gh run watch <run-id>`
    - View logs: `gh run view <run-id> --log`

### Testing & Validation
- **Package Scripts**: The `site/package.json` contains several validation scripts:
    - `test:ui`: UI validation.
    - `test:posthog`: PostHog analytics validation.
    - `test:e2e`: Playwright end-to-end tests.
- **Full Validation**: Run `pnpm run validate` to run checks, build, and tests in sequence.

## Resume Updates

When updating resume content, ensure **Core Information** (contact info, education, certificates) stays synchronized across **ALL** variants.

### Variants & Focus Areas

1. **Leader** (`site/content/resume.yaml`)
    - **Role**: Technical Director / Architect.
    - **Focus**: Client/customer interaction, team management (culture, dev experience), enterprise architecture (cloud-native, performance, high-resiliency).
    - **Target Audience**: Leadership roles.

2. **Ops** (`site/content/resume-ops.yaml`)
    - **Role**: DevOps / SRE.
    - **Focus**: Operational excellence, platform engineering, infrastructure, CI/CD, reliability.
    - **Target Audience**: DevOps/SRE roles.

3. **Builder** (`site/content/resume-builder.yaml`)
    - **Role**: Principal Engineer / Technical Director.
    - **Focus**: Hands-on coding, builder expertise, technical depth, software craftsmanship.
    - **Target Audience**: Senior individual contributor or hands-on leadership roles.

### Tailoring Guidelines
- **Experience Summaries**: Tailor the description and highlights of each job to match the variant's focus.
- **Taglines/Summaries**: Adjust to emphasize the relevant skills (e.g., "managing teams" for Leader vs "shipping code" for Builder).
