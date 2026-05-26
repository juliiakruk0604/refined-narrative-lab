import { useEffect, useState, type ReactNode } from "react";
import { ReactLenis } from "lenis/react";

/** Matches DreamLab — https://www.enterdreamlab.com/ */
const dreamlabEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

const lenisOptions = {
  duration: 1.2,
  easing: dreamlabEasing,
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  smoothWheel: true,
  syncTouch: true,
  touchMultiplier: 2,
  lerp: 0.08,
  autoRaf: true,
  anchors: {
    duration: 1.2,
    easing: dreamlabEasing,
  },
};

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!reduced);
  }, []);

  if (!enabled) return children;

  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}
