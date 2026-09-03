import { Fragment, useEffect, useId, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Buildings,
  Profile2User,
  TickCircle,
  Timer,
  type Icon as AppIcon,
} from "iconsax-react";

import {
  borderSoft,
  DURATION_ENTER,
  DURATION_HOVER,
  divideSoft,
  EASE_ENTER,
  EASE_HOVER,
  FramerTag,
  sectionHeadline,
  sectionInner,
  siteGutter,
  subsectionTitle,
  textCardBody,
  textGhost,
  textMeta,
  textSubtle,
} from "@/components/framer-section";
import { GlowOrb } from "@/components/glow-orb";
import { TRIGGER_VIEWPORT_MARGIN } from "@/components/motion-bits";
import { StudioTrustBand } from "@/components/studio-trust-band";
import { cn } from "@/lib/utils";
import type { PageContent } from "@/lib/page-content/types";
import { getPageDefaults } from "@/lib/page-content/defaults";

const defaultPage = getPageDefaults("home");

/** One glyph per bullet, in the order `studio.bullets` is authored. */
const BULLET_ICONS: AppIcon[] = [Profile2User, Buildings, Timer, TickCircle];

/** Headline rises line-by-line with a brief de-blur, same choreography as
 * the home hero's title — this section's copy was landing at full opacity
 * with no perceptible entrance, unlike everywhere else on the page. */
const titleStage = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const titleLine = {
  hidden: { opacity: 0, y: "0.45em", filter: "blur(7px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE_ENTER },
  },
};

/** Arrow height in SVG user units — 1:1 with CSS px, since the viewBox is
 * sized to the container's actual measured width (see RowConnector). */
const ARROW_H = 8;
const ARROW_MID_Y = ARROW_H / 2;
/** Chevron tip sits 1px in from the right edge; its back corner 3.5px
 * further left — same proportions the old fixed 10×8 glyph used. */
const CHEVRON_SPAN = 3.5;

function RowConnector() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const maskId = useId();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.getBoundingClientRect().width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const w = width || 1;
  const tipX = w - 1;
  const backX = Math.max(0, tipX - CHEVRON_SPAN);
  // One path — shaft plus both chevron legs — instead of a separate line
  // element sitting next to a separate arrow glyph. Two elements can only
  // ever be MADE to line up; one path can't help but already be continuous.
  const d = `M0 ${ARROW_MID_Y} H${backX} M${backX} ${ARROW_MID_Y - 3} L${tipX} ${ARROW_MID_Y} L${backX} ${ARROW_MID_Y + 3}`;

  return (
    <div ref={containerRef} className="relative h-2 flex-1 mx-[60px]">
      {width > 0 && (
        <svg
          width={w}
          height={ARROW_H}
          viewBox={`0 0 ${w} ${ARROW_H}`}
          fill="none"
          aria-hidden
          className="absolute left-0 top-1/2 -translate-y-1/2"
        >
          {/* Muted base — always visible */}
          <path
            d={d}
            stroke="var(--rm-border-soft)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bright copy of the exact same path, masked by a rect that grows
              left-to-right on row hover — reveals brighter without needing a
              second, separately-positioned shape to keep aligned. */}
          <mask id={maskId}>
            <motion.rect
              x="0"
              y="0"
              height={ARROW_H}
              fill="#fff"
              variants={{ rest: { width: 0 }, hover: { width: w } }}
              transition={{ duration: DURATION_HOVER, ease: EASE_HOVER }}
            />
          </mask>
          <path
            d={d}
            stroke="#fff"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            mask={`url(#${maskId})`}
          />
        </svg>
      )}
    </div>
  );
}

export function AboutSection({ page }: { page?: PageContent }) {
  const chapterRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const studio = page?.sections.studio ?? defaultPage.sections.studio;
  const stats = page?.stats ?? defaultPage.stats ?? [];
  const metaCards = page?.metaCards ?? defaultPage.metaCards ?? [];

  // One shared entrance signal for the grid + rows + bullets strip below it,
  // gated with the sitewide trigger margin. These used to check their own
  // position independently (.reveal/.reveal-fade) — with the bullets strip
  // the furthest down, that meant it needed its own extra scroll/wait to
  // cross the trigger line after everything above it had already settled,
  // instead of reading as one scene arriving together.
  const sceneRef = useRef<HTMLDivElement>(null);
  const entered = useInView(sceneRef, {
    once: true,
    amount: 0.15,
    margin: TRIGGER_VIEWPORT_MARGIN,
  });
  const cascade = (delay: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 16 } as const),
    animate: reduced || entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: DURATION_ENTER, ease: EASE_ENTER, delay },
  });

  return (
    <section
      ref={chapterRef}
      id="studio"
      className="rm-studio-chapter"
      aria-label="Studio overview"
    >
      <StudioTrustBand
        chapterRef={chapterRef}
        inView={true}
        stats={stats.map((stat) => ({
          copy: stat.label,
          ...(stat.animateTo != null
            ? {
                countUp: {
                  to: stat.animateTo,
                  prefix: stat.prefix,
                  suffix: stat.suffix,
                },
              }
            : {
                value: `${stat.prefix ?? ""}${stat.value}${stat.suffix ?? ""}`,
              }),
        }))}
      />

      <div className="rm-studio-chapter__body">
        <div
          className={cn(
            "flex min-h-screen flex-col justify-center border-b bg-black pb-16 md:pb-20",
            borderSoft,
            siteGutter,
          )}
        >
          <div
            ref={sceneRef}
            className={cn(
              sectionInner,
              "rm-plan-scene flex flex-col gap-10 md:gap-14 py-16 md:py-20",
            )}
          >
            {/* Ambient background decorations */}
            <div className="rm-plan-scene__ambient" aria-hidden="true">
              <div className="rm-plan-scene__grid" />
              <div className="rm-plan-scene__glow" />
              <div className="rm-plan-scene__axis" />
            </div>
            {/* -right-1/4 is a % of this grid's own width, which tracks
                viewport width up to --rm-grid-max (160rem/2560px) — at
                typical 1920px+ screens that pushes most of the orb off the
                section entirely. min-[1920px] pulls it back into frame. */}
            <GlowOrb className="pointer-events-none absolute -right-1/4 min-[1920px]:right-[8%] top-1/2 -z-[1] w-[52rem] -translate-y-1/2 opacity-[0.3]" />

            {/* ── Main: two-column grid ── */}
            <div className="relative grid grid-cols-1 items-start gap-10 md:grid-cols-[5fr_7fr] md:gap-16">
              {/* Left: tag + headline */}
              <div className="flex flex-col items-start gap-2">
                <motion.div {...cascade(0)}>
                  <FramerTag>{studio?.tag ?? "Marketing agency"}</FramerTag>
                </motion.div>
                <motion.h2
                  className={cn(sectionHeadline, "m-0 max-w-[20ch] text-balance")}
                  aria-label={studio?.heading ?? ""}
                  variants={titleStage}
                  initial={reduced ? false : "hidden"}
                  animate={reduced || entered ? "show" : "hidden"}
                >
                  {/* pb + matching -mb: overflow-hidden's own box was sized
                      exactly to the line-height, clipping descenders (the
                      "g" in "bring") that render below it — pad the box for
                      them, then pull the extra space back out so line
                      spacing is unaffected. */}
                  <span className="block overflow-hidden pb-[0.15em] -mb-[0.15em]">
                    <motion.span
                      className={cn("block text-pretty", textSubtle)}
                      variants={titleLine}
                    >
                      {studio?.headingLines?.[0] ?? "We don't bring ideas."}
                    </motion.span>
                  </span>
                  {/* pb + matching -mb: overflow-hidden's own box was sized
                      exactly to the line-height, clipping descenders (the
                      "g" in "bring") that render below it — pad the box for
                      them, then pull the extra space back out so line
                      spacing is unaffected. */}
                  <span className="block overflow-hidden pb-[0.15em] -mb-[0.15em]">
                    <motion.span className="block text-pretty text-white" variants={titleLine}>
                      {studio?.headingLines?.[1] ?? "We come with a plan."}
                    </motion.span>
                  </span>
                </motion.h2>
              </div>

              {/* Right: arrow-table rows — each row rises in on its own step
                  after the headline, instead of the table arriving as one
                  flat block. */}
              <div className={cn("rm-plan-scene__cards flex flex-col", divideSoft, borderSoft)}>
                {metaCards.map((card, i) => (
                  <motion.div
                    key={card.label}
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    animate={reduced || entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{
                      duration: DURATION_ENTER,
                      ease: EASE_ENTER,
                      delay: 0.35 + i * 0.12,
                    }}
                  >
                    <motion.div
                      // Was `last:border-b-0`, keyed off CSS :last-child — but
                      // the entrance wrapper this row now sits inside makes
                      // every row its OWN parent's only/last child, so that
                      // selector would strip the border-b from all four.
                      className={cn(
                        "flex items-center border-b border-[var(--rm-border-soft)] py-6",
                        i === metaCards.length - 1 && "border-b-0",
                      )}
                      initial="rest"
                      whileHover={reduced ? "rest" : "hover"}
                      animate="rest"
                      variants={{
                        rest: { borderColor: "var(--rm-border-soft)" },
                        hover: { borderColor: "rgba(255,255,255,0.35)" },
                      }}
                      transition={{ duration: DURATION_HOVER, ease: EASE_HOVER }}
                    >
                      {/* Label — slides toward the arrow on row hover */}
                      <motion.span
                        className={cn(subsectionTitle, "w-32 shrink-0 md:w-40")}
                        variants={{
                          rest: { x: 0 },
                          hover: { x: 16 },
                        }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      >
                        {card.label}
                      </motion.span>

                      {/* Growing line + arrowhead */}
                      <RowConnector />

                      {/* Value — slides toward the arrow on row hover, mirroring the label */}
                      <motion.p
                        className={cn(textCardBody, "m-0 max-w-[28ch] flex-1 whitespace-pre-line")}
                        variants={{
                          rest: { x: 0 },
                          hover: { x: -16 },
                        }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      >
                        {card.value}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── Bottom: bullets strip with dividers — each bullet rises in
                on its own step, picking up right after the table rows. ── */}
            {studio?.bullets?.length ? (
              <div
                className={cn(
                  "border-t pt-6",
                  "flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-0",
                  borderSoft,
                )}
              >
                {studio.bullets.map((bullet, i) => {
                  const BulletIcon = BULLET_ICONS[i % BULLET_ICONS.length];
                  const delay = 0.85 + i * 0.1;
                  return (
                    <Fragment key={bullet}>
                      <motion.span
                        initial={reduced ? false : { opacity: 0, y: 16 }}
                        animate={
                          reduced || entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
                        }
                        transition={{ duration: DURATION_ENTER, ease: EASE_ENTER, delay }}
                        className={cn(
                          textMeta,
                          "flex flex-1 items-center justify-center gap-2 text-center text-[var(--rm-text-body)]",
                        )}
                      >
                        <BulletIcon
                          size={14}
                          variant="Bold"
                          color="currentColor"
                          className="shrink-0"
                          aria-hidden
                        />
                        {bullet}
                      </motion.span>
                      {i < (studio.bullets?.length ?? 0) - 1 && (
                        <motion.span
                          key={`sep-${i}`}
                          aria-hidden
                          initial={reduced ? false : { opacity: 0 }}
                          animate={reduced || entered ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ duration: DURATION_ENTER, ease: EASE_ENTER, delay }}
                          className={cn(
                            textMeta,
                            textGhost,
                            "hidden shrink-0 select-none sm:inline",
                          )}
                        >
                          |
                        </motion.span>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
