<script lang="ts">
  import type { Resume } from "$lib/types";
  import { getDuration } from "$lib/utils/date";
  import ResumeContent from "./ResumeContent.svelte";
  import "$lib/components/ui/glowing-green.css";
  import { useSwipe } from "$lib/actions/useSwipe";
  import { goto } from "$app/navigation";
  import { onMount, onDestroy } from "svelte";

  export let resume: Resume;
  export let variants: string[] = [];
  export let currentVariant: string = "default";

  let pageContainer: HTMLElement;
  let isDragging = false;
  let dragOffset = 0;
  let isAnimating = false;
  let swipeProgress = 0; // -1 to 1

  // Cache for loaded resumes
  const loadedVariants = new Set<string>();

  $: currentIndex = variants.includes(currentVariant)
    ? variants.indexOf(currentVariant)
    : 0;
  $: canGoNext = currentIndex < variants.length - 1; // Can go to next variant (index + 1)
  $: canGoPrevious = currentIndex > 0; // Can go to previous variant (index - 1)
  $: swipeDirection =
    swipeProgress > 0 ? "right" : swipeProgress < 0 ? "left" : null;

  function handleSwipeStart(event: CustomEvent) {
    isDragging = true;
    dragOffset = 0;
  }

  function handleSwipeMove(event: CustomEvent) {
    if (!isDragging) return;

    const { deltaX } = event.detail;

    // Limit drag based on edges
    // Swipe right (deltaX > 0) → previous, swipe left (deltaX < 0) → next
    if (deltaX > 0 && !canGoPrevious) {
      dragOffset = deltaX * 0.3; // Resistance at edge
    } else if (deltaX < 0 && !canGoNext) {
      dragOffset = deltaX * 0.3;
    } else {
      dragOffset = deltaX;
    }
  }

  $: swipeProgress = isDragging
    ? Math.max(-1, Math.min(1, dragOffset / 300))
    : 0;

  // Helper function to get button background color based on swipe progress
  function getButtonBackground(
    buttonVariant: string,
    currentVariant: string,
    progress: number,
  ): string {
    if (buttonVariant === currentVariant) {
      return "var(--color-skin-accent)";
    }

    const buttonIndex = variants.indexOf(buttonVariant);
    const currentIndex = variants.indexOf(currentVariant);

    // If swiping towards this button, show partial green
    const distance = buttonIndex - currentIndex;

    if (progress > 0 && distance === 1) {
      // Swiping right towards next
      return `rgba(var(--color-skin-accent-rgb, 1, 1, 1), ${progress * 0.4})`;
    } else if (progress < 0 && distance === -1) {
      // Swiping left towards previous
      return `rgba(var(--color-skin-accent-rgb, 1, 1, 1), ${Math.abs(progress) * 0.4})`;
    }

    return "transparent";
  }

  function handleSwipeEnd(event: CustomEvent) {
    // Always reset dragging first
    isDragging = false;

    const { direction, shouldNavigate } = event.detail;

    if (shouldNavigate) {
      handleNavigate(direction);
    } else {
      animateBack();
    }
  }

  function handleNavigate(direction: "left" | "right") {
    if (!isAnimating && shouldNavigateForDirection(direction)) {
      isAnimating = true;

      // Swipe left (deltaX negative) → show next variant
      // Swipe right (deltaX positive) → show previous variant
      const targetOffset =
        direction === "left" ? -window.innerWidth : window.innerWidth;
      dragOffset = targetOffset;

      // Navigate after animation
      setTimeout(() => {
        let nextIndex: number;

        if (direction === "left") {
          // Swipe left → next variant
          nextIndex = currentIndex + 1;
        } else if (direction === "right") {
          // Swipe right → previous variant
          nextIndex = currentIndex - 1;
        } else {
          animateBack();
          return;
        }

        // Safety check
        if (nextIndex < 0 || nextIndex >= variants.length) {
          animateBack();
          return;
        }

        const nextVariant = variants[nextIndex];
        if (!nextVariant) {
          animateBack();
          return;
        }

        const targetUrl =
          nextVariant === "default" ? "/resume/" : `/resume/${nextVariant}/`;

        // Navigate
        goto(targetUrl, { noScroll: true });

        // Force reflow and reset state after navigation
        requestAnimationFrame(() => {
          setTimeout(() => {
            isAnimating = false;
            dragOffset = 0;
            swipeProgress = 0;

            // Force reflow
            document.body.offsetHeight;
          }, 400);
        });
      }, 300);
    }
  }

  function shouldNavigateForDirection(direction: "left" | "right"): boolean {
    // Swipe left (deltaX < 0) → next variant
    // Swipe right (deltaX > 0) → previous variant
    if (direction === "left" && canGoNext) return true;
    if (direction === "right" && canGoPrevious) return true;
    return false;
  }

  function animateBack() {
    isAnimating = true;
    dragOffset = 0;
    setTimeout(() => {
      isAnimating = false;
      swipeProgress = 0;
      // Force reflow
      document.body.offsetHeight;
    }, 300);
  }

  function handleClick(event: MouseEvent) {
    if (isDragging) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  // Lazy preload adjacent resumes - only load once, cache in browser
  async function preloadAdjacentResumes() {
    // Preload next variant
    if (canGoNext) {
      const nextVariant = variants[currentIndex + 1];
      if (!loadedVariants.has(nextVariant)) {
        loadedVariants.add(nextVariant);
        preloadVariant(nextVariant);
      }
    }

    // Preload previous variant
    if (canGoPrevious) {
      const prevVariant = variants[currentIndex - 1];
      if (!loadedVariants.has(prevVariant)) {
        loadedVariants.add(prevVariant);
        preloadVariant(prevVariant);
      }
    }
  }

  function preloadVariant(variant: string) {
    // Fire and forget - browser will cache the response
    const url = variant === "default" ? "/resume/" : `/resume/${variant}/`;
    fetch(url).catch((e) => {
      // Ignore preload errors silently
    });
  }

  let cleanup: (() => void)[] = [];

  onMount(() => {
    // Reset state on mount
    isDragging = false;
    isAnimating = false;
    dragOffset = 0;
    swipeProgress = 0;

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      if (pageContainer) {
        const handleSwipeStartEvent = (e: Event) =>
          handleSwipeStart(e as CustomEvent);
        const handleSwipeMoveEvent = (e: Event) =>
          handleSwipeMove(e as CustomEvent);
        const handleSwipeEndEvent = (e: Event) =>
          handleSwipeEnd(e as CustomEvent);

        pageContainer.addEventListener("swipestart", handleSwipeStartEvent);
        pageContainer.addEventListener("swipemove", handleSwipeMoveEvent);
        pageContainer.addEventListener("swipeend", handleSwipeEndEvent);

        cleanup.push(() => {
          pageContainer.removeEventListener(
            "swipestart",
            handleSwipeStartEvent,
          );
          pageContainer.removeEventListener("swipemove", handleSwipeMoveEvent);
          pageContainer.removeEventListener("swipeend", handleSwipeEndEvent);
        });
      }
    }, 100);

    // Preload adjacent resumes
    preloadAdjacentResumes();

    // Reset on any touch/click to handle visibility issues
    const resetHandler = () => {
      if (isAnimating || isDragging) {
        isAnimating = false;
        isDragging = false;
        dragOffset = 0;
        swipeProgress = 0;
        // Force reflow
        document.body.offsetHeight;
      }
    };

    window.addEventListener("touchstart", resetHandler);
    window.addEventListener("click", resetHandler);
    cleanup.push(() => {
      window.removeEventListener("touchstart", resetHandler);
      window.removeEventListener("click", resetHandler);
    });
  });

  onDestroy(() => {
    cleanup.forEach((fn) => fn());
  });
</script>

<div
  bind:this={pageContainer}
  use:useSwipe={{ threshold: 100 }}
  class="max-w-4xl mx-auto px-4 pt-4 pb-12 md:pt-6 md:pb-16 font-mono print:font-serif print:p-0 print:max-w-none print:leading-tight relative page-container"
>
  <!-- Actions (Print & Switcher) -->
  <div class="flex items-center justify-between mb-8 print:hidden">
    {#if variants.length > 1}
      <div class="flex items-center">
        <!-- Variant switcher -->
        <div
          class="flex items-center bg-skin-base/5 rounded-lg p-1 border border-skin-border gap-1 w-fit"
        >
          {#each variants as v}
            {@const isCurrent = v === currentVariant}
            {@const bgColor = getButtonBackground(
              v,
              currentVariant,
              swipeProgress,
            )}
            <a
              href={v === "default" ? "/resume/" : `/resume/${v}/`}
              class="variant-button min-w-[60px] md:min-w-[80px] px-3 py-2 text-xs md:text-sm font-bold rounded-md transition-all hover:scale-105 active:scale-95"
              style="background-color: {bgColor};"
              class:active={isCurrent}
              aria-current={currentVariant === v ? "page" : undefined}
              on:click={handleClick}
            >
              ./{v === "default" ? "leader" : v}
            </a>
          {/each}
        </div>
      </div>
    {:else}
      <div></div>
    {/if}

    <button
      class="px-4 py-2 bg-skin-accent text-skin-accent-contrast text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
      on:click={() => window.print()}
    >
      Print
    </button>
  </div>

  <div class="resume-wrapper">
    <div
      class="resume-content"
      class:dragging={isDragging}
      style="transform: translateX({dragOffset}px); transition: {isDragging ||
      !isAnimating
        ? 'none'
        : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'};"
    >
      <ResumeContent {resume} />

      <!-- Download/Action -->
      <div
        class="mt-16 pt-8 border-t-2 border-dashed border-skin-border print:hidden"
      >
        <!-- Swipe Indicators -->
        {#if isDragging && swipeDirection}
          <div class="flex items-center justify-center gap-4 mb-4">
            {#if swipeDirection === "left" && canGoNext}
              {@const nextVariant = variants[currentIndex + 1]}
              <div
                class="swipe-indicator swipe-indicator-left"
                style="opacity: {Math.abs(
                  swipeProgress,
                )}; transform: translateX({-20 * swipeProgress}px);"
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
                  >./{nextVariant === "default" ? "leader" : nextVariant}</span
                >
              </div>
            {/if}
            {#if swipeDirection === "right" && canGoPrevious}
              {@const prevVariant = variants[currentIndex - 1]}
              <div
                class="swipe-indicator swipe-indicator-right"
                style="opacity: {swipeProgress}; transform: translateX({20 *
                  swipeProgress}px);"
              >
                <span class="text-xs font-bold mr-1"
                  >./{prevVariant === "default" ? "leader" : prevVariant}</span
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

        <button
          class="px-6 py-3 bg-skin-accent text-skin-accent-contrast font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          on:click={() => window.print()}
        >
          Print
        </button>
      </div>
    </div>
  </div>

  <style>
    .resume-wrapper {
      position: relative;
      overflow: visible;
    }

    .resume-content {
      will-change: transform;
      opacity: 1;
      pointer-events: auto;
      min-height: 1px; /* Force render */
    }

    .resume-content.dragging {
      cursor: grabbing;
    }

    .variant-button.active {
      color: var(--color-skin-accent-contrast) !important;
    }

    .variant-button:not(.active):hover {
      color: var(--color-skin-accent);
      background-color: rgba(var(--color-skin-base-rgb, 1, 1, 1), 0.1);
    }

    .page-container {
      touch-action: pan-y;
    }

    @media print {
      @page {
        margin: 0.5in;
        size: auto;
      }
      :global(body),
      :global(html) {
        background-color: white !important;
        color: black !important;
        height: auto !important;
        min-height: 0 !important;
        overflow: visible !important;
        font-family: "Lato", sans-serif !important; /* Apply Lato font */
      }
      /* Hide the siteNavbar (nav), Footer, and Scanlines */
      :global(nav),
      :global(footer),
      :global(.scanlines) {
        display: none !important;
      }
      /* Ensure the main layout container doesn't force height or padding */
      :global(.min-h-screen),
      :global(main) {
        min-height: 0 !important;
        display: block !important;
        padding: 0 !important;
        margin: 0 !important;
        flex: none !important;
        height: auto !important;
      }
      /* Specific overrides for elements that might still be mono */
      h1,
      h2,
      h3,
      p,
      span,
      li,
      a,
      div,
      section,
      article {
        font-family: "Lato", sans-serif !important;
      }
      /* Prevent elements from creating extra blank pages */
      section,
      article {
        break-after: auto !important;
      }
      ul {
        break-after: auto !important;
      }
    }
  </style>
</div>
