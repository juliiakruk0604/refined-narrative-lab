import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import type { Post } from "@/lib/posts";

type InsightsHeroSectionProps = {
  posts: Post[];
};

const FEATURED_SLUGS = [
  "cross-border-fintech-scale",
  "cybersecurity-trust-building",
  "b2b-performance-marketing",
] as const;

function BlogCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.25, 0, 0, 1] }}
    >
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="group block bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300"
      >
        <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        </div>
        <div className="p-6 flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
            {post.category} · {post.date} · {post.read}
          </span>
          <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-neutral-900">
            {post.title}
          </h3>
        </div>
      </Link>
    </motion.article>
  );
}

export function InsightsHeroSection({ posts }: InsightsHeroSectionProps) {
  const featured = FEATURED_SLUGS.map((slug) => posts.find((p) => p.slug === slug)).filter(
    (p): p is Post => Boolean(p),
  );

  if (featured.length === 0) return null;

  return (
    <section
      className="bg-[#0a0a0a] border-b border-white/10 py-16 md:py-[120px] px-5 md:px-10"
      aria-labelledby="insights-heading"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12">
        {/* Top row: tag + headline + CTA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2.5 items-end">
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-white/50 border border-white/20 rounded-full px-4 py-1.5">
              Insights
            </span>
          </div>
          <h2
            id="insights-heading"
            className="md:col-span-2 text-[32px] md:text-[40px] leading-[1.15] font-semibold tracking-tight text-white reveal"
          >
            This quarter we are writing on positioning under pressure, pricing in regulated markets,
            and why agency reporting is theater.
          </h2>
        </div>

        {/* CTA */}
        <div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white border border-white rounded-full px-5 py-2.5 transition-colors duration-200 hover:bg-white hover:text-neutral-900"
          >
            All articles →
          </Link>
        </div>

        {/* 3 blog cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-3">
          {featured.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
