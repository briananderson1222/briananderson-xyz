<script lang="ts">
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let href: string | null = null;
  export let variant: 'default' | 'outline' | 'ghost' = 'default';
  export let size: 'sm' | 'md' = 'md';
  let base = 'inline-flex items-center justify-center font-mono text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-terminal-green/50 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider';
  let sizes = size === 'sm' ? 'px-3 py-1.5' : 'px-5 py-2.5';
  let styles = variant === 'outline'
    ? 'border border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-terminal-black'
    : variant === 'ghost'
    ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100'
    : 'bg-terminal-green text-terminal-black hover:bg-terminal-green/90 shadow-[0_0_10px_rgba(74,246,38,0.3)] hover:shadow-[0_0_15px_rgba(74,246,38,0.5)]';
</script>
{#if href}
  <a class={`${base} ${sizes} ${styles}`} href={href}><slot /></a>
{:else}
  <button {type} class={`${base} ${sizes} ${styles}`}><slot /></button>
{/if}
