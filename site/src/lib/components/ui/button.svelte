<script lang="ts">
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let href: string | null = null;
  export let variant: 'default' | 'outline' | 'ghost' = 'default';
  export let size: 'sm' | 'md' = 'md';
  let className = '';
  export { className as class };

  let base = 'inline-flex items-center justify-center font-mono text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-skin-accent/50 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider';
  let sizes = size === 'sm' ? 'px-3 py-1.5' : 'px-5 py-2.5';
  let styles = variant === 'outline'
    ? 'border border-skin-accent text-skin-accent hover:bg-skin-accent hover:text-skin-accent-contrast'
    : variant === 'ghost'
    ? 'hover:bg-skin-base/10 text-skin-muted hover:text-skin-base'
    : 'bg-skin-accent text-skin-accent-contrast hover:bg-skin-accent/90 shadow-[0_0_10px_rgba(var(--color-accent),0.3)] hover:shadow-[0_0_15px_rgba(var(--color-accent),0.5)]';
</script>
{#if href}
  <a class={`${base} ${sizes} ${styles} ${className}`} href={href}><slot /></a>
{:else}
  <button {type} class={`${base} ${sizes} ${styles} ${className}`}><slot /></button>
{/if}
