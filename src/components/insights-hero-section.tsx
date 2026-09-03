import { Link } from "@tanstack/react-router";

import { BlogPostCard } from "@/components/blog-post-card";
import { triggerPageTransition } from "@/components/page-transition";
import {
  BtnArrow,
  FlipLabel,
  btnOutlineOnDark,
  FramerTag,
  sectionHeadline,
  sectionHeadlineLead,
  sectionInner,
  sectionShell,
} from "@/components/framer-section";
import type { Post } from "@/lib/posts";
import { cn } from "@/lib/utils";

type InsightsHeroSectionProps = {
  posts: Post[];
};

const FEATURED_SLUGS = [
  "cybersecurity-trust-building",
  "b2b-performance-marketing",
  "buyers-compare-safe-decisions",
  "creation-vs-dominance",
] as const;

/* Seconds before each card starts its own reveal (photo → meta → title →
   button, staggered further inside BlogPostCard). Spread across a wider
   range than a plain 1-2-3-4 step so the cascade between cards reads longer,
   matching the .reveal[data-delay] cadence (120ms/step) this replaced. */
const CARD_REVEAL_DELAY = [0.12, 0.24, 0.48, 0.6] as const;

export function InsightsHeroSection({ posts }: InsightsHeroSectionProps) {
  const featured = FEATURED_SLUGS.map((slug) => posts.find((p) => p.slug === slug)).filter(
    (p): p is Post => Boolean(p),
  );

  if (featured.length < 2) return null;

  return (
    <section className={cn(sectionShell, "rm-section-insights")} aria-labelledby="insights-heading">
      <div className={sectionInner}>
        <div className="flex items-end justify-between mb-10 md:mb-16">
          <div className={cn(sectionHeadlineLead, "items-start")}>
            <div className="reveal self-start">
              <FramerTag>Insights</FramerTag>
            </div>
            <h2
              id="insights-heading"
              className={cn(sectionHeadline, "reveal m-0 max-w-[18ch] text-balance text-white")}
              data-delay="1"
            >
              Field notes on building brands that last.
            </h2>
          </div>
          <Link
            to="/blog"
            className={cn(btnOutlineOnDark, "reveal hidden md:flex group shrink-0 gap-2 self-end")}
            data-delay="1"
            aria-label="All articles"
            onClick={(event) => {
              event.preventDefault();
              triggerPageTransition("/blog");
            }}
          >
            <FlipLabel text="All articles" />
            <BtnArrow />
          </Link>
        </div>

        <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {featured.map((post, i) => (
            <div
              key={post.slug}
              // 4 cards read comfortably at 1/2 columns (mobile/tablet) and at
              // the 4-col desktop breakpoint — but a lone 4th card orphaned in
              // a 3-col row (typical laptop width) looks unbalanced, so it
              // drops out specifically across that middle range.
              className={cn(i === 3 && "lg:hidden 2xl:block")}
            >
              <BlogPostCard post={post} revealDelay={CARD_REVEAL_DELAY[i] ?? 0.6} />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-end md:hidden">
          <Link
            to="/blog"
            className={cn(btnOutlineOnDark, "reveal group gap-2")}
            data-delay="1"
            aria-label="All articles"
            onClick={(event) => {
              event.preventDefault();
              triggerPageTransition("/blog");
            }}
          >
            <FlipLabel text="All articles" />
            <BtnArrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
