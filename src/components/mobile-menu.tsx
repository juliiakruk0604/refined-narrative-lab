import { Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import logoUrl from "@/assets/logo.svg";
import { CtaButton, siteGutter } from "@/components/framer-section";
import { useSiteNav } from "@/components/nav-context";
import { cn } from "@/lib/utils";

export function MobileMenu({ light = false }: { light?: boolean }) {
  const items = useSiteNav();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const html = document.documentElement;
    const scrollbarW = window.innerWidth - html.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbarW > 0) body.style.paddingRight = `${scrollbarW}px`;
    // Hide the site header to avoid a backdrop-blur flicker — delayed just
    // long enough (matches the trigger icon's own transition below) for the
    // hamburger-to-X morph to actually finish playing first, instead of the
    // header vanishing mid-animation.
    const header = document.querySelector<HTMLElement>("body > div header");
    const hideTimer = window.setTimeout(() => {
      if (header) header.style.visibility = "hidden";
    }, 280);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(hideTimer);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      if (header) header.style.visibility = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Mount first (invisible), then trigger transition on next frame. Opening
  // holds off starting the clip-path reveal for one beat — the dialog's own
  // background is opaque, and its top edge is never clipped (only the
  // bottom inset animates), so the instant the reveal starts it immediately
  // covers the real header underneath. Without this delay the trigger's
  // hamburger-to-X morph (see the trigger button below) never gets a chance
  // to actually play before being papered over.
  useEffect(() => {
    if (open) {
      setMounted(true);
      const t = setTimeout(() => setVisible(true), 260);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 500);
      return () => clearTimeout(t);
    }
  }, [open]);

  const dialog = mounted ? (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      data-open={visible}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        background: "var(--rm-surface)",
        overflowY: "auto",
        clipPath: visible ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
        transition: visible
          ? "clip-path 520ms cubic-bezier(0.22,1,0.36,1)"
          : "clip-path 320ms cubic-bezier(0.4,0,1,1)",
      }}
    >
      {/* ── Header bar ─────────────────────────────────────── */}
      {/* No pill/backdrop, no rounded corners — a plain row using the exact
          same siteGutter + pt-5/pb-5 + row alignment as the real sticky
          header, so the logo sits at the identical pixel position in both.
          It used to be an inset rounded capsule with its own margin, which
          both read as a stray floating object and made the logo visibly
          jump between the closed header and the open menu. */}
      <div className={cn(siteGutter, "pt-5 pb-5 shrink-0")}>
        <div className="h-14 flex items-center justify-between pl-4 pr-3 md:pl-5 md:pr-1">
          <Link to="/" onClick={close} aria-label="Real Media — home" className="leading-none">
            <img src={logoUrl} alt="Real Media" width={90} height={65} className="h-8 w-auto" />
          </Link>

          {/* Same button chrome as the closed-state trigger (border + faint
              fill + pill shape) and the same icon-then-label order — it used
              to be bare text with no button-like frame at all. */}
          <button
            type="button"
            onClick={close}
            aria-label="Close navigation"
            className="rm-touch inline-flex items-center gap-2 rm-type-tag text-[var(--rm-text-muted)] hover:text-white px-4 rounded-full border border-[var(--rm-border-soft)] transition-colors duration-200"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <span className="relative w-[14px] h-[14px]">
              <span
                className="absolute inset-0 m-auto h-px bg-current"
                style={{ width: "14px", transform: "rotate(45deg)" }}
              />
              <span
                className="absolute inset-0 m-auto h-px bg-current"
                style={{ width: "14px", transform: "rotate(-45deg)" }}
              />
            </span>
            Close
          </button>
        </div>
      </div>

      {/* ── Nav list ───────────────────────────────────────── */}
      <nav aria-label="Primary navigation" className="flex-1 px-5 pt-6 pb-2">
        <ul className="divide-y divide-white/[0.07]">
          {items.map((item, i) => (
            <li
              key={item.label}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(18px)",
                transition: `opacity 480ms cubic-bezier(0.22,1,0.36,1) ${80 + i * 60}ms, transform 480ms cubic-bezier(0.22,1,0.36,1) ${80 + i * 60}ms`,
              }}
            >
              {item.to ? (
                <Link
                  to={item.to}
                  onClick={close}
                  className="group flex items-center justify-between gap-4 py-[18px]"
                >
                  {/* Index numeral */}
                  <span
                    className="shrink-0 tabular-nums rm-type-tag text-[var(--rm-text-ghost)] select-none"
                    style={{ width: "2ch" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Label + sub */}
                  <span className="flex-1 flex flex-col gap-0.5 min-w-0">
                    <span
                      className="text-[var(--rm-ink)] group-hover:text-white font-medium leading-[1] tracking-[-0.025em] transition-colors duration-200"
                      style={{ fontSize: "clamp(2rem, 9vw, 2.8rem)" }}
                    >
                      {item.label}
                    </span>
                    <span className="rm-type-meta normal-case tracking-normal text-[var(--rm-text-ghost)]">
                      {item.sub ?? ""}
                    </span>
                  </span>

                  {/* Arrow */}
                  <span
                    aria-hidden
                    className="shrink-0 text-rm-accent rm-type-subsection leading-none opacity-0 group-hover:opacity-100 translate-x-[-6px] group-hover:translate-x-0"
                    style={{ transition: "opacity 180ms ease-out, transform 180ms ease-out" }}
                  >
                    →
                  </span>
                </Link>
              ) : (
                <a
                  href={item.href}
                  onClick={close}
                  className="group flex items-center justify-between gap-4 py-[18px]"
                >
                  <span
                    className="shrink-0 tabular-nums rm-type-tag text-[var(--rm-text-ghost)] select-none"
                    style={{ width: "2ch" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 flex flex-col gap-0.5 min-w-0">
                    <span
                      className="text-[var(--rm-ink)] group-hover:text-white font-medium leading-[1] tracking-[-0.025em] transition-colors duration-200"
                      style={{ fontSize: "clamp(2rem, 9vw, 2.8rem)" }}
                    >
                      {item.label}
                    </span>
                    {item.sub ? (
                      <span className="rm-type-meta normal-case tracking-normal text-[var(--rm-text-ghost)]">
                        {item.sub}
                      </span>
                    ) : null}
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 text-rm-accent rm-type-subsection leading-none opacity-0 group-hover:opacity-100 translate-x-[-6px] group-hover:translate-x-0"
                    style={{ transition: "opacity 180ms ease-out, transform 180ms ease-out" }}
                  >
                    →
                  </span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div
        className="px-5 pb-8 pt-6 shrink-0 border-t border-white/[0.07] space-y-6"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition:
            "opacity 520ms cubic-bezier(0.22,1,0.36,1) 400ms, transform 520ms cubic-bezier(0.22,1,0.36,1) 400ms",
        }}
      >
        {/* Primary CTA */}
        <CtaButton to="/audit" variant="primary" className="w-full justify-between" onClick={close}>
          Book an audit
        </CtaButton>

        {/* Meta row */}
        <div className="grid grid-cols-2 gap-4 rm-type-body text-[var(--rm-text-faint)]">
          <div className="space-y-1">
            <div className="rm-type-tag text-[var(--rm-text-ghost)]">Write</div>
            <a
              href="mailto:info@realmedia.ink"
              onClick={close}
              className="block text-[var(--rm-text-muted)] hover:text-white transition-colors normal-case tracking-normal"
            >
              info@realmedia.ink
            </a>
          </div>
          <div className="space-y-1">
            <div className="rm-type-tag text-[var(--rm-text-ghost)]">Located</div>
            <div className="text-[var(--rm-text-muted)] normal-case tracking-normal">
              Warsaw · EU · MENA
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rm-type-tag text-[var(--rm-text-ghost)]">
          <span>© R—M 2026</span>
          <span>Vol. 01</span>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* ── Trigger button ───────────────────────────────── */}
      {/* Explicit light/dark classes instead of the shared --rm-text-muted
          custom property — that property is itself redefined under a
          [data-theme="light"] scope on the header, and Safari doesn't
          reliably recompute values inherited that way when the attribute
          changes on an already-mounted ancestor, so the button stayed the
          dark-theme color after scrolling onto a light section there. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
        className={cn(
          "md:hidden rm-touch inline-flex items-center gap-2 rm-type-tag px-4 rounded-full border transition-colors duration-200",
          light
            ? "text-[var(--rm-light-muted)] hover:text-[var(--rm-light-ink)] border-[var(--rm-light-border)]"
            : "text-[var(--rm-text-muted)] hover:text-white border-[var(--rm-border-soft)]",
        )}
        style={{ background: light ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)" }}
      >
        {/* Hamburger that morphs into an X on click — both bars ease to the
            vertical center and rotate to ±45°, instead of just swapping for
            a static X once the header hides. The header-hide delay above
            gives this ~280ms transition room to actually finish playing. */}
        <span className="relative w-[15px] h-[14px]" aria-hidden="true">
          <span
            className="absolute left-0 h-px bg-current transition-all duration-[240ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={
              open
                ? { width: "15px", top: "50%", transform: "translateY(-50%) rotate(45deg)" }
                : { width: "15px", top: "3px", transform: "translateY(0) rotate(0deg)" }
            }
          />
          <span
            className="absolute left-0 h-px bg-current transition-all duration-[240ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={
              open
                ? { width: "15px", top: "50%", transform: "translateY(-50%) rotate(-45deg)" }
                : { width: "10px", top: "10px", transform: "translateY(0) rotate(0deg)" }
            }
          />
        </span>
        Menu
      </button>

      {typeof document !== "undefined" && createPortal(dialog, document.body)}
    </>
  );
}
