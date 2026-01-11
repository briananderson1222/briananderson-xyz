<script lang="ts">
  import '$lib/styles/app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<div class="pointer-events-none fixed inset-0 z-50 overflow-hidden">
  <div class="scanlines"></div>
</div>

<div class="min-h-screen flex flex-col bg-zinc-50 dark:bg-black dark:text-gray-300 font-sans selection:bg-terminal-green/30 selection:text-white">
  <Navbar />
  <main class="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6"><slot /></main>
  <Footer />
</div>
