<script lang="ts">export let error;</script>
<div class="max-w-3xl mx-auto px-4 py-24">
  <h1 class="text-3xl font-bold mb-2">Something went wrong</h1>
  <p class="text-gray-600 dark:text-gray-300">{error?.message ?? 'Not found'}</p>
</div>
