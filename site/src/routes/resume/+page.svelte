<script lang="ts">
  import type { PageData } from './$types';
  import ResumeView from '$lib/components/ResumeView.svelte';

  export let data: PageData;
</script>

<ResumeView resume={data.resume} variants={data.variants} currentVariant="default" />

