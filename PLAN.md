# Travel Trip Builder — Product and Implementation Plan

## 1. Project Overview

Build a polished visual travel-planning web application where people create trips by dragging modular cards into a canvas. Instead of completing a conventional form, they progressively assemble a trip by choosing destinations, cities, dates, travelers, budget, travel styles, and destination-specific activities.

After the setup is complete, the selected cards should smoothly reorganize into a colorful Bento-style trip overview. From there, people can plan a day-by-day itinerary by dragging relevant places and activities into different days, review their route, and see estimated costs update automatically.

The product should feel like a combination of a flexible Notion workspace, the geographic awareness of Google Maps, the visual inspiration of Airbnb, and the tactile organization of a modern drag-and-drop tool. It must have its own cohesive identity rather than visually copying any of those products.

### Core product principle

> Every meaningful part of a trip is represented by a card that can be selected, moved, edited, expanded, or reorganized.

### Primary goals

- Make trip creation feel visual, playful, and easy to understand.
- Support different ways of traveling, such as gastronomy, beaches, relaxation, trekking, culture, nightlife, nature, photography, and family travel.
- Ensure recommendations depend on the selected country and cities.
- Use a consistent card-based design system throughout the product.
- Deliver a highly polished desktop experience with useful tablet and mobile adaptations.
- Keep the first version frontend-only and easy to deploy through GitHub and Vercel.

### Non-goals for the first release

- Real booking or payment processing.
- Live airline, hotel, weather, or pricing integrations.
- Real-time multi-user collaboration.
- Production authentication or user accounts.
- A production database.
- AI-generated itineraries or recommendations.
- A live Google Maps or Mapbox integration.
- Perfect global travel coverage.

All unavailable external functionality should be represented through realistic local mock data and clearly designed simulated interactions.

---

## 2. Target Experience

The experience has two connected modes.

### Mode 1: Trip Builder

The person builds the structure of a trip by dragging options from a contextual card tray into a central canvas.

They choose:

1. One or more countries.
2. One or more cities from the selected countries.
3. The order of the route.
4. Dates or total trip duration.
5. Number and type of travelers.
6. Budget level.
7. Travel styles and interests.
8. Destination-specific activities and experiences.

The available options must change based on previous selections. For example:

- Selecting Colombia can reveal Medellín, Cartagena, Bogotá, and Santa Marta.
- Selecting Italy can reveal Rome, Florence, Venice, and Positano.
- Selecting Positano can reveal relevant beaches, boat trips, coastal hikes, and local food experiences.
- Selecting Santa Marta can reveal Tayrona, nearby beaches, trekking, diving, and regional food experiences.

Generic interests such as `Beaches & relaxation` act as preferences and filters. Concrete options such as `Fornillo Beach`, `Tayrona day trip`, or `Path of the Gods hike` are destination-specific activities.

### Mode 2: Trip Workspace

After completing the builder, the selected cards animate into a Bento-style overview. The person can then open the itinerary, saved places, map, bookings, and budget areas.

The workspace supports:

- Reviewing the trip at a glance.
- Dragging activities into itinerary days.
- Reordering or moving activities between days.
- Inspecting activity details.
- Viewing a simulated route map.
- Tracking estimated costs.
- Seeing planning progress and contextual suggestions.

---

## 3. Technology Stack

Use the following stack unless a documented compatibility issue requires a change.

### Core

- Next.js using the App Router.
- React.
- TypeScript with strict mode enabled.
- Tailwind CSS.
- npm as the package manager.

### UI and design system

- shadcn/ui as the accessible component foundation.
- Radix primitives where required by shadcn/ui.
- Lucide React as the only general-purpose icon library.
- CSS custom properties for design tokens.
- `next/font` for font loading.

### Interaction and state

- dnd-kit for drag-and-drop and sortable behavior.
- Motion for React for interface animation and shared layout transitions.
- Zustand for global trip state.
- Zustand persistence middleware for localStorage.
- React Hook Form and Zod for forms and validation.

### Utilities and quality

- ESLint.
- Prettier.
- Vitest and React Testing Library for unit/component tests.
- Playwright for essential end-to-end flows if time permits.

### Deployment

- Git repository hosted on GitHub.
- Vercel deployment connected to the GitHub repository.
- The project must build successfully with `npm run build` before deployment.

Do not add a backend, database, authentication provider, map API, or AI service in the first version.

---

## 4. Application Routes

Use these primary routes:

```text
/                           Trip library / home
/builder                    Create a new trip
/trips/[tripId]             Trip overview
/trips/[tripId]/itinerary   Day-by-day itinerary
/trips/[tripId]/places      Saved and recommended places
/trips/[tripId]/map         Route and map view
/trips/[tripId]/bookings    Flights and accommodations
/trips/[tripId]/budget      Budget and expenses
```

The first release may combine secondary views if needed, but the route architecture should support them without a major refactor.

---

## 5. Primary User Flow

### 5.1 Home / Trip Library

Show a welcoming page with:

- Product name and compact navigation.
- A primary `Create a new trip` action.
- Upcoming trips.
- Draft trips.
- Past trips, if available.
- Visually varied trip cards using destination photography and travel metadata.

Preload several demo trips to show that the product supports multiple destinations:

- Japan Spring Escape.
- Summer in France.
- Colombian Caribbean.
- Italian Food Tour.

Selecting a trip opens its overview. Creating a new trip opens the builder with an empty canvas.

### 5.2 Builder: Choose destinations

- Present a horizontal card carousel or responsive card tray.
- Support search and optional continent filters.
- Allow click-to-add as an accessible alternative to dragging.
- Allow one or multiple countries.
- Show a strong empty drop zone in the canvas.
- Provide immediate visual feedback for valid and invalid drop targets.

Initial country dataset:

- Colombia.
- France.
- Italy.
- Japan.
- Spain.
- Greece.

### 5.3 Builder: Choose cities

After a country is added:

- Replace or update the option tray with cities belonging to the selected country.
- Allow multiple cities.
- Allow cities to be reordered in the route.
- Show a recommended number of days for each city.
- Show approximate travel time between route stops using mock values.
- Support trips across multiple countries.

### 5.4 Builder: Dates and duration

Support two methods:

- Select exact start and end dates.
- Select a total number of days when dates are not known.

Suggest an initial distribution of days across selected cities. Allow the person to adjust it using plus/minus controls and, when practical, draggable duration boundaries.

Never allow assigned city days to exceed the trip duration. Clearly explain and resolve any conflict.

### 5.5 Builder: Travelers

Provide visual presets:

- Solo.
- Couple.
- Friends.
- Family.
- Group.

Then allow adjustment of:

- Adults.
- Children.
- Optional traveler names.

Traveler count must affect estimated costs.

### 5.6 Builder: Budget

Offer:

- Budget.
- Balanced.
- Premium.
- Custom amount.

Calculate a mock estimated range based on destinations, duration, travelers, and budget level. Keep the calculation deterministic and document it in a utility module.

### 5.7 Builder: Travel styles

Present selectable and draggable preference cards:

- Food & gastronomy.
- Beaches & relaxation.
- Trekking & hiking.
- Nature & wildlife.
- Museums & culture.
- History & architecture.
- Nightlife.
- Shopping.
- Photography.
- Sports & adventure.
- Wellness.
- Family activities.

Allow multiple selections and priority ordering. These preferences determine the ranking of destination-specific activity recommendations.

### 5.8 Builder: Destination-specific activities

After destinations, cities, and preferences are known:

- Display concrete activities from the selected cities only.
- Rank matching activities first.
- Group or filter activities by city and category.
- Allow activities to be saved for later or added to the initial itinerary.
- Clearly identify the city, duration, category, and estimated cost.

Do not show Positano activities for a Colombia-only trip or Cartagena activities for an Italy-only trip.

### 5.9 Builder summary

Keep a live summary visible as the trip is assembled:

- Countries.
- Cities and route order.
- Dates or duration.
- Travelers.
- Budget level.
- Selected travel styles.
- Saved activities.
- Estimated total and per-person cost.

Enable `Build my trip` only when the required information is valid.

### 5.10 Builder-to-overview transition

This is a signature moment of the product.

When `Build my trip` is activated:

1. Lock the builder controls temporarily.
2. Fade or slide away the options tray.
3. Elevate the selected cards.
4. Reposition and resize cards through shared layout transitions.
5. Transform the destination card into the overview hero.
6. Transform date, traveler, route, and budget cards into Bento modules.
7. Animate the estimated cost and route.
8. Navigate to the newly created trip overview.

Respect `prefers-reduced-motion` and provide a simple fade transition instead.

---

## 6. Trip Overview

The overview uses a responsive Bento Grid and should feel editorial rather than like a corporate analytics dashboard.

### Required Bento cards

#### Destination hero

- Trip name.
- Large destination image.
- Countries or primary destination.
- Countdown or trip status.
- Share action.

#### Dates

- Start and end dates.
- Total days and nights.

#### Travelers

- Traveler count.
- Avatars or initials.
- Pending invitations as simulated data.

#### Route

- Ordered cities.
- Days per city.
- Mini visual route or simulated map.

#### Budget

- Estimated total.
- Cost per person.
- Remaining amount if a custom budget exists.
- Visual progress indicator.

#### Planning progress

- Percentage planned.
- Activities scheduled.
- Reservations completed.
- Next recommended action.

#### Travel style

- Top preferences.
- Visual priority order.

#### Contextual suggestion

- One simulated insight based on trip state.
- Examples: an overloaded day, an unconfirmed hotel, or an activity that better fits another day.

The grid should use multiple card spans at desktop sizes and collapse naturally on smaller screens. Do not force every application screen into a Bento layout.

---

## 7. Itinerary Experience

The itinerary is functional and timeline-oriented while retaining the shared card design language.

### Layout

- Desktop: activity recommendation tray plus day columns or a spacious day timeline.
- Tablet: horizontally scrollable days with a collapsible activity tray.
- Mobile: one selected day at a time with an activity bottom sheet.

### Day cards

Each day should show:

- Day number and date.
- Current city.
- Daily estimated cost.
- Activity count.
- Pace indicator: Relaxed, Balanced, Busy, or Overbooked.
- Ordered activities.

### Activity interactions

- Drag from recommendations into a day.
- Reorder within a day.
- Move between days.
- Click or tap to add as a non-drag alternative.
- Open activity details in a drawer.
- Edit time, duration, cost, status, and notes.
- Duplicate or remove an activity.
- Undo a recent move or deletion through a toast action.

### Derived calculations

Recalculate after every relevant change:

- Daily cost.
- Trip cost.
- Number of planned activities.
- Planning percentage.
- Day pace.
- Category balance.

### Simulated smart action

Include an `Optimize my day` action for at least one demo itinerary.

It should:

- Reorder the activities using a predefined optimized order.
- Animate the cards into position.
- Update the simulated map route.
- Display an estimated time-saving message.
- Be clearly represented as a product simulation, not a live geographic calculation.

---

## 8. Places and Activities

Create a browsable catalog derived from the selected cities.

### Activity card content

- Image.
- Name.
- City.
- Category.
- Short description.
- Duration.
- Estimated cost.
- Rating or popularity indicator using mock data.
- Tags such as `Must visit`, `Rainy day`, `Hidden gem`, or `Optional`.
- Save and `Add to itinerary` actions.

### Filters

- City.
- Category.
- Price level.
- Duration.
- Saved status.
- Selected travel-style match.

### Add-to-itinerary flow

1. Select an activity.
2. Choose a day compatible with its city.
3. Choose a suggested or custom time.
4. Confirm duration and estimated cost.
5. Add optional notes.
6. Confirm and update all derived trip values.

---

## 9. Map Experience

Use a styled simulated map for the first version. Do not require an API key.

### Required behavior

- Display selected cities and activity pins.
- Use numbered or category-based pins.
- Selecting an itinerary day filters the visible route.
- Hovering a card highlights its pin.
- Hovering a pin highlights its card.
- Selecting a pin opens a compact place preview.
- Animate a route line when changing days where practical.

Keep geographic coordinates in the mock dataset so the architecture can later support a real map provider.

---

## 10. Budget Experience

Track mock estimated and confirmed costs.

### Categories

- Flights.
- Accommodation.
- Food.
- Local transportation.
- Activities.
- Shopping.
- Other.

### Required information

- Total budget.
- Estimated total.
- Confirmed total.
- Remaining amount.
- Cost per person.
- Cost per day.
- Category breakdown.

### Interactions

- Edit an activity cost.
- Add a custom expense.
- Change the person who paid using mock travelers.
- Mark an estimate as confirmed.
- Filter by category or traveler.

Use simple CSS or lightweight SVG visualizations. Do not add a charting library unless the required visualization cannot be implemented cleanly without one.

---

## 11. Design System

Use shadcn/ui as a behavioral and accessibility foundation, not as the final visual identity. Customize all relevant components with shared tokens and variants.

### Design principles

- Minimal but expressive.
- Editorial travel imagery balanced with functional information.
- Playful color used intentionally.
- Spacious layouts and strong hierarchy.
- Tactile, responsive interactions.
- Consistency across every card and control.
- Accessible contrast and visible focus states.

### Token architecture

Define tokens as CSS variables and map them into Tailwind utilities where appropriate.

Create tokens for:

- Canvas and surface colors.
- Text colors.
- Borders and dividers.
- Semantic status colors.
- Destination accent colors.
- Card radii.
- Control radii.
- Shadows and elevation.
- Spacing scale.
- Typography scale.
- Motion duration and easing.
- Focus rings.

Do not hardcode arbitrary hex values, border radii, or shadows repeatedly inside components.

### Base palette

Use a warm neutral foundation:

- Warm off-white application background.
- White or softly tinted surfaces.
- Dark charcoal primary text.
- Muted gray-brown secondary text.
- Subtle neutral borders.

Semantic accents:

- Destination and route: sky blue or lavender.
- Dates: butter yellow.
- Travelers: soft pink.
- Budget and success: mint green.
- Transportation: deep blue.
- Warning: coral.
- Recommendations: soft violet.

Color must have a purpose. Do not assign random colors to cards solely for decoration.

### Destination themes

Allow each trip to select an accent theme while keeping the same underlying tokens:

- Japan: cream, coral, ink.
- France: blue, butter, wine.
- Italy: olive, terracotta, cream.
- Colombia: warm yellow, tropical green, coral.
- Greece: white, vivid blue, sand.
- Spain: terracotta, saffron, deep red.

### Typography

- Primary UI font: Geist or Manrope through `next/font`.
- Optional editorial display font: Instrument Serif for destination names and hero moments.
- Use the sans-serif font for controls, data, labels, and navigation.
- Use the display font sparingly.
- Use tabular numbers for costs, dates, and statistics when supported.

### Card system

Build a reusable card foundation with variants rather than creating unrelated card implementations.

Suggested card primitives:

- `BaseCard`.
- `ImageCard`.
- `StatCard`.
- `DestinationCard`.
- `CityCard`.
- `PreferenceCard`.
- `ActivityCard`.
- `TripCard`.
- `BentoCard`.
- `DraggableCard`.
- `SortableCard`.

Supported card sizes:

- `1 × 1` compact.
- `2 × 1` horizontal.
- `1 × 2` vertical.
- `2 × 2` featured.

Supported states:

- Default.
- Hover.
- Focus-visible.
- Selected.
- Dragging.
- Valid drop target.
- Invalid drop target.
- Disabled.
- Loading.
- Expanded.

### shadcn/ui components

Use and customize components such as:

- Button.
- Card.
- Dialog.
- Drawer or Sheet.
- Dropdown Menu.
- Tooltip.
- Popover.
- Tabs.
- Command.
- Calendar.
- Select.
- Slider.
- Progress.
- Avatar.
- Badge.
- Toast or Sonner.
- Skeleton.

Keep customization centralized. Avoid changing the same component differently in individual feature folders unless it is represented by an intentional variant.

### Iconography

- Use Lucide React exclusively for general interface icons.
- Use consistent stroke width and icon sizing.
- Default inline icon size: 16–18 px.
- Default standalone control icon size: 20 px.
- Never mix unrelated icon families.
- Do not use icons when a clear text label is more understandable.
- Icon-only actions require accessible labels and tooltips.

### Imagery

- Use high-quality editorial travel photographs.
- Maintain consistent crop ratios per card type.
- Apply overlays only when necessary for text readability.
- Add meaningful alt text.
- Keep demo imagery locally in `/public/images` or use a deliberately configured image source.
- Avoid unreliable hotlinked assets.

---

## 12. Motion System

Animation should communicate state and spatial relationships, not delay the interface.

### Motion rules

- Fast feedback: approximately 120–180 ms.
- Standard transitions: approximately 200–300 ms.
- Larger layout transformations: approximately 400–650 ms.
- Use consistent easing tokens.
- Prefer transform and opacity animations.
- Avoid excessive blur, bounce, and parallax.
- Respect reduced-motion preferences everywhere.

### Key animations

- Card lift and subtle image zoom on hover.
- Slight scale and rotation while dragging.
- Drop-zone expansion when an item approaches.
- Shared layout animation from builder to overview.
- Drawer and modal transitions.
- Animated cost updates.
- Route drawing.
- Smooth Bento reflow.
- Toast feedback after destructive or structural actions.

---

## 13. Data Model

Create normalized TypeScript types and realistic JSON fixtures.

### Main entities

```ts
type Country = {
  id: string;
  name: string;
  continent: string;
  description: string;
  image: string;
  theme: ThemeId;
  tags: TravelStyleId[];
  dailyBudget: BudgetRange;
  cityIds: string[];
};

type City = {
  id: string;
  countryId: string;
  name: string;
  description: string;
  image: string;
  recommendedDays: number;
  tags: TravelStyleId[];
  coordinates: Coordinates;
  activityIds: string[];
};

type Activity = {
  id: string;
  countryId: string;
  cityId: string;
  name: string;
  description: string;
  image: string;
  category: TravelStyleId;
  tags: string[];
  durationMinutes: number;
  estimatedCost: number;
  currency: string;
  coordinates: Coordinates;
  rating: number;
  recommendedTimeOfDay: TimeOfDay[];
};

type Trip = {
  id: string;
  name: string;
  status: "draft" | "upcoming" | "past";
  countryIds: string[];
  route: TripStop[];
  startDate?: string;
  endDate?: string;
  totalDays: number;
  travelers: Traveler[];
  budget: TripBudget;
  travelStylePriorities: TravelStyleId[];
  savedActivityIds: string[];
  itinerary: ItineraryDay[];
};
```

Add supporting types for `TripStop`, `Traveler`, `TripBudget`, `ItineraryDay`, `ScheduledActivity`, `Coordinates`, `BudgetRange`, and `TimeOfDay`.

### Required fixture coverage

Create data for six countries with four or five cities each and six to ten activities per city.

The data should be plausible and internally consistent, but it does not need to represent live prices or availability. Label estimated costs appropriately in the UI.

Use stable IDs and relational references rather than duplicating full objects inside every trip.

---

## 14. State Management

Create a typed Zustand store divided into logical slices if useful.

### Required actions

- Create, rename, duplicate, and delete a local trip.
- Add or remove a country.
- Add or remove a city.
- Reorder route stops.
- Set trip dates or duration.
- Assign days to cities.
- Set traveler type and counts.
- Set budget level or custom amount.
- Add, remove, and reorder travel-style priorities.
- Save or unsave an activity.
- Add an activity to a day.
- Reorder activities.
- Move an activity between days.
- Update scheduled activity details.
- Remove an activity with undo support.
- Recalculate derived budget and progress values.

### State rules

- Derived values should come from selectors or pure utility functions where possible.
- Avoid storing values that can reliably be derived.
- Keep persistence versioned so fixture or schema changes can be migrated or reset safely.
- Validate restored local state before using it.
- Provide a `Reset demo data` option.

---

## 15. Suggested Project Structure

```text
src/
├── app/
│   ├── page.tsx
│   ├── builder/page.tsx
│   └── trips/[tripId]/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── itinerary/page.tsx
│       ├── places/page.tsx
│       ├── map/page.tsx
│       ├── bookings/page.tsx
│       └── budget/page.tsx
├── components/
│   ├── ui/
│   ├── cards/
│   ├── builder/
│   ├── overview/
│   ├── itinerary/
│   ├── map/
│   ├── budget/
│   └── navigation/
├── data/
│   ├── countries.json
│   ├── cities.json
│   ├── activities.json
│   └── demo-trips.json
├── hooks/
├── lib/
│   ├── budget.ts
│   ├── recommendations.ts
│   ├── itinerary.ts
│   ├── validation.ts
│   └── utils.ts
├── store/
│   └── trip-store.ts
├── styles/
│   └── tokens.css
└── types/
    └── travel.ts
```

Keep components reasonably small. Feature-specific components should not be placed in `components/ui`. That folder is reserved for reusable design-system primitives.

---

## 16. Responsive Behavior

### Desktop

- Full navigation and spacious canvas.
- Multi-column Bento Grid.
- Persistent or collapsible option tray.
- Multi-day itinerary view where space allows.

### Tablet

- Collapsible navigation.
- Two-column Bento Grid.
- Horizontally scrollable builder trays.
- Horizontally scrollable itinerary days.

### Mobile

- Bottom navigation or compact top navigation.
- Single-column overview.
- Tap-to-add must be the primary alternative to drag and drop.
- Option tray becomes a bottom sheet or horizontal carousel.
- Itinerary shows one selected day at a time.
- Drawers become full-height sheets where appropriate.

Do not make critical functionality dependent exclusively on desktop drag interactions.

---

## 17. Accessibility Requirements

- Meet WCAG AA contrast for essential text and controls.
- Provide visible keyboard focus.
- Use semantic HTML landmarks and headings.
- Give all icon-only buttons accessible names.
- Support keyboard alternatives for every drag-and-drop action.
- Announce drag-and-drop changes through appropriate live regions where supported.
- Do not use color as the only way to communicate selection, status, or validity.
- Ensure drawers and dialogs trap and restore focus correctly.
- Provide alt text for meaningful destination and activity images.
- Respect reduced-motion preferences.
- Maintain usable text reflow and touch targets.

---

## 18. Empty, Loading, and Error States

Design intentional states for:

- No trips created.
- Empty builder canvas.
- No cities selected.
- No matching activities.
- Empty itinerary day.
- No saved places.
- Missing trip ID.
- Invalid persisted data.
- Image loading failure.
- Simulated save or update feedback.

Use skeletons for content loading simulations. Avoid generic blank screens and unexplained errors.

---

## 19. Implementation Phases

Codex must build the project incrementally. Do not attempt the entire application in one unreviewed pass.

### Phase 0: Foundation

- Initialize Next.js with TypeScript, Tailwind, App Router, and ESLint.
- Install and configure shadcn/ui, Lucide, Motion, dnd-kit, Zustand, React Hook Form, and Zod.
- Create global design tokens and typography.
- Establish project structure.
- Add formatting and test scripts.
- Create a minimal responsive application shell.
- Confirm `npm run lint` and `npm run build` succeed.

### Phase 1: Data and core card system

- Add TypeScript domain models.
- Add normalized mock data.
- Build shared card primitives and variants.
- Add image treatment, badges, buttons, and states.
- Create a visual internal card gallery if useful during development.
- Test representative card variants.

### Phase 2: Home and trip library

- Build navigation.
- Build trip cards and sections.
- Load demo trips.
- Implement trip opening and new-trip navigation.
- Add responsive and empty states.

### Phase 3: Trip Builder

- Build the contextual option tray.
- Build the central canvas.
- Add country and city selection.
- Add route ordering.
- Add dates, travelers, budget, and travel styles.
- Add destination-specific activity recommendations.
- Add live summary and validation.
- Persist draft progress.
- Provide click/tap alternatives to dragging.

### Phase 4: Builder transition and overview

- Implement `Build my trip`.
- Create a saved local trip.
- Add the signature shared-layout transition.
- Build the complete Bento overview.
- Add responsive layouts and reduced-motion behavior.

### Phase 5: Itinerary

- Build day structures.
- Add destination-aware recommendation tray.
- Add drag, reorder, and cross-day movement.
- Add activity details drawer.
- Add derived cost and pace calculations.
- Add undo feedback.
- Add simulated `Optimize my day`.

### Phase 6: Places, map, bookings, and budget

- Build activity browsing and filtering.
- Build simulated map synchronization.
- Build simplified flight and hotel cards.
- Build budget summary and expense editing.

### Phase 7: Polish and quality

- Complete responsive behavior.
- Audit accessibility.
- Refine animation timing.
- Add remaining empty/error states.
- Check image performance.
- Run tests, lint, and production build.
- Fix all blocking warnings and errors.
- Prepare README deployment instructions.

At the end of every phase, summarize completed work, list important files, run the relevant checks, and wait for review before making broad changes to the next phase.

---

## 20. Acceptance Criteria

The first version is complete when:

- A person can create more than one trip.
- A person can choose from at least six countries.
- City options depend on selected countries.
- Concrete activity options depend on selected cities.
- Travel styles influence activity ranking.
- A person can build and reorder a multi-city route.
- Dates or duration, travelers, and budget affect the summary.
- Estimated cost updates deterministically.
- The completed setup becomes a Bento-style trip overview.
- A person can drag or otherwise add activities to itinerary days.
- Activities can be reordered and moved between days.
- Trip totals and progress update after itinerary changes.
- All important data persists across page reloads.
- The main flow works with keyboard/tap alternatives to drag and drop.
- The application is responsive across desktop, tablet, and mobile.
- The design system is consistent across all screens.
- No general interface icons come from outside Lucide.
- The application has no TypeScript, lint, or production-build errors.
- The repository can be pushed to GitHub and deployed on Vercel.

---

## 21. Codex Working Instructions

Before writing code:

1. Read this entire file.
2. Inspect the existing repository before changing it.
3. Preserve intentional existing work.
4. Create a concise implementation checklist for the current phase.
5. Ask only when a missing decision would materially change the architecture or product experience.

While implementing:

- Work phase by phase.
- Prefer reusable components and pure utilities.
- Keep data, UI, state, and business logic separated.
- Use strict TypeScript and avoid `any`.
- Do not silently replace the approved stack.
- Do not install overlapping libraries without justification.
- Do not use placeholder gradients as a substitute for intentional visual design.
- Do not use random emoji as interface icons.
- Do not introduce a backend or external API without approval.
- Keep the app runnable after every phase.
- Use realistic content instead of repeated lorem ipsum.
- Make reasonable product decisions consistent with this plan and document them.

After meaningful changes:

- Run the relevant tests.
- Run `npm run lint`.
- Run `npm run build` before considering a phase complete.
- Fix errors rather than suppressing them.
- Report what changed, what was verified, and what remains.

---

## 22. Suggested Repository Documentation

In addition to this file, create or maintain:

- `README.md`: setup, scripts, architecture summary, and Vercel deployment.
- `AGENTS.md`: persistent implementation rules for Codex.
- `design-system.md`: tokens, component variants, and interaction patterns.
- `data-model.md`: entity relationships and fixture conventions.
- `tasks.md`: phase checklist and implementation status.

Do not duplicate the full contents of this plan across those files. Each document should have a focused purpose.

---

## 23. Initial Command Expectations

The completed repository should support:

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

Document any additional commands in the README. Never require secret environment variables for the initial demo.

