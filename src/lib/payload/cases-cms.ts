import type { CaseStudy } from "@/lib/cases";
import { cases as staticCases, getCase as getStaticCase } from "@/lib/cases";
import type { PayloadCaseDoc } from "@/lib/page-content/types";
import { isPayloadEnabled, payloadFetch } from "@/lib/payload/client";
import { mediaUrl } from "@/lib/payload/media";
import type { PayloadListResponse } from "@/lib/payload/types";

import nicheAi from "@/assets/niche-ai.jpg";

function mapPayloadCase(doc: PayloadCaseDoc): CaseStudy {
  const cover = mediaUrl(doc.coverImage) || nicheAi;
  const hero = mediaUrl(doc.heroImage) || cover;

  return {
    slug: doc.slug,
    client: doc.client,
    niche: doc.niche,
    format: doc.format,
    duration: doc.duration,
    preview: doc.preview,
    headline: doc.headline,
    heroMetrics: doc.heroMetrics ?? [],
    primaryMetric: doc.primaryMetric ?? { value: "", label: "" },
    situation: doc.situation,
    challenge: doc.challenge,
    work: doc.work ?? [],
    resultMetrics: doc.resultMetrics ?? [],
    resultsBody: doc.resultsBody,
    quote: doc.quote ?? { text: "", who: "", role: "" },
    accent: doc.accent ?? "#7c5cff",
    coverImage: cover,
    heroImage: hero,
  };
}

export async function fetchCases(): Promise<CaseStudy[] | null> {
  const data = await payloadFetch<PayloadListResponse<PayloadCaseDoc>>(
    "/api/cases?depth=2&limit=100&where[_status][equals]=published",
    { revalidate: 60 },
  );
  if (!data?.docs?.length) return null;
  return data.docs.map(mapPayloadCase);
}

export async function fetchCaseBySlug(slug: string): Promise<CaseStudy | null> {
  const data = await payloadFetch<PayloadListResponse<PayloadCaseDoc>>(
    `/api/cases?depth=2&limit=1&where[slug][equals]=${encodeURIComponent(slug)}&where[_status][equals]=published`,
    { revalidate: 60 },
  );
  const doc = data?.docs?.[0];
  return doc ? mapPayloadCase(doc) : null;
}

export async function getCases(): Promise<CaseStudy[]> {
  if (!isPayloadEnabled()) return staticCases;
  const remote = await fetchCases();
  return remote?.length ? remote : staticCases;
}

export async function getCase(slug: string): Promise<CaseStudy | undefined> {
  if (!isPayloadEnabled()) return getStaticCase(slug);
  const remote = await fetchCaseBySlug(slug);
  return remote ?? getStaticCase(slug);
}
