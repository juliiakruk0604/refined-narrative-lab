import { useEffect, useRef } from "react";

function headerOffsetPx() {
  const root = document.documentElement;
  const raw = getComputedStyle(root).getPropertyValue("--rm-header-offset").trim() || "4.75rem";
  if (raw.endsWith("px")) return parseFloat(raw);
  if (raw.endsWith("rem")) {
    return parseFloat(raw) * parseFloat(getComputedStyle(root).fontSize || "16");
  }
  return parseFloat(raw) || 76;
}

/**
 * Mobile-only: pin the second card (Marathon) under the site header while
 * scrolling through #engage. Pure CSS sticky fails for 2nd items in this layout.
 */
export function useMobileMarathonPin(enabled: boolean) {
  const marathonRef = useRef<HTMLElement | null>(null);
  const boundsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const card = marathonRef.current;
    const bounds = boundsRef.current;
    if (!card || !bounds) return;

    const mobile = window.matchMedia("(max-width: 991px)");
    if (!mobile.matches) return;

    let placeholder: HTMLDivElement | null = null;
    let frame = 0;

    const syncPlaceholder = () => {
      if (!placeholder) return;
      placeholder.style.height = `${card.offsetHeight}px`;
    };

    const update = () => {
      frame = 0;
      if (!mobile.matches) {
        card.classList.remove("rm-points-card--pinned");
        card.style.removeProperty("top");
        card.style.removeProperty("width");
        placeholder?.remove();
        placeholder = null;
        return;
      }

      const offset = headerOffsetPx();
      const cardRect = card.getBoundingClientRect();
      const boundsRect = bounds.getBoundingClientRect();
      const cardHeight = card.offsetHeight;

      const shouldPin =
        cardRect.top <= offset + 1 &&
        boundsRect.bottom > offset + cardHeight + 24;

      if (shouldPin) {
        if (!placeholder) {
          placeholder = document.createElement("div");
          placeholder.className = "rm-points-card__placeholder";
          placeholder.setAttribute("aria-hidden", "true");
          syncPlaceholder();
          card.parentElement?.insertBefore(placeholder, card);
        } else {
          syncPlaceholder();
        }

        const content = card.closest(".rm-glass-points__content");
        const contentRect = content?.getBoundingClientRect();
        const inset = contentRect
          ? { left: contentRect.left, width: contentRect.width }
          : { left: 16, width: window.innerWidth - 32 };

        card.classList.add("rm-points-card--pinned");
        card.style.top = `${offset}px`;
        card.style.left = `${inset.left}px`;
        card.style.width = `${inset.width}px`;
      } else {
        card.classList.remove("rm-points-card--pinned");
        card.style.removeProperty("top");
        card.style.removeProperty("left");
        card.style.removeProperty("width");
        placeholder?.remove();
        placeholder = null;
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      card.classList.remove("rm-points-card--pinned");
      card.style.removeProperty("top");
      card.style.removeProperty("left");
      card.style.removeProperty("width");
      placeholder?.remove();
    };
  }, [enabled]);

  return { marathonRef, boundsRef };
}
