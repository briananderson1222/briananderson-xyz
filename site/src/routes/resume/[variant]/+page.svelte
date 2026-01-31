<script lang="ts">
  import type { PageData } from "./$types";
  import ResumeViewSwiper from "$lib/components/ResumeViewSwiper.svelte";

  export let data: PageData;
</script>

<ResumeViewSwiper resumes={data.allResumes} currentIndex={data.currentIndex} />
