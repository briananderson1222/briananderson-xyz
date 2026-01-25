<script lang="ts">
  import { onMount } from 'svelte';
  import '$lib/styles/app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { browser } from '$app/environment';
  import { beforeNavigate, afterNavigate } from '$app/navigation';
  import posthog from 'posthog-js';
  import { PUBLIC_POSTHOG_KEY, PUBLIC_POSTHOG_HOST } from '$env/static/public';

  if (browser) {
    beforeNavigate(() => posthog.capture('$pageleave'));
    
    // Track subsequent navigations
    let isInitial = true;
    afterNavigate(() => {
      if (isInitial) {
        isInitial = false;
        return; // Handled by onMount
      }
      posthog.capture('$pageview');
    });
  }
</script>

<svelte:head>
  <title>Brian Anderson</title>
</svelte:head>

<div class="pointer-events-none fixed inset-0 z-30 overflow-hidden">
  <div class="scanlines pointer-events-none"></div>
</div>

<div class="min-h-screen flex flex-col bg-skin-page text-skin-base font-sans transition-colors duration-300">
  <Navbar />
  <main class="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6"><slot /></main>
  <Footer />
</div>