<script lang="ts">
  import '$lib/styles/app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { browser } from '$app/environment';
  import { beforeNavigate, afterNavigate } from '$app/navigation';
  import posthog from 'posthog-js';

  if (browser) {
    beforeNavigate(() => posthog.capture('$pageleave'));
    afterNavigate(() => posthog.capture('$pageview'));
  }
</script>

<div class="pointer-events-none fixed inset-0 z-30 overflow-hidden">
  <div class="scanlines pointer-events-none"></div>
</div>

<div class="min-h-screen flex flex-col bg-skin-page text-skin-base font-sans transition-colors duration-300">
  <Navbar />
  <main class="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6"><slot /></main>
  <Footer />
</div>