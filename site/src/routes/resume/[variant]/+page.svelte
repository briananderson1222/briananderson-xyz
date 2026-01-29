<script lang="ts">
  import type { PageData } from './$types';
  import ResumeView from '$lib/components/ResumeView.svelte';
  import { page } from '$app/stores';

  export let data: PageData;
  const { resume, variants } = data;
</script>

<ResumeView {resume} {variants} currentVariant={$page.params.variant} />
