<script lang="ts">
  import { Menu, Terminal } from 'lucide-svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { page } from '$app/stores';
  let open = false;

  $: activeRoute = $page.url.pathname;
</script>

<header class="sticky top-0 z-40 bg-skin-page/90 backdrop-blur border-b border-skin-border font-mono transition-colors duration-300 print:hidden">
  <div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
    <a href="/" class="text-sm md:text-base font-bold tracking-tight text-skin-base flex items-center gap-2 group">
      <span class="text-skin-accent group-hover:animate-pulse">guest@briananderson:~$</span>
      <span class="w-2 h-4 bg-skin-accent animate-terminal-blink"></span>
    </a>
    
    <nav class="hidden md:flex gap-6 text-sm items-center">
      <a class="hover:text-skin-accent transition-colors {activeRoute === '/projects' ? 'text-skin-accent' : 'text-skin-muted'}" href="/projects">./projects</a>
      <a class="hover:text-skin-accent transition-colors {activeRoute.startsWith('/blog') ? 'text-skin-accent' : 'text-skin-muted'}" href="/blog">./blog</a>
      <a class="hover:text-skin-accent transition-colors {activeRoute === '/resume' ? 'text-skin-accent' : 'text-skin-muted'}" href="/resume">./resume</a>
      <a class="hover:text-skin-accent transition-colors text-skin-muted" href="/#about">./about</a>
      <a class="hover:text-skin-accent transition-colors text-skin-muted" href="/#contact">./contact</a>
      <ThemeToggle />
    </nav>

    <button class="md:hidden p-2 text-skin-muted hover:text-skin-accent" aria-label="Menu" on:click={() => (open = !open)}>
      <Menu size={20} />
    </button>
  </div>

  {#if open}
    <div class="md:hidden border-t border-skin-border bg-skin-page">
      <div class="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-3 font-mono text-sm">
        <a class="text-skin-muted hover:text-skin-accent" on:click={() => (open = false)} href="/projects">./projects</a>
        <a class="text-skin-muted hover:text-skin-accent" on:click={() => (open = false)} href="/blog">./blog</a>
        <a class="text-skin-muted hover:text-skin-accent" on:click={() => (open = false)} href="/resume">./resume</a>
        <a class="text-skin-muted hover:text-skin-accent" on:click={() => (open = false)} href="/#about">./about</a>
        <a class="text-skin-muted hover:text-skin-accent" on:click={() => (open = false)} href="/#contact">./contact</a>
        <div class="pt-2 border-t border-skin-border mt-2 flex justify-between items-center">
          <span class="text-xs text-skin-muted">Theme:</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  {/if}
</header>
