---
phase: code-review
reviewed: 2026-05-23T00:00:00Z
depth: standard
files_reviewed: 8
files_reviewed_list:
  - src/routes/index.tsx
  - src/components/motion-bits.tsx
  - src/components/site-chrome.tsx
  - src/components/unified-cta.tsx
  - src/hooks/use-reveal.ts
  - src/lib/posts.ts
  - src/lib/cases.ts
  - src/styles.css
findings:
  critical: 3
  warning: 8
  info: 6
  total: 17
status: issues_found
---

# Code Review Report

**Reviewed:** 2026-05-23  
**Depth:** standard  
**Files Reviewed:** 8  
**Status:** issues_found

## Summary

The codebase is a TanStack Router / React marketing site with a sophisticated CSS reveal system and Framer Motion animation layer. The overall structure is clean and the visual language is consistent. However, several correctness bugs and accessibility defects are present that will cause user-visible failures in production. The most serious issues are: duplicate post entries that will cause React key collisions and broken DOM IDs on the blog page; featured cases that reference slugs not present in the canonical `cases` data (severed navigation); and non-null assertions on props that can be `undefined` at runtime. Eight warnings cover reduced-motion gaps, an unstable `useEffect` dependency, dead exports, and stale content. Six info items flag typos, copyright year, and minor patterns.

---

## Critical Issues

### CR-01: Duplicate post entries cause React key collisions and broken DOM IDs

**File:** `src/lib/posts.ts:27-167`  
**Issue:** The `posts` array contains ten entries, but the first three entries (`cross-border-fintech-scale`, `cybersecurity-trust-building`, `b2b-performance-marketing`) are effectively duplicated by entries four through six (`why-scaling-brands-fail`, `visibility-vs-authority`, `structured-systems`). The `n` field values restart at `"00"`, `"01"`, `"02"` for the second group. Because `blog.index.tsx` uses `p.n` as both a React list key and as part of a DOM `id` (`id="post-${p.n}-title"`), rendering two posts with the same `n` value produces duplicate keys (React renders incorrectly, may skip updates) and duplicate element IDs (invalid HTML — `aria-labelledby` and fragment links will resolve to the wrong element).

The three duplicate-titled posts (`"Why cross-border fintechs fail…"`, `"Building trust in cybersecurity…"`, `"B2B performance marketing is broken…"`) indicate these are genuinely different articles that were given wrong metadata copied from the first group.

**Fix:** Assign unique `n` values to every post and ensure each post has a unique title that correctly describes its content. The `n` field should never be used as a React key — use `slug` instead, which is already unique per post:

```tsx
// blog.index.tsx and any component rendering posts
posts.map((p) => (
  <article key={p.slug} ...>
    <h3 id={`post-${p.slug}-title`}>
```

Also assign correct sequential `n` values across the full list (00–09) in `posts.ts`.

---

### CR-02: `featuredCases` keys do not match any slug in `cases.ts` — case detail links are silently broken

**File:** `src/routes/index.tsx:142-157`  
**Issue:** The homepage `featuredCases` array uses `key: "tequila-cpa"` and `key: "currency"`. These strings are used only as React keys on the `<li>`, so there is no runtime error. However, the intent is clearly to link these cards to case detail pages: both cards link to `to="/cases"` (the index list) rather than to `/cases/$slug`. The case slugs in `cases.ts` are `"nebula-ai"`, `"vault-fintech"`, `"sentinel-security"`, and `"ace-igaming"` — none match `"tequila-cpa"` or `"currency"`. If the `key` field was ever wired up to navigate to `/cases/tequila-cpa`, the `getCase()` call would return `undefined` and the detail page would crash.

**Fix:** Either map `key` values to real slugs from `cases.ts` and use them for deep links, or explicitly wire the "→" CTAs to the correct case detail routes:

```tsx
// Replace the generic /cases link with a deep link
const featuredCases = [
  { key: "nebula-ai", ... },      // matches cases.ts slug
  { key: "vault-fintech", ... },  // matches cases.ts slug
];

// In the JSX:
<Link to="/cases/$slug" params={{ slug: c.key }} ...>
```

---

### CR-03: Non-null assertion on `primaryTo` / `secondaryTo` can crash at runtime

**File:** `src/components/unified-cta.tsx:72,88`  
**Issue:** When `primaryHref` is falsy, the component renders `<Link to={primaryTo!} ...>`. The `!` asserts `primaryTo` is defined, but the prop has a default value of `"/audit"` only because the parameter destructuring supplies it. If a caller passes `primaryTo={undefined}` explicitly, TypeScript erases the default and `primaryTo!` evaluates to `undefined` at runtime, causing TanStack Router's `Link` to receive `undefined` for its `to` prop — which will throw. The same applies to `secondaryTo`.

```tsx
// Calling code can legally write:
<UnifiedCTA title="…" primaryTo={undefined} />
// TypeScript sees Partial<CTAProps> & { title?: string } — undefined is valid
```

**Fix:** Remove the non-null assertions and fall back safely:

```tsx
<Link to={primaryTo ?? "/audit"} ...>
  {primaryLabel}
</Link>
// and:
<Link to={secondaryTo ?? "/cases"} ...>
  {secondaryLabel}
</Link>
```

---

## Warnings

### WR-01: `useInView` has an unstable object dependency that causes the observer to be re-created every render

**File:** `src/routes/index.tsx:46`  
**Issue:** The `options` parameter of `useInView` is included in the `useEffect` dependency array. When `options` is passed as an inline object literal (e.g. `useInView({ threshold: 0.5 })`), a new object is created on every render, causing the effect to tear down and re-create the `IntersectionObserver` on every render. While `StatsStrip` currently calls `useInView<HTMLElement>()` with no argument (so `options` is always `undefined`), this is a latent bug that will silently break when any future caller passes options inline.

**Fix:** Either stabilise options with `useRef` / `useMemo` inside the hook, or split the threshold into a primitive parameter:

```ts
function useInView<T extends Element>(threshold = 0.25) {
  // ...
  useEffect(() => {
    // ...
    const io = new IntersectionObserver(cb, { threshold });
  }, [inView, threshold]);
}
```

---

### WR-02: `useReveal` does not respect `prefers-reduced-motion` — elements animate anyway

**File:** `src/hooks/use-reveal.ts:1-90`  
**Issue:** The CSS at `styles.css:624-641` applies `opacity: 1 !important` in reduced-motion mode, which prevents the initial hidden state from being visible. However, the `useReveal` hook still runs the `IntersectionObserver`, still adds `will-change: opacity, transform`, and still fires `transitionend` cleanup — meaning it does unnecessary GPU work for users who opted out of motion. More importantly, the hook sets `el.style.willChange = "opacity, transform"` inline on every reveal element, overriding the intent of the reduced-motion CSS. For users with vestibular disorders, triggering `will-change` promotion on dozens of elements can itself cause compositor jank.

**Fix:** Check the media query once at the start of the effect and skip observer setup when reduced motion is preferred:

```ts
useEffect(() => {
  if (typeof window === "undefined") return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    document.querySelectorAll<HTMLElement>(revealSelector).forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }
  // ... rest of observer setup
}, []);
```

---

### WR-03: `.hover-zoom img` has no `transition` property — zoom effect is instant (jank)

**File:** `src/styles.css:441-450`  
**Issue:** The `.hover-zoom` block sets `transform: scale(1.04)` on hover but defines no `transition` for `img` elements inside `.hover-zoom`. The global `a, button` transition rule (line 332) does not cover `img`. The result is an instantaneous scale jump on hover, contradicting the smooth-motion design intent stated in the comments.

**Fix:** Add a transition to the hover-zoom img rule:

```css
.hover-zoom img {
  transform: scale(1);
  transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
}
```

---

### WR-04: Featured blog image has empty `alt` attribute despite being the editorial lead image

**File:** `src/routes/index.tsx:548`  
**Issue:** The featured article image is rendered with `alt=""`, marking it as decorative for screen readers. However, this is the primary editorial image for the lead story — it communicates visual content to sighted users. An empty alt means screen reader users get no description of what is depicted. Additionally, the surrounding `<figure>` has no `<figcaption>`.

**Fix:** Use descriptive alt text derived from the post content:

```tsx
<img
  src={insightPosts[0].image}
  alt={`Cover image for: ${insightPosts[0].title}`}
  loading="lazy"
  ...
/>
```

---

### WR-05: Index route has no skip link and no `<main>` landmark — keyboard users cannot bypass navigation

**File:** `src/routes/index.tsx:169-658`  
**Issue:** The service pages, blog detail page, SEO page, and about page all implement a skip-to-content link (`<a href="#main" className="skip-link">`) and wrap page content in `<main id="main">`. The homepage (`src/routes/index.tsx`) has neither. Keyboard and screen reader users landing on the homepage must tab through the full navigation before reaching any content, which fails WCAG 2.4.1 (Bypass Blocks, Level A).

**Fix:** Add a skip link at the top of the `Index` component and wrap sections in `<main>`:

```tsx
function Index() {
  useReveal();
  return (
    <div className="rm-page selection:bg-rm-accent selection:text-black">
      <a href="#main" className="skip-link">Skip to content</a>
      <AmbientBlobs />
      <SiteHeader variant="dark" />
      <main id="main">
        {/* HERO, STATS, ABOUT, etc. */}
      </main>
      <SiteFooter />
    </div>
  );
}
```

---

### WR-06: `SiteHeader` `variant` prop is received but completely ignored

**File:** `src/components/site-chrome.tsx:14`  
**Issue:** The `variant` parameter is renamed to `_variant` on receipt, and the underscore prefix signals intentional non-use. The header always renders the same markup regardless of whether `variant="light"` or `variant="dark"` is passed. All callers pass `"dark"` or `"light"` expecting different visual behaviour (the homepage passes `variant="dark"`). This means the header never adapts its colour scheme to the page background — on light-background pages the header would be illegible if the design ever ships light variants.

**Fix:** Either implement the variant logic or remove the prop from the public API to avoid misleading callers:

```tsx
// Option A: remove unused prop
export function SiteHeader() { ... }

// Option B: implement the variant
export function SiteHeader({ variant = "dark" }: { variant?: "light" | "dark" }) {
  const textClass = variant === "light" ? "text-black/70" : "text-white/60";
  // apply to nav links
}
```

---

### WR-07: `siteNav` exported but never imported outside `site-chrome.tsx`

**File:** `src/components/site-chrome.tsx:5`  
**Issue:** `export const siteNav` is exported as a public API but grep confirms it is only consumed internally by `SiteHeader`. No other file imports it. This is a dead export that creates a false API surface — callers who discover it and import it to build their own nav will share the same mutable array reference.

**Fix:** Remove the `export` keyword if `siteNav` is only needed internally:

```ts
const siteNav: { label: string; href?: string; to?: string }[] = [
  ...
];
```

---

### WR-08: `TiltCard` and `ParallaxImage` exported but never used in the codebase

**File:** `src/components/motion-bits.tsx:83,126`  
**Issue:** Both `TiltCard` and `ParallaxImage` are exported from `motion-bits.tsx` but are imported nowhere in the codebase (confirmed by exhaustive grep). They add bundle weight (Framer Motion `useScroll`, `useTransform` are pulled in for `ParallaxImage`) without being used. Additionally, `ParallaxImage` renders a `motion.img` inside a wrapping `<div>` that is `absolute inset-0` — if this component is ever used it will require the parent to be `position: relative`, but this constraint is not documented.

**Fix:** Remove or convert to internal-only until they have consumers:

```tsx
// Remove exports:
function TiltCard(...) { ... }      // internal only
function ParallaxImage(...) { ... } // internal only
```

---

## Info

### IN-01: Duplicate post titles — three posts share titles with other posts

**File:** `src/lib/posts.ts:87,110,130`  
**Issue:** Posts at lines 87, 110, and 130 have `title` values identical to posts at lines 27, 47, and 67 respectively. The excerpt and body content differ, so these are distinct articles, but the titles are copied from the first group. This causes confusing display on the blog index (two articles listed with the same headline) and will make SEO metadata duplicate.

**Fix:** Give each article its own accurate title reflecting its actual body content.

---

### IN-02: Typographic errors in `featuredCases` data

**File:** `src/routes/index.tsx:153-154`  
**Issue:** Two copy errors in the hardcoded featured cases:
- Line 153: `"New accounts created in in 6 mo"` — "in in" is a doubled preposition.
- Line 154: `"Cryptocurrency exchange, / Currency"` — trailing comma before the slash is erroneous punctuation.

**Fix:**
```ts
label: "New accounts created in 6 mo",
sector: "Cryptocurrency exchange / Currency",
```

---

### IN-03: Copyright year is stale

**File:** `src/components/site-chrome.tsx:168`  
**Issue:** The footer reads `© R-M 2025`. The current date is 2026-05-23, so the copyright year is one year behind.

**Fix:**
```tsx
<span>© R-M {new Date().getFullYear()}</span>
```
Or statically update to 2026 if dynamic generation is not desired.

---

### IN-04: `n` field on `Post` type is a fragile de-facto index — duplicate values in data

**File:** `src/lib/posts.ts:12`  
**Issue:** The `n` field is typed as `string` and is used as both a display numeral and a React key in several components. Posts 1–3 and posts 4–6 share `n` values `"00"`, `"01"`, `"02"`. Beyond the React key collision covered in CR-01, the field design conflates display ordering with identity. If posts are ever reordered or filtered, `n` values will be wrong.

**Fix:** Remove `n` from the data model and compute display numerals from array index at render time:

```tsx
{posts.map((p, i) => (
  <article key={p.slug}>
    <span aria-hidden>{String(i).padStart(2, "0")}</span>
    ...
  </article>
))}
```

---

### IN-05: Sectors with trailing comma in `featuredCases` parsed inconsistently

**File:** `src/routes/index.tsx:154,449`  
**Issue:** The `sector` field for the currency case is `"Cryptocurrency exchange, / Currency"`. The display code splits on `"/"` to extract the industry label: `c.sector.split("/")[0]?.trim()` yields `"Cryptocurrency exchange,"` — the trailing comma appears in the rendered UI.

**Fix:** Remove the comma as noted in IN-02, which also fixes this display artifact.

---

### IN-06: `reveal-scale` and `reveal-fade` CSS classes are defined but not given `data-delay` stagger rules

**File:** `src/styles.css:408-421`  
**Issue:** The stagger delay rules (`.reveal[data-delay="1"].is-visible`, etc.) are only defined for `.reveal`. If `.reveal-scale` or `.reveal-fade` elements use `data-delay` attributes, the delay will have no effect. This is a silent CSS mismatch that is easy to accidentally trigger.

**Fix:** Extend the stagger selectors to cover all reveal classes:

```css
.reveal[data-delay="1"].is-visible,
.reveal-fade[data-delay="1"].is-visible,
.reveal-scale[data-delay="1"].is-visible {
  transition-delay: 80ms;
}
/* repeat for 2–5 */
```

---

_Reviewed: 2026-05-23_  
_Reviewer: Claude (gsd-code-reviewer)_  
_Depth: standard_
