<script lang="ts">
  import type { Resume } from '$lib/types';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  export let resume: Resume;
  export let variants: string[] = [];
  export let currentVariant: string = 'default';

  // Swipe event callbacks
  export let onSwipeStart: ((detail: { x: number; y: number }) => void) | undefined = undefined;
  export let onSwipeMove: ((detail: { deltaX: number; deltaY: number; progress: number }) => void) | undefined = undefined;
  export let onSwipeEnd: ((detail: { deltaX: number; deltaY: number; direction: 'left' | 'right' | 'none'; shouldNavigate: boolean }) => void) | undefined = undefined;

  let contentElement: HTMLElement;
  let dragOffset = 0;
  let isDragging = false;
  let isAnimating = false;

  // Silence unused export warning - resume may be used in future enhancements
  void resume;

  const currentIndex = variants.indexOf(currentVariant);
  const canSwipeLeft = currentIndex > 0;
  const canSwipeRight = currentIndex < variants.length - 1;

  function handleSwipeStart(event: CustomEvent) {
    isDragging = true;
    dragOffset = 0;
    if (onSwipeStart) onSwipeStart(event.detail);
  }

  function handleSwipeMove(event: CustomEvent) {
    if (!isDragging) return;

    const { deltaX, progress } = event.detail;

    // Limit drag based on edges
    if (deltaX > 0 && !canSwipeRight) {
      dragOffset = deltaX * 0.3; // Resistance at edge
    } else if (deltaX < 0 && !canSwipeLeft) {
      dragOffset = deltaX * 0.3;
    } else {
      dragOffset = deltaX;
    }

    if (onSwipeMove) onSwipeMove(event.detail);
  }

  function handleSwipeEnd(event: CustomEvent) {
    isDragging = false;
    const { direction, shouldNavigate } = event.detail;

    if (shouldNavigate) {
      handleNavigate(direction);
    } else {
      animateBack();
    }

    if (onSwipeEnd) onSwipeEnd(event.detail);
  }

  function handleNavigate(direction: 'left' | 'right') {
    if (!isAnimating && shouldNavigateForDirection(direction)) {
      isAnimating = true;

      // Animate fully off screen
      const targetOffset = direction === 'left' ? -window.innerWidth : window.innerWidth;
      dragOffset = targetOffset;

      // Navigate after animation
      setTimeout(() => {
        const nextIndex = direction === 'left' ? currentIndex + 1 : currentIndex - 1;
        const nextVariant = variants[nextIndex];
        const targetUrl = nextVariant === 'default' ? '/resume/' : `/resume/${nextVariant}/`;

        goto(targetUrl, { noScroll: true });
      }, 300);
    }
  }

  function shouldNavigateForDirection(direction: 'left' | 'right'): boolean {
    if (direction === 'left' && canSwipeLeft) return true;
    if (direction === 'right' && canSwipeRight) return true;
    return false;
  }

  function animateBack() {
    isAnimating = true;
    dragOffset = 0;
    setTimeout(() => {
      isAnimating = false;
    }, 300);
  }

  onMount(() => {
    // Ensure content starts at 0 offset
    dragOffset = 0;
  });

  export { isDragging };
</script>

<div class="resume-wrapper">
  <div
    class="resume-content"
    class:dragging={isDragging}
    style="transform: translateX({dragOffset}px); transition: {(isDragging || !isAnimating) ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'};"
  >
    <slot />
  </div>
</div>

<style>
  .resume-wrapper {
    position: relative;
    overflow: hidden;
  }

  .resume-content {
    will-change: transform;
  }

  .resume-content.dragging {
    cursor: grabbing;
  }
</style>
