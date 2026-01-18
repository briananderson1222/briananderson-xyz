<script lang="ts">
  import Button from '$lib/components/ui/button.svelte';
  import Badge from '$lib/components/ui/badge.svelte';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import type { PageData } from './$types';
  import { getDuration } from '$lib/utils/date';
  import ExperienceItem from '$lib/components/experience-item.svelte';

  export let data: PageData;
  const { resume } = data;

 let mounted = false;
  let openCategories: Record<string, boolean> = {};
  let showAllExperience = false;

 onMount(() => mounted = true);

 function toggleCategory(category: string) {
    openCategories[category] = !openCategories[category];
  }
</script>
