<script lang="ts">
  export let metadata: Record<string, any>;
</script>
<article class="prose prose-zinc dark:prose-invert max-w-3xl mx-auto px-4 py-16">
  <header class="mb-8">
    <h1 class="!mb-2">{metadata.title}</h1>
    {#if metadata.date}<p class="!mt-0 text-sm text-gray-500">{new Date(metadata.date).toLocaleDateString()}</p>{/if}
    {#if metadata.summary}<p class="text-gray-700 dark:text-gray-300">{metadata.summary}</p>{/if}
  </header>
  <slot />
</article>
