<script lang="ts">
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let href: string | null = null;
  export let variant: 'default' | 'outline' | 'ghost' = 'default';
  export let size: 'sm' | 'md' = 'md';
  let base = 'inline-flex items-center justify-center rounded-2xl font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-500';
  let sizes = size === 'sm' ? 'text-sm px-3 py-1.5' : 'text-sm px-4 py-2';
  let styles = variant === 'outline'
    ? 'border bg-white dark:bg-zinc-900 hover:bg-emerald-50 dark:hover:bg-zinc-800'
    : variant === 'ghost'
    ? 'hover:bg-gray-100 dark:hover:bg-zinc-800'
    : 'bg-emerald-600 text-white hover:bg-emerald-700';
</script>
{#if href}
  <a class={`${base} ${sizes} ${styles}`} href={href}><slot /></a>
{:else}
  <button {type} class={`${base} ${sizes} ${styles}`}><slot /></button>
{/if}
