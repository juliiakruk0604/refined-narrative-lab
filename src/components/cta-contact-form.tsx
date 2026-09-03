import { Dribbble, Instagram, Sms, type Icon as AppIcon } from "iconsax-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import ctaSectionGlow from "@/assets/cta-section-glow.svg";
import {
  BtnArrow,
  DURATION_ENTER,
  DropdownChevron,
  EASE_ENTER,
  FlipLabel,
  FramerTag,
  bodyCopy,
  btnPrimaryOnLight,
  hoverColorTransform,
  sectionGap,
  sectionHeadline,
  sectionInner,
  sectionShell,
  sectionTagLeadStack,
  textFaint,
  textSubtle,
} from "@/components/framer-section";
import { afterHubSpotFormCapture } from "@/components/hubspot-tracking";
import { TRIGGER_VIEWPORT_MARGIN } from "@/components/motion-bits";
import { LinkedinIcon } from "@/components/social-icons";
import { COUNTRIES, detectDefaultCountry, flagUrl, type Country } from "@/lib/countries";
import type { PageContactContent, PageCtaContent } from "@/lib/page-content/types";
import { servicesList } from "@/lib/services";
import { cn } from "@/lib/utils";

const socialIconMap: Record<string, AppIcon> = {
  Linkedin: LinkedinIcon,
  Instagram,
  Dribbble,
};

/** mdx.so's own "Let's talk" card shadow (inspected live: rgba(16,24,32,.06) 0 10px 36px
 * + a 1px rgba(230,236,242,.08) edge) — lifts the card off the section instead of blending in. */
const CARD_SHADOW = "0 10px 36px rgba(16,24,32,0.06), 0 0 0 1px rgba(230,236,242,0.08)";

const INTEREST_OPTIONS = [
  { slug: "free-audit", label: "Free audit" },
  ...servicesList.map((s) => ({ slug: s.slug, label: s.shortName })),
];

/**
 * Form field text (inputs, textarea, interest pills) — a previous pass
 * dropped all three flat to 12px (rm-font-xs) at every width, which client
 * feedback flagged as too small below 1920px and unnecessarily changed at
 * 1920px+, where nothing was wrong. 14px below 1920, native rm-type-body
 * (18px) restored at 1920px+.
 */
const formFieldText =
  "text-[14px] leading-[1.4] min-[1920px]:text-[length:var(--rm-font-base)] min-[1920px]:leading-[var(--rm-line-base)]";

/** Ellipse-fill hover grown from wherever the pointer entered — same
 * interaction as the Disciplines section's service pills (Section 5). */
function InterestPill({
  label,
  active,
  onClick,
}: {
  label: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  const fillRef = useRef<HTMLSpanElement>(null);

  const onPointerEnter = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    if (fillRef.current) fillRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      aria-pressed={active}
      className={cn(
        // min-h-[38px] only bites below 1920px, where formFieldText's 14px/
        // 1.4 line-height keeps the natural content height under it; at
        // 1920px+ the restored 18px/28px line-height alone exceeds 38px, so
        // the pill naturally sits taller there — matching how it always did.
        "group relative rm-touch inline-flex min-h-[38px] items-center overflow-hidden whitespace-nowrap rounded-full border px-4 py-2 rm-type-body transition-colors duration-[700ms] ease-[cubic-bezier(0.625,0.05,0,1)]",
        formFieldText,
        active ? "border-[var(--rm-ink)]" : "border-[var(--rm-border-strong)] hover:border-[var(--rm-ink)]",
      )}
    >
      <span
        ref={fillRef}
        aria-hidden
        className={cn(
          "absolute -inset-px rounded-full bg-[var(--rm-ink)] transition-transform duration-[700ms] ease-[cubic-bezier(0.625,0.05,0,1)]",
          active ? "scale-100" : "scale-0 group-hover:scale-100",
        )}
        style={{ transformOrigin: "center" }}
      />
      <span
        className={cn(
          "relative z-[1] transition-colors duration-[700ms] ease-[cubic-bezier(0.625,0.05,0,1)]",
          active ? "text-[var(--rm-light-surface)]" : "text-[var(--rm-ink)] group-hover:text-white",
        )}
      >
        {label}
      </span>
    </button>
  );
}

type CtaContactFormProps = {
  cta?: PageCtaContent;
  contact?: PageContactContent;
};

export function CtaContactForm({ cta, contact }: CtaContactFormProps) {
  const [sent, setSent] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const reduce = Boolean(useReducedMotion());

  const clearError = (field: string) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = "Please enter your name";
    if (!email) nextErrors.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address";
    }
    if (!message) nextErrors.message = "Tell us a little about your project";
    if (phone && phone.replace(/\D/g, "").length < 6) {
      nextErrors.phone = "Enter a valid phone number";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).some((key) => nextErrors[key])) return;

    afterHubSpotFormCapture(() => setSent(true));
  };

  // One shared entrance signal for the whole card, gated with the sitewide
  // trigger margin. The card is tall (160px top/bottom padding, socials
  // sitting 100px below the heading, the form column further still), so
  // checking each block's own position independently — the old .reveal
  // approach — meant the user had to keep scrolling for each piece to reach
  // the trigger line in turn: a scroll-position-dependent staccato instead
  // of one cascade that plays once the card arrives.
  const cascadeRef = useRef<HTMLDivElement>(null);
  const entered = useInView(cascadeRef, {
    once: true,
    amount: 0.15,
    margin: TRIGGER_VIEWPORT_MARGIN,
  });
  const cascade = (index: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 16 } as const),
    animate: reduce || entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: DURATION_ENTER, ease: EASE_ENTER, delay: index * 0.13 },
  });

  const socialLinks =
    contact?.socialLinks?.map((item) => ({
      ...item,
      icon: socialIconMap[item.label] ?? LinkedinIcon,
    })) ?? [];

  const submitLabel = (contact?.submitLabel ?? "Send message →").replace(/\s*→$/, "");
  const submitSuccessLabel = contact?.submitSuccessLabel ?? "Message sent — we'll reply soon";

  const titleText = cta?.title ?? "Tell us what's slowing you down. We'll clear the track.";
  // Split once after the first ". " so the first sentence can be muted —
  // same subtle-then-full-color pattern used on other section headlines —
  // wrapping is otherwise left to flow naturally, no forced line break.
  const titleSplit = titleText.match(/^(.*?\.)\s+(.*)$/);

  return (
    <section
      className={cn(
        sectionShell,
        "relative overflow-hidden rm-section-light lg:flex lg:min-h-screen lg:flex-col lg:pt-[calc(var(--rm-header-offset)+2.5rem)] lg:pb-10",
      )}
    >
      <img
        src={ctaSectionGlow}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-16 md:-bottom-20 lg:-bottom-10 z-0 h-full w-full object-cover object-bottom opacity-90"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 45%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 45%)",
        }}
      />

      <div className={cn(sectionInner, "relative z-[1] w-full lg:flex lg:flex-1 lg:flex-col")}>
        <div
          ref={cascadeRef}
          className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/25 p-8 backdrop-blur-2xl backdrop-saturate-150 md:rounded-[2.5rem] md:p-16 lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:py-[160px]"
          style={{ boxShadow: CARD_SHADOW }}
        >
          <div className={cn("relative grid grid-cols-1 lg:grid-cols-12 lg:items-center", sectionGap)}>
            <div className="flex flex-col lg:col-span-6">
              <div className={sectionTagLeadStack}>
                <motion.div {...cascade(0)}>
                  <FramerTag className="w-fit">
                    {contact?.eyebrow ?? "The conversation starts here"}
                  </FramerTag>
                </motion.div>
                <motion.div {...cascade(1)} className="flex w-full flex-col gap-4">
                  {/* h2-scale (sectionHeadline) below 1920px — hero scale
                      (rm-title-hero-lead's own --rm-font-4xl/--rm-line-4xl,
                      referenced directly since that token is itself a fluid
                      clamp with no single fixed px value to restore to) at
                      1920px+, where it isn't too big. */}
                  <h2
                    className={cn(
                      sectionHeadline,
                      "m-0 min-[1920px]:text-[length:var(--rm-font-4xl)] min-[1920px]:leading-[var(--rm-line-4xl)] min-[1920px]:tracking-[-0.05em]",
                    )}
                  >
                    {titleSplit ? (
                      <>
                        <span className={textSubtle}>{titleSplit[1]}</span> {titleSplit[2]}
                      </>
                    ) : (
                      titleText
                    )}
                  </h2>
                  {cta?.titleAccent ? (
                    <p className={cn(bodyCopy, "m-0")}>{cta.titleAccent}</p>
                  ) : null}
                </motion.div>
              </div>

              <motion.div {...cascade(2)} className="mt-[100px] flex flex-col gap-8">
                {socialLinks.length ? (
                  <div className="flex flex-wrap items-center gap-3">
                    {socialLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.label}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={item.label}
                          className={cn(
                            "group inline-flex rm-touch items-center justify-center size-11 rounded-full border border-[var(--rm-border-strong)] text-[var(--rm-text-muted)] hover:border-[var(--rm-ink)] hover:text-[var(--rm-ink)] motion-safe:hover:-translate-y-0.5",
                            hoverColorTransform,
                          )}
                        >
                          <span className="relative inline-block size-[18px] overflow-hidden">
                            <span className="flex flex-col transition-transform duration-[600ms] ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:-translate-y-[18px] motion-reduce:group-hover:translate-y-0">
                              <Icon
                                className="size-[18px] shrink-0"
                                variant="Bold"
                                color="currentColor"
                                aria-hidden
                              />
                              <Icon
                                className="size-[18px] shrink-0"
                                variant="Bold"
                                color="currentColor"
                                aria-hidden
                              />
                            </span>
                          </span>
                        </a>
                      );
                    })}
                  </div>
                ) : null}

                <a
                  href={`mailto:${contact?.email ?? "info@realmedia.ink"}`}
                  className="group inline-flex rm-touch items-center gap-3 rm-type-subsection text-[var(--rm-ink)] w-fit"
                >
                  {/* Same hover-to-ink border as the social icons above. */}
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--rm-border-strong)] text-[var(--rm-text-muted)] transition-colors duration-300 group-hover:border-[var(--rm-ink)]">
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
                  <span className="relative inline-block after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-current after:content-[''] after:transition-transform after:duration-[500ms] after:ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:after:scale-x-100">
                    {contact?.email ?? "info@realmedia.ink"}
                  </span>
                </a>
              </motion.div>
            </div>

            <motion.div {...cascade(3)} className="lg:col-span-5 lg:col-start-8">
              {/* noValidate: native HTML5 constraint validation runs before
                  the submit event fires and cancels it outright on a failing
                  required/type=email field — handleSubmit (with our own
                  styled error UI) never even ran without this. */}
              <form
                id="rm-cta-contact-form"
                name="rm-cta-contact-form"
                noValidate
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="interest" value={interests.join(", ")} readOnly />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-12 min-[1920px]:gap-y-[60px]">
                  <Field
                    label="Full name"
                    name="name"
                    required
                    error={errors.name}
                    onChange={() => clearError("name")}
                  />
                  <Field label="Company" name="company" />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    required
                    error={errors.email}
                    onChange={() => clearError("email")}
                  />
                  <PhoneField error={errors.phone} onClearError={() => clearError("phone")} />
                </div>

                <div className="mt-12 min-[1920px]:mt-[60px]">
                  <p className={cn("rm-type-tag mb-3", textFaint, formFieldText)}>
                    I&rsquo;m interested in
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {INTEREST_OPTIONS.map((option) => {
                      const active = interests.includes(option.slug);
                      const label =
                        option.slug === "free-audit" ? (
                          <>
                            <span className="text-[#B85821]">Free</span> audit
                          </>
                        ) : (
                          option.label
                        );
                      return (
                        <InterestPill
                          key={option.slug}
                          label={label}
                          active={active}
                          onClick={() =>
                            setInterests((prev) =>
                              active ? prev.filter((slug) => slug !== option.slug) : [...prev, option.slug],
                            )
                          }
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="mt-12 min-[1920px]:mt-[60px]">
                  <textarea
                    name="message"
                    rows={2}
                    required
                    onChange={() => clearError("message")}
                    placeholder={
                      contact?.formPlaceholder ??
                      "Tell us what you are building and where you are stuck"
                    }
                    className={cn(
                      "block w-full bg-transparent border-0 border-b px-0 py-2 rm-type-body placeholder:uppercase placeholder:tracking-[var(--rm-track-caps)] placeholder:font-medium focus:outline-none transition-colors resize-none",
                      formFieldText,
                      errors.message
                        ? "border-[var(--rm-accent)] text-[var(--rm-accent)] placeholder:text-[var(--rm-accent)]/50"
                        : "border-[var(--rm-border-strong)] text-[var(--rm-ink)] placeholder:text-[var(--rm-text-ghost)]",
                    )}
                  />
                  {/* Reserved-height slot, always rendered — the message
                      appearing/disappearing changes text and opacity only,
                      never the field's own layout height. */}
                  <p
                    className={cn(
                      "m-0 mt-1 text-[11px] leading-[1.4] text-[var(--rm-accent)] transition-opacity duration-200",
                      errors.message ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {errors.message || " "}
                  </p>
                </div>

                <button
                  type="submit"
                  className={cn(btnPrimaryOnLight, "group mt-12 w-full gap-2")}
                  aria-label={sent ? submitSuccessLabel : submitLabel}
                >
                  <FlipLabel text={sent ? submitSuccessLabel : submitLabel} />
                  {!sent ? <BtnArrow /> : null}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  className = "",
  error,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
  error?: string;
  onChange?: () => void;
}) {
  return (
    <div className={className}>
      {/* Placeholder IS the label, sitting inside the field itself — no
          caption above it, matching the reference. The border stays the
          same color focused or not; only outline-none is needed to drop
          the browser's own default focus ring. */}
      <input
        type={type}
        name={name}
        required={required}
        placeholder={label}
        onChange={onChange}
        aria-invalid={!!error}
        className={cn(
          "w-full bg-transparent border-0 border-b px-0 py-2 rm-type-body placeholder:uppercase placeholder:tracking-[var(--rm-track-caps)] placeholder:font-medium focus:outline-none transition-colors",
          formFieldText,
          error
            ? "border-[var(--rm-accent)] text-[var(--rm-accent)] placeholder:text-[var(--rm-accent)]/50"
            : "border-[var(--rm-border-strong)] text-[var(--rm-ink)] placeholder:text-[var(--rm-text-ghost)]",
        )}
      />
      {/* Reserved-height slot, always rendered — an error appearing/
          disappearing changes text and opacity only, never layout height,
          so sibling fields never jump. */}
      <p
        className={cn(
          "m-0 mt-1 text-[11px] leading-[1.4] text-[var(--rm-accent)] transition-opacity duration-200",
          error ? "opacity-100" : "opacity-0",
        )}
      >
        {error || " "}
      </p>
    </div>
  );
}

/**
 * Country-code trigger + panel for PhoneField below. Same visual language as
 * the header's Services dropdown (rounded-2xl, dividers, blur, stroke-only
 * DropdownChevron) but color-inverted — this form section is
 * rm-section-light, so reusing the exact same token names (--rm-ink,
 * --rm-border-strong/soft) resolves to the light-theme values automatically,
 * no separate "light" tokens needed. Click-toggled (not hover) — a form
 * control, not a nav menu.
 *
 * The panel renders through a portal into document.body instead of as a
 * normal absolutely-positioned child. It sits inside several nested
 * motion.div entrance animations (the form column's own cascade, the card's
 * own reveal) — Framer Motion keeps a non-identity transform/opacity on an
 * animated element even at rest, and per spec that alone creates a stacking
 * context, which becomes this panel's backdrop-filter root once it's
 * nested inside one. That root doesn't include the actual page behind it,
 * so the blur had nothing to blur. Portaling to body sidesteps every
 * ancestor's stacking context entirely.
 */
function CountryCodeSelect({
  value,
  onChange,
}: {
  value: Country;
  onChange: (country: Country) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const PANEL_WIDTH = 288;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const left = Math.min(rect.left, window.innerWidth - PANEL_WIDTH - 16);
      setPosition({ top: rect.bottom + 8, left: Math.max(16, left) });
    };
    updatePosition();

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    const focusFrame = requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      cancelAnimationFrame(focusFrame);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return COUNTRIES;
    const qDigits = q.replace(/[^0-9]/g, "");
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || (qDigits && c.dialCode.includes(qDigits)),
    );
  }, [search]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Select country code"
        aria-expanded={open}
        className="group flex items-center gap-1.5 py-2 text-[var(--rm-ink)]"
      >
        <img
          src={flagUrl(value.iso)}
          alt=""
          aria-hidden
          className="h-3 w-4 shrink-0 rounded-[2px] object-cover"
        />
        <span className={cn("rm-type-body", formFieldText)}>+{value.dialCode}</span>
        <DropdownChevron open={open} className="text-[var(--rm-text-muted)]" />
      </button>

      {mounted &&
        createPortal(
          <div
            ref={panelRef}
            style={{ width: PANEL_WIDTH, top: position?.top ?? 0, left: position?.left ?? 0 }}
            className={cn(
              "fixed z-50 transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.625,0.05,0,1)]",
              open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
            )}
          >
            {/* bg-white/85 (not /90) — matches the Services dropdown's own
                bg-[#0a0a0b]/85 exactly; the extra 5% transparency is what
                actually lets the backdrop-blur read as a blur instead of
                just a flat, near-opaque white panel. */}
            <div className="overflow-hidden rounded-2xl border border-[var(--rm-border-strong)] bg-white/85 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)] backdrop-blur-xl">
              <div className="p-3">
                {/* Same underline-input language as the rest of the form
                    (border-b, uppercase tracked placeholder) — just kept at
                    this dropdown's own 14px instead of switching to
                    formFieldText. */}
                <input
                  ref={searchInputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country or code"
                  className="w-full bg-transparent border-0 border-b border-[var(--rm-border-strong)] px-0 pb-2 text-[14px] text-[var(--rm-ink)] placeholder:text-[var(--rm-text-ghost)] placeholder:uppercase placeholder:tracking-[var(--rm-track-caps)] placeholder:font-medium focus:outline-none transition-colors"
                />
              </div>
              {/* data-lenis-prevent: Lenis hijacks wheel input for its own
                  virtual scroll before a nested overflow-auto region gets a
                  chance to handle it — without this the whole page scrolled
                  instead of this list. rm-custom-scrollbar is a thin,
                  on-brand scrollbar instead of the browser default. */}
              <div
                data-lenis-prevent
                className="rm-custom-scrollbar max-h-64 overflow-y-auto overscroll-contain"
              >
                {filtered.length === 0 ? (
                  <p className="p-4 text-[14px] text-[var(--rm-text-muted)]">No matches</p>
                ) : (
                  filtered.map((c, i) => (
                    <button
                      key={c.iso}
                      type="button"
                      onClick={() => {
                        onChange(c);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left text-[var(--rm-ink)] transition-colors duration-200 hover:bg-black/[0.04]",
                        i > 0 && "border-t border-[var(--rm-border-soft)]",
                      )}
                    >
                      <img
                        src={flagUrl(c.iso)}
                        alt=""
                        aria-hidden
                        className="h-3 w-4 shrink-0 rounded-[2px] object-cover"
                      />
                      <span className="min-w-0 flex-1 truncate text-[14px]">{c.name}</span>
                      <span className="shrink-0 text-[14px] text-[var(--rm-text-muted)]">
                        +{c.dialCode}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

/** Phone field — country-code picker (flag + dial code) glued to a
 * digits-only number input, sharing one underline row like the other
 * fields. type="tel" + inputMode="numeric" brings up a number pad on
 * mobile immediately, and the onChange handler strips anything non-digit
 * so letters can never land in the field (including pasted text). */
function PhoneField({
  error,
  onClearError,
}: {
  error?: string;
  onClearError?: () => void;
}) {
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [digits, setDigits] = useState("");

  useEffect(() => {
    setCountry(detectDefaultCountry());
  }, []);

  return (
    <div>
      <input
        type="hidden"
        name="phone"
        value={digits ? `+${country.dialCode}${digits}` : ""}
        readOnly
      />
      <div
        className={cn(
          "flex items-center border-b",
          error ? "border-[var(--rm-accent)]" : "border-[var(--rm-border-strong)]",
        )}
      >
        <CountryCodeSelect value={country} onChange={setCountry} />
        {/* 8px / divider / 8px, called out explicitly rather than one flex
            gap shared unevenly between the chevron and the phone input. */}
        <span
          aria-hidden
          className={cn(
            "mx-2 h-4 w-px shrink-0",
            error ? "bg-[var(--rm-accent)]" : "bg-[var(--rm-border-strong)]",
          )}
        />
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={digits}
          onChange={(e) => {
            setDigits(e.target.value.replace(/\D/g, ""));
            onClearError?.();
          }}
          placeholder="Phone"
          aria-invalid={!!error}
          className={cn(
            "w-full min-w-0 bg-transparent border-0 px-0 py-2 rm-type-body placeholder:uppercase placeholder:tracking-[var(--rm-track-caps)] placeholder:font-medium focus:outline-none transition-colors",
            formFieldText,
            error
              ? "text-[var(--rm-accent)] placeholder:text-[var(--rm-accent)]/50"
              : "text-[var(--rm-ink)] placeholder:text-[var(--rm-text-ghost)]",
          )}
        />
      </div>
      {/* Same reserved-height slot as Field, so this row never jumps either. */}
      <p
        className={cn(
          "m-0 mt-1 text-[11px] leading-[1.4] text-[var(--rm-accent)] transition-opacity duration-200",
          error ? "opacity-100" : "opacity-0",
        )}
      >
        {error || " "}
      </p>
    </div>
  );
}
