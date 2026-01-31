<script lang="ts">
  import ResumeViewSwiper from "$lib/components/ResumeViewSwiper.svelte";

  export let data: {
    resume: any;
    variants: string[];
    allResumes: { variant: string; resume: any }[];
    currentIndex: number;
  };
</script>

<ResumeViewSwiper resumes={data.allResumes} currentIndex={data.currentIndex} />
