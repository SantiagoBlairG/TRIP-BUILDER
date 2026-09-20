# Implementation status

## Phase 0 — Foundation

- [x] Inspect the project and read PLAN.md; preserve original plan.
- [x] Initialize Next.js App Router, React, strict TypeScript, Tailwind, and ESLint.
- [x] Install the specified interaction, state, validation, and UI dependencies.
- [x] Configure shadcn aliases and initial Button/Card primitives.
- [x] Define semantic tokens, Geist UI typography, and Instrument Serif display typography.
- [x] Add responsive navigation, a home preview, builder placeholder, and not-found page.
- [x] Respect reduced motion and provide visible focus and skip navigation.
- [x] Configure Prettier, Vitest, and React Testing Library.
- [x] Document setup, architecture, and deployment.
- [x] Verify formatting, tests, lint, typecheck, and production build.
- [x] Review Phase 0 before broad Phase 1 changes (user authorized Phase 1).

## Phase 1 — Data and core cards

- [x] Add strict domain models and runtime-validated normalized JSON fixtures.
- [x] Cover six countries, 24 cities, 144 activities, and four demo trips.
- [x] Add reusable card sizes, semantic tones, selection, loading, and image fallback states.
- [x] Add destination, city, preference, activity, trip, stat, and Bento card variants.
- [x] Add local credited photography and a responsive interactive card gallery.
- [x] Test fixture relationships, destination filtering, and representative card interactions.
- [x] Run formatting, tests, lint, typecheck, and production build; document the phase.
- [x] Review Phase 1 before broad Phase 2 changes (user authorized continuation).

## Phase 2 — Home and trip library

- [x] Replace the home preview with upcoming, draft, and past trip sections using existing demo fixtures and TripCard.
- [x] Reuse the application shell and connect trip opening and new-trip navigation.
- [x] Add responsive library layouts and a no-trips state.
- [x] Verify navigation, responsive behavior, tests, lint, and production build.
- [x] Start and verify a local preview for user review.
- [ ] Review Phase 2 before broad Phase 3 changes.

The interactive builder, persisted drafts, and complete Bento overview remain in Phases 3–4. Reuse the validated catalog and card components instead of recreating them.

## Next phases

- [x] Phase 1: normalized domain data and reusable card variants.
- [x] Phase 2: trip library and demo trips.
- [ ] Phase 3: interactive builder and persisted drafts.
- [ ] Phase 4: builder transition and Bento overview.
- [ ] Phase 5: itinerary editing and derived calculations.
- [ ] Phase 6: places, simulated map, bookings, and budget.
- [ ] Phase 7: responsive/accessibility polish and end-to-end quality.

## Phase 0 verification

- `npm run format:check`: passed.
- `npm run lint`: passed with zero warnings.
- `npm run typecheck`: passed.
- `npm run test`: one navigation/accessibility test passed.
- `npm run build`: passed; `/`, `/builder`, and the not-found page prerendered successfully.
- Test workers and font downloads required execution outside the restricted sandbox.
- Browser visual inspection and end-to-end flows have not been run in Phase 0.

## Decisions

- Roam is a provisional product name.
- Phase 0 uses an editorial typographic preview; destination photography arrives with the real fixtures and cards in Phase 1.
- Scaffold manually in the existing root to retain PLAN.md and avoid a nested app.
- Install future feature dependencies now as requested, but introduce their contexts, schemas, and state alongside the corresponding features.
- Create feature directories when they contain real implementation; avoid empty scaffolding.
- Keep ESLint on major version 9: the installed Next.js React plugin crashes with ESLint 10. This produces a documented npm deprecation notice, but preserves functioning lint checks.

## Phase 1 verification — September 20, 2026

Verified the existing implementation at commit `0de9e22`; the repository was clean before this status update. No application code needed rebuilding or replacement.

- `npm run format:check`: passed.
- `npm run lint`: passed with zero warnings.
- `npm run typecheck`: passed.
- `npm run test`: 15 tests passed across four files.
- `npm run build`: passed; home, builder preview, card gallery, and not-found page prerendered successfully.
- `npm run test:e2e` with `PLAYWRIGHT_CHANNEL=msedge`: all five tests passed against the production build.
- Browser coverage: all 24 city photos and six country photos load; destination selections scope cities and activities; keyboard saving, expandable details, reset, and fallback work; gallery layouts fit 375px, 768px, and 1440px widths.
- Reviewed the generated desktop and tablet screenshots. Screenshots remain in ignored `test-results/`.
- Tests/build/browser processes used approved execution outside the restricted sandbox. Browser output included only the environment's non-blocking NO_COLOR/FORCE_COLOR notice.

Important files: `src/types/travel.ts`, `src/data/catalog.ts`, normalized JSON in `src/data`, `src/lib/validation.ts`, `src/lib/recommendations.ts`, `src/components/cards`, `src/app/card-gallery/page.tsx`, and `e2e/card-gallery.spec.ts`. Photo attribution is recorded in `public/images/CREDITS.md` and `public/images/cities/CREDITS.md`.

Gallery selections remain temporary. Drag/drop states are visual previews; actual builder interactions, trip persistence, and trip workspace routes are not implemented yet. Activity cards use their own city's photo as labeled inspiration; costs, ratings, and activity coordinates are explicitly simulated.

## Phase 2 verification — September 20, 2026

- Home now groups the four demo trips into upcoming, draft, and past sections, with status filters and trip/country/city search.
- TripCard supports real navigation links. `/trips/[tripId]` presents each demo route, dates, travelers, interests, and saved activities, with direct-link reload support and an unknown-trip recovery page.
- Empty libraries offer a creation link; empty search results offer a clear-filters action. Creation links open the existing labeled builder placeholder.
- Reused the existing cards, shell, tokens, photographs, and fixtures. The full editable Bento overview remains Phase 4 work.
- Fixed a browser hydration error caused by Node/browser differences in `Intl.DateTimeFormat.formatRange`. Calendar-date text now uses consistent punctuation, covered by regression tests.
- Formatting, lint, strict TypeScript, and production build passed. All 19 unit/component tests and all 10 Playwright tests passed.
- Browser checks cover all four trip links and reloads, unknown trips, filter recovery, and library/trip layouts at 375px, 768px, and 1440px. Reviewed desktop library and phone trip screenshots.
- Started the development preview at `http://127.0.0.1:3000` and confirmed HTTP 200. If it stops, restart with `npm run dev`.
- Starting `next dev` appended its managed Next.js guidance block to AGENTS.md; all existing project rules remain intact.

Important files: `src/components/library/trip-library.tsx`, `src/components/overview/trip-preview.tsx`, `src/app/trips/[tripId]/page.tsx`, `src/components/cards/trip-card.tsx`, `src/lib/format.ts`, and `e2e/trip-library.spec.ts`.

Next: Phase 3 — contextual builder tray/canvas, destination and route editing, dates, travelers, budget, preferences, activity recommendations, validation, and persisted drafts. The current preview uses sample data and does not create or edit trips yet.

## Trip detail visual refinement — September 20, 2026

- Applied the requested bento reference to the existing read-only trip detail page: a tall destination photograph, compact date and traveler tiles, a city photo route, interests, saved ideas, and derived planning progress.
- Used an asymmetric 12-column desktop grid, a six-column tablet layout, and a compact mobile layout with shared semantic colors and quieter typography.
- All saved ideas remain available through a native expandable section. Photos have error fallbacks; imagery reused for activities is labeled as city inspiration.
- Formatting, lint, TypeScript, production build, 19 unit/component tests, and 10 Playwright tests passed. Visually reviewed trip screenshots at 375px, 768px, and 1440px.
- Main files: `src/components/overview/trip-bento.tsx`, `trip-bento.module.css`, `destination-photo.tsx`, and shared photo-overlay tokens in `src/styles/tokens.css`.
- This user-requested visual refinement does not complete Phase 4's editable workspace or builder transition. Phase 3 remains next.

## App-wide visual refresh ? September 20, 2026

- Applied the user-requested cool blue visual direction across the shell, library, trip overview, builder preview, and shared cards/controls. This supersedes the original warm base palette without changing phase scope.
- Added semantic tokens for subtle canvas gradients, frosted surfaces, blue button gradients, and soft elevation. Rounded buttons and navigation retain 44px minimum tap targets and visible focus.
- Reduced page padding, card padding, library section spacing, and bento gutters while preserving responsive card proportions and existing interactions.
- Lint, strict TypeScript, production build, all 19 unit/component tests, and all 10 Playwright checks passed. Reviewed desktop library and trip screenshots plus tablet and phone trip layouts.
- Interactive builder and persistence remain upcoming Phase 3 work.
