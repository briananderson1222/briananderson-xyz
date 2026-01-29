<script lang="ts">
  import type { PageData } from './$types';
  import ResumeView from '$lib/components/ResumeView.svelte';

  export let data: PageData & { currentVariant: string };
  const { resume, variants, currentVariant } = data;
</script>

<ResumeView {resume} {variants} {currentVariant} />
