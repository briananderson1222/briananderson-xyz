<script lang="ts">
  import { Menu, Terminal } from 'lucide-svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { page } from '$app/stores';
  let open = false;

  $: activeRoute = $page.url.pathname;
</script>

<header class="sticky top-0 z-40 bg-zinc-50/90 dark:bg-black/90 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 font-mono">
  <div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
    <a href="/" class="text-sm md:text-base font-bold tracking-tight text-zinc-800 dark:text-zinc-100 flex items-center gap-2 group">
      <span class="text-terminal-green group-hover:animate-pulse">guest@briananderson:~$</span>
      <span class="w-2 h-4 bg-terminal-green animate-[pulse_1s_infinite]"></span>
    </a>
    
    <nav class="hidden md:flex gap-6 text-sm items-center">
      <a class="hover:text-terminal-green transition-colors {activeRoute === '/projects' ? 'text-terminal-green' : ''}" href="/projects">./projects</a>
      <a class="hover:text-terminal-green transition-colors {activeRoute.startsWith('/blog') ? 'text-terminal-green' : ''}" href="/blog">./blog</a>
      <a class="hover:text-terminal-green transition-colors {activeRoute === '/resume' ? 'text-terminal-green' : ''}" href="/resume">./resume</a>
      <a class="hover:text-terminal-green transition-colors" href="/#about">./about</a>
      <a class="hover:text-terminal-green transition-colors" href="/#contact">./contact</a>
      <ThemeToggle />
    </nav>

    <button class="md:hidden p-2 text-zinc-600 dark:text-zinc-400 hover:text-terminal-green" aria-label="Menu" on:click={() => (open = !open)}>
      <Menu size={20} />
    </button>
  </div>

  {#if open}
    <div class="md:hidden border-t border-zinc-800 bg-zinc-50 dark:bg-black">
      <div class="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-3 font-mono text-sm">
        <a class="hover:text-terminal-green" on:click={() => (open = false)} href="/projects">./projects</a>
        <a class="hover:text-terminal-green" on:click={() => (open = false)} href="/blog">./blog</a>
        <a class="hover:text-terminal-green" on:click={() => (open = false)} href="/#about">./about</a>
        <a class="hover:text-terminal-green" on:click={() => (open = false)} href="/#contact">./contact</a>
        <div class="pt-2 border-t border-zinc-800 mt-2 flex justify-between items-center">
          <span class="text-xs text-zinc-500">Theme:</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  {/if}
</header>
