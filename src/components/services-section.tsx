import {
  FramerTag,
  PlusIcon,
  sectionContainer,
  sectionHeaderGrid,
  sectionShell,
} from "@/components/framer-section";

const engagements = [
  {
    name: "Sprint",
    time: "From 4 weeks",
    intro:
      "Fast start for brands that don't want to spend months on planning. We dive straight into execution, taking over your chosen channels from week one.",
    steps: [
      "01 — SETUP: free audit and channel selection (SMM, PR, SEO, Performance, Design, Messaging)",
      "02 — RUN: weekly updates, monthly reports, on-demand analytics and recommendations",
      "03 — HANDOVER: final deliverable with a clear roadmap and 100% asset & content ownership",
    ],
  },
  {
    name: "Marathon",
    time: "From 2 months",
    intro:
      "Strategy followed by execution. For brands launching from scratch, rebranding, or entering new markets. We build your positioning and run your marketing channels.",
    steps: [
      "01 — STRATEGY: deep-dive workshop, market analysis, brand positioning, and GTM planning",
    ],
  },
] as const;

function PricingCard({
  name,
  time,
  intro,
  steps,
  index,
}: {
  name: string;
  time: string;
  intro: string;
  steps: readonly string[];
  index: number;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-white p-3">
      <div className="flex flex-col gap-10 border-b border-neutral-200 px-4 py-6 md:px-5 md:py-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <p className="text-[18px] font-medium leading-[1.3] tracking-[-0.04em] text-neutral-900 md:text-[20px]">
              {name}
            </p>
            <p className="text-[clamp(1.25rem,2vw,1.75rem)] font-semibold leading-[1.3] tracking-[-0.04em] text-neutral-900">
              {time}
            </p>
          </div>
          <span className="text-[40px] font-semibold leading-none tracking-[-0.05em] text-neutral-200 tabular-nums md:text-[48px]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <p className="max-w-[36ch] text-[15px] leading-[1.65] text-neutral-500">{intro}</p>
      </div>

      <div className="flex flex-col gap-4 px-4 py-6 md:px-5">
        {steps.map((step) => (
          <p key={step} className="text-[13px] leading-[1.6] text-neutral-500">
            {step}
          </p>
        ))}
      </div>
    </article>
  );
}

export function ServicesSection() {
  return (
    <section id="engage" aria-labelledby="services-heading" className={sectionShell}>
      <div className={sectionContainer}>
        <div className={sectionHeaderGrid}>
          <div className="reveal">
            <FramerTag>Pricing</FramerTag>
          </div>

          <div className="reveal md:col-span-2 md:max-w-[64%]" data-delay="1">
            <h2 id="services-heading" className="sr-only">
              Pricing
            </h2>
            <div className="flex w-full max-w-[320px] items-start justify-between opacity-80">
              <PlusIcon />
              <PlusIcon />
              <PlusIcon />
            </div>
          </div>
        </div>

        <div className="reveal grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-2" data-delay="2">
          {engagements.map((e, i) => (
            <PricingCard key={e.name} {...e} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
