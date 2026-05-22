# Project Review (gsd-review)

Date: 2026-05-20  
Scope: whole repository (no `--phase` argument was provided)

## Reviewer Availability

- Codex CLI: available, executed (read-only review run).
- Gemini CLI: unavailable for review (no auth configured: `GEMINI_API_KEY` / Vertex / GCA missing).
- OpenCode/Qwen/Cursor: not installed in this environment.

## Consolidated Findings (Codex CLI + local audit)

### [P1] Reveal hook misses newly mounted cards after filter changes
- File: `src/hooks/use-reveal.ts` (query/observe runs once)
- Evidence:
  - Hook queries `.reveal` nodes only on first mount.
  - Blog/cases filter changes can remount card elements; new nodes are never observed.
- Impact:
  - Cards can stay hidden (`opacity: 0`) after switching filters.
- Recommendation:
  - Re-run observer when filtered lists change, or use per-component reveal (e.g. motion `whileInView`), or a MutationObserver-based re-bind.

### [P1] Case images reference non-bundled paths in production
- File: `src/lib/cases.ts` (lines with `coverImage`/`heroImage`)
- Evidence:
  - Cases use strings like `"/src/assets/niche-ai.jpg"`.
  - Production output (`dist/client/assets`) does not contain `niche-*.jpg`, so these URLs can 404 in preview/prod.
- Impact:
  - Case card/hero backgrounds can disappear outside dev/HMR flows.
- Recommendation:
  - Import assets in `cases.ts` (`import nicheAi from "@/assets/niche-ai.jpg"`) and store imported URLs in data.

### [P2] Blog category filter excludes featured post category
- File: `src/routes/blog.index.tsx` (`filtered` is derived from `archive`)
- Evidence:
  - Category list includes `Growth Strategy`.
  - `archive` excludes featured post, and featured post is currently the only `Growth Strategy` entry.
- Impact:
  - Filter shows “Nothing here yet” for a real category.
- Recommendation:
  - Filter against all posts (or include featured in filtered results), or remove category chips with zero archive items.

### [P2] Hero WebGL does not reliably resume after tab restore
- File: `src/components/hero-webgl.tsx` (`onVis` logic)
- Evidence:
  - Visibility handler sets: `visible = visible && !document.hidden`.
  - After hidden state, this can remain `false` until intersection callback fires again.
- Impact:
  - Hero animation can remain frozen after returning to tab.
- Recommendation:
  - Track `inView` and `isHidden` separately, then recompute `visible = inView && !document.hidden`.

### [P2] Lint signal is currently unusable for app-level quality
- Files: `eslint.config.js`, repository layout
- Evidence:
  - `npm run lint` returns ~8k errors, mostly from `.agents/skills/**` scripts and formatting noise outside app runtime scope.
- Impact:
  - Real app regressions are hidden in lint noise; CI gating is not practical.
- Recommendation:
  - Extend ignores (e.g. `.agents/**`, `.claude/**`, optional generated/vendor directories), or split lint scripts into app-only and tooling-only.

## Validation Summary

- `npm run build`: PASS
- `npm run lint`: FAIL (massive non-app noise + formatting issues)

## Notes from External Review Runs

- Codex CLI run completed with heavy environment/plugin warnings; useful signal extracted and merged above.
- Gemini CLI could not execute due missing auth configuration.
