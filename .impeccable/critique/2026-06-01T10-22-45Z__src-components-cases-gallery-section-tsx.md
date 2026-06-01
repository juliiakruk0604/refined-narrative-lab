---
target: cases gallery /cases
total_score: 26
p0_count: 1
p1_count: 2
timestamp: 2026-06-01T10-22-45Z
slug: src-components-cases-gallery-section-tsx
---
# Cases Gallery — Design Critique

**Target:** `src/components/cases-gallery-section.tsx` + `/cases`  
**Register:** Brand (portfolio)  
**Date:** 2026-06-01

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Skeleton + row hover OK; TextReveal delays heading scan |
| 2 | Match System / Real World | 3 | Founder/agency copy lands; format labels assume prior knowledge |
| 3 | User Control and Freedom | 3 | Full-row links + back nav; no filters to escape |
| 4 | Consistency and Standards | 2 | Chapter `04` from home reused on standalone `/cases`; hero + gallery repeat intro |
| 5 | Error Prevention | 3 | Empty state exists; low risk surface |
| 6 | Recognition Rather Than Recall | 2 | All rows same weight; stock covers don't differentiate work |
| 7 | Flexibility and Efficiency | 2 | Five long rows, no jump nav or niche filter at 5+ items |
| 8 | Aesthetic and Minimalist Design | 3 | Cleaner grid after polish; still redundant copy layers |
| 9 | Error Recovery | 3 | Minimal empty state, adequate |
| 10 | Help and Documentation | 2 | "Marathon" / "Sprint" unexplained for cold visitors |
| **Total** | | **26/40** | **Acceptable with notable gaps** |

## Anti-Patterns Verdict

**LLM assessment:** Does not scream generic AI carousel anymore. The document index + home 3-col grid is site-consistent. Remaining slop signals: watermark chapter numeral borrowed from home sections, mono index + muted scope lines (editorial lane), and mood photography pretending to be portfolio proof.

**Deterministic scan:** `detect.mjs` on `cases-gallery-section.tsx` + `cases.index.tsx` returned **0 findings**.

**Visual inspection:** Live `/cases` at 8080 — 5 rows render, grid aligns col 1 meta / col 2–3 content. Covers are atmospheric stock, not deliverables.

## Overall Impression

Structure is finally coherent: same grid rhythm as Services/Insights on home, flat rows, no metric theater. The page still fails its core job as a **portfolio**: visitors cannot see what R-M actually shipped. Copy also introduces the work twice before row 01.

## What's Working

1. **Home grid alignment** — `md:grid-cols-3` with meta column + `md:col-span-2` content matches Services/Insights; rows line up with section header.
2. **Restrained row chrome** — No corner brackets, glow, or hero-metric blocks; hover is border + text shift only.
3. **Accessible targets** — Whole-row links with `aria-label`, visible `focus-visible` rings, lazy loading on lower rows.

## Priority Issues

### [P0] Covers are not portfolio proof
- **What:** `coverImage` in `cases.ts` points to mood assets (`niche-*.jpg`, `hero-bg.png`, `insights-bg.png`), not UI/brand deliverables.
- **Why it matters:** Founders hiring an agency need to see craft in 3 seconds; mood boards signal placeholder.
- **Fix:** Replace each cover with 16:10 crop of real shipped work (site hero, app screen, brand board).
- **Suggested command:** `$impeccable polish` (after assets supplied) or content update in `cases.ts`

### [P1] Double introduction before the work
- **What:** Hero h1 + subcopy, then gallery h2 "Five engagements…" + nearly identical subheading.
- **Why it matters:** Mobile users scroll through two intros before Nebula AI; cognitive load without new information.
- **Fix:** On `/cases`, drop gallery subheading or shorten hero; let gallery header be index-only ("Selected work") with no repeated thesis.
- **Suggested command:** `$impeccable distill`

### [P1] Chapter watermark `04` on dedicated page
- **What:** Home section ordinal appears on `/cases` where there is no multi-section page context.
- **Why it matters:** Breaks IA consistency; reads as copy-pasted home block, not page-native layout.
- **Fix:** Omit `chapter` prop on `/cases`; keep it on home `CasesSection` only.
- **Suggested command:** `$impeccable layout`

### [P2] Rows lack scan hierarchy at 5 items
- **What:** Every case row identical structure and visual weight; Empresex rich case doesn't read as anchor.
- **Why it matters:** Long scroll with no focal project; weak "start here" path for recruiters.
- **Fix:** Either restore one featured row (without metric template) or tighten to 3 on page + "View all" pattern from home.
- **Suggested command:** `$impeccable layout` or `$impeccable bolder`

### [P3] Dead `--case-accent` variable
- **What:** Set on each row, never consumed after decorative removal.
- **Why it matters:** Noise in markup; suggests unfinished accent system.
- **Fix:** Remove inline style unless accent returns purposefully (e.g. niche tag color).
- **Suggested command:** `$impeccable polish`

## Persona Red Flags

**Founder (primary buyer):** Opens `/cases` after hero — sees abstract photo for Nebula AI, not a funnel or site. Cannot validate "work that ships" claim. Abandons before Empresex.

**Design director (hiring creative):** Five equal rows, no reel moment. Scope lines help but images don't show typography, layout, or product UI. Portfolio feels template-assembled.

**Alex (power user):** Must scroll or tab through five full-row links; no keyboard list pattern, no sticky index, no filter after removal.

## Minor Observations

- `TextReveal` on gallery heading adds motion where static type would scan faster on an index page.
- Mobile puts index + niche on one horizontal line above image; desktop column alignment is strong.
- `btnOutline` on "View all" uses `rounded-md` while site CTAs are pill-shaped — minor inconsistency.
- No `PRODUCT.md` / `DESIGN.md` in repo; brand decisions are implicit. Run `$impeccable teach` + `$impeccable document` for durable critique baseline.

## Questions to Consider

- What if `/cases` opened directly on one real screenshot per project, not a mood photo?
- Does the dedicated page need the home chapter numeral at all?
- What would this page look like with three projects visible and the rest one click away?
