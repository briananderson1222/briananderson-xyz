<script lang="ts">
  import { Menu } from 'lucide-svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  let open = false;
</script>
<header class="sticky top-0 z-40 bg-white/70 dark:bg-zinc-900/70 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
  <div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
    <a href="/" class="font-semibold tracking-tight text-lg">Brian Anderson<span class="text-emerald-600">.</span></a>
    <nav class="hidden md:flex gap-6 text-sm items-center">
      <a class="hover:text-emerald-600" href="/#about">About</a>
      <a class="hover:text-emerald-600" href="/projects">Projects</a>
      <a class="hover:text-emerald-600" href="/blog">Writing</a>
      <a class="hover:text-emerald-600" href="/#contact">Contact</a>
      <a class="hover:text-emerald-600" href="/admin/" rel="nofollow">Admin</a>
      <ThemeToggle />
    </nav>
    <button class="md:hidden p-2" aria-label="Menu" on:click={() => (open = !open)}><Menu size={22} /></button>
  </div>
  {#if open}
    <div class="md:hidden border-t bg-white dark:bg-zinc-900">
      <div class="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-3">
        <a class="hover:text-emerald-600" href="/#about">About</a>
        <a class="hover:text-emerald-600" href="/projects">Projects</a>
        <a class="hover:text-emerald-600" href="/blog">Writing</a>
        <a class="hover:text-emerald-600" href="/#contact">Contact</a>
        <a class="hover:text-emerald-600" href="/admin/" rel="nofollow">Admin</a>
        <div class="pt-2"><ThemeToggle /></div>
      </div>
    </div>
  {/if}
</header>
