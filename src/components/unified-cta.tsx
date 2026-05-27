import { Link } from "@tanstack/react-router";

import { MagneticButton, Reveal } from "@/components/motion-bits";

type CTAProps = {
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  primaryLabel?: string;
  primaryTo?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  secondaryHref?: string;
};

export function UnifiedCTA({
  eyebrow,
  title = "Tell us what needs fixing",
  titleAccent = "New launch, a raise, or marketing that doesn't perform.",
  primaryLabel = "Get free audit",
  primaryTo = "/audit",
  primaryHref,
  secondaryLabel = "See case studies",
  secondaryTo = "/cases",
  secondaryHref,
}: Partial<CTAProps> & { title?: string }) {
  return (
    <section
      id="cta"
      aria-labelledby="unified-cta-heading"
      className="relative overflow-hidden border-b border-white/10 px-6 py-20 sm:px-10 md:px-20 md:py-28 lg:px-32"
    >
      <div className="mx-auto flex max-w-[40rem] flex-col items-center text-center">
        {eyebrow ? (
          <Reveal duration={0.5}>
            <p className="mb-8 text-[11px] uppercase tracking-[0.28em] text-white/45">{eyebrow}</p>
          </Reveal>
        ) : null}
        <Reveal duration={0.5}>
          <h2
            id="unified-cta-heading"
            className="w-full text-[35px] font-medium leading-[0.94] tracking-[-0.045em] text-white sm:text-[48px] md:text-[58px] lg:text-[64px]"
          >
            <span className="block text-balance">{title}</span>
            {titleAccent ? (
              <span className="mt-1 block text-balance font-light text-white/48">{titleAccent}</span>
            ) : null}
          </h2>
        </Reveal>
        <Reveal delay={0.1} duration={0.5}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {primaryHref ? (
              <MagneticButton
                href={primaryHref}
                strength={8}
                className="inline-flex rm-touch items-center rounded-full bg-white px-6 py-3.5 text-[13px] font-medium text-black transition-[background-color,transform] duration-150 ease-out hover:-translate-y-0.5 hover:bg-[#efeeea]"
              >
                {primaryLabel}
              </MagneticButton>
            ) : (
              <Link
                to={primaryTo ?? "/audit"}
                className="inline-flex rm-touch items-center rounded-full bg-white px-6 py-3.5 text-[13px] font-medium text-black transition-[background-color,transform] duration-150 ease-out hover:-translate-y-0.5 hover:bg-[#efeeea]"
              >
                {primaryLabel}
              </Link>
            )}
            {secondaryHref ? (
              <MagneticButton
                href={secondaryHref}
                strength={6}
                className="inline-flex rm-touch items-center rounded-full border border-white/20 px-6 py-3.5 text-[13px] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white"
              >
                {secondaryLabel}
              </MagneticButton>
            ) : (
              <Link
                to={secondaryTo ?? "/cases"}
                className="inline-flex rm-touch items-center rounded-full border border-white/20 px-6 py-3.5 text-[13px] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white"
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
