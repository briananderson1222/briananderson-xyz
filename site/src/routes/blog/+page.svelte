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
  <h1 class="text-3xl font-extrabold tracking-tight">Writing</h1>
  <p class="text-gray-600 dark:text-gray-300 mt-2">Notes on architecture, platforms, and building things.</p>
  <ul class="mt-8 space-y-6">
    {#each posts as post}
      <li class="rounded-2xl border bg-white dark:bg-zinc-900 p-6 hover:shadow-sm transition">
        <a href={post.route} class="block">
          <h2 class="font-semibold">{post.metadata.title}</h2>
          <p class="text-sm text-gray-500 mt-1">{new Date(post.metadata.date).toLocaleDateString()}</p>
          {#if post.metadata.summary}<p class="text-gray-700 dark:text-gray-300 mt-2">{post.metadata.summary}</p>{/if}
        </a>
      </li>
    {/each}
  </ul>
</section>
