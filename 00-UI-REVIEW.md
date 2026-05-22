# 00-UI-REVIEW

Scope: Home route visual audit (`/src/routes/index.tsx`) with `impeccable` standards + 6-pillar `gsd-ui-review` grading.
Date: 2026-05-23

## Scorecard (1-4)

1. Visual Hierarchy: **3/4**
2. Spacing & Layout Rhythm: **2/4**
3. Typography Quality: **3/4**
4. Color, Contrast, and Depth: **3/4**
5. Interaction & Motion: **2/4**
6. Responsiveness & Accessibility: **2/4**

Overall: **2.5/4**

---

## 1) Visual Hierarchy — 3/4

### What works
- Primary section headlines are clear and consistently strong (`Hero`, `Studio`, `Engage`, `Cases`, `Insights`).
- Numeric case metrics (`+35%`, `+30 878`) anchor attention effectively.

### Issues
- In `#engage`, the top kicker wrapper now renders only a separator line (label removed), which reads as a leftover decorative element rather than intentional hierarchy.
- In `#insights`, heading hierarchy improved with broken-line typography, but the first featured article still visually competes with the heading too early on mobile due to tight vertical transition.

### Priority fixes
- Remove or repurpose the orphan top line in `#engage`.
- Increase heading-to-content breathing room in `#insights` on small screens only.

---

## 2) Spacing & Layout Rhythm — 2/4

### What works
- Section paddings are mostly consistent in the mid/large breakpoints.
- Grid structure inside `#cases` is cleaner after recent reductions.

### Issues
- Rhythm breaks between `#cases` and `#insights`: compressed bottom of cases + immediate heavy heading creates abrupt transition.
- `#trusted+stats` block is forced to `min-h-[100svh]`, which can produce dead vertical space depending on viewport height and actual content density.

### Priority fixes
- Normalize vertical cadence between `#cases` and `#insights` with explicit spacing contract (same bottom/top pair across adjacent sections).
- Replace hard `100svh` with responsive min-height strategy (`min-h-[70svh] md:min-h-[85svh]`) unless full-screen is a strict brand requirement.

---

## 3) Typography Quality — 3/4

### What works
- Strong editorial scale and tight heading tracking.
- Effective contrast between medium and light text weights in hero and statement sections.

### Issues
- Some meta rows remain too letter-spaced for small screens (e.g., uppercase microcopy in case labels) and lose readability.
- `New accounts created in in 6 mo` contains a copy defect and impacts perceived polish.

### Priority fixes
- Reduce tracking on mobile for microcopy labels (kickers/meta).
- Correct duplicated word in case label string.

---

## 4) Color, Contrast, and Depth — 3/4

### What works
- Palette is cohesive and branded dark editorial.
- Surface borders and muted text consistently support depth hierarchy.

### Issues
- Multiple text tokens hover around low-contrast gray on dark blue/black sections (especially long paragraph blocks in cases and testimonial attribution).
- Depth language is mostly border-based; some sections flatten into each other when separators are removed.

### Priority fixes
- Raise contrast for body-secondary text in long paragraphs.
- Keep one consistent depth cue between major sections (either border or space rhythm, not partial/inconsistent).

---

## 5) Interaction & Motion — 2/4

### What works
- Hover states on links/buttons are coherent.
- Case CTA icon transition is clear.

### Issues
- Many elements use reveal/hover treatment, but motion system is not clearly tiered by importance (primary, secondary, ambient).
- Key information blocks rely more on static layout than microinteraction feedback; perceived interactivity differs by section.

### Priority fixes
- Define motion tiers and apply consistently (headline blocks minimal, cards moderate, CTA strongest).
- Add subtle but consistent focus/hover affordances for keyboard and pointer parity.

---

## 6) Responsiveness & Accessibility — 2/4

### What works
- Grids collapse correctly to single-column on small screens.
- Buttons meet touch-target size.

### Issues
- Decorative empty elements remain in markup (e.g., empty spans/lines), adding noise for maintainers and risking semantic drift.
- Some link labels and uppercase microcopy may underperform at smaller sizes for readability.
- Heading and case metric blocks can create aggressive line-wrap transitions around tablet widths.

### Priority fixes
- Remove empty/decorative nodes not required for layout.
- Tune breakpoint-specific type sizes and spacing for tablet widths.
- Re-check contrast and readability at 390px, 768px, 1024px.

---

## Critical Findings (Must Fix)

1. **Spacing discontinuity between `#cases` and `#insights`** creates jarring flow break.
2. **`100svh` enforced second block** risks layout dead zones on some viewports.
3. **Copy defect:** `New accounts created in in 6 mo`.

---

## Recommended Patch Plan

1. Layout pass:
   - Rebalance section transitions (`#cases` bottom and `#insights` top).
   - Replace fixed fullscreen second block with responsive min-height scale.
2. Typography pass:
   - Fix copy defect.
   - Reduce mobile microcopy tracking.
3. Accessibility pass:
   - Raise contrast of long-form secondary text.
   - Remove decorative empty nodes and verify keyboard focus visuals.

---

## Verdict

Current Home is directionally strong and much cleaner than earlier iterations, but still below production-polish threshold for strict launch quality.

Release readiness: **NO-GO** until Critical Findings are fixed.
