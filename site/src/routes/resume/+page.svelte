<script lang="ts">
  import ResumeViewSwiper from '$lib/components/ResumeViewSwiper.svelte';

  export let data: { resume: any; variants: string[]; allResumes: { variant: string; resume: any }[] };

  console.log('Resume page data:', data);
  console.log('All resumes:', data.allResumes);
</script>

<ResumeViewSwiper resumes={data.allResumes} />

