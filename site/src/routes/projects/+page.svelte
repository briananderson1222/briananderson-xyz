<script lang="ts">
  const modules = import.meta.glob('/content/projects/**/*.md', { eager: true });
  type Item = { metadata: any; route: string };
  let projects: Item[] = [];
  for (const [path, mod] of Object.entries(modules)) {
    // @ts-ignore
    projects.push({ metadata: mod.metadata, route: path.replace('/content','').replace('.md','') });
  }
  projects.sort((a, b) => (a.metadata.date > b.metadata.date ? -1 : 1));
</script>
<section class="mx-auto max-w-6xl px-4 py-16">
  <h1 class="text-3xl font-extrabold tracking-tight">Projects</h1>
  <p class="text-gray-600 dark:text-gray-300 mt-2">A few things I’ve built or led.</p>
  <div class="grid md:grid-cols-2 gap-6 mt-8">
    {#each projects as p}
      <a href={p.route} class="rounded-2xl border bg-white dark:bg-zinc-900 p-6 hover:shadow-md transition block">
        <h2 class="font-semibold">{p.metadata.title}</h2>
        <p class="text-sm text-gray-500 mt-1">{new Date(p.metadata.date).toLocaleDateString()}</p>
        {#if p.metadata.summary}<p class="text-gray-700 dark:text-gray-300 mt-2">{p.metadata.summary}</p>{/if}
        {#if p.metadata.tags}
          <div class="mt-3 flex flex-wrap gap-2">
            {#each p.metadata.tags as tag}<span class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">{tag}</span>{/each}
          </div>
        {/if}
      </a>
    {/each}
  </div>
</section>
