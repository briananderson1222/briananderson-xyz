<script lang="ts">
  import { Moon, Sun } from 'lucide-svelte';
  let dark = false;
  if (typeof window !== 'undefined') {
    dark = localStorage.getItem('theme') === 'dark' || (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'));
    document.documentElement.classList.toggle('dark', dark);
  }
  function toggle() {
    dark = !dark;
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
</script>
<button class="p-2 hover:text-terminal-green transition-colors" on:click={toggle} aria-label="Toggle theme">
  {#if dark}<Sun size={18} />{:else}<Moon size={18} />{/if}
</button>
