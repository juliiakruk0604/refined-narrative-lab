export const CASES_GALLERY_CHAPTER = "04";

export const CASES_GALLERY_SUBHEADING =
  "Empresex, Tequila, and Progresivo — Fintech and iGaming work that ships.";

export function casesGalleryHeaderProps(work?: { tag?: string; heading?: string }) {
  return {
    tag: work?.tag ?? "Selected work",
    heading: work?.heading ?? "Three engagements. One standard.",
    subheading: CASES_GALLERY_SUBHEADING,
    chapter: CASES_GALLERY_CHAPTER,
    animateHeading: true as const,
  };
}
