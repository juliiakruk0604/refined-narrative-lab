import { Link } from "@tanstack/react-router";

import {
  FramerPrimaryButton,
  interactiveSurfaceCard,
  sectionActionRow,
  sectionContainer,
  sectionContentGrid,
  sectionGridSpacer,
  sectionHeadline,
  sectionPill,
  sectionShell,
  SectionHeader,
  surfaceCardPadding,
  surfaceCardSeparator,
  textCardBody,
  textMeta,
  textMetric,
} from "@/components/framer-section";
import { SurfaceCard } from "@/components/surface-card";
import { TextReveal } from "@/components/text-reveal";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const featuredCases = [
  {
    cardKey: "featured-tequila-cpa-network",
    to: "/cases" as const,
    tag: "CPA Network / Tequila CPA",
    title:
      "We built Tequila CPA Network's brand from the ground up, grew their partner base, and hit all key launch targets.",
    label: "Brand growth in 6 mo",
    metric: "+35%",
    footerRight: "Read Case →",
  },
  {
    cardKey: "featured-currency-exchange",
    to: "/cases" as const,
    tag: "Cryptocurrency exchange / Currency",
    title:
      "We scaled user base across EMEA, Americas, and APAC through 270+ influencer videos across finance, tech, and economics channels.",
    label: "New accounts created in 6 mo",
    metric: "+30 878",
    footerRight: "Read Case →",
  },
] as const;

function progressFromMetric(metric: string) {
  const match = metric.match(/(\d+)\s*%/);
  return match ? Number(match[1]) : 65;
}

function CaseProgressBar({ value, footerRight }: { value: number; footerRight: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-1 w-full overflow-visible rounded-full bg-white/10">
        <div
          className="relative h-full rounded-full bg-rm-accent"
          style={{ width: `${Math.min(100, Math.max(8, value))}%` }}
        >
          <span
            aria-hidden
            className="absolute -right-1.5 top-1/2 size-3 -translate-y-1/2 rounded-full bg-rm-accent"
          />
        </div>
      </div>

      <Separator className={surfaceCardSeparator} />

      <div className="flex justify-end">
        <span className="text-sm font-medium text-white/40 transition-colors group-hover:text-white/75 group-focus-visible:text-white/75">
          {footerRight}
        </span>
      </div>
    </div>
  );
}

function CaseBentoCard({
  to,
  tag,
  title,
  label,
  metric,
  footerRight,
}: {
  to: "/cases";
  tag: string;
  title: string;
  label: string;
  metric: string;
  footerRight: string;
}) {
  const progress = progressFromMetric(metric);

  return (
    <Link
      to={to}
      aria-label={`${tag}. ${metric} ${label}. ${title}`}
      className={cn("group block h-full cursor-pointer", interactiveSurfaceCard)}
    >
      <SurfaceCard className={cn("h-full gap-6", surfaceCardPadding)}>
        <div className="flex flex-col gap-4">
          <span className={sectionPill}>
            <span className="text-balance">{tag}</span>
          </span>
          <p className={`line-clamp-3 max-w-prose ${textCardBody}`}>{title}</p>
        </div>

        <div className="mt-auto flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className={textMeta}>{label}</p>
            <p className={textMetric}>{metric}</p>
          </div>

          <CaseProgressBar value={progress} footerRight={footerRight} />
        </div>
      </SurfaceCard>
    </Link>
  );
}

export function CasesSection() {
  return (
    <section id="cases" aria-labelledby="cases-heading" className={sectionShell}>
      <div className={sectionContainer}>
        <SectionHeader tag="Selected case studies">
          <h2 id="cases-heading" className="sr-only">
            Selected case studies
          </h2>
          <TextReveal text="Results we deliver." className={sectionHeadline} />
        </SectionHeader>

        <div className={`reveal ${sectionContentGrid}`} data-delay="1">
          <div className={sectionGridSpacer} aria-hidden />

          {featuredCases.map(({ cardKey, ...item }) => (
            <CaseBentoCard key={cardKey} {...item} />
          ))}
        </div>

        <div className={`reveal ${sectionActionRow}`} data-delay="2">
          <FramerPrimaryButton to="/cases">View all cases →</FramerPrimaryButton>
        </div>
      </div>
    </section>
  );
}
