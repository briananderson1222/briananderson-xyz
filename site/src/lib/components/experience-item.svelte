<script lang="ts">
  import { getDuration } from '$lib/utils/date';
  import type { ResumeJob } from '$lib/types';
  import { browser } from '$app/environment';

  export let job: ResumeJob;
  export let compact = false;

  function isCurrentJob(job: ResumeJob): boolean {
    return !job.end_date;
  }
</script>

<div class="relative group {compact ? 'mb-3' : 'mb-6'}">
  <div class="absolute -left-[31px] top-1.5 w-3 h-3 bg-skin-page border border-skin-accent rounded-full class:current-job={isCurrentJob(job)}"></div>
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 hover:ring-1 hover:ring-skin-accent/20 hover:ring-offset-1 rounded transition-all">
    <div class="min-w-0 flex-1">
      <h3 class="text-base text-skin-base font-bold leading-snug">{job.role}</h3>
      <div class="text-skin-accent text-sm">@ {job.company}</div>
    </div>
    <div class="text-xs text-skin-muted whitespace-nowrap text-left sm:text-right shrink-0 mt-1 sm:mt-0.5">
      <div>{job.start_date} {job.end_date ? '- ' + job.end_date : ' - Present'}</div>
      <div class="text-skin-muted">[{getDuration(job.start_date, job.end_date)}]</div>
    </div>
  </div>
  {#if job.description}
    <p class="text-skin-muted text-sm mt-2 max-w-2xl leading-relaxed">
      {job.description}
    </p>
  {/if}
</div>

<style>
  .current-job {
    background-color: var(--color-skin-accent);
    box-shadow: 0 0 10px 2px var(--color-skin-accent);
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.8;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
  }
</style>
