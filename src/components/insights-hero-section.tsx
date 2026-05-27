import { Link } from "@tanstack/react-router";

import { TextReveal } from "@/components/text-reveal";
import type { Post } from "@/lib/posts";

type InsightsHeroSectionProps = {
  posts: Post[];
};

const FEATURED_SLUGS = [
  "cross-border-fintech-scale",
  "cybersecurity-trust-building",
] as const;

function Tag({ children }: { children: string }) {
  return (
    <span className="inline-block rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-white/50">
      {children}
    </span>
  );
}

function PlusIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M16 8V24M8 16H24" stroke="rgb(122, 122, 122)" strokeWidth="1.5" />
    </svg>
  );
}

function BlogTile({ post }: { post: Post }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group flex flex-col gap-4"
    >
      <div className="aspect-[0.793] overflow-hidden rounded-3xl bg-white/5">
        <img
          src={post.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-[-0.04em] text-white/45">{post.date}</p>
        <h3 className="text-[20px] font-semibold leading-[1.4] tracking-[-0.04em] text-white md:text-[22px]">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

export function InsightsHeroSection({ posts }: InsightsHeroSectionProps) {
  const featured = FEATURED_SLUGS.map((slug) => posts.find((p) => p.slug === slug)).filter(
    (p): p is Post => Boolean(p),
  );

  if (featured.length < 2) return null;

  const [firstPost, secondPost] = featured;

  return (
    <section
      className="border-b border-white/10 bg-[#0a0a0a] px-5 py-16 md:px-10 md:py-[120px]"
      aria-labelledby="insights-heading"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 md:gap-16">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3 md:gap-2.5">
          <div className="reveal">
            <Tag>Insights</Tag>
          </div>

          <div className="reveal md:col-span-2 md:max-w-[64%]" data-delay="1">
            <TextReveal
              text="Our blog shares insights on branding, digital design, and websites that perform."
              className="w-[92%] text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[110%] tracking-[-0.06em]"
            />
          </div>
        </div>

        <div className="reveal grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-3" data-delay="2">
          <div className="flex flex-col justify-between gap-8 py-4 md:max-w-[360px] md:gap-8 md:pb-16 md:pt-4">
            <div className="flex w-[80%] items-start justify-between">
              <PlusIcon />
              <PlusIcon />
            </div>

            <div className="flex flex-col gap-8">
              <p className="max-w-[80%] text-[18px] font-medium leading-[1.3] tracking-[-0.04em] text-white/60 md:text-[20px]">
                From practical advice on building better websites to honest takes on branding
                mistakes we see too often.
              </p>

              <Link
                to="/blog"
                className="inline-flex w-fit items-center rounded-full bg-white px-6 py-3 text-sm font-semibold tracking-[-0.04em] text-black transition-colors hover:bg-white/85"
              >
                Discover all articles
              </Link>
            </div>
          </div>

          <BlogTile post={firstPost} />
          <BlogTile post={secondPost} />
        </div>
      </div>
    </section>
  );
}
