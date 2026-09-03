/** Safari WebKit — heavy filter/canvas + Lenis often tanks frame rate on Mac. */
export function isSafariEngine() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox/i.test(ua);
}

export function prefersNativeScroll() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 991px), (pointer: coarse)").matches || isSafariEngine()
  );
}

export type TrustScenePerformanceProfile = {
  canvasGlow: boolean;
  particleMorphBlur: boolean;
  /** Minimum ms between animation frames (0 = uncapped). */
  minFrameMs: number;
};

export function getTrustScenePerformanceProfile(): TrustScenePerformanceProfile {
  if (typeof window === "undefined") {
    return { canvasGlow: false, particleMorphBlur: false, minFrameMs: 0 };
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const safari = isSafariEngine();
  const coarse = window.matchMedia("(max-width: 991px), (pointer: coarse)").matches;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const lowMemory = mem !== undefined && mem <= 4;

  if (reduced) {
    return { canvasGlow: false, particleMorphBlur: false, minFrameMs: 0 };
  }

  // Phones/tablets — this canvas particle sim ran uncapped (targeting the
  // display's full refresh rate) on every touch device, since only Safari
  // and low-memory desktops were ever throttled. Mobile CPUs are weaker
  // than that default assumed, and Lenis now also runs its own rAF loop on
  // these same devices, so the two were competing for frame budget.
  if (safari || lowMemory || coarse) {
    return { canvasGlow: false, particleMorphBlur: false, minFrameMs: 32 };
  }

  return { canvasGlow: false, particleMorphBlur: false, minFrameMs: 0 };
}
