import { useRef, useCallback } from 'react';

interface SwipeHandlers {
  onLeft?: () => void;
  onRight?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  threshold?: number;
}

export function useSwipe({ onLeft, onRight, onUp, onDown, threshold = 60 }: SwipeHandlers) {
  const startX = useRef(0);
  const startY = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX.current;
      const dy = e.changedTouches[0].clientY - startY.current;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) < threshold) return;

      if (absDx > absDy) {
        if (dx < 0) onLeft?.();
        else onRight?.();
      } else {
        if (dy < 0) onUp?.();
        else onDown?.();
      }
    },
    [onLeft, onRight, onUp, onDown, threshold],
  );

  return { onTouchStart, onTouchEnd };
}
