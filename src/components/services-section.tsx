import { sectionContainer, sectionShell } from "@/components/framer-section";

const engagements = [
  {
    name: "Sprint",
    time: "From 4 weeks",
    intro: [
      "Fast start for brands that don't want to spend months on planning. We dive straight into execution, taking over your chosen channels from week one.",
    ],
    steps: [
      "01 — SETUP: free audit and channel selection (SMM, PR, SEO, Performance, Design, Messaging)",
      "02 — RUN: weekly updates, monthly reports, on-demand analytics and recommendations",
      "03 — HANDOVER: final deliverable with a clear roadmap and 100% asset & content ownership",
    ],
  },
  {
    name: "Marathon",
    time: "From 2 months",
    intro: [
      "Strategy followed by execution. For brands launching from scratch, rebranding, or entering new markets. We build your positioning and run your marketing channels.",
    ],
    steps: [
      "01 — STRATEGY: deep-dive workshop, market analysis, brand positioning, and GTM planning",
      "02 — ACTION: full-scale execution across SMM, PR, SEO, Performance, and active Brand Management",
      "03 — HANDOVER: final brand guidelines, operational channels, 100% asset & content ownership",
    ],
  },
] as const;

function parseStep(step: string) {
  const match = step.match(/^(\d{2})\s—\s([^:]+):\s*(.+)$/);
  if (!match) {
    return { code: "", title: step, body: "" };
  }

  return {
    code: match[1],
    title: match[2].trim(),
    body: match[3].trim(),
  };
}

function PricingStep({ step }: { step: string }) {
  const { code, title, body } = parseStep(step);

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-neutral-400">
        {code ? `${code} — ${title}` : title}
      </p>
      {body ? <p className="text-sm leading-relaxed text-neutral-600">{body}</p> : null}
    </div>
  );
}

function PricingCard({
  name,
  time,
  intro,
  steps,
  index,
}: {
  name: string;
  time: string;
  intro: readonly string[];
  steps: readonly string[];
  index: number;
}) {
  return (
    <article className="flex min-h-[420px] flex-col overflow-hidden rounded-3xl bg-white md:min-h-[440px]">
      <div className="flex flex-col gap-6 border-b border-neutral-200 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-neutral-500">{name}</p>
            <p className="text-xl font-semibold leading-snug tracking-[-0.03em] text-neutral-900 md:text-2xl">
              {time}
            </p>
          </div>
          <span
            aria-hidden
            className="text-2xl font-semibold leading-none tracking-[-0.04em] text-neutral-200 tabular-nums"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="flex max-w-prose flex-col gap-4">
          {intro.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-neutral-600 md:text-base">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
        {steps.map((step) => (
          <PricingStep key={step} step={step} />
        ))}
      </div>
    </article>
  );
}

export function ServicesSection() {
  return (
    <section id="engage" aria-label="Pricing" className={sectionShell}>
      <div className={sectionContainer}>
        <div className="reveal grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-2">
          {engagements.map((e, i) => (
            <PricingCard key={e.name} {...e} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
