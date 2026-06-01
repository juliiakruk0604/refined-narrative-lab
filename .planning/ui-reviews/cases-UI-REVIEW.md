# Cases Page — UI Review

**Audited:** 2026-06-01  
**Scope:** `/cases` index + `CasesPortfolioCarousel` + linked case detail (`/cases/empresex`)  
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md for this page)  
**Screenshots:** Partial — mobile captured via Playwright CLI; desktop Playwright returned blank (SSR/hydration timing). Live browser capture used for carousel state. Stored under `.planning/ui-reviews/cases-20260601-124647/` (gitignored).

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 2/4 | Hero and cards still lead with metrics, not work outcomes |
| 2. Visuals | 2/4 | Cover images present but stock/mood — not client deliverables |
| 3. Color | 3/4 | Per-case accents work; too many ad-hoc white opacity steps |
| 4. Typography | 2/4 | 6+ distinct sizes on carousel alone (10–13px + clamps) |
| 5. Spacing | 3/4 | Card scale improved; hero still pushes carousel below fold on mobile |
| 6. Experience Design | 3/4 | Carousel a11y solid; no loading/error for CMS fetch |

**Overall: 15/24**

---

## Top 3 Priority Fixes

1. **Replace stock `coverImage` assets with real project frames** — Users cannot evaluate agency craft; portfolio reads as placeholder mood boards — Add 1–3 screenshots per case (web UI, brand, product) in `cases.ts` / CMS `coverImage` fields; prefer 16:9 crops of actual deliverables.
2. **Rewrite hero + card metric copy to be work-first** — Hero title “Selected work with real metrics.” contradicts visual portfolio intent; Empresex card shows “Licensed” as hero stat (opaque) — Hero: outcome + category; card metric: tangible result or scope tag (e.g. “4 surfaces · Live”).
3. **Consolidate micro-typography on carousel** — 10px / 11px / 13px / arbitrary clamps create noisy hierarchy — Map to site tokens: `textMeta` (12px uppercase), `bodyCopy` (14–16px), one display size for client name; drop `text-[10px]` and `text-[13px]`.

---

## Detailed Findings

### Pillar 1: Copywriting (2/4)

**WARNING — Metrics-first hero conflicts with portfolio genre**  
CMS-driven hero (`cases.index.tsx:53–60`) renders “Selected work **with real metrics.**” and body copy about “Sprint and Marathon engagements…” — reads as sales deck, not gallery. Homepage carousel kicker was updated to “Work that ships.” but `/cases` hero was not aligned.

**WARNING — Redundant story on active card**  
`cases-portfolio-carousel.tsx:157–168` shows full `headline` plus `primaryMetric` — user gets narrative twice before click. Pick one hook on the card; save depth for detail page.

**WARNING — Weak Empresex metric label**  
`cases.ts:296` — `primaryMetric: { value: "Licensed", label: "Crypto exchange platform" }` — “Licensed” is not a result; fails scannability vs “+340%” on other cards.

**WARNING — Empty filter state lacks recovery**  
`cases.index.tsx:86–88` — “No cases in this niche yet.” with no link to reset filters or contact.

**PASS — CTAs are specific**  
“View case ↗”, “Prev / Next”, niche filters use domain labels (not “Submit” / “Click here”).

---

### Pillar 2: Visuals (2/4)

**BLOCKER — Covers are not project work**  
`cases.ts` maps cases to `niche-*.jpg`, `hero-bg.png`, `engage-bg.jpg`, `vertical-ai-saas.jpg` — atmospheric stock, not Nebula/Vault/Empresex UI. Carousel now shows images (improvement over text-only) but **portfolio proof is still missing**.

**WARNING — Peek slides too narrow on mobile**  
Slide width `w-[min(24vw,128px)]` (`cases-portfolio-carousel.tsx:333`) — side cards are slivers; image crop unreadable; weak “browse” affordance.

**PASS — Visual hierarchy on active card**  
Cover → client → headline → metric → CTA; corner brackets + `CaseMark` give focal anchor (`CornerAccent`, `CaseMark` in carousel).

**PASS — Thumbnail strip**  
Tablist with image previews (`cases-portfolio-carousel.tsx:386–408`) — jump navigation without repeated Next clicks.

**needs_human_review: true** — Whether abstract mood photography fits R-M brand vs. literal product screenshots is a brand call; technically implemented hierarchy is sound.

---

### Pillar 3: Color (3/4)

**PASS — Per-case accent system**  
`--case-accent` on cards + tint gradient (`styles.css:2956–2962`) — purple/gold/blue glow matches case identity without breaking black page shell.

**WARNING — Opacity sprawl**  
Carousel uses `white/35`, `/40`, `/45`, `/52`, `/58`, `/62`, `/75` in one component — hard to maintain 4.5:1 contrast consistently; `white/58` body on black may borderline for small text.

**WARNING — Site crimson underused on cases page**  
`--rm-accent` (#c03535) appears only in text selection; case cards ignore brand crimson entirely — intentional for portfolio variety but page feels disconnected from R-M signature color.

**PASS — No emoji icons**  
Lucide `ArrowUpRight` only.

---

### Pillar 4: Typography (2/4)

**WARNING — Too many size tokens in one component**  
`cases-portfolio-carousel.tsx` uses: `text-[10px]`, `text-[11px]`, `text-[13px]`, `text-sm`, `text-base`, `clamp(1.25rem…)`, `clamp(1.125rem…)`, `clamp(1.75rem…)` — exceeds 4-size guideline.

**WARNING — Meta duplication**  
Uppercase tracking on niche, format, duration, CTA, footer counter — all same visual weight (`textMeta` + custom 10–11px variants).

**PASS — Page-level hero scale**  
`rm-services-hero__title` (`styles.css:2743–2748`) — clear h1 vs card h2 separation.

---

### Pillar 5: Spacing (3/4)

**PASS — Card scale after resize**  
Removed `78vh` min-height; active width capped ~440–480px; media `aspect-ratio: 16/9` — no longer fullscreen poster.

**WARNING — Mobile fold**  
Hero (h1 + body + 5 filter pills) occupies ~70% of first mobile viewport (`mobile-375.png`) — carousel requires scroll before any work is visible.

**WARNING — Arbitrary ch widths**  
`max-w-[34ch]`, `[36ch]`, `[42ch]` — editorial intent ok but outside shared spacing scale in `framer-section.tsx`.

**PASS — Section rhythm**  
`sectionContainer max-w-[1280px]`, `border-t border-white/10`, `pb-20 md:pb-28` — consistent with `/services`.

---

### Pillar 6: Experience Design (3/4)

**PASS — Carousel accessibility**  
`role="region"`, `aria-roledescription="carousel"`, arrow keys, `aria-live` status, `aria-pressed` filters, active slide = link / inactive = scroll button (`cases-portfolio-carousel.tsx:252–314`).

**PASS — Reduced motion**  
`prefers-reduced-motion` disables scroll tween and image zoom (`cases-portfolio-carousel.tsx:159–164`, `styles.css:2945–2953`).

**WARNING — No loading state**  
Route loader awaits `getCases()` (`cases.index.tsx:16–18`) with no skeleton or spinner — 3s Payload timeout can leave blank pause with no feedback.

**WARNING — No error state**  
CMS failure falls back silently in `cases-cms.ts`; user never sees “couldn’t load cases” vs empty portfolio.

**WARNING — Empty niche filter**  
Handled (`cases.index.tsx:85–88`) but no animation or suggestion to switch niche.

**PASS — Touch targets**  
`rm-btn` on Prev/Next and filters — min 44px height preserved.

---

## Registry Safety

`components.json` present; no UI-SPEC.md with third-party registry blocks.  
**Registry audit:** skipped (no UI-SPEC baseline).

---

## Files Audited

- `src/routes/cases.index.tsx`
- `src/components/cases-portfolio-carousel.tsx`
- `src/components/cases-section.tsx`
- `src/components/corner-accent.tsx`
- `src/components/case-mark.tsx`
- `src/lib/cases.ts`
- `src/styles.css` (`.rm-case-*` block, ~2876–3103)
- `src/components/case-rich-detail.tsx` (linked detail, sampled)

## Screenshot Evidence

| File | Viewport | Notes |
|------|----------|-------|
| `.planning/ui-reviews/cases-20260601-124647/mobile-375.png` | 375×812 | Hero + carousel visible |
| `.planning/ui-reviews/cases-20260601-124647/desktop-1440.png` | 1440×900 | Blank capture — hydration timing |
| Live browser | ~1280px | Carousel with Nebula active, thumbnail strip, peek cards |

---

## Recommendation Count

- **Priority fixes:** 3  
- **Blockers:** 1 (stock images as portfolio proof)  
- **Warnings:** 14  
- **Pass items:** 12  
