import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

type TextRevealProps = {
  text: string;
  className?: string;
  baseColor?: string;
  revealColor?: string;
};

function RevealWord({
  children,
  progress,
  range,
  baseColor,
  revealColor,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  baseColor: string;
  revealColor: string;
}) {
  const color = useTransform(progress, range, [baseColor, revealColor]);
  return (
    <motion.span style={{ color }} className="inline">
      {children}{" "}
    </motion.span>
  );
}

export function TextReveal({
  text,
  className,
  baseColor = "rgb(153, 153, 153)",
  revealColor = "rgb(255, 255, 255)",
}: TextRevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.35"],
  });

  const words = text.trim().split(/\s+/);

  if (reduce) {
    return (
      <p className={className} style={{ color: revealColor }}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => {
        const start = index / words.length;
        const end = Math.min(1, (index + 1.5) / words.length);
        return (
          <RevealWord
            key={`${word}-${index}`}
            progress={scrollYProgress}
            range={[start, end]}
            baseColor={baseColor}
            revealColor={revealColor}
          >
            {word}
          </RevealWord>
        );
      })}
    </p>
  );
}
