<script lang="ts">
  import type { Resume } from '$lib/types';
  import ResumeContent from './ResumeContent.svelte';
  import { onMount, afterUpdate, tick } from 'svelte';
  import { useSwipe } from '$lib/actions/useSwipe';

  export let resumes: { variant: string; resume: Resume }[] = [];
  export let currentIndex: number = 0;

  let swiperContainer: HTMLElement;
  let swipeProgress = 0;
  let buttonElements: HTMLElement[] = [];
  let slideElements: HTMLElement[] = [];
  let wrapperHeight = '2000px';
  let resizeObserver: ResizeObserver;

  $: indicatorState = calculateIndicatorState();
  $: if (currentIndex >= 0 && typeof window !== 'undefined') { updateWrapperHeight(); }

  function handleSwipeMove(event: CustomEvent) {
    swipeProgress = event.detail.progress;
  }

  function handleSwipeEnd(event: CustomEvent) {
    swipeProgress = 0;
    const direction = event.detail.direction;
    const shouldNavigate = event.detail.shouldNavigate;

    if (shouldNavigate) {
      if (direction === 'left' && currentIndex < resumes.length - 1) {
        currentIndex++;
      } else if (direction === 'right' && currentIndex > 0) {
        currentIndex--;
      }
    }
  }

  function getTargetIndex() {
    return swipeProgress < 0 ? currentIndex + 1 : swipeProgress > 0 ? currentIndex - 1 : currentIndex;
  }

  function calculateIndicatorState() {
    if (buttonElements.length === 0 || !buttonElements[currentIndex]) {
      return { transform: 'translateX(0)', width: '80px' };
    }

    const currentBtn = buttonElements[currentIndex];
    const targetIndex = getTargetIndex();
    const targetBtn = buttonElements[targetIndex];

    const currentRect = currentBtn.getBoundingClientRect();
    const parentRect = currentBtn.parentElement?.getBoundingClientRect();

    if (!parentRect) return { transform: 'translateX(0)', width: '80px' };

    const currentLeft = currentRect.left - parentRect.left;
    const currentWidth = currentRect.width;

    let targetLeft = currentLeft;
    let targetBtnWidth = currentWidth;

    if (swipeProgress !== 0 && targetBtn && targetIndex >= 0 && targetIndex < buttonElements.length) {
      const targetRect = targetBtn.getBoundingClientRect();
      targetLeft = targetRect.left - parentRect.left;
      targetBtnWidth = targetRect.width;
    }

    const progress = Math.abs(swipeProgress);
    const interpolatedLeft = currentLeft + (targetLeft - currentLeft) * progress;
    const interpolatedWidth = currentWidth + (targetBtnWidth - currentWidth) * progress;

    return {
      transform: `translateX(${interpolatedLeft}px)`,
      width: `${interpolatedWidth}px`
    };
  }

  function getIndicatorTransform() {
    return indicatorState.transform;
  }

  function getIndicatorWidth() {
    return indicatorState.width;
  }

  function updateWrapperHeight() {
    console.log('updateWrapperHeight called', { slideElementsLength: slideElements.length, currentIndex });
    if (slideElements[currentIndex]) {
      const slide = slideElements[currentIndex];
      const height = slide.scrollHeight || slide.offsetHeight || 0;
      console.log('Slide height:', { slide, scrollHeight: slide.scrollHeight, offsetHeight: slide.offsetHeight, calculatedHeight: height });
      if (height > 0) {
        wrapperHeight = `${height}px`;
        console.log('Setting wrapperHeight to:', wrapperHeight);
      }
    } else {
      console.log('No current slide found');
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
    if (swiperContainer) {
      swiperContainer.addEventListener('swipemove', handleSwipeMove);
      swiperContainer.addEventListener('swipeend', handleSwipeEnd);
    }

    tick().then(() => {
      updateWrapperHeight();
      setupResizeObserver();
      setTimeout(() => updateWrapperHeight(), 100);
      setTimeout(() => updateWrapperHeight(), 500);
    });

    return () => {
      if (swiperContainer) {
        swiperContainer.removeEventListener('swipemove', handleSwipeMove);
        swiperContainer.removeEventListener('swipeend', handleSwipeEnd);
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

<div class="max-w-4xl mx-auto pt-4 pb-12 md:pt-6 md:pb-16 font-mono print:font-serif print:p-0 print:max-w-none print:leading-tight relative">

  <!-- Actions (Print & Switcher) -->
  <div class="flex items-center justify-between mb-8 print:hidden">
    <div class="flex items-center relative">
      {#each resumes as item, index}
        {@const isCurrent = index === currentIndex}
        {@const textColor = isCurrent ? 'rgb(var(--color-skin-accent-contrast))' : ''}
        <button
          onclick={() => currentIndex = index}
          class="variant-button min-w-[60px] md:min-w-[80px] px-3 py-2 text-xs md:text-sm font-bold rounded-md transition-all hover:scale-105 active:scale-95 relative z-10"
          aria-current={isCurrent ? 'page' : undefined}
          bind:this={buttonElements}
          data-index={index}
          style="color: {textColor}"
        >
          ./{item.variant === 'default' ? 'leader' : item.variant}
        </button>
      {/each}
      <div
        class="active-indicator absolute h-full rounded-md bg-skin-accent transition-all duration-150 ease-out pointer-events-none"
        style:transform={getIndicatorTransform()}
        style:width={getIndicatorWidth()}
        style:opacity={swipeProgress !== 0 ? 0.5 : 1}
      ></div>
    </div>

    <button class="px-4 py-2 bg-skin-accent text-skin-accent-contrast text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity" onclick={() => window.print()}>
      Print
    </button>
  </div>

  <!-- Swipe Indicators -->
  {#if Math.abs(swipeProgress) > 0}
    <div class="swipe-indicators">
      {#if swipeProgress < 0 && currentIndex < resumes.length - 1}
        {@const nextResume = resumes[currentIndex + 1]}
        <div class="swipe-indicator swipe-indicator-left" style="opacity: {Math.abs(swipeProgress)};">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7-7"/>
          </svg>
          <span class="text-xs font-bold ml-1">./{nextResume.variant === 'default' ? 'leader' : nextResume.variant}</span>
        </div>
      {:else if swipeProgress > 0 && currentIndex > 0}
        {@const prevResume = resumes[currentIndex - 1]}
        <div class="swipe-indicator swipe-indicator-right" style="opacity: {swipeProgress};">
          <span class="text-xs font-bold mr-1">./{prevResume.variant === 'default' ? 'leader' : prevResume.variant}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </div>
      {/if}
    </div>
  {/if}

  <div class="resume-wrapper" bind:this={swiperContainer} use:useSwipe={{threshold: 250, verticalThreshold: 120, velocityThreshold: 1.5}} style="height: {wrapperHeight};">
    {#each resumes as item, index}
      {@const baseX = (index - currentIndex) * 100}
      {@const dragX = swipeProgress * 50}
      {@const transformX = baseX + dragX}
      {@const isCurrent = index === currentIndex}
      {@const isNext = index === currentIndex + 1}
      {@const isPrev = index === currentIndex - 1}
      {@const targetIndex = swipeProgress < 0 ? currentIndex + 1 : swipeProgress > 0 ? currentIndex - 1 : currentIndex}
      {@const isTarget = index === targetIndex}
      {@const opacity = swipeProgress === 0 ? (isCurrent ? 1 : 0) : isTarget ? Math.abs(swipeProgress) : isCurrent ? 1 - Math.abs(swipeProgress) : 0}
      <div
        class="resume-slide {isCurrent ? 'current' : ''}"
        bind:this={slideElements}
        style="transform: translateX({transformX}%); transition: {swipeProgress === 0 ? 'transform 0.3s ease-out, opacity 0.3s ease-out' : 'none'}; z-index: {resumes.length - index}; opacity: {opacity};"
        data-index={index}
        data-transform={transformX}
      >
        <ResumeContent resume={item.resume} />
      </div>
    {/each}
  </div>

  <!-- Download/Action -->
  <div class="mt-16 pt-8 border-t-2 border-dashed border-skin-border text-center print:hidden">
    <button class="px-6 py-3 bg-skin-accent text-skin-accent-contrast font-bold uppercase tracking-wider hover:opacity-90 transition-opacity" onclick={() => window.print()}>
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
    .swipe-indicators {
      display: none;
    }
  }
</style>
