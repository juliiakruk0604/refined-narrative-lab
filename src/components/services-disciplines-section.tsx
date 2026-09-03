import { Link } from "@tanstack/react-router";
import {
  ChartSuccess,
  Designtools,
  Hashtag,
  Microphone,
  Ranking,
  SearchNormal1,
  type Icon as AppIcon,
} from "iconsax-react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { useRef } from "react";

import {
  BtnArrow,
  EASE_ENTER,
  FlipLabel,
  FramerTag,
  bodyCopy,
  hoverColorTransform,
  sectionHeadline,
  sectionHeadlineLead,
  sectionInner,
  sectionShell,
  sectionTagLeadStack,
} from "@/components/framer-section";
import { GlowOrb } from "@/components/glow-orb";
import { useCinemaMotion } from "@/components/home-scroll-cinema";
import { TRIGGER_VIEWPORT_MARGIN } from "@/components/motion-bits";
import { servicesList } from "@/lib/services";
import type { ServiceContent, ServiceSlug } from "@/lib/services/types";
import { cn } from "@/lib/utils";

const TAG = "Services";
const HEADLINE = ["Six disciplines.", "One operating system."];
const STANDFIRST =
  "Real Media works at the deeper levels of market context — how trust is built, how customers compare options, and how purchase decisions are made.";

/** One relevant Iconsax Bold glyph per discipline — replaces the old colour-dot markers.
 * Exported so the header's Services dropdown (site-chrome.tsx) reuses the same set. */
export const SERVICE_ICONS: Record<ServiceSlug, AppIcon> = {
  brand: Ranking,
  smm: Hashtag,
  pr: Microphone,
  performance: ChartSuccess,
  seo: SearchNormal1,
  design: Designtools,
};

/** Left/right rows, three height levels each — same grouping mdx.so uses (two columns flanking the
 * central visual), sized up from their 4 tags to our 6 real services. Rest position sits close in
 * around the orb; only on scroll do the two columns diverge out toward the screen edges. */
const LEFT_SERVICES = servicesList.slice(0, 3);
const RIGHT_SERVICES = servicesList.slice(3, 6);
/** Scattered, not gridded — left/right columns get their own row heights so
 * pills don't line up into a neat 3x2 grid either at rest or fully diverged. */
/* Top-row pills (Brand Strategy / Performance) sat close enough to the
   headline/standfirst above that on ≥1920px screens — where both run at
   their largest fluid size — they read as crowded. Nudged down; still clear
   of the copy above (ends ~29%) and the row below (58% / 68%). */
const LEFT_TOP = ["47%", "58%", "82%"];
const RIGHT_TOP = ["48%", "68%", "90%"];
const LEFT_REST = ["43%", "31%", "44%"];
const LEFT_FAR = ["27%", "17%", "29%"];
const RIGHT_REST = ["57%", "69%", "56%"];
const RIGHT_FAR = ["73%", "83%", "71%"];
/** Vertical center of the pill cluster — average of LEFT_TOP/RIGHT_TOP. The
 * cycling "Be ___." phrases sit here (not on the orb, which recenters toward
 * 50% as it grows) so they stay level with the pills instead of drifting
 * above them once the orb starts scaling up. */
const PHRASE_TOP = "64%";

/** Real per-service "Be ___." — service.hero.word, same order as the pill columns above. */
const BE_PHRASES = servicesList.map((service) => `Be ${service.hero.word}.`);

/** Same drop-shadow duplicate-and-slide trick as BtnArrow, generalized to any
 * 16px glyph. Static regardless of hover — only the label and arrow next to
 * it use the slide trick now — and tinted a fixed muted gray instead of
 * currentColor, so it doesn't darken to full ink on hover along with the
 * text. */
function SlideIcon({ icon: Icon }: { icon: AppIcon }) {
  return (
    <Icon
      size={16}
      variant="Bold"
      color="var(--rm-light-muted)"
      className="shrink-0"
      aria-hidden="true"
    />
  );
}

/** No border, no fill-in — the pill leans on its own shadow for shape and
 * reuses the exact button hover vocabulary (FlipLabel + BtnArrow + the same
 * icon-slide trick) so it reads as the same interactive language, not a
 * one-off tag treatment. */
export function ServicePillLink({ service }: { service: ServiceContent }) {
  const Icon = SERVICE_ICONS[service.slug];

  return (
    <Link
      to="/services/$slug"
      params={{ slug: service.slug }}
      aria-label={service.shortName}
      className={cn(
        "group relative inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[var(--rm-light-surface)] px-4 py-2 rm-type-body text-[var(--rm-light-ink)] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.25)]",
        hoverColorTransform,
        "motion-safe:hover:-translate-y-0.5 hover:bg-white",
      )}
    >
      <SlideIcon icon={Icon} />
      <FlipLabel text={service.shortName} />
      <BtnArrow />
    </Link>
  );
}

function DisciplinePill({
  service,
  top,
  left,
  entered,
  delay,
}: {
  service: ServiceContent;
  top: string;
  left: MotionValue<string> | string;
  entered: boolean;
  delay: number;
}) {
  return (
    <motion.div
      style={{ top, left, x: "-50%", y: "-50%" }}
      className="absolute z-[1]"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={entered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.45, ease: EASE_ENTER, delay }}
    >
      <ServicePillLink service={service} />
    </motion.div>
  );
}

/**
 * Pinned scroll-scrub stage — mdx.so's actual mechanic: the hero-style stage
 * stays fixed while you scroll through it; the two columns of tags flanking
 * the central visual slide outward toward the screen edges, the intro copy
 * fades, and a sequence of per-service "Be ___." lines crossfades in over
 * the orb (each rising in from above as it fades in — the "opacity down"
 * read from the reference). Desktop only (see the fallback below) — this is
 * a genuine pin, not something to force on touch scroll.
 */
function PinnedDisciplinesStage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  // Children here sit inside a pinned h-screen stage — once pinned, their
  // position relative to the viewport is fixed for the whole scroll range,
  // so a per-child whileInView keyed to "has this element's own box crossed
  // the trigger line" can permanently fail for anything that lands below
  // that line (e.g. the lower-row pills). Gate everyone on the WRAPPER
  // approaching into view instead — that 260vh box moves normally through
  // scroll right up until the instant it pins, so its own inView check is
  // reliable, and it gives every child in the scene one shared "now" moment.
  // Same margin as everywhere else — without it this fired the instant any
  // sliver of the 260vh wrapper touched the viewport, so the whole scene
  // (copy + pills) had already finished revealing by the time it was
  // actually scrolled into a comfortable view.
  const stageEntered = useInView(wrapRef, {
    once: true,
    amount: 0.1,
    margin: TRIGGER_VIEWPORT_MARGIN,
  });
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });
  // Tracks raw scroll position directly — a spring here used to visibly lag
  // whenever scroll direction reversed (it has to cancel its old velocity
  // before it can follow the new direction), most noticeable scrolling back
  // up through the pin. Same reasoning as the orb below: for a pinned
  // scroll-scrub scene, 1:1 tracking beats smoothing out input noise.
  const progress = scrollYProgress;

  // A sticky child can only stay pinned for (wrapperHeight - childHeight) of
  // scroll — here, 260vh - 100vh = 160vh. Scroll further and it un-pins and
  // rides normally out of view for one more full viewport height (the
  // remaining 100vh of the wrapper) before the next section takes over. The
  // orb's position is relative to that (now-unpinned, moving) box, so no
  // amount of scale covers it forever — the box itself is sliding away.
  // `scrollYProgress` above clamps to 1 right at the un-pin instant, so it
  // can't see this tail at all — track it separately with an offset that runs
  // to the wrapper's true end, and use it to color the *wrapper's own*
  // background dark ahead of time (see wrapperBg below), so once the orb
  // slides away during that tail it uncovers a plain dark backdrop that was
  // already there — not a screen that visibly fades to black on top of it.
  const { scrollYProgress: extendedProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
    layoutEffect: false,
  });
  const wrapperBg = useTransform(extendedProgress, [0.2, 0.3], ["#fbfbfa", "#000000"]);

  const copyOpacity = useTransform(progress, [0, 0.3], [1, 0]);
  const copyY = useTransform(progress, [0, 0.3], [0, -18]);
  // Orb scale/position/background are driven off the RAW scroll progress, not
  // the spring-smoothed one — position:sticky's own pin/release is exact and
  // un-smoothed, so any spring-lagged value can momentarily disagree with it
  // during active scroll, flashing a seam right at the sticky boundary. Only
  // things that don't need to line up with that boundary (pills, phrases)
  // use the smoothed `progress`.
  // Front-loaded — full size by 0.4, not 1 — so the orb is already at its
  // largest (and unambiguously covering the whole viewport) through the back
  // 60% of the pin, instead of only reaching full coverage right at the end.
  // Less of the scroll spent in a "still growing, might not fully cover yet"
  // window means less exposure to any edge-of-coverage seam.
  const orbScale = useTransform(scrollYProgress, [0, 0.4], [1, 6]);
  // Orb re-centers toward the viewport's vertical middle as it grows — at rest
  // (66%, small) it clears the headline; fully grown and off-center it would
  // clip flat only at the bottom against the sticky viewport's edge instead of
  // bleeding evenly on every side. Expressed as a translateY delta (-16vh —
  // the gap between 66% and 50% of the h-screen stage) rather than animating
  // `top` directly: `top` is a layout property that forces a reflow on every
  // scroll frame, which is exactly what made reverse-scroll (flicking back up
  // through the pin) read as laggier than forward scroll — translate is
  // compositor-only.
  const orbY = useTransform(scrollYProgress, [0, 0.4], ["0vh", "-16vh"]);
  // Backstop for the orb's own coverage: fades the stage's background from the
  // section's light surface to black (matching the next section) across the
  // tail of the scroll, so if the orb's growth is ever a frame short of the
  // true edge at the exact instant the pin releases, what shows through is
  // dark-on-dark rather than a visible light seam.
  const stageBg = useTransform(scrollYProgress, [0.3, 0.4], ["#fbfbfa", "#000000"]);

  // Written out explicitly (not .map()) so every useTransform call is a fixed,
  // statically-visible hook call — six rows, six anchors, one per side per row.
  const leftLeft0 = useTransform(progress, [0, 0.88], [LEFT_REST[0], LEFT_FAR[0]]);
  const leftLeft1 = useTransform(progress, [0, 0.88], [LEFT_REST[1], LEFT_FAR[1]]);
  const leftLeft2 = useTransform(progress, [0, 0.88], [LEFT_REST[2], LEFT_FAR[2]]);
  const rightLeft0 = useTransform(progress, [0, 0.88], [RIGHT_REST[0], RIGHT_FAR[0]]);
  const rightLeft1 = useTransform(progress, [0, 0.88], [RIGHT_REST[1], RIGHT_FAR[1]]);
  const rightLeft2 = useTransform(progress, [0, 0.88], [RIGHT_REST[2], RIGHT_FAR[2]]);
  const leftLefts = [leftLeft0, leftLeft1, leftLeft2];
  const rightLefts = [rightLeft0, rightLeft1, rightLeft2];

  // Six "Be ___." lines cycle across the back 70% of the pin, each in its own
  // non-overlapping ~0.117-of-scroll slice — fades in from above, holds,
  // fades out as the next takes over (the last one just holds at the end).
  // Fade-in now claims most of that budget (0.09, was 0.06, was 0.035
  // originally) with hold and fade-out both compressed to make room — the
  // appearance is the slow part, per repeated feedback that it still read as
  // fast; disappearance stays quick since only the entrance was called out.
  // Explicit calls again, same reasoning as the pill anchors above.
  const phraseOpacity0 = useTransform(progress, [0.3, 0.39, 0.397, 0.417], [0, 1, 1, 0]);
  const phraseOpacity1 = useTransform(progress, [0.417, 0.507, 0.514, 0.534], [0, 1, 1, 0]);
  const phraseOpacity2 = useTransform(progress, [0.534, 0.624, 0.631, 0.651], [0, 1, 1, 0]);
  const phraseOpacity3 = useTransform(progress, [0.651, 0.741, 0.748, 0.768], [0, 1, 1, 0]);
  const phraseOpacity4 = useTransform(progress, [0.768, 0.858, 0.865, 0.885], [0, 1, 1, 0]);
  const phraseOpacity5 = useTransform(progress, [0.885, 0.975, 1], [0, 1, 1]);
  const phraseY0 = useTransform(progress, [0.3, 0.39], [-20, 0]);
  const phraseY1 = useTransform(progress, [0.417, 0.507], [-20, 0]);
  const phraseY2 = useTransform(progress, [0.534, 0.624], [-20, 0]);
  const phraseY3 = useTransform(progress, [0.651, 0.741], [-20, 0]);
  const phraseY4 = useTransform(progress, [0.768, 0.858], [-20, 0]);
  const phraseY5 = useTransform(progress, [0.885, 0.975], [-20, 0]);
  const phraseOpacities = [
    phraseOpacity0,
    phraseOpacity1,
    phraseOpacity2,
    phraseOpacity3,
    phraseOpacity4,
    phraseOpacity5,
  ];
  const phraseYs = [phraseY0, phraseY1, phraseY2, phraseY3, phraseY4, phraseY5];

  return (
    <motion.div
      ref={wrapRef}
      style={{ backgroundColor: wrapperBg }}
      // 260vh -> 340vh: repeated feedback that the phrase cycle still reads
      // fast (especially trackpad/inertial scrolling) — every sub-animation
      // here is keyed to `progress` (0-1 of this wrapper's own scroll range),
      // so stretching the wrapper slows the whole sequence in real scroll
      // distance without needing to keep re-tuning individual fractions.
      className="rm-disciplines-scene relative h-[340vh]"
    >
      <motion.div
        style={{ backgroundColor: stageBg }}
        className="sticky top-0 h-screen overflow-hidden will-change-transform"
      >
        <div className={cn(sectionInner, "relative h-full w-full")}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={stageEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.55, ease: EASE_ENTER }}
            className="absolute left-6 top-[14%] max-w-[42rem] md:left-10"
          >
            <motion.div style={{ opacity: copyOpacity, y: copyY }}>
              <div className={sectionTagLeadStack}>
                <FramerTag className="w-fit self-start">{TAG}</FramerTag>
                <div className={sectionHeadlineLead}>
                  <h2 id="disciplines-heading" className={cn(sectionHeadline, "m-0")}>
                    {HEADLINE[0]}
                    <br />
                    {HEADLINE[1]}
                  </h2>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={stageEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.55, ease: EASE_ENTER, delay: 0.08 }}
            className="absolute right-6 top-[22%] max-w-[32ch] text-right md:right-10"
          >
            <motion.p style={{ opacity: copyOpacity, y: copyY }} className={cn(bodyCopy, "m-0")}>
              {STANDFIRST}
            </motion.p>
          </motion.div>

          <motion.div
            // Promoting this to its own GPU layer up front (rather than the
            // browser deciding mid-scroll) is what actually matters here —
            // the orb underneath carries a 50px blur, and re-rasterizing a
            // blur at up to 6x its original size on every frame is heavy
            // enough to visibly drop frames on integrated-GPU laptops.
            // Composited-transform scaling sidesteps that: the blur is
            // rasterized once at rest size and the GPU just stretches the
            // resulting layer.
            style={{ scale: orbScale, y: orbY, willChange: "transform" }}
            className="absolute left-1/2 top-[66%] w-[min(36vw,30rem)] -translate-x-1/2 -translate-y-1/2"
          >
            <GlowOrb className="w-full" breathe={false} />
          </motion.div>

          <div
            style={{ top: PHRASE_TOP }}
            className="pointer-events-none absolute left-1/2 z-[1] -translate-x-1/2 -translate-y-1/2"
          >
            {BE_PHRASES.map((phrase, i) => (
              <motion.p
                key={phrase}
                style={{ opacity: phraseOpacities[i], y: phraseYs[i] }}
                className="rm-title-hero-lead absolute left-1/2 top-1/2 m-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center text-white"
              >
                {phrase}
              </motion.p>
            ))}
          </div>

          {LEFT_SERVICES.map((service, i) => (
            <DisciplinePill
              key={service.slug}
              service={service}
              top={LEFT_TOP[i]}
              left={leftLefts[i]}
              entered={stageEntered}
              delay={0.28 + i * 0.1}
            />
          ))}
          {RIGHT_SERVICES.map((service, i) => (
            <DisciplinePill
              key={service.slug}
              service={service}
              top={RIGHT_TOP[i]}
              left={rightLefts[i]}
              entered={stageEntered}
              delay={0.34 + i * 0.1}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Same stagger idiom as the home hero (heroStage/heroTitle) — one shared pattern, not a one-off. */
const pillStage: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const pillItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_ENTER } },
};

/** Mobile / coarse-pointer / reduced-motion fallback — no pin, no scroll-scrub. */
function StaticDisciplinesStage() {
  return (
    <div
      className={cn(
        sectionInner,
        "grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-8 lg:gap-16",
      )}
    >
      <div className="md:col-span-5">
        <div className={sectionTagLeadStack}>
          <div className="reveal">
            <FramerTag className="w-fit">{TAG}</FramerTag>
          </div>
          <div className={cn(sectionHeadlineLead, "reveal")} data-delay="1">
            <h2 id="disciplines-heading" className={cn(sectionHeadline, "m-0")}>
              {HEADLINE[0]}
              <br />
              {HEADLINE[1]}
            </h2>
            <p className={cn(bodyCopy, "m-0")}>{STANDFIRST}</p>
          </div>
        </div>
      </div>

      <div className="md:col-span-7">
        <GlowOrb className="w-full max-w-[24rem] md:max-w-[28rem]" />
        <motion.div
          variants={pillStage}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3, margin: TRIGGER_VIEWPORT_MARGIN }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {servicesList.map((service) => (
            <motion.div key={service.slug} variants={pillItem}>
              <ServicePillLink service={service} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export function ServicesDisciplinesSection() {
  const reduce = useReducedMotion();
  const cinemaEnabled = useCinemaMotion();
  const usePinned = cinemaEnabled && !reduce;

  return (
    <section
      aria-labelledby="disciplines-heading"
      className={cn(
        // The pinned stage's orb needs to bleed edge-to-edge — sectionShell's own
        // siteGutter padding would inset the sticky/overflow-hidden box and clip
        // the orb well short of the true viewport edge on wide screens. No
        // border either — a seam line breaks the orb's own fade into the
        // next section.
        !usePinned && sectionShell,
        "rm-section-light",
      )}
    >
      {usePinned ? <PinnedDisciplinesStage /> : <StaticDisciplinesStage />}
    </section>
  );
}
