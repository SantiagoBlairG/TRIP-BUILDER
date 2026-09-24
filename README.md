# Roam — Travel Trip Builder

A frontend-only visual travel planner, built incrementally from [PLAN.md](PLAN.md).

## Current scope

Phases 0 through 4 provide the application foundation, a trip library, read-only sample-trip pages, an interactive draft builder, and the data/card system. The library at `/trips` groups upcoming, draft, and past trips, with status filters and search by trip, country, or city. Open any trip to review its route, dates, travelers, interests, and saved ideas. Unknown trip links show a recovery page.

Visit `/card-gallery` (also linked in the footer) to try destination selection, city-scoped activities, preference ranking, saved states, expandable details, and responsive card sizes. Gallery selections and library filters are temporary and reset on reload.

The validated catalog contains six countries, 24 cities, 144 activities, and four demo trips. The builder saves one active draft locally, with destination and city selection, drag/drop and keyboard route ordering, dates, travelers, budget, interests, and saved activities. Apply the Details form to save those fields; other selections save immediately. Resume from My trips or `/builder`. On the final step, Create Trip saves a completed local trip and animates the selections into its Bento overview. Day-by-day editing arrives in Phase 5. “Roam” is a working product name.

## Run locally

Use Node.js 22.12+ (Node 24 recommended) and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000. No secrets or environment variables are required. The first development/production compilation downloads Geist and Instrument Serif through `next/font`; subsequent page requests serve the fonts locally.

For a production preview, run `npm run build` then `npm start`. Browse `/` for the animated introduction, `/trips` for the trip library, `/trips/japan-spring` for a sample trip, and `/card-gallery` for interactive card previews. `/builder` opens your current draft (or an empty canvas). Use Start over to clear it after confirmation. If a previously started preview is no longer available, either command above starts it again.

## Commands

| Command                 | Purpose                                       |
| ----------------------- | --------------------------------------------- |
| `npm run dev`           | Development server                            |
| `npm run lint`          | ESLint, with zero warnings allowed            |
| `npm run typecheck`     | Strict TypeScript check                       |
| `npm run test`          | Vitest and React Testing Library              |
| `npm run test:watch`    | Interactive tests                             |
| `npm run test:e2e`      | Production browser flow checks                |
| `npm run data:generate` | Regenerate normalized JSON from curated seeds |
| `npm run format`        | Format source and documentation               |
| `npm run format:check`  | Check formatting                              |
| `npm run build`         | Production build                              |
| `npm start`             | Serve the production build                    |

Use `npm ci` for reproducible installs from the committed lockfile. PLAN.md is excluded from automatic formatting to preserve the original plan.

### Browser checks

Run `npm run build`, then `npx playwright install chromium` once and `npm run test:e2e`. Playwright starts a temporary production server on port 3100 and stops it after testing. It checks keyboard selection, destination isolation, saved state, image fallback, and layout at 375px, 768px, and 1440px. Screenshots are written to the ignored `test-results/` directory.

You can use an installed browser without downloading Chromium. In PowerShell: `$env:PLAYWRIGHT_CHANNEL = 'msedge'`, then `npm run test:e2e`. In a POSIX shell: `PLAYWRIGHT_CHANNEL=msedge npm run test:e2e`.

## Architecture

- `src/app`: Next.js App Router pages and global styles.
- `src/components/ui`: customized shadcn-style primitives with Radix behavior.
- `src/components/navigation`: shared responsive application shell.
- `src/components/cards`: reusable domain cards and the internal gallery.
- `src/components/builder`: contextual tray, route canvas, validated details form, and drag controls.
- `src/stores/builder-store.ts`: versioned Zustand local draft persistence.
- `src/lib/builder.ts`: draft schema, dependent-selection cleanup, readiness and mock budget calculations.
- `src/components/providers.tsx`: Motion configuration respecting reduced motion.
- `src/styles/tokens.css`: semantic design tokens.
- `src/types/travel.ts`: Zod schemas and inferred TypeScript domain models.
- `src/data`: normalized JSON fixtures, validated catalog exports, travel styles, and photo metadata.
- `src/lib`: relationship validation, destination-aware recommendations, formatting, and shared utilities.
- `src/test`: shared test setup.
- `e2e`: Playwright checks for landing motion, library navigation, gallery interactions, and draft building/recovery.
- `public/images`: checked-in destination photographs and source credits.

Edit curated content in `scripts/generate-fixtures.mjs`, run `npm run data:generate`, then format and test. IDs are deliberately stable; append new activities rather than renumbering existing entries. All mock costs use USD; ratings and activity map pins are simulated. There are six country photos, 24 city photos, and individual activity photo assets. Activity images show the landmark or illustrate the food/experience; they are not photographs of a specific tour operator. See [country photo credits](public/images/CREDITS.md) [city photo credits and licenses](public/images/cities/CREDITS.md), and [activity photo credits](public/images/activities/CREDITS.md). The app footer also links to `/photo-credits`. The optional `scripts/download-images.mjs` and `scripts/download-city-images.mjs` utilities reproduce those local assets; they are not required to run the app.

Tailwind CSS v4 uses CSS-based configuration. The shadcn registry aliases and style configuration live in `components.json`; the initial Button and Card are locally owned, following the [manual installation approach](https://ui.shadcn.com/docs/installation/manual). The Button uses Radix Slot for accessible link composition. Add other primitives as they become necessary.

Zod validates fixtures and locally saved trips, including catalog relationships. The builder uses dnd-kit and React Hook Form; Zustand holds the active draft and completed local trips. Create Trip becomes available on the final step once every route day is allocated. Motion gathers the selections into the Bento overview, with a short fade for reduced motion. Finished trips survive reloads in this browser and appear in My trips. Saving must succeed before the draft is cleared; failed saves leave it intact. Copy trip summary shares plain text, not a cross-device link. Itinerary editing remains Phase 5. See [tasks.md](tasks.md), [design-system.md](design-system.md), and [data-model.md](data-model.md).

Compatibility note: ESLint stays on major version 9 because the React lint plugin bundled with `eslint-config-next@16.3.5` crashes on ESLint 10 (`contextOrFilename.getFilename is not a function`). npm reports ESLint 9 as deprecated. Revisit this pin when the bundled plugin supports ESLint 10; lint rules have not been disabled to work around it.

## Deploy to Vercel

1. Run formatting, tests, lint, and `npm run build` locally.
2. Push this repository to GitHub.
3. Import the repository into Vercel using the Next.js preset and Node.js 24.
4. Keep the root directory at the repository root and the build command as `npm run build`.

The build environment needs internet access for font downloads. Photographs are served locally. No environment secrets, database, or API keys are needed. No deployment has been created.

Trip overviews include Edit and Delete actions. The modal saves selections together, while Cancel/Escape discards edits. Delete requires confirmation; unfinished builder drafts can also be deleted from My trips. Sample-trip edits and deletions apply only in this browser.

Photos under `public/images` ship with the Vercel deployment and are available to every visitor/device. Commit the image files alongside their metadata before deploying. No photo API keys or runtime Wikimedia calls are needed. Saved trips still live in browser localStorage and do not sync between devices.
