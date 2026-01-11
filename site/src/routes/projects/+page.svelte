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
  <div class="flex items-center gap-2 mb-6 font-mono text-terminal-green">
    <span>></span>
    <h1 class="text-3xl font-bold tracking-tight">./projects</h1>
  </div>
  <p class="font-mono text-zinc-500 mb-8 border-l-2 border-zinc-700 pl-4">A collection of deployed systems and experiments.</p>
  
  <div class="grid md:grid-cols-2 gap-6">
    {#each projects as p}
      <a href={p.route} class="group block border border-zinc-700 bg-zinc-900/50 p-6 hover:border-terminal-green hover:shadow-[0_0_10px_rgba(74,246,38,0.1)] transition-all duration-300">
        <div class="flex justify-between items-start mb-2">
          <h2 class="font-bold text-lg font-mono text-zinc-100 group-hover:text-terminal-green transition-colors">
            {p.metadata.title}
          </h2>
          <span class="text-xs font-mono text-zinc-500 border border-zinc-800 px-2 py-1">
            {new Date(p.metadata.date).getFullYear()}
          </span>
        </div>
        
        {#if p.metadata.summary}
          <p class="text-zinc-400 text-sm mb-4 font-mono leading-relaxed">
            {p.metadata.summary}
          </p>
        {/if}

        {#if p.metadata.tags}
          <div class="flex flex-wrap gap-2">
            {#each p.metadata.tags as tag}
              <span class="text-xs font-mono text-terminal-green/80 before:content-['#']">
                {tag}
              </span>
            {/each}
          </div>
        {/if}
      </a>
    {/each}
  </div>
</section>
