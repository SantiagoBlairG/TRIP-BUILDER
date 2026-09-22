# Data model

`src/types/travel.ts` defines Zod schemas and inferred strict TypeScript types. `src/data/catalog.ts` validates the JSON and relational constraints once at import, then exports arrays and safe ID indexes (unknown IDs return `undefined`). Invalid checked-in data fails tests/builds rather than being silently used.

## Entities and relationships

- `Country`: stable ID, continent, description, image path, theme, style tags, mock daily budget range, and city IDs.
- `City`: parent country ID, description, image path, suggested duration, coordinates, style tags, and activity IDs.
- `Activity`: parent city/country IDs, category, tags, duration, mock price/rating, suggested time of day, and coarse simulated coordinates.
- `Trip`: country IDs, ordered route stops, dates or duration, traveler records/type, budget, theme, ordered preferences, saved activity IDs, and itinerary days.
- `TripStop`: instance ID, city ID, and assigned day count.
- `ScheduledActivity`: unique instance ID plus catalog activity ID, local `HH:mm` time, duration, cost per person, planned/confirmed status, and notes. Catalog data is not copied into the itinerary.
- `ItineraryDay`: instance ID, one-based sequential day number, city ID, and scheduled instances.

The schema allows undated trips and incomplete draft routes. Completed routes must fill the duration. Start and end dates are both present or both absent; when present they use inclusive calendar-day counting. Every assigned city day has one itinerary day in route order. At least one traveler must be an adult. Custom budgets require a positive amount. Route cities are unique in this release; return visits would require an explicit schema extension.

`src/lib/validation.ts` checks uniqueness and both directions of country/city/activity references. It rejects route stops outside selected countries, saved places outside the route, and activities scheduled in a different city.

## Fixture conventions

- Six countries, four cities each, six concrete activities per city: 24 cities and 144 activities across all 12 travel styles.
- Four demo trips: Japan Spring Escape, Summer in France, Colombian Caribbean, Italian Food Tour. Dates/statuses are fixed demonstration snapshots, not a live countdown.
- Source: `scripts/generate-fixtures.mjs`; output: `countries.json`, `cities.json`, `activities.json`, and `demo-trips.json`.
- Regenerate with `npm run data:generate`, then run formatting and tests. Append activities without reordering existing seed rows to preserve IDs such as `positano-01`.
- All prices are deterministic mock **USD** amounts, never converted local currencies. Country daily ranges represent an illustrative baseline per person; activity prices are per person. No total-cost formula is claimed in Phase 1.
- City coordinates are approximate centers. Activity coordinates are intentionally coarse offsets near those centers for future simulated pins, including day-trip entries; they are not venue entrances, excursion destinations, or real navigation coordinates.
- Durations, ratings, tags, and suggested stays are illustrative fixtures, not availability or current travel advice.
- Images are normalized through `src/data/images.ts` and `city-images.json`: six country inspiration photos and 24 city-specific images, all served locally. Activity cards reuse their own city image with an explicit city-inspiration caption. Credits and reuse licenses live alongside the files in `public/images`.

## Selectors and future state

`citiesForCountries` only returns cities in selected countries. `recommendActivities` filters by selected cities before ranking travel-style priorities, then mock rating and stable ID. Empty or unknown selections return no results. Neither utility mutates fixture arrays.

Versioned Zustand persistence and restored-state recovery arrive with the builder. Future totals, pace, and progress should remain derived pure calculations. The gallery only holds transient React state and never writes localStorage.

## Builder draft (Phase 3)

BuilderDraft is a separate, incomplete model in src/lib/builder.ts. It holds validated details, selected country IDs, ordered city/day allocations, ranked interest IDs, saved activity IDs, and an update timestamp. Phase 4 converts a valid, fully allocated draft into Trip and empty itinerary-day records. The version-1 roam-builder-v1 localStorage record stores one active draft. Hydration validates its schema and removes unknown or incompatible catalog references. Parent removals prune child cities and saved ideas.

Mock budget calculations multiply route-weighted country daily ranges by duration, traveler count, and budget tier. Unassigned days use the selected-country average; children use the same allowance as adults. Saved activities are already covered by that allowance; flights are excluded. Custom budgets compare against the balanced estimate.

## Completed local trips (Phase 4)

`src/lib/trips.ts` converts drafts into validated Trip records with local UUID IDs, ordered route/day IDs, traveler records, inclusive dates, budget, priorities, and saved activity IDs. Empty itinerary days reserve the route structure; saved ideas remain unscheduled. `src/stores/trip-store.ts` stores the completed trip array under `roam-trips-v1`, validates schemas and catalog references during hydration, and exposes it to the library and local trip routes. Saving must succeed before draft reset; failures preserve the draft. There is no backend or cross-device synchronization.

Trip edits preserve IDs and retain scheduled activities by city and day-within-city. Saved trip storage accepts legacy arrays or an object containing trips and deletedIds. Sample IDs can be locally overridden; deleted sample IDs are persisted so fixture trips remain hidden after reload. No fixture files are mutated.
