<script lang="ts">
  export let data: { component: any, metadata: any };
</script>
{#if data?.component}
  <svelte:component this={data.component} metadata={data.metadata} />
{:else}
  <div class="max-w-3xl mx-auto px-4 py-16">Not found.</div>
{/if}
