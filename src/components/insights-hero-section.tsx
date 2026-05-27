import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";

import {
  btnPrimary,
  sectionContainer,
  sectionShell,
  textMeta,
} from "@/components/framer-section";
import { TextReveal } from "@/components/text-reveal";
import type { Post } from "@/lib/posts";

type InsightsHeroSectionProps = {
  posts: Post[];
};

const FEATURED_SLUGS = [
  "cross-border-fintech-scale",
  "cybersecurity-trust-building",
  "b2b-performance-marketing",
] as const;

function postMetaLine(post: Post) {
  return `${post.category.toUpperCase()} · ${post.read.toUpperCase()}`;
}

function InsightPreview({ post }: { post: Post }) {
  const reduce = useReducedMotion();

  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="rm-insights-dl__preview group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
      aria-label={`Read ${post.title}`}
    >
      <div className="rm-insights-dl__preview-media">
        <motion.img
          key={post.slug}
          src={post.image}
          alt=""
          loading="lazy"
          initial={reduce ? false : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="rm-insights-dl__preview-img"
        />
        <div className="rm-insights-dl__preview-wash" />
        <div className="rm-insights-dl__preview-copy">
          <p className="rm-insights-dl__preview-kicker">{post.category.toUpperCase()}</p>
          <p className="rm-insights-dl__preview-title">{post.title}</p>
          <span className="rm-insights-dl__preview-link">Read essay →</span>
        </div>
      </div>
    </Link>
  );
}

export function InsightsHeroSection({ posts }: InsightsHeroSectionProps) {
  const featured = FEATURED_SLUGS.map((slug) => posts.find((p) => p.slug === slug)).filter(
    (p): p is Post => Boolean(p),
  );

  const [activeSlug, setActiveSlug] = useState(featured[0]?.slug ?? "");
  const activePost = featured.find((post) => post.slug === activeSlug) ?? featured[0];

  if (!activePost || featured.length < 2) return null;

  return (
    <section className={`${sectionShell} rm-section-insights`} aria-labelledby="insights-heading">
      <div className={sectionContainer}>

        {/* Header */}
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3 md:gap-8">
          <div className="hidden md:flex md:items-end" aria-hidden>
            <span
              className="select-none pointer-events-none font-bold leading-none text-white/[0.05]"
              style={{ fontSize: "clamp(5rem, 8vw, 8rem)", letterSpacing: "-0.06em" }}
            >
              05
            </span>
          </div>
          <div className="reveal flex flex-col gap-4 md:col-span-2">
            <span className="inline-flex w-fit rounded-full border border-[var(--rm-border-soft)] px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-[var(--rm-text-muted)]">
              Insights
            </span>
            <h2
              id="insights-heading"
              className="font-semibold text-[var(--rm-ink)]"
              style={{ fontSize: "clamp(1.25rem, 2.4vw, 1.9rem)", lineHeight: 1.25, letterSpacing: "-0.035em" }}
            >
              <TextReveal
                text="This quarter we are writing on positioning under pressure, pricing in regulated markets, and why agency reporting is theater."
                className="font-[inherit] text-[length:inherit] leading-[inherit] tracking-[inherit]"
                revealColor="rgb(255, 255, 255)"
              />
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="rm-insights-dl reveal" data-delay="1">
          <div className="rm-insights-dl__layout">
            <div className="rm-insights-dl__left">
              <ul className="rm-insights-dl__list" role="list">
                {featured.map((post) => {
                  const active = post.slug === activePost.slug;

                  return (
                    <li key={post.slug}>
                      <button
                        type="button"
                        aria-current={active ? "true" : undefined}
                        onMouseEnter={() => setActiveSlug(post.slug)}
                        onFocus={() => setActiveSlug(post.slug)}
                        onClick={() => setActiveSlug(post.slug)}
                        className={[
                          "rm-insights-dl__item",
                          active ? "rm-insights-dl__item--active" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <span className="rm-insights-dl__item-title">{post.title}</span>
                        <span className={`rm-insights-dl__item-meta ${textMeta}`}>
                          {postMetaLine(post)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="rm-insights-dl__footer">
                <Link to="/blog" className={btnPrimary}>All articles →</Link>
              </div>
            </div>

            <div className="rm-insights-dl__right">
              <InsightPreview post={activePost} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
