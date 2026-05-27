import { Link } from "@tanstack/react-router";

import {
  btnGhostLink,
  btnPrimarySm,
  sectionContainer,
  sectionContentGrid,
  sectionGridSpacer,
  sectionShell,
  SectionHeader,
  surfaceCardPadding,
  surfaceCardSeparator,
  surfaceCardTitle,
  surfaceCardTitleLg,
  textCardBody,
  textMeta,
} from "@/components/framer-section";
import { SurfaceCard } from "@/components/surface-card";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { homepageEngagements, type Engagement, type EngagementStep } from "@/lib/engagements";
import { cn } from "@/lib/utils";

function PricingStep({ step, showAuditLink }: { step: EngagementStep; showAuditLink?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <p className={cn("uppercase", textMeta)}>
        {step.code} — {step.title}:
      </p>
      <p className={textCardBody}>
        {showAuditLink ? (
          <>
            <Link
              to="/audit"
              className="font-medium text-white/80 underline decoration-white/25 underline-offset-2 transition-colors hover:text-white hover:decoration-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] rounded-sm"
            >
              Free audit
            </Link>
            {step.body.replace(/^free audit/i, "")}
          </>
        ) : (
          step.body
        )}
      </p>
    </div>
  );
}

function PricingCard({ engagement }: { engagement: Engagement }) {
  return (
    <SurfaceCard className="min-h-[min(520px,100%)]">
      <CardHeader className={cn("gap-4 space-y-0", surfaceCardPadding)}>
        <div className="flex flex-col gap-2">
          <CardDescription className={cn("uppercase", textMeta)}>{engagement.name}</CardDescription>
          <CardTitle className={surfaceCardTitleLg}>{engagement.time}</CardTitle>
        </div>
        <p className={cn("max-w-prose", textCardBody)}>{engagement.intro}</p>
      </CardHeader>

      <Separator className={surfaceCardSeparator} />

      <CardContent className={cn("flex flex-1 flex-col gap-4", surfaceCardPadding, "pt-6 md:pt-8")}>
        {engagement.steps.map((step) => (
          <PricingStep
            key={`${engagement.id}-${step.code}`}
            step={step}
            showAuditLink={engagement.id === "sprint" && step.code === "01"}
          />
        ))}
      </CardContent>

      <Separator className={surfaceCardSeparator} />

      <CardFooter className={cn("flex flex-wrap items-center justify-between gap-4", surfaceCardPadding)}>
        <Button asChild variant="ghost" className={cn("h-auto min-h-11 hover:bg-transparent", btnGhostLink)}>
          <Link to="/products">Compare formats →</Link>
        </Button>
        <Button asChild className={cn("h-auto", btnPrimarySm)}>
          <Link to="/contact" search={{ engagement: engagement.id }}>
            {engagement.ctaLabel}
          </Link>
        </Button>
      </CardFooter>
    </SurfaceCard>
  );
}

export function ServicesSection() {
  return (
    <section id="engage" aria-labelledby="engage-heading" className={sectionShell}>
      <h2 id="engage-heading" className="sr-only">
        Engagement formats
      </h2>
      <div className={sectionContainer}>
        <SectionHeader tag="Engagement formats" />

        <div className={`reveal ${sectionContentGrid}`} data-delay="1">
          <div className={sectionGridSpacer} aria-hidden />

          {homepageEngagements.map((engagement) => (
            <PricingCard key={engagement.id} engagement={engagement} />
          ))}
        </div>
      </div>
    </section>
  );
}
