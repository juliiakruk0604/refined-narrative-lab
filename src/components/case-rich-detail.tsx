import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";

import { CasesGallerySection } from "@/components/cases-gallery-section";
import {
  bodyCopy,
  bodyCopyStrong,
  btnOutline,
  btnPrimary,
  pageHeroContainer,
  sectionContainer,
  sectionHeadline,
  sectionPill,
  sectionShell,
  subsectionTitle,
  textCardBody,
  textMeta,
  textMetric,
} from "@/components/framer-section";
import { HeroAtmosphere } from "@/components/hero-atmosphere";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { UnifiedCTA } from "@/components/unified-cta";
import { useReveal } from "@/hooks/use-reveal";
import type { CaseRichContent, CaseSectionVisual, CaseStudy } from "@/lib/cases";
import { deckImage } from "@/lib/case-deck-images";
import { cn } from "@/lib/utils";

function isDeckAsset(src: string) {
  return src.startsWith("/cases/");
}

function DeckImage({
  src,
  alt,
  fallback,
  className,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const [current, setCurrent] = useState(src);

  useEffect(() => {
    setCurrent(src);
  }, [src]);

  return (
    <img
      src={current}
      alt={alt}
      loading={loading}
      width={1280}
      height={800}
      className={className}
      onError={() => {
        if (fallback && current !== fallback) setCurrent(fallback);
      }}
    />
  );
}

type CaseRichDetailProps = {
  study: CaseStudy;
  others: CaseStudy[];
};

type TocItem = { id: string; label: string };

function buildToc(rich: CaseRichContent): TocItem[] {
  const items: TocItem[] = [
    { id: "case-overview", label: "Overview" },
    { id: "case-challenge", label: "The challenge" },
    { id: "case-identity", label: "Identity" },
  ];
  if (rich.gallery?.length) {
    items.push({ id: "case-campaign", label: "Campaign" });
  }
  items.push(
    { id: "case-deliverables", label: "Deliverables" },
    { id: "case-results", label: "Results" },
  );
  return items;
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className={cn("size-4 shrink-0", className)}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroMetric({ metric }: { metric: { value: string; label: string } }) {
  return (
    <div>
      <p className={textMetric}>{metric.value}</p>
      <p className={cn("mt-1", textMeta)}>{metric.label}</p>
    </div>
  );
}

function OverviewMetrics({
  metrics,
}: {
  metrics: CaseStudy["heroMetrics"];
}) {
  if (metrics.length === 0) return null;

  return (
    <dl
      className={cn(
        "reveal rm-case-study__metrics mt-8 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[var(--rm-border-soft)] pt-8 md:grid-cols-4",
      )}
    >
      {metrics.map((m) => (
        <div key={m.label}>
          <dt className={textMetric}>{m.value}</dt>
          <dd className={cn("mt-1", textMeta)}>{m.label}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Blog-style section rhythm */
const caseSection = "scroll-mt-32 mb-14 md:mb-20";

function resolveSectionVisuals(c: CaseStudy, rich: CaseRichContent) {
  const v = rich.visuals ?? {};
  return {
    overview: v.overview ?? {
      src: deckImage(c.slug, "overview"),
      alt: `${c.client} — project overview`,
    },
    challenge: v.challenge ?? {
      src: c.previewImage ?? deckImage(c.slug, "overview"),
      alt: `${c.client} — market context`,
    },
    identity: v.identity ?? {
      src: deckImage(c.slug, "identity"),
      alt: `${c.client} — visual identity`,
    },
    deliverables: v.deliverables ?? {
      src: deckImage(c.slug, "deliverables"),
      alt: `${c.client} — deliverables`,
    },
  };
}

function resolveGallery(c: CaseStudy, rich: CaseRichContent): CaseSectionVisual[] | null {
  if (rich.gallery?.length) return rich.gallery;
  const sources = [c.previewImage, c.heroImage, deckImage(c.slug, "deliverables"), deckImage(c.slug, "platform")].filter(
    (src, index, arr): src is string => Boolean(src) && arr.indexOf(src) === index,
  );
  if (sources.length < 2) return null;
  return sources.slice(0, 4).map((src, index) => ({
    src,
    alt: `${c.client} — campaign frame ${index + 1}`,
  }));
}

function SectionKicker({
  index,
  label,
  accent,
}: {
  index: number;
  label: string;
  accent: string;
}) {
  return (
    <div className="reveal rm-case-study__kicker mb-5 flex items-center gap-4">
      <span
        className="rm-case-study__section-index text-[var(--rm-text-muted)]"
        style={{ color: accent }}
      >
        {String(index).padStart(2, "0")}
      </span>
      <span aria-hidden className="h-px flex-1 bg-[var(--rm-border-soft)]" />
      <span className={textMeta}>{label}</span>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  const domainMatch = value.match(/([\w-]+\.(?:cpa|com|io|net|org|co))/i);
  const hasExternalLink = domainMatch && value.includes("·");

  return (
    <>
      <dt>{label}</dt>
      <dd className="mt-1 text-[var(--rm-ink)]">
        {hasExternalLink && domainMatch ? (
          <>
            {value.slice(0, value.indexOf(domainMatch[0])).trim()}{" "}
            <a
              href={`https://${domainMatch[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer underline decoration-[var(--rm-border-strong)] underline-offset-4 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--rm-surface-raised)]"
            >
              {domainMatch[0]}
            </a>
          </>
        ) : (
          value
        )}
      </dd>
    </>
  );
}

function ChallengeCardGrid({
  items,
  accent,
}: {
  items: { title: string; body: string }[];
  accent: string;
}) {
  return (
    <div className="rm-case-challenge-grid reveal mt-8 grid gap-3 sm:grid-cols-2">
      {items.map((item, i) => (
        <article
          key={item.title}
          className="rm-case-challenge-card group relative flex flex-col gap-3 border border-[var(--rm-border-soft)] bg-[color-mix(in_oklab,var(--rm-ink)_2%,transparent)] p-5 md:p-6"
          data-delay={String((i % 4) + 1)}
          style={
            {
              "--case-accent": accent,
            } as CSSProperties
          }
        >
          <span className="rm-case-study__section-index text-[var(--rm-text-muted)]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className={subsectionTitle}>{item.title}</h3>
          <p className={cn("max-w-prose text-pretty", textCardBody)}>{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function ColorPaletteVisual({
  items,
  accent,
  principle,
}: {
  items: { name: string; meaning: string }[];
  accent: string;
  principle: string;
}) {
  return (
    <div className="rm-case-palette reveal mt-6">
      <p className={cn("max-w-prose", bodyCopyStrong)}>{principle}</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((color) => {
          const swatch = colorSwatch(color.name, accent);
          return (
            <li
              key={color.name}
              className="rm-case-palette__swatch flex min-h-[5.5rem] flex-col justify-between border border-[var(--rm-border-soft)] p-4"
            >
              <span
                aria-hidden
                className="block h-10 w-full rounded-sm"
                style={{
                  background: swatch,
                  border: color.name === "White" ? "1px solid var(--rm-border-soft)" : undefined,
                }}
              />
              <div className="mt-3">
                <p className="text-sm font-medium text-[var(--rm-ink)]">{color.name}</p>
                <p className={cn("mt-1 text-pretty", textMeta)}>{color.meaning}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TypefaceSpecimen({ label, body }: { label: string; body: string }) {
  return (
    <div className="rm-case-type-specimen reveal border border-[var(--rm-border-soft)] bg-[color-mix(in_oklab,var(--rm-ink)_2%,transparent)] p-6 md:p-8">
      <p className={textMeta}>Typeface</p>
      <p className="rm-case-type-specimen__label mt-4 text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[0.95] tracking-[-0.04em] text-[var(--rm-ink)]">
        {label}
      </p>
      <p className={cn("mt-5 max-w-prose text-pretty", textCardBody)}>{body}</p>
    </div>
  );
}

function DeliverableCards({
  items,
  accent,
}: {
  items: { title: string; body: string }[];
  accent: string;
}) {
  return (
    <ol className="rm-case-deliverables reveal mt-8 grid gap-3 md:grid-cols-2">
      {items.map((item, i) => (
        <li
          key={item.title}
          className="rm-case-deliverable-card relative flex flex-col gap-4 border border-[var(--rm-border-soft)] p-5 md:p-6"
          data-delay={String((i % 3) + 1)}
          style={{ "--case-accent": accent } as CSSProperties}
        >
          <span className="rm-case-study__section-index text-[var(--rm-text-muted)]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className={subsectionTitle}>{item.title}</h3>
          <p className={cn("max-w-prose text-pretty", textCardBody)}>{item.body}</p>
        </li>
      ))}
    </ol>
  );
}

function ResultsMetricGrid({
  metrics,
  accent,
}: {
  metrics: CaseStudy["heroMetrics"];
  accent: string;
}) {
  if (metrics.length === 0) return null;
  return (
    <dl className="rm-case-results-metrics reveal mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rm-case-results-metric flex flex-col justify-between border border-[var(--rm-border-soft)] p-4 md:p-5"
          style={{ "--case-accent": accent } as CSSProperties}
        >
          <dt className={textMetric}>{m.value}</dt>
          <dd className={cn("mt-2 text-pretty", textMeta)}>{m.label}</dd>
        </div>
      ))}
    </dl>
  );
}

function SectionFigure({
  visual,
  fallback,
  aspect = "16/10",
  breakout = false,
}: {
  visual: CaseSectionVisual;
  fallback?: string;
  aspect?: "16/10" | "4/5" | "auto";
  breakout?: boolean;
}) {
  const deck = isDeckAsset(visual.src);
  return (
    <figure
      className={cn(
        "rm-case-figure reveal overflow-hidden border border-[var(--rm-border-soft)]",
        breakout ? "rm-case-figure--breakout mb-10 md:mb-12" : "mb-8",
      )}
    >
      <div
        className={cn(
          "relative",
          aspect === "16/10" && "aspect-[16/10]",
          aspect === "4/5" && "aspect-[4/5]",
          deck ? "bg-black" : "bg-[var(--rm-surface-float)]",
        )}
      >
        <DeckImage
          src={visual.src}
          alt={visual.alt}
          fallback={fallback}
          className={cn(
            "h-full w-full",
            deck ? "object-contain object-center" : "object-cover",
          )}
        />
      </div>
      <figcaption className={cn("border-t border-[var(--rm-border-soft)] px-4 py-3", textMeta)}>
        {visual.alt}
      </figcaption>
    </figure>
  );
}

function CampaignGallery({
  items,
  fallback,
}: {
  items: CaseSectionVisual[];
  fallback?: string;
}) {
  return (
    <div className="rm-case-gallery mt-8 grid grid-cols-12 gap-3 md:gap-4">
      {items.map((item, i) => {
        const featured = i === 0;
        return (
          <figure
            key={`${item.src}-${i}`}
            className={cn(
              "reveal group rm-case-figure overflow-hidden border border-[var(--rm-border-soft)] bg-black",
              featured ? "col-span-12 md:col-span-8" : "col-span-6 md:col-span-4",
            )}
            data-delay={String((i % 4) + 1)}
          >
            <div
              className={cn(
                "relative",
                featured ? "aspect-[16/10]" : "aspect-[4/5]",
              )}
            >
              <DeckImage
                src={item.src}
                alt={item.alt}
                fallback={fallback}
                className="h-full w-full object-cover object-center motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
              />
            </div>
            <figcaption
              className={cn(
                "border-t border-[var(--rm-border-soft)] bg-[color-mix(in_oklab,var(--rm-ink)_4%,transparent)] px-3 py-2.5",
                textMeta,
              )}
            >
              {item.alt}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

function TocLink({
  section,
  index,
  isActive,
}: {
  section: TocItem;
  index: number;
  isActive: boolean;
}) {
  return (
    <a
      href={`#${section.id}`}
      className={cn(
        "block text-sm leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--rm-surface-raised)]",
        isActive
          ? "text-[var(--rm-ink)]"
          : "text-[var(--rm-text-muted)] hover:text-[var(--rm-ink)]",
      )}
    >
      <span className="mr-2 tabular-nums text-[var(--rm-text-muted)]">
        {String(index + 1).padStart(2, "0")}
      </span>
      {section.label}
    </a>
  );
}

function colorSwatch(name: string, accent: string): string {
  const map: Record<string, string> = {
    Gold: accent,
    Green: accent,
    White: "#ffffff",
    Black: "#0a0a0a",
    "Secondary Gray": "#6b7280",
    "Vibrant primaries": accent,
    "Neutral base": "#d4d4d4",
    "Accent line": accent,
  };
  return map[name] ?? accent;
}

export function CaseRichDetail({ study: c, others }: CaseRichDetailProps) {
  useReveal();
  const rich = c.rich;
  const toc = useMemo(() => (rich ? buildToc(rich) : []), [rich]);
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>(toc[0]?.id ?? "case-overview");

  useEffect(() => {
    if (!rich) return;

    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);

      const offsets = toc
        .map((s) => {
          const el = document.getElementById(s.id);
          if (!el) return null;
          return { id: s.id, top: el.getBoundingClientRect().top };
        })
        .filter(Boolean) as { id: string; top: number }[];

      const above = offsets.filter((o) => o.top <= 140);
      const current = above.length ? above[above.length - 1] : offsets[0];
      if (current) setActiveId(current.id);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [rich, toc]);

  if (!rich) return null;

  const overviewParagraphs = rich.overview.body.split("\n\n");
  const overviewLead = overviewParagraphs[0] ?? "";
  const overviewRest = overviewParagraphs.slice(1);
  const visualFallback = c.fallbackCover ?? c.coverImage;
  const sectionVisuals = resolveSectionVisuals(c, rich);
  const galleryItems = resolveGallery(c, rich);
  const hasGallery = Boolean(galleryItems?.length);
  const problemParagraphs = rich.problem.body.split("\n\n");
  const problemLead = problemParagraphs[0] ?? "";
  const problemRest = problemParagraphs.slice(1);
  const isLogoCover = c.coverTreatment === "logo";
  const showIdentityLogo = Boolean(rich.logo) && !isLogoCover;

  return (
    <div className="rm-page rm-case-study selection:bg-rm-accent selection:text-black">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-white/5"
      >
        <div
          className="h-full w-full origin-left bg-rm-accent"
          style={{ transform: `scaleX(${progress / 100})`, transition: "transform 80ms linear" }}
        />
      </div>

      <SiteHeader variant="dark" overlay />

      <main id="main">
        {isLogoCover ? (
          <section
            aria-labelledby="case-title"
            className="rm-case-hero-logo relative isolate border-b border-[var(--rm-border-soft)]"
            style={{ "--case-accent": c.accent } as CSSProperties}
          >
            <div
              className={cn(
                pageHeroContainer,
                "relative z-10 pb-[clamp(2.5rem,6vw,4rem)] pt-[var(--rm-header-offset)] md:pb-16",
              )}
            >
              <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-14">
                <div className="lg:col-span-7 xl:col-span-6">
                  <nav
                    aria-label="Breadcrumb"
                    className={cn("reveal mb-10 flex flex-wrap items-center gap-2", textMeta)}
                  >
                    <Link
                      to="/cases"
                      className="cursor-pointer rounded-md hover:text-[var(--rm-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                    >
                      Cases
                    </Link>
                    <span aria-hidden>/</span>
                    <span aria-current="page">{c.client}</span>
                  </nav>

                  <p className={cn("reveal mb-5", textMeta)}>
                    {c.niche} · {c.format} · {c.duration}
                  </p>

                  <h1
                    id="case-title"
                    className="reveal max-w-[16ch] text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-[var(--rm-ink)]"
                  >
                    {rich.titleLines[0]}{" "}
                    <span className="font-normal text-[var(--rm-text-muted)]">
                      {rich.titleLines[1]}
                    </span>
                  </h1>

                  <p className={cn("reveal mt-7 max-w-[42ch]", bodyCopy)} data-delay="1">
                    {rich.subline}
                  </p>

                  {rich.heroNote ? (
                    <p
                      className={cn("reveal mt-5 max-w-[42ch]", bodyCopyStrong)}
                      data-delay="1"
                    >
                      {rich.heroNote}
                    </p>
                  ) : null}

                  <div className="reveal mt-10" data-delay="2">
                    <HeroMetric metric={c.primaryMetric} />
                  </div>

                  <div
                    className="reveal mt-10 flex flex-wrap items-center gap-3"
                    data-delay="3"
                  >
                    <Link to="/contact" className={btnOutline}>
                      Consultation
                    </Link>
                    <Link to={rich.closing.primaryTo} className={btnPrimary}>
                      {rich.closing.primaryLabel.replace(/\s*→\s*$/, "")}
                    </Link>
                  </div>
                  <a
                    href="#case-overview"
                    className={cn(
                      "rm-case-study__read-link reveal mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm text-[var(--rm-text-muted)] transition-colors duration-200 hover:text-[var(--rm-ink)] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--rm-surface-raised)]",
                    )}
                    data-delay="4"
                  >
                    Full case study
                    <ChevronDownIcon />
                  </a>
                </div>

                <div
                  className="reveal flex justify-start lg:col-span-5 lg:justify-end xl:col-span-6"
                  data-delay="1"
                >
                  <figure className="rm-case-hero-logo__mark w-full max-w-[min(420px,88vw)] lg:max-w-[360px]">
                    <DeckImage
                      src={c.coverImage}
                      alt={`${c.client} wordmark`}
                      fallback={c.fallbackCover}
                      loading="eager"
                      className="h-auto w-full object-contain"
                    />
                  </figure>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <HeroAtmosphere
            imageSrc={c.coverImage}
            fallbackImageSrc={c.fallbackCover}
            underHeader
            className="rm-hero-atmosphere--about-photo rm-hero-atmosphere--compact"
          >
            <section
              aria-labelledby="case-title"
              className="relative z-10 flex flex-1 items-end pb-12 pt-[var(--rm-header-offset)] md:pb-16"
            >
              <div className={pageHeroContainer}>
                <div className="mx-auto w-full max-w-[720px]">
                  <nav
                    aria-label="Breadcrumb"
                    className={cn("reveal mb-8 flex flex-wrap items-center gap-2", textMeta)}
                  >
                    <Link
                      to="/cases"
                      className="cursor-pointer rounded-md hover:text-[var(--rm-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                    >
                      Cases
                    </Link>
                    <span aria-hidden>/</span>
                    <span aria-current="page">{c.client}</span>
                  </nav>

                  <p className={cn("reveal mb-4", textMeta)}>
                    {c.niche} · {c.format} · {c.duration}
                  </p>

                  <h1
                    id="case-title"
                    className="reveal max-w-[20ch] text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--rm-ink)] md:text-4xl lg:text-5xl"
                  >
                    {rich.titleLines[0]}{" "}
                    <span className="font-normal text-[var(--rm-text-muted)]">
                      {rich.titleLines[1]}
                    </span>
                  </h1>

                  <p className={cn("reveal mt-6 max-w-prose", bodyCopy)} data-delay="1">
                    {rich.subline}
                  </p>

                  {rich.heroNote ? (
                    <p className={cn("reveal mt-5 max-w-prose", bodyCopyStrong)} data-delay="1">
                      {rich.heroNote}
                    </p>
                  ) : null}

                  <div className="reveal mt-10" data-delay="2">
                    <HeroMetric metric={c.primaryMetric} />
                  </div>

                  <div
                    className="reveal mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rm-border-soft)] pt-8"
                    data-delay="3"
                  >
                    <span className={textMeta}>{c.client} case study</span>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link to="/contact" className={btnOutline}>
                        Consultation
                      </Link>
                      <Link to={rich.closing.primaryTo} className={btnPrimary}>
                        {rich.closing.primaryLabel.replace(/\s*→\s*$/, "")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </HeroAtmosphere>
        )}

        <div className={cn(sectionShell, "border-b-0 py-0 md:py-0")}>
          <div className={cn(sectionContainer, "pt-12 pb-8 md:pt-16 md:pb-10")}>
            <div className="grid grid-cols-12 gap-8 lg:gap-12">
              <aside aria-label="Table of contents" className="hidden lg:col-span-3 lg:block">
                <div className="sticky top-32">
                  <p className={cn("mb-4", textMeta)}>On this page</p>
                  <ol className="relative space-y-4 border-l border-[var(--rm-border-soft)] pl-5">
                    {toc.map((s, i) => {
                      const isActive = activeId === s.id;
                      return (
                        <li key={s.id} className="relative">
                          <span
                            aria-hidden
                            className={cn(
                              "absolute -left-[23px] top-1.5 h-4 w-[3px] rounded-full transition-colors",
                              isActive ? "bg-rm-accent" : "bg-transparent",
                            )}
                          />
                          <TocLink section={s} index={i} isActive={isActive} />
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </aside>

              <div className="col-span-12 lg:col-span-9">
                <div className="mx-auto max-w-[min(100%,52rem)]">
                  <section
                    id="case-overview"
                    aria-labelledby="case-overview-heading"
                    className={caseSection}
                  >
                    <SectionKicker index={1} label="Overview" accent={c.accent} />
                    <h2 id="case-overview-heading" className={cn("reveal", sectionHeadline)}>
                      {rich.overview.heading}
                    </h2>

                    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] lg:items-start">
                      <div>
                        {overviewLead ? (
                          <p className={cn("reveal text-pretty text-lg leading-relaxed md:text-xl", bodyCopy)}>
                            {overviewLead}
                          </p>
                        ) : null}
                        {overviewRest.length > 0 ? (
                          <div className="mt-6 space-y-5">
                            {overviewRest.map((paragraph) => (
                              <p key={paragraph.slice(0, 24)} className={cn("reveal text-pretty", bodyCopy)}>
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <dl
                        className={cn(
                          "rm-case-study__meta reveal grid gap-5 border border-[var(--rm-border-soft)] bg-[color-mix(in_oklab,var(--rm-ink)_2%,transparent)] p-5",
                          isLogoCover ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-1",
                        )}
                        data-delay="1"
                      >
                        <MetaItem label="Client" value={rich.meta.client} />
                        <MetaItem label="Scope" value={rich.meta.scope} />
                        <MetaItem label="Year" value={rich.meta.year} />
                        <MetaItem label="Status" value={rich.meta.status} />
                      </dl>
                    </div>

                    <SectionFigure
                      visual={sectionVisuals.overview}
                      fallback={c.fallbackHero ?? visualFallback}
                      breakout
                    />

                    <OverviewMetrics metrics={c.heroMetrics} />

                    <div className="reveal mt-6 flex flex-wrap gap-2">
                      {rich.overview.scope.map((item) => (
                        <span key={item} className={sectionPill}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section
                    id="case-challenge"
                    aria-labelledby="case-challenge-heading"
                    className={caseSection}
                  >
                    <SectionKicker index={2} label="Challenge" accent={c.accent} />
                    <h2 id="case-challenge-heading" className={cn("reveal", sectionHeadline)}>
                      {rich.problem.heading}
                    </h2>

                    <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
                      <div className="space-y-5">
                        {problemLead ? (
                          <p className={cn("reveal text-pretty text-lg leading-relaxed", bodyCopyStrong)}>
                            {problemLead}
                          </p>
                        ) : null}
                        {problemRest.map((paragraph) => (
                          <p key={paragraph.slice(0, 24)} className={cn("reveal text-pretty", bodyCopy)}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                      <SectionFigure
                        visual={sectionVisuals.challenge}
                        fallback={visualFallback}
                        aspect="4/5"
                      />
                    </div>

                    <ChallengeCardGrid items={rich.problem.cards} accent={c.accent} />
                  </section>

                  <section
                    id="case-identity"
                    aria-labelledby="case-identity-heading"
                    className={caseSection}
                  >
                    <SectionKicker index={3} label="Identity" accent={c.accent} />
                    <h2 id="case-identity-heading" className={cn("reveal", sectionHeadline)}>
                      {rich.identity.heading}
                    </h2>

                    <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-start">
                      {showIdentityLogo && rich.logo ? (
                        <figure className="rm-case-figure reveal flex flex-col items-center justify-center border border-[var(--rm-border-soft)] bg-[color-mix(in_oklab,var(--rm-ink)_3%,transparent)] px-6 py-10 lg:col-span-4">
                          <DeckImage
                            src={rich.logo.src}
                            alt={rich.logo.alt}
                            fallback={visualFallback}
                            className="max-h-24 w-full object-contain"
                          />
                          <figcaption className={cn("mt-4 text-center", textMeta)}>Wordmark</figcaption>
                        </figure>
                      ) : null}
                      <div className={cn(showIdentityLogo && rich.logo ? "lg:col-span-8" : "lg:col-span-12")}>
                        <SectionFigure
                          visual={sectionVisuals.identity}
                          fallback={c.fallbackHero ?? c.heroImage}
                          aspect="16/10"
                          breakout={!showIdentityLogo}
                        />
                      </div>
                    </div>

                    <div className="mt-8 grid gap-6 lg:grid-cols-2">
                      <TypefaceSpecimen
                        label={rich.identity.typeface.label}
                        body={rich.identity.typeface.body}
                      />
                      <ColorPaletteVisual
                        items={rich.identity.colors.items}
                        accent={c.accent}
                        principle={rich.identity.colors.principle}
                      />
                    </div>

                    <div className="reveal mt-6 grid gap-3 md:grid-cols-2">
                      <div className="border border-[var(--rm-border-soft)] p-5 md:p-6">
                        <p className={textMeta}>Logo</p>
                        <p className={cn("mt-3 max-w-prose text-pretty", textCardBody)}>
                          {rich.identity.logo}
                        </p>
                      </div>
                      <div className="border border-[var(--rm-border-soft)] p-5 md:p-6">
                        <p className={textMeta}>Key visual</p>
                        <p className={cn("mt-3 max-w-prose text-pretty", textCardBody)}>
                          {rich.identity.keyVisual}
                        </p>
                      </div>
                    </div>
                  </section>

                  {hasGallery ? (
                    <section
                      id="case-campaign"
                      aria-labelledby="case-campaign-heading"
                      className={caseSection}
                    >
                      <SectionKicker index={4} label="Campaign" accent={c.accent} />
                      <h2 id="case-campaign-heading" className={cn("reveal", sectionHeadline)}>
                        {rich.galleryHeading ?? "Campaign gallery"}
                      </h2>
                      {rich.galleryLead ? (
                        <p className={cn("reveal mt-6 max-w-prose text-pretty", bodyCopy)}>
                          {rich.galleryLead}
                        </p>
                      ) : null}
                      <CampaignGallery items={galleryItems ?? []} fallback={visualFallback} />
                    </section>
                  ) : null}

                  <section
                    id="case-deliverables"
                    aria-labelledby="case-deliverables-heading"
                    className={caseSection}
                  >
                    <SectionKicker
                      index={hasGallery ? 5 : 4}
                      label="Deliverables"
                      accent={c.accent}
                    />
                    <h2 id="case-deliverables-heading" className={cn("reveal", sectionHeadline)}>
                      {rich.deliverables.heading}
                    </h2>
                    <SectionFigure
                      visual={sectionVisuals.deliverables}
                      fallback={visualFallback}
                      breakout
                    />
                    <DeliverableCards items={rich.deliverables.items} accent={c.accent} />
                  </section>

                  <section
                    id="case-results"
                    aria-labelledby="case-results-heading"
                    className={caseSection}
                  >
                    <SectionKicker
                      index={hasGallery ? 6 : 5}
                      label="Results"
                      accent={c.accent}
                    />
                    <h2 id="case-results-heading" className={cn("reveal", sectionHeadline)}>
                      {rich.platform.heading}
                    </h2>
                    <p className={cn("reveal mt-6 max-w-prose text-pretty text-lg", bodyCopy)}>
                      {rich.platform.body}
                    </p>

                    <ResultsMetricGrid metrics={c.heroMetrics} accent={c.accent} />

                    <div className="reveal mt-8 grid gap-3 md:grid-cols-2">
                      {rich.platform.features.map((feature, i) => (
                        <article
                          key={feature.title}
                          className="rm-case-result-card border border-[var(--rm-border-soft)] bg-[color-mix(in_oklab,var(--rm-ink)_2%,transparent)] p-5 md:p-6"
                          data-delay={String((i % 4) + 1)}
                          style={{ "--case-accent": c.accent } as CSSProperties}
                        >
                          <h3 className={subsectionTitle}>{feature.title}</h3>
                          <p className={cn("mt-3 max-w-prose text-pretty", textCardBody)}>
                            {feature.body}
                          </p>
                        </article>
                      ))}
                    </div>

                    <blockquote className="rm-case-study__quote reveal mt-12 max-w-prose">
                      <p className={cn("text-lg leading-relaxed md:text-xl", bodyCopy)}>
                        “{c.quote.text}”
                      </p>
                      <footer className={cn("mt-6", textMeta)}>
                        {c.quote.who} · {c.quote.role}
                      </footer>
                    </blockquote>

                    <div className="reveal mt-10 border-t border-[var(--rm-border-soft)] pt-8">
                      <Link to="/cases" className={btnOutline}>
                        ← All cases
                      </Link>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>

        {others.length > 0 ? (
          <CasesGallerySection
            tag="More work"
            heading="Other case studies."
            cases={others}
            animateHeading={false}
          />
        ) : null}

        <UnifiedCTA
          title={rich.closing.titleLines[0]}
          titleAccent={rich.closing.subline}
          primaryLabel={rich.closing.primaryLabel.replace(/\s*→\s*$/, "")}
          primaryTo={rich.closing.primaryTo}
          secondaryLabel={rich.closing.secondaryLabel}
          secondaryTo={rich.closing.secondaryTo}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
