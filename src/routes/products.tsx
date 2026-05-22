import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check, MoveRight } from "lucide-react";

import { Reveal } from "@/components/motion-bits";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products | Sprint and Marathon | R-M" },
      {
        name: "description",
        content:
          "Choose the R-M product format that fits the work: a focused Sprint or an embedded Marathon.",
      },
      { property: "og:title", content: "Products | R-M" },
      {
        property: "og:description",
        content: "Two product formats for teams that need sharper growth decisions.",
      },
    ],
  }),
  component: ProductsPage,
});

const formats = [
  {
    index: "(01)",
    id: "sprint",
    name: "sprint",
    window: "2-6 weeks",
    promise: "one urgent growth problem, fixed with focus.",
    summary:
      "A tight engagement for positioning, channel diagnosis, launch planning, and the conversion bottleneck that is costing the next move.",
    outputs: ["Positioning audit", "Experiment stack", "Conversion review"],
  },
  {
    index: "(02)",
    id: "marathon",
    name: "marathon",
    window: "3-12 months",
    promise: "an embedded partner for compound market pressure.",
    summary:
      "A retained product for teams building a category over time. Narrative, experiments, advisory, and iteration stay in one operating system.",
    outputs: ["Narrative architecture", "Monthly experiments", "Strategic advisory"],
  },
];

const modules = [
  {
    title: "Find the lever",
    copy: "We isolate the message, channel, or funnel point that changes the next decision fastest.",
    mark: "signal",
  },
  {
    title: "Build the runbook",
    copy: "Creative, copy, owners, metrics, cadence. The output is made to ship, not sit in a deck.",
    mark: "system",
  },
  {
    title: "Stay in the room",
    copy: "Sprint leaves a clean handoff. Marathon keeps the strategic pressure on every month.",
    mark: "cadence",
  },
];

const comparisonRows = [
  { label: "Best for", sprint: "One clear problem", marathon: "Compound growth" },
  { label: "Cadence", sprint: "Daily working loop", marathon: "Weekly strategy loop" },
  { label: "Output", sprint: "Fixed deliverables", marathon: "Rolling experiment log" },
  { label: "Team fit", sprint: "Founder or growth lead", marathon: "Cross-functional leadership" },
];

function ProductsPage() {
  return (
    <div className="products-page rm-page selection:bg-rm-accent selection:text-black">
      <SiteHeader variant="dark" />
      <main className="overflow-x-hidden">
        <Hero />
        <Formats />
        <Modules />
        <Comparison />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="products-sheet px-4 pb-5 pt-8 md:px-12 md:pb-8 md:pt-12">
      <div className="mx-auto max-w-[1440px] border products-border bg-products-paper">
        <Reveal>
          <div className="grid gap-3 border-b products-border px-4 py-4 text-[10px] font-bold uppercase tracking-[0.22em] products-dim sm:grid-cols-2 md:grid-cols-4 md:px-7">
            <span>R-M / products</span>
            <span className="sm:text-right md:text-left">Sprint + Marathon</span>
            <span>For competitive categories</span>
            <span className="sm:text-right">2026 edition</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-12 gap-4 px-4 py-5 md:gap-6 md:px-7 md:py-7">
          <Reveal className="col-span-12 md:col-span-5">
            <p className="products-kicker">
              <span className="products-cross" aria-hidden />
              Two formats. One growth system.
            </p>
            <h1 className="mt-10 max-w-[5.4ch] text-[clamp(4.5rem,12vw,13.5rem)] font-extrabold lowercase leading-[0.8] tracking-[-0.08em] products-ink">
              products<span className="products-accent">.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.05} className="col-span-12 md:col-span-7">
            <div className="grid h-full gap-4 lg:grid-cols-[1fr_17rem]">
              <article className="products-proof min-h-[25rem] overflow-hidden p-4 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/48">
                    / product ledger
                  </p>
                  <span className="products-badge">2 lanes</span>
                </div>

                <p className="mt-16 max-w-[12ch] text-[clamp(2.15rem,4.1vw,5.4rem)] font-bold lowercase leading-[0.9] tracking-[-0.065em] text-white">
                  Choose the pace that matches the pressure.
                </p>

                <div className="mt-8 grid gap-px bg-white/15 sm:grid-cols-2">
                  {formats.map((format) => (
                    <a
                      key={format.id}
                      href={`#${format.id}`}
                      className="group bg-[oklch(0.14_0.006_40)] p-4 transition-colors duration-200 hover:bg-[oklch(0.19_0.012_40)]"
                    >
                      <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-white/38">
                        {format.index} / {format.window}
                      </span>
                      <span className="mt-4 flex items-end justify-between gap-3 text-[2rem] font-bold lowercase leading-none tracking-[-0.055em] text-white">
                        {format.name}
                        <ArrowUpRight className="h-5 w-5 shrink-0 text-rm-accent transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </a>
                  ))}
                </div>
              </article>

              <aside className="products-ticket flex min-h-[25rem] flex-col justify-between p-4 md:p-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] products-dim">
                    As of now
                  </p>
                  <p className="mt-8 text-[clamp(1.7rem,2.7vw,3.1rem)] font-semibold lowercase leading-[0.95] tracking-[-0.055em] products-ink">
                    strategy made operational.
                  </p>
                </div>
                <div className="border-t products-border pt-4">
                  <p className="max-w-[22ch] text-sm leading-6 products-copy">
                    Not a service menu. A pair of formats designed to move through real work.
                  </p>
                  <Link
                    to="/contact"
                    className="mt-5 inline-flex min-h-11 items-center gap-2 bg-products-ink px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-products-paper transition-colors duration-200 hover:bg-rm-accent hover:text-black"
                  >
                    Scope the fit <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </aside>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.1}>
        <div className="products-reel mx-auto max-w-[1440px] overflow-hidden border-x border-b products-border bg-products-ink">
          <div className="flex min-w-max items-end gap-8 px-4 py-4 md:px-7">
            <span className="pb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-white/42">
              / make the next move legible
            </span>
            <p className="text-[clamp(3.5rem,10.4vw,11.5rem)] font-extrabold lowercase leading-[0.78] tracking-[-0.085em] products-flare">
              pick your pace.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Formats() {
  return (
    <section className="products-sheet px-4 py-14 md:px-12 md:py-24">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-4 md:gap-6">
        <Reveal className="col-span-12 md:col-span-4">
          <div className="products-sticky border-t products-border pt-5">
            <p className="products-kicker">
              <span className="products-cross" aria-hidden />
              Formats
            </p>
            <h2 className="mt-8 max-w-[7ch] text-[clamp(2.7rem,5vw,6.2rem)] font-bold lowercase leading-[0.88] tracking-[-0.07em] products-ink">
              select the engagement.
            </h2>
            <p className="mt-8 max-w-[31ch] text-sm leading-6 products-copy">
              Sprint compresses the work. Marathon compounds it. Both start from the market signal,
              not an agency checklist.
            </p>
          </div>
        </Reveal>

        <div className="col-span-12 md:col-span-8">
          {formats.map((format, index) => (
            <Reveal key={format.id} delay={index * 0.06}>
              <article
                id={format.id}
                className="products-format grid scroll-mt-28 gap-5 border-t products-border py-6 last:border-b md:grid-cols-[5.25rem_minmax(0,1fr)_16rem] md:gap-6 md:py-8"
              >
                <p className="pt-1 text-[11px] font-bold uppercase tracking-[0.24em] products-dim">
                  {format.index}
                </p>
                <div>
                  <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
                    <h3 className="text-[clamp(2.7rem,6vw,7.3rem)] font-extrabold lowercase leading-[0.82] tracking-[-0.08em] products-ink">
                      {format.name}
                    </h3>
                    <span className="mb-2 border products-border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] products-dim">
                      {format.window}
                    </span>
                  </div>
                  <p className="mt-5 max-w-[17ch] text-[clamp(1.55rem,2.7vw,3.05rem)] font-semibold lowercase leading-[0.98] tracking-[-0.055em] products-ink">
                    {format.promise}
                  </p>
                  <p className="mt-5 max-w-[48ch] text-sm leading-6 products-copy md:text-[15px]">
                    {format.summary}
                  </p>
                </div>
                <div className="products-output self-stretch p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] products-dim">
                    Included
                  </p>
                  <ul className="mt-5 grid gap-4">
                    {format.outputs.map((output) => (
                      <li key={output} className="flex items-start gap-3 text-sm font-medium products-ink">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-rm-accent" />
                        {output}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Modules() {
  return (
    <section className="products-block px-4 py-14 text-white md:px-12 md:py-24">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <div className="grid gap-5 border-b border-white/15 pb-7 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="products-kicker products-kicker-dark">
                <span className="products-cross" aria-hidden />
                What ships
              </p>
              <h2 className="mt-8 max-w-[8ch] text-[clamp(2.8rem,6vw,7.4rem)] font-extrabold lowercase leading-[0.84] tracking-[-0.08em]">
                a format with teeth.
              </h2>
            </div>
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center gap-3 justify-self-start border border-white/25 px-5 text-[11px] font-bold uppercase tracking-[0.22em] transition-colors duration-200 hover:border-rm-accent hover:text-rm-accent"
            >
              Open a scope <MoveRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-5 grid gap-px bg-white/15 md:grid-cols-3">
          {modules.map((module, index) => (
            <Reveal key={module.title} delay={index * 0.05}>
              <article className="products-module min-h-[21rem] bg-products-ink p-5 md:p-7">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/35">
                    0{index + 1}
                  </span>
                  <span className="products-badge products-badge-dark">{module.mark}</span>
                </div>
                <h3 className="mt-20 max-w-[9ch] text-[clamp(2rem,3.5vw,4.2rem)] font-bold lowercase leading-[0.9] tracking-[-0.065em]">
                  {module.title}
                </h3>
                <p className="mt-5 max-w-[34ch] text-sm leading-6 text-white/62">{module.copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  return (
    <section className="products-sheet px-4 pb-24 pt-14 md:px-12 md:pb-32 md:pt-24">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-4 md:gap-6">
        <Reveal className="col-span-12 md:col-span-5">
          <div className="border-t products-border pt-5">
            <p className="products-kicker">
              <span className="products-cross" aria-hidden />
              Fit check
            </p>
            <h2 className="mt-8 max-w-[8ch] text-[clamp(2.6rem,5vw,5.7rem)] font-bold lowercase leading-[0.9] tracking-[-0.07em] products-ink">
              unsure where to start?
            </h2>
            <p className="mt-6 max-w-[34ch] text-sm leading-6 products-copy">
              Book one call. We will tell you which format fits, or why neither does yet.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex min-h-12 items-center gap-2 bg-rm-accent px-5 text-[11px] font-bold uppercase tracking-[0.22em] text-black transition-colors duration-200 hover:bg-products-ink hover:text-products-paper"
            >
              Book a call <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="col-span-12 md:col-span-7">
          <div className="border products-border bg-products-paper">
            <div className="grid grid-cols-[minmax(7rem,0.8fr)_1fr_1fr] border-b products-border text-[10px] font-bold uppercase tracking-[0.22em] products-dim">
              <span className="p-4 md:p-5">Measure</span>
              <span className="border-l products-border p-4 md:p-5 products-accent">Sprint</span>
              <span className="border-l products-border p-4 md:p-5 products-accent">Marathon</span>
            </div>
            {comparisonRows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[minmax(7rem,0.8fr)_1fr_1fr] border-b products-border last:border-b-0"
              >
                <span className="p-4 text-[10px] font-bold uppercase tracking-[0.22em] products-dim md:p-5">
                  {row.label}
                </span>
                <span className="border-l products-border p-4 text-sm font-medium leading-6 products-ink md:p-5">
                  {row.sprint}
                </span>
                <span className="border-l products-border p-4 text-sm font-medium leading-6 products-ink md:p-5">
                  {row.marathon}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
