<script lang="ts">
  import type { PageData } from './$types';
  import ResumeView from '$lib/components/ResumeView.svelte';
  import { page } from '$app/stores';

  export let data: PageData;
  const { resume, variants } = data;

  let currentVariant = $page.params.variant;
</script>

<ResumeView {resume} {variants} {currentVariant} />
