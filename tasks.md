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

- [ ] Add strict domain models and runtime-validated normalized JSON fixtures.
- [ ] Cover six countries, 24 cities, at least 144 activities, and four demo trips.
- [ ] Add reusable card sizes, semantic tones, selection, loading, and image fallback states.
- [ ] Add destination, city, preference, activity, trip, stat, and Bento card variants.
- [ ] Add local credited photography and a responsive interactive card gallery.
- [ ] Test fixture relationships, destination filtering, and representative card interactions.
- [ ] Run formatting, tests, lint, typecheck, and production build; document the phase.

## Next phases

- [ ] Phase 1: normalized domain data and reusable card variants.
- [ ] Phase 2: trip library and demo trips.
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
