import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import quoteBg from "@/assets/engage-bg.jpg";
import {
  sectionContainer,
  sectionGridSpacer,
  sectionHeadline,
  sectionHeaderGrid,
  sectionShell,
  textValue,
} from "@/components/framer-section";
import { cn } from "@/lib/utils";

type TestimonialSectionProps = {
  quote?: string;
  authorName?: string;
};

const defaultQuote =
  "Working with Real Media has been an excellent experience for Finup. They are reliable, creative, and always professional in their approach. We're happy to recommend them as a fantastic team to work with";

function QuoteBackground() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 overflow-hidden">
      <motion.img
        src={quoteBg}
        alt=""
        loading="lazy"
        style={reduce ? undefined : { y, scale: 1.12 }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[rgb(10,10,10)]/40" />
    </div>
  );
}

export default function TestimonialSection({
  quote = defaultQuote,
  authorName = "Nikita PR FinUp",
}: TestimonialSectionProps) {
  return (
    <section
      aria-label="Client testimonial"
      className={`relative flex min-h-[min(720px,85svh)] flex-col justify-end overflow-hidden ${sectionShell}`}
    >
      <QuoteBackground />

      <div className={`relative z-[1] ${sectionContainer}`}>
        <div className={sectionHeaderGrid}>
          <div className={sectionGridSpacer} aria-hidden />

          <div className="flex flex-col gap-8 md:col-span-2 md:gap-10">
            <div
              className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white"
              aria-hidden
            >
              F
            </div>

            <blockquote className="reveal m-0 max-w-prose border-0 p-0">
              <p className={`text-balance ${sectionHeadline} leading-[1.2]`}>“{quote}”</p>
            </blockquote>
          </div>
        </div>

        <div className={`reveal ${sectionHeaderGrid}`} data-delay="1">
          <div className={sectionGridSpacer} aria-hidden />

          <footer className="md:col-span-2">
            <cite className={cn("not-italic", textValue)}>{authorName}</cite>
          </footer>
        </div>
      </div>
    </section>
  );
}
