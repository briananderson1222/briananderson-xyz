<script lang="ts">
  import type { Resume } from "$lib/types";
  import ResumeContent from "./ResumeContent.svelte";
  import { onMount, afterUpdate, tick } from "svelte";
  import { useSwipe } from "$lib/actions/useSwipe";
  import { goto } from "$app/navigation";

  export let resumes: { variant: string; resume: Resume }[] = [];
  export let currentIndex: number = 0;

  // Fixed button width in pixels (matches w-[105px] class)
  const BUTTON_WIDTH = 105;

  let swiperContainer: HTMLElement;
  let swipeProgress = 0;
  let slideElements: HTMLElement[] = [];
  let wrapperHeight = "2000px";
  let resizeObserver: ResizeObserver;
  let mounted = false;
  let isAnimating = false;
  let animationProgress = 0;
  let animationFrom = 0;
  let animationTo = 0;

  // Simple indicator position: just index * button width
  $: indicatorX = isAnimating
    ? animationFrom * BUTTON_WIDTH +
      (animationTo - animationFrom) * BUTTON_WIDTH * animationProgress
    : swipeProgress !== 0
      ? currentIndex * BUTTON_WIDTH + getSwipeOffset()
      : currentIndex * BUTTON_WIDTH;

  function getSwipeOffset() {
    const targetIndex = swipeProgress < 0 ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex < 0 || targetIndex >= resumes.length) return 0;
    const direction = swipeProgress < 0 ? 1 : -1;
    return direction * Math.abs(swipeProgress) * BUTTON_WIDTH * 0.5;
  }

  $: if (currentIndex >= 0 && typeof window !== "undefined") {
    updateWrapperHeight();
  }

  // Update URL when currentIndex changes
  $: if (mounted && resumes.length > 0) {
    const variant = resumes[currentIndex]?.variant;
    const newUrl = variant === "default" ? "/resume/" : `/resume/${variant}/`;
    if (typeof window !== "undefined" && window.location.pathname !== newUrl) {
      goto(newUrl, { replaceState: true, noScroll: true });
    }
  }

  function handleSwipeMove(event: CustomEvent) {
    if (isAnimating) return;
    let progress = event.detail.progress;

    // Prevent swiping right when at first index
    if (currentIndex === 0 && progress > 0) {
      progress = 0;
    }
    // Prevent swiping left when at last index
    if (currentIndex === resumes.length - 1 && progress < 0) {
      progress = 0;
    }

    swipeProgress = progress;
  }

  function handleSwipeEnd(event: CustomEvent) {
    if (isAnimating) return;
    swipeProgress = 0;
    const direction = event.detail.direction;
    const shouldNavigate = event.detail.shouldNavigate;

    if (shouldNavigate) {
      if (direction === "left" && currentIndex < resumes.length - 1) {
        currentIndex++;
      } else if (direction === "right" && currentIndex > 0) {
        currentIndex--;
      }
    }
  }

  function animateToIndex(targetIndex: number) {
    if (targetIndex === currentIndex || isAnimating) return;

    isAnimating = true;
    animationFrom = currentIndex;
    animationTo = targetIndex;
    animationProgress = 0;

    const duration = 300;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      animationProgress = 1 - Math.pow(1 - progress, 3);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        currentIndex = targetIndex;
        isAnimating = false;
        animationProgress = 0;
      }
    }

    requestAnimationFrame(animate);
  }

  function updateWrapperHeight() {
    if (slideElements[currentIndex]) {
      const slide = slideElements[currentIndex];
      const height = slide.scrollHeight || slide.offsetHeight || 0;
      if (height > 0) {
        wrapperHeight = `${height}px`;
      }
    }
  }

  function setupResizeObserver() {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }

    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const index = slideElements.indexOf(entry.target as HTMLElement);
        if (index === currentIndex) {
          wrapperHeight = `${entry.contentRect.height}px`;
        }
      }
    });

    slideElements.forEach((slide) => {
      if (slide) {
        resizeObserver.observe(slide);
      }
    });
  }

  onMount(() => {
    mounted = true;

    if (swiperContainer) {
      swiperContainer.addEventListener("swipemove", handleSwipeMove);
      swiperContainer.addEventListener("swipeend", handleSwipeEnd);
    }

    tick().then(() => {
      updateWrapperHeight();
      setupResizeObserver();
    });

    return () => {
      if (swiperContainer) {
        swiperContainer.removeEventListener("swipemove", handleSwipeMove);
        swiperContainer.removeEventListener("swipeend", handleSwipeEnd);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  });

  afterUpdate(() => {
    tick().then(() => {
      updateWrapperHeight();
      setupResizeObserver();
    });
  });
</script>

<div
  class="max-w-4xl mx-auto pt-4 pb-12 md:pt-6 md:pb-16 font-mono print:font-serif print:p-0 print:m-0 print:max-w-none print:leading-tight relative"
>
  <!-- Actions (Print & Switcher) -->
  <div class="flex items-center justify-between mb-8 pl-5 print:hidden">
    <div
      class="flex items-center relative border border-skin-border/50 rounded-lg p-1"
    >
      {#each resumes as item, index}
        {@const isCurrent = index === currentIndex && !isAnimating}
        {@const isAnimatingTo = isAnimating && index === animationTo}
        <button
          onclick={() => animateToIndex(index)}
          class="variant-button w-[105px] px-2 py-2 text-xs md:text-sm font-bold rounded-md transition-colors relative z-10 text-center {isCurrent ||
          isAnimatingTo
            ? 'text-skin-accent-contrast'
            : 'text-skin-muted hover:text-skin-base'}"
          aria-current={isCurrent ? "page" : undefined}
          data-index={index}
        >
          ./{item.variant === "default" ? "leader" : item.variant}
        </button>
      {/each}
      <div
        class="active-indicator absolute h-full w-[105px] rounded-md bg-skin-accent pointer-events-none"
        style:transform="translateX({indicatorX}px)"
        style:opacity={swipeProgress !== 0 ? 0.5 : 1}
      ></div>
    </div>

    <button
      class="px-4 py-2 bg-skin-accent text-skin-accent-contrast text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
      onclick={() => window.print()}
    >
      Print
    </button>
  </div>

  <!-- Swipe Indicators -->
  {#if Math.abs(swipeProgress) > 0}
    <div class="swipe-indicators">
      {#if swipeProgress < 0 && currentIndex < resumes.length - 1}
        {@const nextResume = resumes[currentIndex + 1]}
        <div
          class="swipe-indicator swipe-indicator-left"
          style="opacity: {Math.abs(swipeProgress)};"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M5 12h14M12 5l7 7-7-7" />
          </svg>
          <span class="text-xs font-bold ml-1"
            >./{nextResume.variant === "default"
              ? "leader"
              : nextResume.variant}</span
          >
        </div>
      {:else if swipeProgress > 0 && currentIndex > 0}
        {@const prevResume = resumes[currentIndex - 1]}
        <div
          class="swipe-indicator swipe-indicator-right"
          style="opacity: {swipeProgress};"
        >
          <span class="text-xs font-bold mr-1"
            >./{prevResume.variant === "default"
              ? "leader"
              : prevResume.variant}</span
          >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </div>
      {/if}
    </div>
  {/if}

  <div
    class="resume-wrapper"
    bind:this={swiperContainer}
    use:useSwipe={{
      threshold: 250,
      verticalThreshold: 120,
      velocityThreshold: 1.5,
    }}
    style="height: {wrapperHeight};"
  >
    {#each resumes as item, index}
      {@const isCurrentSlide = index === currentIndex}
      {@const isFromSlide = isAnimating && index === animationFrom}
      {@const isToSlide = isAnimating && index === animationTo}

      {@const baseX = isAnimating
        ? (index - animationFrom) * 100 +
          (animationFrom - animationTo) * 100 * animationProgress
        : (index - currentIndex) * 100}
      {@const dragX = swipeProgress * 50}
      {@const transformX = baseX + dragX}

      {@const swipeTargetIndex =
        swipeProgress < 0
          ? currentIndex + 1
          : swipeProgress > 0
            ? currentIndex - 1
            : currentIndex}
      {@const isSwipeTarget = index === swipeTargetIndex}

      {@const opacity = isAnimating
        ? isFromSlide
          ? 1 - animationProgress
          : isToSlide
            ? animationProgress
            : 0
        : swipeProgress === 0
          ? isCurrentSlide
            ? 1
            : 0
          : isSwipeTarget
            ? Math.abs(swipeProgress)
            : isCurrentSlide
              ? 1 - Math.abs(swipeProgress)
              : 0}
      <div
        class="resume-slide {isCurrentSlide && !isAnimating ? 'current' : ''}"
        bind:this={slideElements[index]}
        style="transform: translateX({transformX}%); transition: none; z-index: {resumes.length -
          index}; opacity: {opacity};"
        data-index={index}
        data-transform={transformX}
      >
        <ResumeContent resume={item.resume} />
      </div>
    {/each}
  </div>

  <!-- Download/Action -->
  <div
    class="mt-16 pt-8 border-t-2 border-dashed border-skin-border text-center print:hidden print:m-0 print:p-0 print:border-0"
  >
    <button
      class="px-6 py-3 bg-skin-accent text-skin-accent-contrast font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
      onclick={() => window.print()}
    >
      Print
    </button>
  </div>
</div>

<style>
  .resume-wrapper {
    position: relative;
    width: 100%;
    overflow: visible;
  }

  .resume-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    will-change: transform;
    padding-left: 1.25rem;
  }

  .resume-slide.current {
    pointer-events: auto;
  }

  .resume-slide:not(.current) {
    pointer-events: none;
  }

  .resume-slide.current {
    pointer-events: auto;
  }

  .swipe-indicators {
    position: fixed;
    bottom: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
    display: flex;
    gap: 6rem;
    pointer-events: none;
    z-index: 50;
    width: 100%;
    justify-content: center;
  }

  .swipe-indicator {
    display: flex;
    align-items: center;
    transition: opacity 0.15s ease-out;
    color: rgb(var(--color-accent));
  }

  @media print {
    @page {
      margin: 0.5in;
    }

    .swipe-indicators {
      display: none;
    }

    .resume-wrapper {
      position: static !important;
      height: auto !important;
      overflow: visible !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .resume-slide {
      position: static !important;
      transform: none !important;
      opacity: 1 !important;
      display: none !important;
      padding-left: 0 !important;
      margin: 0 !important;
    }

    .resume-slide.current {
      display: block !important;
    }

    :global(body),
    :global(html) {
      height: auto !important;
      min-height: 0 !important;
      overflow: visible !important;
    }
  }
</style>
