import { Link } from "@tanstack/react-router";
import { Sms, type Icon as AppIcon } from "iconsax-react";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import logoUrl from "@/assets/logo.svg";
import {
  BtnArrow,
  DropdownChevron,
  FlipLabel,
  btnOutlineOnDark,
  btnOutlineOnLight,
  btnPrimarySm,
  chromeLightBorder,
  chromeLightInk,
  chromeLightMuted,
  siteGutter,
  sectionInner,
  siteChromeBand,
  subsectionTitle,
  textFaint,
  textGhost,
  textMeta,
  textNav,
  underlineHoverLink,
} from "@/components/framer-section";
import { MobileMenu } from "@/components/mobile-menu";
import { useSiteNav } from "@/components/nav-context";
import { triggerPageTransition } from "@/components/page-transition";
import { SERVICE_ICONS } from "@/components/services-disciplines-section";
import type { NavItem } from "@/lib/payload/navigation";
import { servicesList } from "@/lib/services";
import { cn } from "@/lib/utils";

/**
 * .rm-type-nav's exact font-size/line-height (12px, 14px past 1920px) as
 * Tailwind utilities rather than the class itself. btnBase now bakes its own
 * utility-level font-size in, and Tailwind's utilities layer always outranks
 * a plain CSS class like .rm-type-nav regardless of source order — applying
 * textNav on top of a button class no longer overrides it. Reasserting the
 * same values as utilities keeps the header button's text pinned to the nav
 * links' size at every breakpoint despite that.
 */
const navFontSize =
  "text-[length:var(--rm-font-xs)] leading-[var(--rm-line-xs)] min-[1920px]:text-[14px] min-[1920px]:leading-[1.3]";
/**
 * Dropdown row label: subsectionTitle's weight/letter-spacing, sized down
 * flat (same on every device) — matching the footer's own size read too
 * large for a compact dropdown once tried.
 */
const dropdownRowText = cn(subsectionTitle, "text-[14px] leading-[1.3]");

/** Samples whatever is scrolled directly beneath the header and reports its
 * theme — lets header content invert (white on dark, ink on light) without a
 * background pill, mirroring how the custom cursor already inverts. */
function useHeaderTheme(initial: "light" | "dark") {
  const [theme, setTheme] = useState(initial);
  const headerRef = useRef<HTMLElement>(null);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    const check = () => {
      frame.current = undefined;
      const header = headerRef.current;
      if (!header) return;
      const rect = header.getBoundingClientRect();
      const el = document.elementFromPoint(window.innerWidth / 2, rect.bottom + 2);
      // A dark decorative surface (e.g. the glow orb) can sit inside an
      // otherwise light-themed section — check for it before falling back
      // to the section-level class, or header text can go invisible against it.
      const isDarkSurface = !!el?.closest('[data-header-surface="dark"]');
      const isLight = !isDarkSurface && !!el?.closest(".rm-section-light");
      setTheme(isLight ? "light" : "dark");
    };
    const onScroll = () => {
      if (frame.current !== undefined) return;
      frame.current = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    };
  }, []);

  return { theme, headerRef };
}

/** Icon-safe: plain color hover — use for social icons. */
function chromeLink(light: boolean) {
  return cn(
    "transition-colors duration-[300ms] ease-[cubic-bezier(0.625,0.05,0,1)]",
    light
      ? "text-[var(--rm-light-muted)] hover:text-[var(--rm-light-ink)]"
      : "text-[var(--rm-text-muted)] hover:text-white",
  );
}

/** Text links only — adds the underline-retract hover on top of chromeLink's color shift. */
function chromeTextLink(light: boolean) {
  return cn(chromeLink(light), underlineHoverLink);
}

/**
 * "Services" header nav item — same trigger link as every other nav item,
 * plus a hover-opened dropdown listing every service. State-driven (not bare
 * CSS group-hover) with a short close delay: the panel sits a few pixels
 * below the link, and a pure-CSS :hover chain loses the ancestor's hover the
 * instant the pointer crosses that gap, snapping the menu shut before it can
 * be reached. The delay absorbs that crossing; onFocus/onBlur give keyboard
 * users the same behavior tabbing through the link.
 */
function ServicesNavItem({ item, light }: { item: NavItem; light: boolean }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  const openNow = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 150);
  };
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <li
      className="relative shrink-0"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
      onFocus={openNow}
      onBlur={scheduleClose}
    >
      <Link
        to={item.to!}
        onClick={(e) => {
          e.preventDefault();
          triggerPageTransition(item.to!);
        }}
        aria-label={item.label}
        aria-expanded={open}
        className={cn(
          "group relative inline-flex items-center gap-1 whitespace-nowrap px-0.5 py-1",
          light
            ? cn(chromeLightMuted, "hover:text-[var(--rm-light-ink)]")
            : "text-[var(--rm-text-muted)] hover:text-white",
        )}
        activeProps={{
          className: light ? "nav-active !text-[var(--rm-light-ink)]" : "nav-active !text-white",
        }}
      >
        <FlipLabel text={item.label} />
        <DropdownChevron open={open} />
        <span
          aria-hidden
          className={cn(
            "nav-dot pointer-events-none absolute -bottom-0.5 left-1/2 block h-[3px] w-[3px] -translate-x-1/2 scale-0 rounded-full opacity-0 transition-[opacity,transform] duration-200",
            light ? "bg-[var(--rm-light-accent)]" : "bg-rm-accent",
          )}
        />
      </Link>

      <div
        // No will-change here — a value that would itself create a stacking
        // context (opacity, translate, transform...) forces one preemptively
        // per spec, and that new context becomes the backdrop-blur panel's
        // "backdrop root" — a nested one that doesn't include the actual
        // page content behind it, so the blur below sampled nothing. Plain
        // opacity/translate transitions here are cheap enough without it.
        className={cn(
          // transition-[opacity,transform] doesn't animate translate-y — the
          // "transform" property and the "translate" property are separate
          // in modern CSS, and Tailwind's arbitrary transition-[...] list
          // only watches exactly what's named. Listing "translate" (not
          // "transform") is what actually makes the slide animate instead
          // of snapping to its end position while only opacity fades — that
          // snap is what read as the panel "jumping" on close.
          "absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.625,0.05,0,1)]",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        {/* Scale is what made the close transition stutter (re-rasterizing
            every glyph each frame at a new size) — this only ever slides on
            translate-y now, so backdrop-blur is safe again. */}
        <div className="w-64 overflow-hidden rounded-2xl border border-[var(--rm-border-strong)] bg-[#0a0a0b]/85 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          {servicesList.map((service, i) => {
            const Icon = SERVICE_ICONS[service.slug];
            return (
              <Link
                key={service.slug}
                to="/services/$slug"
                params={{ slug: service.slug }}
                aria-label={service.shortName}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  triggerPageTransition(`/services/${service.slug}`);
                }}
                className={cn(
                  // Bare `group` (not just group/row) — FlipLabel's own
                  // hover animation is hardcoded to plain group-hover:, so
                  // without this the text never flipped on hover at all.
                  "group group/row flex items-center justify-between gap-3 px-4 py-3 text-[var(--rm-ink)]",
                  i > 0 && "border-t border-[var(--rm-border-soft)]",
                )}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <SlideDropdownIcon icon={Icon} />
                  <span className={dropdownRowText}>
                    <FlipLabel text={service.shortName} />
                  </span>
                </span>
                <DropdownRevealArrow />
              </Link>
            );
          })}
        </div>
      </div>
    </li>
  );
}

/** Same duplicate-stack-and-slide trick as the footer/social/CTA email icon
 * flip (two literal copies, translate the pair) — tried the drop-shadow
 * duplicate BtnArrow uses first, generalized to an arbitrary Icon component,
 * but it silently rendered nothing on hover for this Bold-filled glyph; this
 * is the mechanism already proven to work elsewhere on the site. */
function SlideDropdownIcon({ icon: Icon }: { icon: AppIcon }) {
  return (
    <span className="relative inline-block h-4 w-4 shrink-0 overflow-hidden" aria-hidden="true">
      <span className="flex flex-col transition-transform duration-[600ms] ease-[cubic-bezier(0.625,0.05,0,1)] group-hover/row:-translate-y-4 motion-reduce:group-hover/row:translate-y-0">
        <Icon size={16} variant="Bold" color="var(--rm-text-muted)" className="shrink-0" />
        <Icon size={16} variant="Bold" color="var(--rm-text-muted)" className="shrink-0" />
      </span>
    </span>
  );
}

/** Invisible at rest — fades and nudges in from the left only once a row is
 * hovered, sitting flush with the row's own right padding. */
function DropdownRevealArrow() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 17 17"
      fill="none"
      // transition-[opacity,transform] (not translate) left this snapping
      // into place instead of sliding — same root cause as the panel above.
      className="h-4 w-4 shrink-0 will-change-[opacity,translate] -translate-x-1 text-[var(--rm-ink)] opacity-0 transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover/row:translate-x-0 group-hover/row:opacity-100"
    >
      <path
        d="M3 8.5h11M9.5 4l4.5 4.5L9.5 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SiteHeader({
  variant = "dark",
}: {
  variant?: "light" | "dark";
  /** @deprecated header theme now follows whatever section is scrolled beneath it */
  overlay?: boolean;
  /** @deprecated header theme now follows whatever section is scrolled beneath it */
  solid?: boolean;
}) {
  const { theme, headerRef } = useHeaderTheme(variant);
  const light = theme === "light";
  const siteNav = useSiteNav();

  return (
    <header
      ref={headerRef}
      data-theme={theme}
      // will-change-transform forces the sticky header onto its own stable GPU
      // layer — without it, Chrome can reuse a stale composited backdrop behind
      // this transparent header during fast scroll past GPU-heavy siblings
      // (e.g. the Disciplines orb), flashing whatever was there a frame ago.
      className={cn("sticky top-0 z-50 pt-5 pb-5 will-change-transform", siteGutter)}
    >
      {/* A soft blur + faint scrim (tinted to match whatever theme is detected
          beneath, same signal that already flips the nav's own text color)
          sits behind the logo/nav at all times. Fully transparent content
          scrolling underneath a sticky header will eventually land directly
          behind the logo at some scroll position on some viewport — happened
          on the testimonial name, the engagement card's metric label, and the
          cases carousel's giant display text — so this isn't a per-section
          patch, it's the one place that actually prevents it everywhere.
          Masked as a top-to-bottom linear fade — full strength at the header's
          top edge, gone by its bottom edge — so it reads as a soft light
          falloff instead of a hard-edged glass panel dropped onto the page. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 backdrop-blur-2xl",
          light ? "bg-[var(--rm-light-surface)]/70" : "bg-black/45",
        )}
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
        }}
      />
      <nav className="relative z-[1] mx-auto flex h-14 w-full max-w-[var(--rm-grid-max)] items-center justify-between pl-4 pr-3 md:py-1 md:pl-5 md:pr-1">
        <div className="flex shrink-0 items-center">
          <Link to="/" aria-label="Real Media — home" className="shrink-0">
            <img
              src={logoUrl}
              alt="Real Media"
              width={90}
              height={65}
              className={cn("block h-8 w-auto", light && "[filter:invert(1)]")}
            />
          </Link>
        </div>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
          <ul className={cn("flex items-center gap-5 lg:gap-6", textNav)}>
            {siteNav.map((n) =>
              n.label === "Services" && n.to ? (
                <ServicesNavItem key={n.label} item={n} light={light} />
              ) : (
              <li key={n.label} className="shrink-0">
                {n.to ? (
                  <Link
                    to={n.to}
                    onClick={(e) => {
                      e.preventDefault();
                      triggerPageTransition(n.to!);
                    }}
                    aria-label={n.label}
                    className={cn(
                      "group relative inline-flex items-center whitespace-nowrap px-0.5 py-1",
                      light
                        ? cn(chromeLightMuted, "hover:text-[var(--rm-light-ink)]")
                        : "text-[var(--rm-text-muted)] hover:text-white",
                    )}
                    activeProps={{
                      className: light
                        ? "nav-active !text-[var(--rm-light-ink)]"
                        : "nav-active !text-white",
                    }}
                  >
                    <FlipLabel text={n.label} />
                    <span
                      aria-hidden
                      className={cn(
                        "nav-dot pointer-events-none absolute -bottom-0.5 left-1/2 block h-[3px] w-[3px] -translate-x-1/2 scale-0 rounded-full opacity-0 transition-[opacity,transform] duration-200",
                        light ? "bg-[var(--rm-light-accent)]" : "bg-rm-accent",
                      )}
                    />
                  </Link>
                ) : (
                  <a
                    href={n.href}
                    aria-label={n.label}
                    className={cn(chromeLink(light), "group relative whitespace-nowrap px-0.5 py-1")}
                  >
                    <FlipLabel text={n.label} />
                  </a>
                )}
              </li>
              ),
            )}
          </ul>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 md:gap-0">
          <Link
            to="/audit"
            onClick={(e) => {
              e.preventDefault();
              triggerPageTransition("/audit");
            }}
            className={cn(
              btnPrimarySm,
              // navFontSize reasserts .rm-type-nav's exact sizes as utilities
              // (see comment on its declaration) — the header button used to
              // run larger than the nav links right next to it. min-h-[38px]
              // overrides rm-touch's 44px floor — this button sits in a
              // short 56px header row, where 44px reads as taller than the
              // rest of the chrome around it.
              navFontSize,
              "py-2.5 min-h-[38px]",
              light && "bg-[var(--rm-light-ink)] text-white hover:bg-black",
              "group hidden shrink-0 gap-2 md:inline-flex",
            )}
            aria-label="Get audit"
          >
            <FlipLabel text="Get audit" />
            <BtnArrow />
          </Link>
          <MobileMenu light={light} />
        </div>
      </nav>
    </header>
  );
}

const FOOTER_SOCIAL_LINKS = [
  { label: "LinkedIn", url: "https://www.linkedin.com/company/real-media-corp/" },
  { label: "Instagram", url: "https://www.instagram.com/realmedia.corp" },
  { label: "Dribbble", url: "https://dribbble.com/realmedia26" },
];

/** One footer link column — title + a plain list of text links, internal or external. */
function FooterColumn({
  title,
  items,
  light,
}: {
  title: string;
  items: { key: string; label: ReactNode; to?: string; href?: string }[];
  light: boolean;
}) {
  return (
    <div>
      <div className={cn("mb-6", textMeta, light ? chromeLightMuted : textGhost)}>{title}</div>
      <ul
        className={cn(
          // rm-type-subsection is 26px — sized for the About section's
          // marketing-agency rows, not a dense footer link list. Below
          // 1920px that read as oversized; ≥1920px keeps the original size.
          "space-y-4 rm-type-subsection max-[1919px]:text-[length:var(--rm-font-base)] max-[1919px]:leading-[var(--rm-line-base)]",
          light ? chromeLightMuted : "text-[var(--rm-text-body)]",
        )}
      >
        {items.map((item) => (
          <li key={item.key}>
            {item.to ? (
              <Link to={item.to} className={chromeTextLink(light)}>
                {item.label}
              </Link>
            ) : (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={chromeTextLink(light)}
              >
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Live HH:MM in Warsaw. Renders nothing until mounted — the server and the
 * viewer's clock can't agree on "now", so hydration starts blank and this
 * fills in client-side to avoid a mismatch flash. */
function WarsawTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Warsaw",
      hour: "2-digit",
      minute: "2-digit",
    });
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000 * 15);
    return () => window.clearInterval(id);
  }, []);

  if (!time) return null;
  return <>Warsaw time — {time}</>;
}

function ScrollToTopButton({ light }: { light: boolean }) {
  const lenis = useLenis();
  return (
    <button
      type="button"
      onClick={() => {
        lenis?.scrollTo(0, { duration: 1.1 });
        window.scrollTo({ top: 0, behavior: lenis ? "auto" : "smooth" });
      }}
      aria-label="Back to top"
      className={cn(light ? btnOutlineOnLight : btnOutlineOnDark, "group shrink-0 gap-2")}
    >
      <FlipLabel text="Back to top" />
      <span className="inline-block -rotate-90">
        <BtnArrow />
      </span>
    </button>
  );
}

export function SiteFooter({ variant = "dark" }: { variant?: "light" | "dark" }) {
  const light = variant === "light";

  const servicesItems = servicesList.map((s) => ({
    key: s.slug,
    label: s.shortName,
    to: `/services/${s.slug}` as const,
  }));
  const productsItems = [
    { key: "sprint", label: "Sprint", to: "/products" as const },
    { key: "marathon", label: "Marathon", to: "/products" as const },
  ];
  const agencyItems = [
    { key: "about", label: "About", to: "/about" as const },
    { key: "cases", label: "Case studies", to: "/cases" as const },
    { key: "blog", label: "Blog", to: "/blog" as const },
    { key: "contact", label: "Contact", to: "/contact" as const },
    {
      key: "audit",
      label: (
        <>
          <span className="text-[#B85821]">Free</span> audit
        </>
      ),
      to: "/audit" as const,
    },
  ];
  const socialItems = FOOTER_SOCIAL_LINKS.map((s) => ({ key: s.label, label: s.label, href: s.url }));

  return (
    <footer
      className={cn(
        siteChromeBand,
        "bg-[#0a0a0b] pb-8 pt-12",
        light && cn("border-t", chromeLightBorder, chromeLightInk),
      )}
    >
      <div className={sectionInner}>
        <div className="flex flex-col gap-8 border-b border-[var(--rm-border-soft)] pb-10 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-6">
            <img
              src={logoUrl}
              alt="Real Media"
              width={90}
              height={65}
              className={cn("block h-10 w-auto self-start", light && "[filter:invert(1)]")}
            />
            <p className={cn("rm-type-body max-w-[32ch]", light ? chromeLightMuted : "text-white")}>
              Strategic marketing engine for competitive B2B markets.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <p className={cn("rm-type-subsection m-0", light ? chromeLightInk : "text-white")}>
              Get in touch
            </p>
            <a
              href="mailto:info@realmedia.ink"
              className={cn(
                // gap-3 matches the same email link in the CTA form section
                // (cta-contact-form.tsx) — was gap-5 here, a wider gap than
                // that reference for no reason.
                "group inline-flex rm-touch w-fit shrink-0 items-center gap-3 rm-type-subsection",
                light ? chromeLightInk : "text-white",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                  light
                    ? cn(chromeLightBorder, chromeLightMuted)
                    : "border-white/60 text-[var(--rm-text-muted)] group-hover:border-white",
                )}
              >
                <span className="relative inline-block size-[18px] overflow-hidden">
                  <span className="flex flex-col transition-transform duration-[600ms] ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:-translate-y-[18px] motion-reduce:group-hover:translate-y-0">
                    <Sms
                      className="size-[18px] shrink-0"
                      variant="Bold"
                      color="currentColor"
                      aria-hidden
                    />
                    <Sms
                      className="size-[18px] shrink-0"
                      variant="Bold"
                      color="currentColor"
                      aria-hidden
                    />
                  </span>
                </span>
              </span>
              <span
                className={cn(
                  "relative inline-block after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-current after:content-[''] after:transition-transform after:duration-[500ms] after:ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:after:scale-x-100",
                )}
              >
                info@realmedia.ink
              </span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-12 md:grid-cols-5">
          <FooterColumn title="Services" items={servicesItems} light={light} />
          <FooterColumn title="Products" items={productsItems} light={light} />
          <FooterColumn title="Agency" items={agencyItems} light={light} />
          <FooterColumn title="Social" items={socialItems} light={light} />

          <div>
            <div className={cn("mb-6", textMeta, light ? chromeLightMuted : textGhost)}>Located</div>
            <div
              className={cn(
                // Same below-1920 shrink as the page-name link columns above.
                "rm-type-subsection max-[1919px]:text-[length:var(--rm-font-base)] max-[1919px]:leading-[var(--rm-line-base)]",
                light ? chromeLightMuted : "text-[var(--rm-text-body)]",
              )}
            >
              Warsaw — EU — MENA
            </div>
            <div className={cn("rm-type-body mt-2", light ? chromeLightMuted : textFaint)}>
              Operating across CET / GST timezones for partners in Fintech · AI SaaS · Cybersecurity ·
              iGaming
            </div>
            <div className={cn("rm-type-body mt-2", light ? chromeLightMuted : textFaint)}>
              <WarsawTime />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-[var(--rm-border-soft)] pt-6 md:grid md:grid-cols-3 md:gap-6">
          <span
            className={cn(
              "rm-type-body text-sm md:justify-self-start",
              light ? chromeLightMuted : "text-[var(--rm-text-body)]",
            )}
          >
            © R-M 2026
          </span>

          <a
            href="/privacy"
            className={cn("rm-type-body text-sm md:justify-self-center", chromeTextLink(light))}
          >
            Privacy Policy
          </a>

          <div className="md:justify-self-end">
            <ScrollToTopButton light={light} />
          </div>
        </div>
      </div>
    </footer>
  );
}
