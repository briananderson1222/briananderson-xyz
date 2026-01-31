import type { ActionReturn } from 'svelte/action';

interface SwipeEvents {
  swipestart: CustomEvent<{ x: number; y: number }>;
  swipemove: CustomEvent<{ deltaX: number; deltaY: number; progress: number }>;
  swipeend: CustomEvent<{ deltaX: number; deltaY: number; direction: 'left' | 'right' | 'none'; shouldNavigate: boolean }>;
}

interface SwipeOptions {
  threshold?: number;
  verticalThreshold?: number;
  velocityThreshold?: number;
}

export function useSwipe(node: HTMLElement, options: SwipeOptions = {}) {
  const {
    threshold = 100,
    verticalThreshold = 50,
    velocityThreshold = 0.5
  } = options;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let startTime = 0;
  let hasMoved = false;

  const handleStart = (x: number, y: number) => {
    isDragging = true;
    startX = x;
    startY = y;
    lastX = x;
    startTime = performance.now();
    hasMoved = false;
    node.style.touchAction = 'none';
    node.style.userSelect = 'none';
    node.style.cursor = 'grabbing';

    node.dispatchEvent(new CustomEvent('swipestart', {
      detail: { x, y }
    }));
  };

  const handleMove = (x: number, y: number) => {
    if (!isDragging) return;
    
    const deltaX = x - startX;
    const deltaY = y - startY;
    
    // Prevent triggering on vertical scroll
    if (Math.abs(deltaY) > verticalThreshold && !hasMoved) {
      isDragging = false;
      node.style.touchAction = '';
      node.style.userSelect = '';
      node.style.cursor = '';
      return;
    }
    
    hasMoved = true;
    const progress = Math.max(-1, Math.min(1, deltaX / threshold));

    node.dispatchEvent(new CustomEvent('swipemove', {
      detail: { deltaX, deltaY, progress }
    }));
    
    lastX = x;
  };

  const handleEnd = (x: number, y: number) => {
    if (!isDragging) return;
    
    const deltaX = x - startX;
    const deltaY = y - startY;
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Calculate velocity (pixels per millisecond)
    const velocity = Math.abs(deltaX / Math.max(duration, 1));
    
    let direction: 'left' | 'right' | 'none' = 'none';
    let shouldNavigate = false;
    
    if (Math.abs(deltaX) > threshold) {
      direction = deltaX < 0 ? 'left' : 'right';
      shouldNavigate = true;
    } else if (velocity > velocityThreshold && hasMoved) {
      // Fast swipe with less distance
      direction = deltaX < 0 ? 'left' : 'right';
      shouldNavigate = true;
    }

    node.dispatchEvent(new CustomEvent('swipeend', {
      detail: { deltaX, deltaY, direction, shouldNavigate }
    }));
    
    isDragging = false;
    node.style.touchAction = '';
    node.style.userSelect = '';
    node.style.cursor = '';
  };

  // Touch events
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const touch = e.changedTouches[0];
    handleEnd(touch.clientX, touch.clientY);
  };

  // Mouse events
  const handleMouseDown = (e: MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = (e: MouseEvent) => {
    handleEnd(e.clientX, e.clientY);
  };

  // Event listeners
  node.addEventListener('touchstart', handleTouchStart, { passive: true });
  node.addEventListener('touchmove', handleTouchMove, { passive: true });
  node.addEventListener('touchend', handleTouchEnd);
  node.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);

  // Cleanup
  return {
    update(newOptions: SwipeOptions) {
      Object.assign(options, newOptions);
    },
    destroy() {
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchmove', handleTouchMove);
      node.removeEventListener('touchend', handleTouchEnd);
      node.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
  };
}
