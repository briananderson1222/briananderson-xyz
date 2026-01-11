<script lang="ts">
  const modules = import.meta.glob('/content/blog/**/*.md', { eager: true });
  type Post = { metadata: any; route: string };
  let posts: Post[] = [];
  for (const [path, mod] of Object.entries(modules)) {
    // @ts-ignore
    posts.push({ metadata: mod.metadata, route: path.replace('/content','').replace('.md','') });
  }
  posts.sort((a, b) => (a.metadata.date > b.metadata.date ? -1 : 1));
</script>

<section class="mx-auto max-w-4xl px-4 py-16">
  <div class="flex items-center gap-2 mb-6 font-mono text-terminal-green">
    <span>></span>
    <h1 class="text-3xl font-bold tracking-tight">./blog</h1>
  </div>
  <p class="font-mono text-zinc-500 mb-8 border-l-2 border-zinc-700 pl-4">dumping_core_memory.log</p>

  <div class="flex flex-col gap-1 font-mono">
    <div class="grid grid-cols-12 text-xs text-zinc-600 uppercase tracking-wider mb-2 px-4">
      <div class="col-span-3 md:col-span-2">Date</div>
      <div class="col-span-9 md:col-span-10">Title / Description</div>
    </div>
    
    {#each posts as post}
      <a href={post.route} class="group grid grid-cols-12 gap-4 items-baseline p-4 hover:bg-zinc-900 border-l-2 border-transparent hover:border-terminal-green transition-all">
        <div class="col-span-3 md:col-span-2 text-xs text-zinc-500 pt-1">
          {new Date(post.metadata.date).toISOString().split('T')[0]}
        </div>
        <div class="col-span-9 md:col-span-10">
          <h2 class="text-base text-zinc-300 group-hover:text-terminal-green font-bold transition-colors mb-1">
            {post.metadata.title}
          </h2>
          {#if post.metadata.summary}
            <p class="text-sm text-zinc-500 line-clamp-2">
              {post.metadata.summary}
            </p>
          {/if}
        </div>
      </a>
    {/each}
  </div>
</section>
