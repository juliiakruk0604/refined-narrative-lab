export type ServiceSlug =
  | "smm"
  | "pr"
  | "performance"
  | "seo"
  | "brand"
  | "design";

export type ServiceContent = {
  slug: ServiceSlug;
  name: string;
  shortName: string;
  tagline: string;
  rotate: string[];
  heroTitlePrefix: string;
  heroTitleSuffix: string;
  heroIntro: string;
  position: {
    title: string;
    accent: string;
    body: string;
  };
  pillars: {
    n: string;
    kicker: string;
    title: string;
    body: string;
    deliverables: string[];
  }[];
  outcomes: {
    n: string;
    title: string;
    body: string;
  }[];
  testimonial: {
    quote: string;
    who: string;
    role: string;
  };
  accent: string;
};

const seo: ServiceContent = {
  slug: "seo",
  name: "SEO",
  shortName: "SEO",
  tagline: "Intent, compound, authority.",
  rotate: ["INTENT", "COMPOUND", "LEADERSHIP", "AUTHORITY"],
  heroTitlePrefix: "SEO built on",
  heroTitleSuffix: "— not keyword sludge.",
  heroIntro:
    "We don't rent you traffic. We build the intent map, leadership content and authority footprint that make organic your most defensible channel.",
  position: {
    title: "We don't sell SEO traffic.",
    accent:
      "We build category authority that compounds for years after the engagement ends.",
    body:
      "The market is loaded with agencies optimising for impressions, anchor-text spam and AI-generated word count. That model dies on every Google update. Ours doesn't — because authority earned by real operators on real intent is the moat algorithms reward.",
  },
  pillars: [
    {
      n: "01",
      kicker: "Strategy",
      title: "Intent map, not keyword list.",
      body: "We reverse-engineer the buying journey of your ICP — from category-defining searches to bottom-funnel comparisons. The output is a living intent map, not a 4 000-row keyword spreadsheet nobody opens.",
      deliverables: ["ICP intent map", "Category narrative", "Topical authority blueprint", "Competitor gap audit", "12-month roadmap"],
    },
    {
      n: "02",
      kicker: "Content",
      title: "Leadership content. Not SEO sludge.",
      body: "Pieces written with your senior operators — opinionated, original, sourced. Each one earns links because it deserves them. We ship long-form pillars, comparison hubs and POV essays.",
      deliverables: ["Founder POV essays", "Pillar / cluster hubs", "Comparison & alternative pages", "Editorial calendar", "Internal linking system"],
    },
    {
      n: "03",
      kicker: "Authority",
      title: "Footprint that compounds.",
      body: "Technical foundation, schema, programmatic surfaces and a digital-PR layer that places your founders in the rooms their buyers already read. Built once. Compounds quarterly.",
      deliverables: ["Core Web Vitals fix", "Schema & entity graph", "Programmatic templates", "Digital PR placements", "Quarterly authority review"],
    },
  ],
  outcomes: [
    { n: "01", title: "Inbound that closes itself.", body: "Sales conversations start at consideration, not education. Demo-ready leads instead of cold MQLs." },
    { n: "02", title: "Lower CAC, quarter over quarter.", body: "Organic share of pipeline grows while paid spend flattens. Compounding becomes a P&L line." },
    { n: "03", title: "Category gravity.", body: "Your name shows up in the SERP, in podcasts, in the analyst notes. Buyers arrive already convinced." },
    { n: "04", title: "Defensible moat.", body: "Search authority is one of the hardest assets to copy. Once you own the intent layer, competitors rent traffic — you own it." },
  ],
  testimonial: {
    quote: "Six months in, organic is 64% of pipeline. It's the first agency relationship that actually built an asset instead of renting one.",
    who: "Anna K.",
    role: "Head of Growth · Series-B Fintech",
  },
  accent: "#e85d3a",
};

const smm: ServiceContent = {
  slug: "smm",
  name: "Social Media Marketing",
  shortName: "SMM",
  tagline: "Owned audiences, founder-led narrative.",
  rotate: ["NARRATIVE", "DISTRIBUTION", "COMMUNITY", "REACH"],
  heroTitlePrefix: "Social built on",
  heroTitleSuffix: "— not vanity posting.",
  heroIntro:
    "We build founder-led social engines that turn point of view into pipeline. Editorial calendars, original POV, and distribution loops that compound across LinkedIn, X and YouTube.",
  position: {
    title: "We don't post for engagement.",
    accent: "We build narrative gravity that earns founders an audience they actually own.",
    body: "Most social agencies optimise for likes and templated motivational carousels. That noise is invisible to buyers. We ship original POV, founder essays, and signal-dense content that pulls qualified attention from your ICP — and compounds into pipeline within two quarters.",
  },
  pillars: [
    {
      n: "01",
      kicker: "Narrative",
      title: "POV strategy, not content calendar.",
      body: "We extract the founder's worldview, structure it into a defensible narrative, and map it onto each platform's native format. Every post earns its place.",
      deliverables: ["Founder POV map", "Pillar themes", "Tone & voice system", "Quarterly narrative arc", "Channel mix strategy"],
    },
    {
      n: "02",
      kicker: "Production",
      title: "Editorial cadence at operator quality.",
      body: "A senior writer paired with the founder for weekly recording sessions. Output: 4–6 polished posts per week across primary channels, plus repurposed long-form.",
      deliverables: ["Weekly content sprints", "Long-form essays", "Video & audio cuts", "Carousel design", "Native publishing"],
    },
    {
      n: "03",
      kicker: "Distribution",
      title: "Loops, not one-shot posts.",
      body: "Engagement pods, DM motions, comment seeding, and paid amplification on top performers. Each post is a node in a measurable funnel.",
      deliverables: ["Comment & DM playbook", "Boosted post system", "Newsletter integration", "Analytics dashboards", "Monthly performance review"],
    },
  ],
  outcomes: [
    { n: "01", title: "Founder becomes the channel.", body: "Audience follows the person, not the brand. The asset stays even if the company pivots." },
    { n: "02", title: "Inbound from your ICP.", body: "Comments and DMs turn into qualified sales conversations within 60–90 days." },
    { n: "03", title: "Lower paid dependency.", body: "Organic reach replaces a meaningful portion of paid social spend." },
    { n: "04", title: "Recruiting magnet.", body: "Senior hires and operators come to you because they already follow the worldview." },
  ],
  testimonial: {
    quote: "We went from 2k to 38k followers and, more importantly, from zero inbound to four qualified demos a week in 90 days.",
    who: "Marc L.",
    role: "Founder · AI SaaS",
  },
  accent: "#7c5cff",
};

const pr: ServiceContent = {
  slug: "pr",
  name: "Public Relations",
  shortName: "PR",
  tagline: "Authority placements, not press blasts.",
  rotate: ["AUTHORITY", "TRUST", "PLACEMENTS", "VOICE"],
  heroTitlePrefix: "PR built for",
  heroTitleSuffix: "— not vanity logos.",
  heroIntro:
    "We get your founders into the rooms their buyers already read. Tier-1 placements, podcast circuits, and analyst notes that move pipeline — not press-release spam.",
  position: {
    title: "We don't write press releases.",
    accent: "We engineer authority moments your buyers actually see.",
    body: "Traditional PR optimises for logo walls. Buyers don't read TechCrunch — they read Stratechery, Lenny, The Generalist. We place founders in those rooms with original insight, not pitch-deck noise, and convert each placement into compounding distribution.",
  },
  pillars: [
    {
      n: "01",
      kicker: "Positioning",
      title: "Story angle, not press kit.",
      body: "We define three to five sharp story angles tied to your category narrative. Each one earns coverage on merit because it says something most operators can't.",
      deliverables: ["Story angle map", "Founder messaging kit", "Tier-1 target list", "Spokesperson prep", "Crisis protocol"],
    },
    {
      n: "02",
      kicker: "Placements",
      title: "Outlets your buyers actually read.",
      body: "Direct relationships with senior editors, podcast hosts, and newsletter operators. We pitch ideas, not press releases — and we earn the placement.",
      deliverables: ["Tier-1 media placements", "Podcast bookings (8–12 / quarter)", "Newsletter features", "Analyst briefings", "Conference speaking"],
    },
    {
      n: "03",
      kicker: "Amplification",
      title: "Coverage becomes distribution.",
      body: "Every placement is repackaged into social, sales enablement, and SEO surface area. One podcast becomes 30 days of compounding distribution.",
      deliverables: ["Repurposing playbook", "Sales enablement assets", "SEO-linked landing pages", "Quarterly authority report"],
    },
  ],
  outcomes: [
    { n: "01", title: "Buyers arrive pre-warmed.", body: "Sales cycles shorten because the founder is already a known voice in the category." },
    { n: "02", title: "Hiring becomes easier.", body: "Operators reach out unprompted. Recruiting cost drops sharply." },
    { n: "03", title: "Investor signal.", body: "Authority footprint becomes a measurable input to the next round." },
    { n: "04", title: "Defensible voice.", body: "Once the founder owns a POV in the category, competitors can't outspend their way past it." },
  ],
  testimonial: {
    quote: "Six placements in a quarter, two analyst notes, and a podcast circuit that put us on three buyer shortlists we never even pitched.",
    who: "Yulia M.",
    role: "CMO · Cybersecurity Scale-up",
  },
  accent: "#3aa6e8",
};

const performance: ServiceContent = {
  slug: "performance",
  name: "Performance Marketing",
  shortName: "Performance",
  tagline: "Paid that respects payback windows.",
  rotate: ["PAYBACK", "EFFICIENCY", "SCALE", "MARGIN"],
  heroTitlePrefix: "Paid built for",
  heroTitleSuffix: "— not vanity ROAS.",
  heroIntro:
    "We run paid like a CFO, not an agency. Channel diversification, creative testing velocity, and an attribution model that maps spend to payback — not last-click theatre.",
  position: {
    title: "We don't optimise for ROAS dashboards.",
    accent: "We optimise for payback window, contribution margin, and LTV.",
    body: "Most paid teams chase platform-reported ROAS and ignore blended efficiency. We instrument the funnel end-to-end, model contribution margin per channel, and scale only what survives a real payback test. Quiet, founder-readable, ruthless.",
  },
  pillars: [
    {
      n: "01",
      kicker: "Foundation",
      title: "Measurement before spend.",
      body: "We rebuild attribution from the data layer up — server-side events, consent-aware tracking, blended payback dashboards. No spend scales until measurement is honest.",
      deliverables: ["Server-side tagging", "Blended attribution model", "Cohort dashboards", "Payback calculator", "Forecast model"],
    },
    {
      n: "02",
      kicker: "Channels",
      title: "Portfolio, not a single bet.",
      body: "Meta, Google, LinkedIn, TikTok, programmatic — sized to your funnel and margin profile. We rotate budget weekly based on cohort performance, not weekly ROAS noise.",
      deliverables: ["Channel mix model", "Weekly budget rotation", "Creative testing matrix", "Audience strategy", "Geo & day-parting"],
    },
    {
      n: "03",
      kicker: "Creative",
      title: "Velocity that compounds.",
      body: "Senior creative team shipping 20–40 variants per month with a learning agenda — not random A/B noise. Winning concepts are productised into the brand system.",
      deliverables: ["Creative testing roadmap", "Production system", "Concept libraries", "Editorial guidelines", "Monthly creative review"],
    },
  ],
  outcomes: [
    { n: "01", title: "Payback windows shrink.", body: "Blended payback moves from 9–12 months to 4–6, freeing balance sheet for growth." },
    { n: "02", title: "CAC stops drifting.", body: "Channel efficiency holds as spend scales — not the usual decay curve." },
    { n: "03", title: "Margin clarity.", body: "Every channel has a contribution-margin number the CFO can defend in the board pack." },
    { n: "04", title: "Compounding creative.", body: "Library of proven concepts means each new launch starts with a higher floor." },
  ],
  testimonial: {
    quote: "They cut paid 30% in the first month, then doubled the volume of qualified pipeline by the third. Honest measurement was the unlock.",
    who: "Daniel R.",
    role: "CEO · Fintech",
  },
  accent: "#3ae8a6",
};

const brand: ServiceContent = {
  slug: "brand",
  name: "Marketing & Brand Strategy",
  shortName: "Brand Strategy",
  tagline: "Positioning that makes paid feel free.",
  rotate: ["POSITIONING", "NARRATIVE", "CATEGORY", "VALUE"],
  heroTitlePrefix: "Strategy that earns",
  heroTitleSuffix: "— not deck-ware.",
  heroIntro:
    "We craft positioning, category narrative and a marketing operating system that compounds. The work survives investor decks, leadership changes, and the next platform.",
  position: {
    title: "We don't sell strategy decks.",
    accent: "We install a marketing operating system the team actually runs on.",
    body: "Most brand strategy lives in a PDF nobody opens twice. We embed with the founder and leadership, ship positioning that survives 18-month review, and hand over a system the in-house team can run — narrative, message house, channel architecture, measurement.",
  },
  pillars: [
    {
      n: "01",
      kicker: "Positioning",
      title: "Sharp category position.",
      body: "ICP interviews, competitor teardown, and a positioning statement the whole company aligns behind. We earn the right to a category — not borrow one.",
      deliverables: ["ICP segmentation", "Competitor teardown", "Positioning statement", "Message house", "Proof architecture"],
    },
    {
      n: "02",
      kicker: "Narrative",
      title: "Story the org can repeat.",
      body: "From the elevator line to the keynote deck. Narrative tracks that sales, marketing, and the founder all use — consistent, defensible, sharp.",
      deliverables: ["Founder narrative arc", "Sales narrative", "Investor story", "PR angle bank", "Content pillars"],
    },
    {
      n: "03",
      kicker: "System",
      title: "Operating model, not a deliverable.",
      body: "Channel architecture, marketing rituals, hiring profile, dashboards. The strategy becomes how the team operates — not a slide.",
      deliverables: ["Marketing org design", "Channel architecture", "Quarterly planning cadence", "KPI tree", "Hiring scorecards"],
    },
  ],
  outcomes: [
    { n: "01", title: "Sales cycles compress.", body: "Clear positioning shortens deals because buyers understand the wedge fast." },
    { n: "02", title: "Paid feels free.", body: "Sharper message lifts CTR, CVR, payback — without changing media." },
    { n: "03", title: "Org alignment.", body: "Product, sales and marketing run from the same narrative. Less internal friction." },
    { n: "04", title: "Defensible category.", body: "Once you own a position, competitors fight on price. You don't." },
  ],
  testimonial: {
    quote: "The positioning work cleared a year of internal debate in six weeks. Our win rate went from 22% to 41% the next quarter.",
    who: "Sofia B.",
    role: "CEO · AI SaaS",
  },
  accent: "#e8a23a",
};

const design: ServiceContent = {
  slug: "design",
  name: "Design",
  shortName: "Design",
  tagline: "Identity and product surfaces with intent.",
  rotate: ["IDENTITY", "SURFACE", "SYSTEM", "CRAFT"],
  heroTitlePrefix: "Design built for",
  heroTitleSuffix: "— not Dribbble.",
  heroIntro:
    "Brand identity, web surfaces and product UX engineered to move metrics. Editorial taste, systematised — every pixel earns its place in the funnel or in the founder's story.",
  position: {
    title: "We don't ship moodboards.",
    accent: "We ship surfaces that move conversion, trust and recall.",
    body: "Most design agencies optimise for portfolio shots. We optimise for the user's job-to-be-done and the metric the founder reports to the board. Editorial-grade craft, systematised, handed over with documentation the team can extend.",
  },
  pillars: [
    {
      n: "01",
      kicker: "Identity",
      title: "Brand system, not a logo.",
      body: "Mark, typography, motion, voice and a system the team can apply without us. Crafted with editorial taste; documented for scale.",
      deliverables: ["Visual identity", "Type & color system", "Motion principles", "Brand book", "Asset library"],
    },
    {
      n: "02",
      kicker: "Web",
      title: "Surfaces that convert.",
      body: "Marketing site, product landing pages and campaign surfaces built for clarity and conversion. Awwwards-grade craft, conversion-grade rigour.",
      deliverables: ["Marketing site", "Campaign landing pages", "Design system", "CMS architecture", "A/B test variants"],
    },
    {
      n: "03",
      kicker: "Product",
      title: "UX that earns retention.",
      body: "Embedded with product and engineering on the moments that matter — onboarding, activation, the empty state, the upgrade flow. Measured, iterated, owned.",
      deliverables: ["UX audit", "Onboarding redesign", "Activation flows", "Design QA", "Prototype testing"],
    },
  ],
  outcomes: [
    { n: "01", title: "Conversion lifts hold.", body: "Surfaces ship measured. Lifts hold across cohorts — not just the launch week." },
    { n: "02", title: "Brand recall climbs.", body: "Consistent identity across surfaces compounds into category recognition." },
    { n: "03", title: "Faster shipping.", body: "Design system means in-house teams ship 2–3× faster without losing craft." },
    { n: "04", title: "Investor signal.", body: "Editorial-grade surface tells the market you operate at a different level." },
  ],
  testimonial: {
    quote: "The new site lifted demo requests 2.4× in the first month and the activation flow added 11 points to week-one retention.",
    who: "Andrii P.",
    role: "Founder · Cybersecurity",
  },
  accent: "#e85d3a",
};

export const services: Record<ServiceSlug, ServiceContent> = {
  seo,
  smm,
  pr,
  performance,
  brand,
  design,
};

export const servicesList: ServiceContent[] = [
  brand, smm, pr, performance, seo, design,
];

export function getService(slug: string): ServiceContent | undefined {
  return (services as Record<string, ServiceContent>)[slug];
}
