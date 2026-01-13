<script lang="ts">
  import { Moon, Sun, Coffee } from 'lucide-svelte';
  import { onMount } from 'svelte';

  const themes = ['light', 'dark', 'catppuccin'];
  let currentTheme = 'light';

  onMount(() => {
    // Check local storage or preference
    const saved = localStorage.getItem('theme');
    if (saved && themes.includes(saved)) {
      currentTheme = saved;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      currentTheme = 'dark';
    }
    applyTheme(currentTheme);
  });

  function applyTheme(theme: string) {
    console.log('Applying theme:', theme);
    const root = document.documentElement;
    
    // Reset
    root.classList.remove('dark');
    root.removeAttribute('data-theme');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'catppuccin') {
      root.classList.add('dark'); // It's a dark theme
      root.setAttribute('data-theme', 'catppuccin');
    }
    
    localStorage.setItem('theme', theme);
    currentTheme = theme;
  }

  function toggle() {
    console.log('Toggling theme. Current:', currentTheme);
    const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    applyTheme(themes[nextIndex]);
  }
</script>

<button class="p-2 hover:text-skin-accent transition-colors" on:click={toggle} aria-label="Toggle theme">
  {#if currentTheme === 'light'}
    <Sun size={18} />
  {:else if currentTheme === 'dark'}
    <Moon size={18} />
  {:else}
    <Coffee size={18} />
  {/if}
</button>
