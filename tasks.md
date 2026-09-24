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
- [x] Review Phase 2 before broad Phase 3 changes (user authorized the next phase).

The interactive builder, persisted draft, local trip creation, and Bento overview are complete. Day-by-day itinerary editing is next in Phase 5. Reuse the validated catalog and card components instead of recreating them.

## Next phases

- [x] Phase 1: normalized domain data and reusable card variants.
- [x] Phase 2: trip library and demo trips.
- [x] Phase 3: interactive builder and persisted drafts.
- [x] Phase 4: builder transition and Bento overview.
- [ ] Phase 5: itinerary editing and derived calculations.
- [ ] Phase 6: places, simulated map, bookings, and budget.
- [ ] Phase 7: responsive/accessibility polish and end-to-end quality.

## Phase 0 verification

-

pm run format:check`: passed.
-

pm run lint`: passed with zero warnings.
-

pm run typecheck`: passed.
-

pm run test`: one navigation/accessibility test passed.
-

pm run build`: passed; `/`, `/builder`, and the not-found page prerendered successfully.

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

-

pm run format:check`: passed.
-

pm run lint`: passed with zero warnings.
-

pm run typecheck`: passed.
-

pm run test`: 15 tests passed across four files.
-

pm run build`: passed; home, builder preview, card gallery, and not-found page prerendered successfully.
-

pm run test:e2e`with`PLAYWRIGHT_CHANNEL=msedge`: all five tests passed against the production build.

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
- Started the development preview at `http://127.0.0.1:3000` and confirmed HTTP 200. If it stops, restart with
  pm run dev`.
- Starting
  ext dev` appended its managed Next.js guidance block to AGENTS.md; all existing project rules remain intact.

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

## Landing page and motion refinement - September 21, 2026

- Added the requested introduction at `/`; moved the existing library to `/trips` and updated navigation, trip return links, and route tests.
- Introduced bold Geist headlines, wide rounded blue hero/finale panels, floating destination cards, and a sticky desktop storytelling section.
- Added reversible native scroll timelines for hero parallax and card reveals. Unsupported browsers retain static content; reduced motion disables scroll effects and sticky storytelling. Mobile uses a single-column story.
- Completed the earlier headline refinement and removed the sample-trip banner from the library.
- Lint, production build (including TypeScript), 19 unit tests, and 14 browser tests passed. Browser coverage includes landing navigation at three widths and scroll reversal/reduced motion.
- Builder functionality and persistence remain Phase 3 work.

## Shared landing style and stronger motion - September 21, 2026

- Extended bold Geist typography and rounded cards to trip details, the gallery, and recovery pages. My trips and the builder preview now use shared blue hero panels. Builder remains a preview with working links to sample trips and destinations.
- Promoted brand blues and panel gradient to shared tokens. Increased hero parallax, photo drift, and card reveal distances while retaining reduced-motion support.
- Fixed a focus-triggered animation reset that moved cards during clicks.
- Production build, lint, 19 unit tests, and 14 browser tests passed after the fix. No phase advancement.

## Phase 3 verification - September 22, 2026

- [x] Replace builder placeholder with contextual destination, city, details, interests, and experience trays.
- [x] Reuse existing catalog and card components with the approved blue panels, bold type, rounded surfaces, photo parallax, and reduced-motion-aware step transitions.
- [x] Add dnd-kit pointer dragging and keyboard route sorting, plus selection buttons, move controls, and city-day controls.
- [x] Support multiple countries, country-scoped cities, route cleanup, duration allocation, exact dates, traveler presets/counts/names, budget levels, and ranked interests.
- [x] Add city-scoped ranked activities, saved ideas, a live summary, and deterministic mock land-only budget estimates.
- [x] Validate details using React Hook Form/Zod; prevent duration over-allocation and prune dependent choices when destinations change.
- [x] Persist one active draft using versioned Zustand localStorage; resume from My trips, confirm reset, and recover from malformed/unavailable storage.
- [x] Verify formatting, lint, TypeScript, production build, 23 unit/component tests, and 21 browser tests.
- [x] Review Phase 3 before broad Phase 4 implementation (user authorized continuation).

Browser coverage includes draft creation, invalid dates/custom budgets/durations, dependent cleanup, reload/resume, confirmed reset, pointer drag, keyboard ordering, corrupt/blocked storage, and 375px/768px/1440px layouts. Reviewed populated desktop and phone builder screenshots.

One active draft is supported on this browser/device. Details save on Apply; other selections save immediately. Creating a finished local trip and the signature builder-to-overview transition are Phase 4. No backend or live prices were introduced.

## Builder timeline refinement - September 22, 2026

- Added country-card instructions pointing to the floating trip bar and disabled drag-induced auto-scrolling across the builder. Verified stationary page position during an edge drag, all 9 builder browser tests, lint, formatting, and production build.
- Replaced oversized country/city/activity cards in the builder with compact photo-and-title selection cards; the gallery retains its full-detail variants.
- Replaced the side canvas with a full-width step timeline and floating bottom selection bar, with horizontal choice chips and Back/Next controls. Review expands route ordering, day allocations, interests, saved ideas, and budget without losing the current step.
- Removed separate drag labels. Whole-card mouse dragging and touch-and-hold dragging share native tap/keyboard selection controls.
- Next requires a destination/city on those steps and submits validated Details before advancing. The last step opens draft review; Phase 4 finished-trip creation remains pending.
- Fixed a button-reuse edge case that skipped Details and clipped transient mobile animation overflow.
- Verified 23 unit/component tests, 23 browser tests, lint, TypeScript, formatting, and production build. Reviewed compact desktop and phone layouts; browser checks cover backward/forward navigation, validation, whole-card dragging, route keyboard sorting, touch taps, and persisted drafts.

## Phase 4 verification - September 22, 2026

- [x] Add Create Trip to the final builder step, gated by valid destinations and fully allocated route days; keep optional interests and saved ideas optional.
- [x] Validate and convert draft choices into a completed local Trip with ordered empty itinerary days, traveler records, dates, preferences, and saved ideas.
- [x] Persist finished trips before clearing the draft; prevent duplicate clicks and preserve the draft on failed saves.
- [x] Animate selected summary cards into the existing Bento grid through shared layout IDs; provide a brief fade with reduced motion, lock creation controls, and focus the destination heading.
- [x] Resolve locally saved trip URLs after hydration and include completed trips in library filters/search. Unknown local IDs show recovery UI.
- [x] Extend the overview with group/per-person mock budget ranges, custom-budget comparison, planning counts, contextual suggestions, and copyable trip summaries.
- [x] Verify 26 unit/component tests, lint, TypeScript, formatting, and production build. All 28 browser scenarios passed across the full run and targeted rerun: an initially ambiguous alert selector was corrected; all 10 creation/library checks passed on the final build.
- [x] Review phone overview and desktop transition screenshots; test 375px, 768px, and 1440px layouts, reduced motion, reload/library recovery, and failed-save retry.
- [ ] Review Phase 4 before broad Phase 5 implementation.

Trips remain local to this browser. Copy summary exports plain text, not a cross-device sharing link. Saved ideas are not scheduled automatically; itinerary editing and reservation workflows remain future phases. Corrupt library data is not overwritten during creation.

## Longer trip creation sequence - September 22, 2026

- Extended the simulated creation presentation to 8.5 seconds: 5.2 seconds of gently floating selection cards and staged progress messages, followed by a staggered Bento assembly and settling time.
- Shared destination/date/traveler/route/budget cards expand into place; remaining overview tiles rise and fade in with staggered timing. Reserved action space prevents a layout jump when the finished route opens.
- Reduced motion retains a short 300ms handoff without floating or shared-layout movement.
- Verified lint, TypeScript, formatting, production build, and all five creation browser scenarios (including the retry check rerun with the longer animation timeout). Reviewed the staggered desktop assembly screenshot.

## Create Trip readiness fix - September 22, 2026

- Completing the builder no longer requires manually allocating unused days. Creation evenly distributes remaining days across the selected route, preserving existing allocations, with an explicit final-step notice. Review still supports manual allocation. Missing countries/cities remain blocking.
- Verified 26 unit tests, three targeted browser checks including default-duration creation, lint, TypeScript, and production build.

## Creation fade and full-grid entrance refinement

- Replaced the immediate shared-layout swap with a sequential 850ms loading fade followed by the overview entrance. Every tile, including the hero and first row, starts 96px lower at 94% scale and settles over 1.9 seconds, staggered by 200ms.
- Extended navigation handoff to 10.8 seconds so the last tile finishes before the route opens. Reduced motion keeps a brief opacity-only transition.
- Verified lint, TypeScript, formatting, production build, and creation/reload browser tests at 375px, 768px, and 1440px, including reduced motion.

## Trip editing and deletion

- Added a responsive native modal with focus containment, Escape/Cancel, focus restoration, and scroll locking. Edit countries, cities, route order/days, interests, saved ideas, dates, travelers, and budget; save all changes together with existing validation.
- Preserve scheduled activities on retained city days. Country/city removal cleans dependent choices; removing days removes attached plans, explained before editing.
- Added confirmed trip deletion and confirmed unfinished-draft deletion in My trips. Edits/deletions of sample trips are stored as browser-local overrides; source fixtures are unchanged. Legacy saved-trip arrays remain readable; deletion records prevent removed samples from reappearing.
- Verified 27 unit/component tests, lint, TypeScript via production build, and 13 creation/library/action browser checks; added a targeted unfinished-draft deletion check.

## Activity photography - September 23, 2026

- Replaced shared city-photo assignment with 144 local activity photo entries from 142 credited Wikimedia sources. Landmark photos and representative food/experience photos now appear in builder cards, the gallery, and saved-trip wish lists.
- Reviewed contact sheets and replaced maps, portraits, signs, and unrelated automatic matches. Representative images remain labeled as illustrations; they do not claim to show a specific tour operator.
- Added a public Photo credits page and committed-asset attribution manifest. The download utility now reproduces the curated sources rather than searching again. Fixture generation preserves activity-photo assignments.
- Verified all 144 image URLs, metadata/asset consistency, 27 unit tests, five gallery browser tests, two activity-photo browser tests, lint, formatting, TypeScript via production build, and the Italy activity-grid screenshot. Fixed footer link access beneath the floating builder bar.
- Photos deploy with public/images and work for all visitors; trip data remains browser-local. No runtime photo API or backend was added.
