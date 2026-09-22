# Design foundation

Tokens live in `src/styles/tokens.css` and map to Tailwind v4 utilities in `src/app/globals.css`. Tailwind's spacing and typography scales provide shared sizing. Use semantic tokens instead of repeating raw colors, radii, or shadows in components.

## Visual direction

Cool blue canvas with subtle blue/lavender gradients, navy text, cobalt primary controls, and translucent frosted surfaces. Compact spacing keeps content closer together while controls retain their 44px minimum target. This user-approved direction supersedes the original warm palette in PLAN.md. Geist is the interface font; Instrument Serif is reserved for editorial headlines. Both use `next/font`.

| Role                | Token                     |
| ------------------- | ------------------------- |
| Destination / route | `route` — lavender        |
| Dates               | `dates` — butter          |
| Travelers           | `travelers` — pink        |
| Budget / success    | `budget` — mint           |
| Transportation      | `transport` — deep blue   |
| Warnings            | `warning` — coral         |
| Recommendations     | `recommendation` — violet |

## Primitives and interaction

- Button: pill-shaped controls with a subtle blue gradient and inset highlight on primary actions; default, outline, and ghost variants; default, small, and icon sizes. Radix Slot supports links without nesting interactive elements.
- Card: shared surface, border, card radius, and optional elevation. `BaseCard` builds semantic tones, sizes, and presentation states on this primitive.
- Controls have at least a 44px height. Icon-only controls added later must have accessible names and tooltips.
- Use Lucide exclusively for interface icons.
- Focus outlines use the ring token; navigation exposes `aria-current` and a skip link.
- Motion timing: 150ms feedback, 250ms standard transitions, 500ms layout transformations. Use the shared easing token.
- The root Motion provider respects user reduced-motion preferences; global CSS also disables prolonged animation and transitions under that preference.
- Responsive shell: compact wrapping navigation on mobile; centered content and multi-column layouts at larger widths.

## Domain cards

The internal `/card-gallery` route is the visual reference. It has four collections: Destinations, Experiences, Trip cards, and Sizes & states.

| Component         | Responsibility                                                                         |
| ----------------- | -------------------------------------------------------------------------------------- |
| `BaseCard`        | Shared tones, grid spans, states, elevation, loading skeleton                          |
| `ImageCard`       | Consistent crop, Next Image sizing, caption, readable error fallback                   |
| `DestinationCard` | Country, available cities, mock daily range, controlled selection                      |
| `CityCard`        | City description, suggested stay, activity count, controlled selection                 |
| `PreferenceCard`  | Native toggle button, Lucide category icon, priority indicator                         |
| `ActivityCard`    | Duration, category, mock cost/rating, independent save/add actions, expandable details |
| `TripCard`        | Normalized route, dates, traveler count, status, optional open action                  |
| `StatCard`        | Label, prominent value, supporting description, semantic tone                          |
| `BentoCard`       | Flexible heading, content, footer, and grid spans                                      |

Sizes: `compact` (1×1), `horizontal` (2×1), `vertical` (1×2), and `featured` (2×2). Spans apply at the small breakpoint inside CSS grids; mobile cards return to one column. Height follows content.

States: default, hover, focus-visible, selected, dragging, valid-drop, invalid-drop, disabled, loading, and expanded. Selection uses text/check marks plus borders and `aria-pressed`. Invalid drop previews include explanatory text. BaseCard states are presentation only: consumers must disable their native interactive controls. Real dnd-kit wrappers, keyboard sensors, and drop targets arrive in Phase 3.

Domain card actions are controlled callbacks, with no built-in store or navigation dependency. Entire-card click handlers never enclose other buttons. Native preference buttons work with Space/Enter; detail buttons expose `aria-expanded` and `aria-controls`. Badge and Skeleton are shared primitives in `components/ui`.

## Themes and photography

`data-theme` defines `destination`, `destination-soft`, and `destination-highlight` tokens for each country. Theme accents appear on destination badges and intentional surfaces while functional semantic colors stay consistent.

Photographs use a 4:3 crop for destination cards and 16:9 for compact city/activity/trip cards. Six country photos and 24 city-specific photos live in `public/images`, with metadata in `src/data/images.ts` and `city-images.json`. Activities reuse their own city's image with an explicit city-inspiration caption. Sources and licenses are in `public/images/CREDITS.md` and `public/images/cities/CREDITS.md`, and the gallery exposes linked attribution. Next Image handles responsive optimization and lazy loading. Photo errors preserve the card's layout, text, and actions.

Hover image scaling uses the layout-duration token; elevation uses the standard duration. The gallery intentionally demonstrates an unavailable image. Reduced-motion CSS disables these transitions and skeleton pulsing.

## Trip detail bento

The read-only trip overview uses seven tiles with varied proportions: destination photography, dates, travelers, route, interests, saved ideas, and planning progress. The desktop grid has 12 columns with a tall hero spanning two rows; tablet uses six columns, and phone layouts stack larger tiles while retaining compact photo grids. Tile heights can grow with content.

Use translucent surfaces with fine borders, shared butter/blue/lavender tones, and a deep blue gradient progress tile. Oversized numbers and editorial destination typography establish hierarchy. Photo text uses shared foreground and overlay tokens for readability. Progress comes from the actual number of itinerary days with plans. Saved ideas expand through a native keyboard-accessible details element.

Shared glass surfaces use a light gradient highlight and backdrop blur, with a readable translucent fill when blur is unavailable. Main content uses 24?32px vertical padding, standard cards use 20px padding, and bento gutters use 12px. Primary controls have subtle hover/press feedback and respect reduced motion. Destination photography and destination-specific accents remain distinct from the global blue interface.

## Landing experience

The introduction at `/` uses bold Geist typography with tight tracking, wide rounded blue panels, and local destination photography. The library remains at `/trips`. Landing color tokens are scoped to its CSS module. On desktop, introduction copy stays sticky alongside three story cards. Native scroll timelines move hero cards in opposing directions and reveal story cards as they enter; reversing scroll reverses the effect. Reduced-motion preferences disable these effects and sticky positioning. Browsers without scroll timelines show the static composition. Mobile uses a stacked story.

The landing direction now applies throughout the app: bold Geist headings with tight tracking, shared blue hero panels, and 28px card corners. Shared brand tokens live in tokens.css. Serif headlines are superseded by this direction. Scroll reveals travel 38px; landing story cards travel 90px, with opposing hero parallax up to 145px. Focus must never reset a card transform during a pointer interaction. Reduced-motion and static fallbacks remain required.

## Interactive builder

The builder uses the shared blue hero, pill controls, bold Geist headings, and rounded cards. The builder now uses a full-width horizontal step timeline and a floating bottom selection bar. Country, city, and activity choices are compact photo cards (four across on desktop, two on phones). The entire native button supports mouse dragging, touch-and-hold dragging, and tap/keyboard selection. Route controls, priorities, and budget live in an expandable nonmodal Review panel above the bar. Back/Next navigation preserves selections; Next on Details validates and saves before advancing. Step changes use a short horizontal Motion fade/slide and respect reduced motion. Draggable controls remain stationary while scrolling.

## Trip creation moment

Create Trip is the final-step action once required selections are valid and all route days are assigned. The builder yields to elevated destination, date, traveler, route, and budget cards; shared Motion layout IDs expand them into the approved rounded Bento grid before navigation. Reduced motion uses a brief opacity transition. Creation removes editable controls and announces progress; the resulting trip heading receives keyboard focus. Budget and suggestion cards use shared semantic colors and existing typography.

The creation presentation lasts approximately 8.5 seconds with normal motion: 5.2 seconds of floating summary cards and staged progress, then a staggered 1.5-second shared-layout assembly with settling time. The progress presentation overlays the page so route navigation preserves grid positions. Reduced motion retains the brief fade.

The latest creation handoff supersedes the shared-layout swap: fade the loading collection out first (850ms), then bring every Bento tile into position (96px rise, 94% to full scale, 1.9 seconds, 200ms stagger). Hold navigation until the complete entrance settles at approximately 10.8 seconds. Reduced motion uses only a short fade.
