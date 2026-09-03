import { Calendar, Clock, Tag } from "iconsax-react";
import { Link } from "@tanstack/react-router";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

import { BlogPostImage } from "@/components/blog-post-image";
import {
  BtnArrow,
  DURATION_ENTER,
  EASE_ENTER,
  FlipLabel,
  surfaceCardTitle,
  textMeta,
} from "@/components/framer-section";
import { TRIGGER_VIEWPORT_MARGIN } from "@/components/motion-bits";
import type { Post } from "@/lib/posts";
import { cn } from "@/lib/utils";

/** Step between photo → meta → title → button within one card, once that
 * card's own reveal has started. */
const ITEM_STEP = 0.12;

export function PostMetaLine({ post }: { post: Post }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", textMeta)}>
      <span className="inline-flex items-center gap-2">
        <Tag size={14} variant="Bold" color="currentColor" aria-hidden />
        {post.label}
      </span>
      <span aria-hidden className="text-[var(--rm-text-muted)]">
        ·
      </span>
      <time dateTime={post.dateISO} className="inline-flex items-center gap-2">
        <Calendar size={14} variant="Bold" color="currentColor" aria-hidden />
        {post.date}
      </time>
      <span aria-hidden className="text-[var(--rm-text-muted)]">
        ·
      </span>
      <span className="inline-flex items-center gap-2">
        <Clock size={14} variant="Bold" color="currentColor" aria-hidden />
        {post.read}
      </span>
    </div>
  );
}

/** Conventional blog card — image, meta line, title, "Read article".
 * Shared between the archive grid (/blog) and the home page's Insights teaser.
 *
 * `revealDelay` is opt-in: pass a number (seconds) to have the card's own
 * elements rise in one after another — photo, then meta, then title, then
 * button — once the card scrolls into view, starting at that delay (the
 * archive page stages cards itself via its own `.reveal[data-delay]`
 * wrapper, so it deliberately doesn't pass this and gets the old static
 * render). */
export function BlogPostCard({
  post,
  className,
  revealDelay,
}: {
  post: Post;
  className?: string;
  revealDelay?: number;
}) {
  const containImage = post.imageFit === "contain";
  const reduced = useReducedMotion();
  const animated = revealDelay !== undefined && !reduced;
  const cardRef = useRef<HTMLElement>(null);
  const inView = useInView(cardRef, { once: true, amount: 0.2, margin: TRIGGER_VIEWPORT_MARGIN });
  const show = !animated || inView;

  const itemProps = (step: number) =>
    animated
      ? {
          initial: { opacity: 0, y: 16 } as const,
          animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
          transition: {
            duration: DURATION_ENTER,
            ease: EASE_ENTER,
            delay: (revealDelay ?? 0) + step * ITEM_STEP,
          },
        }
      : {};

  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className={cn(
        "group flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        className,
      )}
    >
      <article ref={cardRef} className="flex h-full flex-col">
        <motion.figure
          {...itemProps(0)}
          className={cn(
            "hover-zoom card-cover relative mb-4 aspect-[3/2] overflow-hidden rounded-3xl border border-[var(--rm-border-soft)] bg-[var(--rm-surface-float)]",
            containImage && "flex items-center justify-center",
          )}
        >
          <BlogPostImage
            post={post}
            frame="landscape"
            width={1024}
            height={768}
            className={containImage ? "p-4" : undefined}
          />
        </motion.figure>
        <motion.div {...itemProps(1)}>
          <PostMetaLine post={post} />
        </motion.div>
        <motion.h3 {...itemProps(2)} className={cn("mt-3 flex-1", surfaceCardTitle)}>
          {post.title}
        </motion.h3>
        <motion.span
          {...itemProps(3)}
          className="mt-6 inline-flex items-center gap-3 text-sm font-medium text-[var(--rm-text-muted)] transition-colors group-hover:text-[var(--rm-ink)]"
        >
          <FlipLabel text="Read article" />
          <BtnArrow />
        </motion.span>
      </article>
    </Link>
  );
}
