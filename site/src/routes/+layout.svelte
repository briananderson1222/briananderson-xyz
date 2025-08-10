<script lang="ts">
  import '$lib/styles/app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>
<div class="min-h-screen flex flex-col ba-gradient dark:bg-zinc-950 dark:text-zinc-100">
  <Navbar />
  <main class="flex-1"><slot /></main>
  <Footer />
</div>
