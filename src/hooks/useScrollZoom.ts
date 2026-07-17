import { useEffect, useRef } from "react";

interface ScrollZoomOptions {
  rotateY?: number;
  rotateX?: number;
  fromScale?: number;
  toScale?: number;
  settleDistance?: number;
}

// Zooms an element in as the page scrolls, via a direct DOM style
// mutation inside a requestAnimationFrame-throttled scroll handler — NOT
// React state, same reason as always: setting state on every scroll tick
// re-renders the component subtree at up to 60fps, mutating a ref's
// style skips that entirely.
//
// The 3D tilt (rotateY/rotateX) is intentionally a FIXED constant here,
// not scroll-driven. Rotating and zooming are different effects with
// different math; keeping zoom as its own hook rather than bolting scale
// onto a rotation hook keeps each one simple to reason about and tune
// independently.
export function useScrollZoom<T extends HTMLElement>(options: ScrollZoomOptions = {}) {
  const ref = useRef<T>(null);
  const { rotateY = -32, rotateX = 10, fromScale = 0.94, toScale = 1.70, settleDistance = 500 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      el.style.transform = `perspective(1400px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${fromScale})`;
      return;
    }

    let ticking = false;

    function update() {
      ticking = false;
      if (!el) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / settleDistance));
      const scale = fromScale + (toScale - fromScale) * progress;
      el.style.transform = `perspective(1400px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [rotateY, rotateX, fromScale, toScale, settleDistance]);

  return ref;
}