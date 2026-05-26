import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { cancelFrame, frame } from "motion/react";

/** Lenis default lerp — buttery continuous scroll (not duration easing). */
const lenisOptions = {
  lerp: 0.075,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1,
  syncTouch: false,
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  autoRaf: false,
  anchors: {
    lerp: 0.075,
  },
};

type LenisHandle = {
  lenis?: {
    raf: (time: number) => void;
    resize: () => void;
  };
};

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServer() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer,
  );
}

/** Re-measure Lenis after layout locks (preloader) release. */
export function LenisLayoutSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const onLoadingEnd = () => {
      lenis.resize();
    };

    window.addEventListener("rm:loading-end", onLoadingEnd);
    return () => window.removeEventListener("rm:loading-end", onLoadingEnd);
  }, [lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const lenisRef = useRef<LenisHandle | null>(null);

  useEffect(() => {
    if (reduced) return;

    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }

    frame.update(update, true);
    return () => cancelFrame(update);
  }, [reduced]);

  if (reduced) return children;

  return (
    <ReactLenis root ref={lenisRef} options={lenisOptions}>
      <LenisLayoutSync />
      {children}
    </ReactLenis>
  );
}
