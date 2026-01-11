<script lang="ts">
  export let metadata: Record<string, any>;
</script>

<article class="prose prose-zinc dark:prose-invert max-w-3xl mx-auto px-4 py-16">
  <header class="mb-10 not-prose border-b border-zinc-800 pb-8">
    <div class="flex items-center gap-2 text-terminal-green font-mono text-xs mb-4">
      <span>></span>
      <span>cat {metadata.title.toLowerCase().replace(/\s+/g, '_')}.md</span>
    </div>
    
    <h1 class="text-3xl md:text-4xl font-bold font-mono tracking-tight text-zinc-100 mb-4">{metadata.title}</h1>
    
    <div class="flex items-center gap-4 font-mono text-xs text-zinc-500">
      {#if metadata.date}
        <span class="flex items-center gap-1">
          <span class="text-terminal-green">[DATE]</span>
          {new Date(metadata.date).toISOString().split('T')[0]}
        </span>
      {/if}
      {#if metadata.readingTime}
        <span class="flex items-center gap-1">
          <span class="text-terminal-green">[TIME]</span>
          {metadata.readingTime}
        </span>
      {/if}
    </div>
  </header>
  
  <div class="font-sans text-lg leading-relaxed text-zinc-300">
    <slot />
  </div>
</article>
