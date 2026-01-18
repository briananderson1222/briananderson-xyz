# Feature Enhancement Suggestions

## 1. Search Functionality
```svelte
<!-- Add search to Navbar.svelte -->
<script>
  import { page } from '$app/stores';
  
  let searchQuery = '';
  let searchResults = [];
  
  async function search() {
    if (searchQuery.length < 2) return;
    // Use simple search or Algolia
    const response = await fetch(`/api/search?q=${searchQuery}`);
    searchResults = await response.json();
  }
</script>

<input 
  type="text" 
  placeholder="Search posts..." 
  bind:value={searchQuery}
  on:input={search}
/>
```

## 2. RSS Feed Enhancement
```ts
// Create /api/rss.xml/+server.ts
export const GET = async () => {
  const posts = await getPosts();
  const feed = generateRSS(posts, {
    title: "Brian Anderson's Blog",
    description: "Architecture, platforms, and building things",
    siteUrl: "https://briananderson.xyz",
    feedUrl: "https://briananderson.xyz/rss.xml"
  });
  return new Response(feed, {
    headers: { 'Content-Type': 'application/rss+xml' }
  });
};
```

## 3. Reading Time Estimates
```svelte
<!-- Add to PostLayout.svelte -->
<script>
  export let metadata;
  
  $: readingTime = calculateReadingTime(content);
  
  function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
</script>

<div class="text-sm text-gray-500 mb-4">
  {readingTime} min read
</div>
```

## 4. Social Sharing
```html
<!-- Add to PostLayout.svelte -->
<div class="flex gap-4 my-6">
  <button 
    onclick="shareToTwitter()" 
    class="px-4 py-2 bg-blue-500 text-white rounded"
  >
    Share on Twitter
  </button>
</div>

<script>
  function shareToTwitter() {
    const text = encodeURIComponent(document.title);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
  }
</script>
```

## 5. Newsletter Signup
```svelte
<!-- Add newsletter component -->
<script>
  let email = '';
  
  async function subscribe() {
    await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }
</script>

<form on:submit|preventDefault={subscribe}>
  <input type="email" placeholder="your@email.com" bind:value={email} />
  <button type="submit">Subscribe</button>
</form>
```