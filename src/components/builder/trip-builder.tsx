"use client";
import { useRef, useState } from "react";
import { createTrip } from "@/lib/trips";
import { useTripStore } from "@/stores/trip-store";
import type { Trip } from "@/types/travel";
import { CreateTripTransition } from "./create-trip-transition";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  ArrowUp,
  Check,
  Compass,
  MapPin,
  RotateCcw,
  X,
} from "lucide-react";
import {
  activities,
  cities,
  countries,
  cityById,
  countryById,
} from "@/data/catalog";
import { travelStyles, travelStyleById } from "@/data/travel-styles";
import type { TravelStyleId } from "@/types/travel";
import { recommendActivities } from "@/lib/recommendations";
import {
  assignedDays,
  distributeRemainingDays,
  duration,
  draftIssues,
  estimateDraft,
  type BuilderDraft,
} from "@/lib/builder";
import { formatDuration, formatMoney } from "@/lib/format";
import { useBuilderStore } from "@/stores/builder-store";
import { Button } from "@/components/ui/button";
import { PreferenceCard } from "@/components/cards/preference-card";
import { SelectionCard } from "./selection-card";
import { DetailsForm } from "./details-form";
import { RouteStop, TripDropZone } from "./drag-cards";
import { useBuilderHydration } from "./use-builder-hydration";
import styles from "./builder.module.css";

const steps = [
  "Destinations",
  "Cities",
  "Details",
  "Interests",
  "Experiences",
] as const;
export function TripBuilder() {
  const [created, setCreated] = useState<Trip | null>(null);
  const creating = useRef(false);
  const [createError, setCreateError] = useState("");
  const { ready, storageError } = useBuilderHydration();
  const draft = useBuilderStore((s) => s.draft);
  const update = useBuilderStore((s) => s.update);
  const reset = useBuilderStore((s) => s.reset);
  const [step, setStep] = useState<(typeof steps)[number]>("Destinations");
  const [query, setQuery] = useState("");
  const [continent, setContinent] = useState("all");
  const [message, setMessage] = useState("");
  const [dragLabel, setDragLabel] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const reduced = useReducedMotion();
  const [reviewOpen, setReviewOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const reviewButtonRef = useRef<HTMLButtonElement>(null);
  const stepIndex = steps.indexOf(step);
  const canContinue =
    step === "Destinations"
      ? draft.countryIds.length > 0
      : step === "Cities"
        ? draft.route.length > 0
        : true;
  function goTo(next: (typeof steps)[number]) {
    setStep(next);
    setQuery("");
    setReviewOpen(false);
    requestAnimationFrame(() => {
      const heading = document.getElementById("builder-step-title");
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView({
        block: "start",
        behavior: reduced ? "instant" : "smooth",
      });
    });
  }
  function openReview() {
    setReviewOpen(true);
    requestAnimationFrame(() => panelRef.current?.focus());
  }
  function closeReview() {
    setReviewOpen(false);
    reviewButtonRef.current?.focus();
  }

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const remaining = duration(draft) - assignedDays(draft);
  const issues = draftIssues(draft);
  const creationDraft = distributeRemainingDays(draft);
  const creationIssues = draftIssues(creationDraft);
  const estimate = estimateDraft(draft);
  const destinationChips = draft.countryIds.map(
    (id) => countryById[id]?.name ?? id,
  );
  const routeChips = draft.route.map(
    (stop) => cityById[stop.cityId]?.name ?? stop.cityId,
  );
  const interestChips = draft.priorities.map((id) => travelStyleById[id].name);
  const activityChips = draft.savedIds.map(
    (id) => activities.find((a) => a.id === id)?.name ?? id,
  );
  const selectionChips =
    step === "Interests"
      ? [...interestChips, ...routeChips, ...destinationChips]
      : step === "Experiences"
        ? [...activityChips, ...routeChips, ...destinationChips]
        : [...destinationChips, ...routeChips];
  function commit(next: BuilderDraft, notice: string) {
    update(next);
    setMessage(notice);
  }
  function country(id: string, remove = false) {
    if (remove)
      commit(
        { ...draft, countryIds: draft.countryIds.filter((c) => c !== id) },
        `Removed ${countryById[id]?.name}, its cities, and their saved ideas.`,
      );
    else if (!draft.countryIds.includes(id))
      commit(
        { ...draft, countryIds: [...draft.countryIds, id] },
        `Added ${countryById[id]?.name}. Choose cities next.`,
      );
  }
  function city(id: string, remove = false) {
    if (remove) {
      commit(
        { ...draft, route: draft.route.filter((s) => s.cityId !== id) },
        `Removed ${cityById[id]?.name} and its saved ideas.`,
      );
      return;
    }
    const item = cityById[id];
    if (
      !item ||
      !draft.countryIds.includes(item.countryId) ||
      draft.route.some((s) => s.cityId === id)
    )
      return;
    if (remaining < 1) {
      setMessage(
        "All days are assigned. Increase your duration or reduce a city’s days first.",
      );
      return;
    }
    commit(
      {
        ...draft,
        route: [
          ...draft.route,
          { cityId: id, days: Math.min(item.recommendedDays, remaining) },
        ],
      },
      `Added ${item.name} to your route.`,
    );
  }
  function preference(id: TravelStyleId, remove = false) {
    commit(
      {
        ...draft,
        priorities: remove
          ? draft.priorities.filter((p) => p !== id)
          : [...new Set([...draft.priorities, id])],
      },
      "Travel interests updated.",
    );
  }
  function save(id: string, remove = false) {
    commit(
      {
        ...draft,
        savedIds: remove
          ? draft.savedIds.filter((a) => a !== id)
          : [...new Set([...draft.savedIds, id])],
      },
      remove ? "Idea removed." : "Idea saved to this draft.",
    );
  }
  function dragEnd(event: DragEndEvent) {
    setDragLabel(null);
    const { active, over } = event;
    if (!over) return;
    const data = active.data.current;
    if (data?.kind === "route") {
      const from = draft.route.findIndex(
        (s) => `route:${s.cityId}` === active.id,
      );
      const to = draft.route.findIndex((s) => `route:${s.cityId}` === over.id);
      if (from >= 0 && to >= 0 && from !== to)
        commit(
          { ...draft, route: arrayMove(draft.route, from, to) },
          "Route reordered.",
        );
      return;
    }
    if (
      over.id !== "trip-canvas" &&
      over.id !== "trip-details" &&
      !String(over.id).startsWith("route:")
    )
      return;
    if (data?.kind === "country") country(data.id);
    if (data?.kind === "city") city(data.id);
    if (data?.kind === "interest") preference(data.id);
    if (data?.kind === "activity") save(data.id);
  }
  const search = query.trim().toLowerCase();
  const visibleCountries = countries.filter(
    (c) =>
      (continent === "all" || c.continent === continent) &&
      c.name.toLowerCase().includes(search),
  );
  const visibleCities = cities.filter(
    (c) =>
      draft.countryIds.includes(c.countryId) &&
      c.name.toLowerCase().includes(search),
  );
  const recommendations = recommendActivities(
    activities,
    draft.route.map((s) => s.cityId),
    draft.priorities,
  ).filter((a) =>
    `${a.name} ${cityById[a.cityId]?.name}`.toLowerCase().includes(search),
  );
  function finishTrip() {
    if (creating.current || creationIssues.length) return;
    creating.current = true;
    try {
      const trip = createTrip(
        creationDraft,
        "local-" + crypto.randomUUID(),
        new Date().toISOString().slice(0, 10),
      );
      if (!useTripStore.getState().save(trip))
        throw new Error(
          "Your trip could not be saved on this device. Your draft is intact. Free some browser storage and try again.",
        );
      setCreated(trip);
      reset();
    } catch (error) {
      creating.current = false;
      setCreateError(
        error instanceof Error
          ? error.message
          : "Could not create trip. Please try again.",
      );
    }
  }
  if (created) return <CreateTripTransition trip={created} />;
  if (!ready)
    return (
      <div className="page-hero">
        <h1 className="text-4xl">Your next chapter</h1>
        <p role="status" className="hero-copy mt-4">
          Opening your trip canvas…
        </p>
      </div>
    );
  return (
    <div className={styles.builder}>
      <header className={`page-hero ${styles.hero}`}>
        <p className="hero-copy mb-3 text-xs font-semibold uppercase tracking-widest">
          Your next chapter
        </p>
        <h1 className="text-4xl sm:text-5xl">
          A little closer to your next adventure.
        </h1>
        <p className="hero-copy mt-4 max-w-xl text-sm leading-6">
          Collect destinations, shape your route, and save the things you love.
          Tap to choose, or drag a card into your trip bar below.
        </p>
      </header>
      <div className="my-4 flex flex-wrap items-center justify-between gap-3">
        <p
          role="status"
          className={storageError ? "text-sm text-destructive" : styles.note}
        >
          {storageError
            ? "Local saving or draft recovery failed. Keep this page open to retain changes."
            : draft.updatedAt
              ? "Draft saved on this device. Pick up wherever you left off."
              : "Your draft will save automatically on this device."}
        </p>
        <div className="flex gap-2">
          <Button asChild variant="ghost">
            <Link href="/trips">My trips</Link>
          </Button>
          <Button variant="outline" onClick={() => setConfirmReset(true)}>
            <RotateCcw />
            Start over
          </Button>
        </div>
      </div>
      {confirmReset && (
        <div role="alert" className="mb-4 rounded-xl border bg-card p-5">
          <p className="mb-3">
            Clear this draft and start fresh? Your sample trips stay in the
            library.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                reset();
                setStep("Destinations");
                setQuery("");
                setConfirmReset(false);
                setMessage("Started a fresh draft.");
              }}
            >
              Clear draft
            </Button>
            <Button variant="outline" onClick={() => setConfirmReset(false)}>
              Keep my draft
            </Button>
          </div>
        </div>
      )}
      <nav aria-label="Builder steps" className={styles.tabs}>
        {steps.map((label, i) => (
          <Button
            key={label}
            variant={step === label ? "default" : "outline"}
            aria-current={step === label ? "step" : undefined}
            onClick={() => {
              goTo(label);
            }}
          >
            <span className={styles.stepNumber}>
              {i < stepIndex ? <Check size={14} /> : `0${i + 1}`}
            </span>
            {label}
          </Button>
        ))}
      </nav>
      <p aria-live="polite" className="mb-3 min-h-5 text-sm text-primary">
        {message}
      </p>
      {createError && (
        <p role="alert" className="mb-4 text-sm text-destructive">
          {createError}
        </p>
      )}
      {step === "Experiences" && creationIssues.length > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">
          Before creating your trip: {creationIssues.join(" ")} Open Review to
          adjust your route.
        </p>
      )}
      {step === "Experiences" && remaining > 0 && draft.route.length > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">
          Create Trip will distribute the remaining {remaining}{" "}
          {remaining === 1 ? "day" : "days"} across your selected cities. Open
          Review to adjust the days yourself.
        </p>
      )}
      <DndContext
        sensors={sensors}
        autoScroll={false}
        onDragStart={(e) =>
          setDragLabel(e.active.data.current?.name ?? "Moving route stop")
        }
        onDragCancel={() => setDragLabel(null)}
        onDragEnd={dragEnd}
      >
        <div className={styles.workspace}>
          <section
            id="option-tray"
            aria-label="Option tray"
            className={styles.tray}
          >
            <motion.div
              key={step}
              initial={reduced ? false : { opacity: 0.5, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h2
                id="builder-step-title"
                tabIndex={-1}
                className="mb-2 scroll-mt-6 text-2xl font-bold tracking-tight outline-none"
              >
                {step === "Destinations"
                  ? "Where is calling you?"
                  : step === "Cities"
                    ? "Connect your favorite places."
                    : step === "Details"
                      ? "Make room for the details."
                      : step === "Interests"
                        ? "What makes a trip yours?"
                        : "Little moments, worth saving."}
              </h2>
              <p className={`${styles.note} mb-4`}>
                {step === "Cities"
                  ? "Cities come from your selected countries. Suggested days never exceed your remaining time."
                  : step === "Interests"
                    ? "Choose your interests. Open Review to put your favorites first."
                    : step === "Experiences"
                      ? "Ideas from your route, ranked by your interests. Photos are city inspiration; costs are sample estimates."
                      : "Your choices stay editable as the trip takes shape."}
              </p>
              {["Destinations", "Cities", "Experiences"].includes(step) && (
                <label>
                  <span className="sr-only">Search {step.toLowerCase()}</span>
                  <input
                    className={styles.search}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Search ${step.toLowerCase()}`}
                  />
                </label>
              )}
              {step === "Destinations" && (
                <>
                  <label className="mb-4 flex items-center gap-3 text-sm">
                    Continent
                    <select
                      className="min-h-11 rounded-full border bg-card px-3"
                      value={continent}
                      onChange={(e) => setContinent(e.target.value)}
                    >
                      <option value="all">All continents</option>
                      {["Europe", "Asia", "South America"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <p className="mb-4 text-sm text-primary">
                    Drag and drop your chosen countries into the floating trip
                    bar below, or tap a card to select it.
                  </p>
                  <div className={styles.cards}>
                    {visibleCountries.map((c) => (
                      <SelectionCard
                        key={c.id}
                        id={c.id}
                        kind="country"
                        name={c.name}
                        image={c.image}
                        detail={c.continent}
                        selected={draft.countryIds.includes(c.id)}
                        onSelect={() =>
                          country(c.id, draft.countryIds.includes(c.id))
                        }
                      />
                    ))}
                  </div>
                  {!visibleCountries.length && (
                    <p className={styles.empty}>
                      No matching destinations. Try another search.
                    </p>
                  )}
                </>
              )}
              {step === "Cities" && (
                <>
                  {!draft.countryIds.length ? (
                    <div className={styles.empty}>
                      <Compass className="mx-auto mb-3 text-primary" />
                      <p>Choose a country to discover its cities.</p>
                      <Button
                        className="mt-4"
                        onClick={() => setStep("Destinations")}
                      >
                        Choose destinations
                      </Button>
                    </div>
                  ) : (
                    <div className={styles.cards}>
                      {visibleCities.map((c) => (
                        <SelectionCard
                          key={c.id}
                          id={c.id}
                          kind="city"
                          name={c.name}
                          image={c.image}
                          detail={
                            countryById[c.countryId]?.name +
                            " \u00b7 " +
                            c.recommendedDays +
                            " days suggested"
                          }
                          selected={draft.route.some((s) => s.cityId === c.id)}
                          onSelect={() =>
                            city(
                              c.id,
                              draft.route.some((s) => s.cityId === c.id),
                            )
                          }
                        />
                      ))}
                    </div>
                  )}
                  {draft.countryIds.length > 0 && !visibleCities.length && (
                    <p className={styles.empty}>No cities match that search.</p>
                  )}
                </>
              )}
              {step === "Details" && (
                <DetailsForm
                  key={JSON.stringify(draft.details)}
                  value={draft.details}
                  assigned={assignedDays(draft)}
                  onApply={(details, advance) => {
                    commit(
                      { ...draft, details },
                      "Trip details applied and saved.",
                    );
                    if (advance) goTo("Interests");
                  }}
                />
              )}
              {step === "Interests" && (
                <div className={styles.cards}>
                  {travelStyles.map((p) => (
                    <PreferenceCard
                      key={p.id}
                      styleId={p.id}
                      selected={draft.priorities.includes(p.id)}
                      priority={
                        draft.priorities.includes(p.id)
                          ? draft.priorities.indexOf(p.id) + 1
                          : undefined
                      }
                      onToggle={() =>
                        preference(p.id, draft.priorities.includes(p.id))
                      }
                    />
                  ))}
                </div>
              )}
              {step === "Experiences" && (
                <>
                  {!recommendations.length ? (
                    <div className={styles.empty}>
                      <MapPin className="mx-auto mb-3 text-primary" />
                      <p>
                        {draft.route.length
                          ? "No ideas match that search."
                          : "Add a city to discover experiences for your route."}
                      </p>
                      {!draft.route.length && (
                        <Button
                          className="mt-4"
                          onClick={() => setStep("Cities")}
                        >
                          Choose cities
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className={styles.cards}>
                      {recommendations.map((a) => (
                        <SelectionCard
                          key={a.id}
                          id={a.id}
                          kind="activity"
                          name={a.name}
                          image={a.image}
                          detail={
                            cityById[a.cityId]?.name +
                            " \u00b7 " +
                            formatDuration(a.durationMinutes) +
                            " \u00b7 " +
                            formatMoney(a.estimatedCost) +
                            " est."
                          }
                          selected={draft.savedIds.includes(a.id)}
                          onSelect={() =>
                            save(a.id, draft.savedIds.includes(a.id))
                          }
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </section>
          <div className={styles.dock}>
            <aside
              ref={panelRef}
              tabIndex={-1}
              hidden={!reviewOpen}
              id="trip-review"
              className={styles.canvas}
              aria-label="Your trip canvas"
              onKeyDown={(e) => {
                if (e.key === "Escape") closeReview();
              }}
            >
              <div className={styles.reviewHeading}>
                <span>Review your trip</span>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Close trip review"
                  onClick={closeReview}
                >
                  <X />
                </Button>
              </div>
              <TripDropZone id="trip-details">
                <h2>{draft.details.name}</h2>
                <p className={`${styles.note} mt-2`}>
                  {duration(draft)} days · {estimate.people}{" "}
                  {estimate.people === 1 ? "traveler" : "travelers"} ·{" "}
                  {draft.details.budgetLevel}
                </p>
                {draft.details.dateMode === "dates" && (
                  <p className={styles.note}>
                    {draft.details.startDate} → {draft.details.endDate}
                  </p>
                )}
                {draft.details.names && (
                  <p className={`${styles.note} break-words`}>
                    {draft.details.names}
                  </p>
                )}
                <div className="my-3 flex flex-wrap gap-2">
                  {draft.countryIds.map((id) => (
                    <Button
                      key={id}
                      variant="outline"
                      size="sm"
                      onClick={() => country(id, true)}
                      aria-label={`Remove country ${countryById[id]?.name}`}
                    >
                      {countryById[id]?.name}
                      <X />
                    </Button>
                  ))}
                </div>
                {!draft.countryIds.length && (
                  <p className={`${styles.empty} my-4`}>
                    Your selections will appear here.
                    <br />
                    <span className={styles.note}>
                      Tap a destination card to get started.
                    </span>
                  </p>
                )}
                <h3 className="mt-4 text-sm font-bold">
                  Your route{" "}
                  <span className="font-normal text-muted-foreground">
                    · {remaining} days left
                  </span>
                </h3>
                <SortableContext
                  items={draft.route.map((s) => `route:${s.cityId}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <ol>
                    {draft.route.map((s, i) => (
                      <RouteStop
                        key={s.cityId}
                        {...s}
                        index={i}
                        count={draft.route.length}
                        remaining={remaining}
                        onRemove={() => city(s.cityId, true)}
                        onDays={(delta) => {
                          if (s.days + delta < 1 || delta > remaining) return;
                          commit(
                            {
                              ...draft,
                              route: draft.route.map((r, j) =>
                                j === i ? { ...r, days: r.days + delta } : r,
                              ),
                            },
                            "City days updated.",
                          );
                        }}
                        onMove={(delta) =>
                          commit(
                            {
                              ...draft,
                              route: arrayMove(draft.route, i, i + delta),
                            },
                            "Route reordered.",
                          )
                        }
                      />
                    ))}
                  </ol>
                </SortableContext>
                {draft.route.length > 0 && remaining > 0 && (
                  <Button
                    variant="ghost"
                    className="mt-2"
                    onClick={() => {
                      commit(
                        distributeRemainingDays(draft),
                        "Remaining days shared across your route.",
                      );
                    }}
                  >
                    Distribute remaining days
                  </Button>
                )}
                {draft.route.length > 1 && (
                  <p className={`${styles.note} mt-2`}>
                    Allow roughly 2–4 hours between cities (simulated; no live
                    routing).
                  </p>
                )}
                {draft.priorities.length > 0 && (
                  <>
                    <h3 className="mt-5 text-sm font-bold">
                      Your interests, in order
                    </h3>
                    <ol>
                      {draft.priorities.map((id, i) => (
                        <li
                          key={id}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span className="flex-1">
                            {i + 1}. {travelStyleById[id].name}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={i === 0}
                            aria-label={`Prioritize ${travelStyleById[id].name}`}
                            onClick={() =>
                              commit(
                                {
                                  ...draft,
                                  priorities: arrayMove(
                                    draft.priorities,
                                    i,
                                    i - 1,
                                  ),
                                },
                                "Interest priority updated.",
                              )
                            }
                          >
                            <ArrowUp />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`Remove interest ${travelStyleById[id].name}`}
                            onClick={() => preference(id, true)}
                          >
                            <X />
                          </Button>
                        </li>
                      ))}
                    </ol>
                  </>
                )}
                <p className="mt-4 text-sm font-medium">
                  {draft.savedIds.length} saved{" "}
                  {draft.savedIds.length === 1 ? "idea" : "ideas"}
                </p>
                {draft.savedIds.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer py-2 text-xs text-primary">
                      Review saved ideas
                    </summary>
                    <ul>
                      {draft.savedIds.map((id) => (
                        <li
                          key={id}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span className="flex-1">
                            {activities.find((a) => a.id === id)?.name}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`Remove saved ${activities.find((a) => a.id === id)?.name}`}
                            onClick={() => save(id, true)}
                          >
                            <X />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
                <div className={styles.summary}>
                  <p>Estimated trip budget · USD</p>
                  <strong>
                    {formatMoney(estimate.min)}–{formatMoney(estimate.max)}
                  </strong>
                  <p>
                    {formatMoney(Math.round(estimate.min / estimate.people))}–
                    {formatMoney(Math.round(estimate.max / estimate.people))}{" "}
                    per person
                  </p>
                  <p className="mt-2 opacity-80">
                    Mock land-only estimate. Flights excluded. Saved experiences
                    are covered by the daily allowance.
                  </p>
                  {draft.details.budgetLevel === "custom" && (
                    <p className="mt-3">
                      Your budget: {formatMoney(draft.details.customAmount)}
                      {estimate.max > draft.details.customAmount
                        ? " · Upper estimate exceeds your budget."
                        : " · Within the estimated range."}
                    </p>
                  )}
                </div>
                <div className="mt-4 border-t pt-4">
                  {issues.length ? (
                    <ul className={styles.note}>
                      {issues.map((issue) => (
                        <li key={issue}>• {issue}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <Check size={18} />
                      Your draft is ready for the next step.
                    </p>
                  )}
                  <p className={`${styles.note} mt-2`}>
                    Your draft is saved here. Turning it into a finished trip is
                    coming next.
                  </p>
                </div>
              </TripDropZone>
            </aside>
            <TripDropZone className={styles.dockDrop}>
              <div className={styles.dockChoices}>
                <span className={styles.dockLabel}>
                  {dragLabel
                    ? "Drop here to add to your trip"
                    : "Your trip, taking shape"}
                </span>
                <div className={styles.chips}>
                  {draft.countryIds.length ? (
                    <>
                      {selectionChips.map((name, i) => (
                        <span key={`${name}-${i}`} title={name}>
                          {name}
                        </span>
                      ))}
                      <span>{duration(draft)} days</span>
                      <span>
                        {estimate.people}{" "}
                        {estimate.people === 1 ? "traveler" : "travelers"}
                      </span>
                      {draft.savedIds.length > 0 && (
                        <span>{draft.savedIds.length} saved ideas</span>
                      )}
                    </>
                  ) : (
                    <span className={styles.placeholder}>
                      Choose your first destination
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.dockActions}>
                <Button
                  ref={reviewButtonRef}
                  variant="ghost"
                  aria-label="Review trip"
                  aria-expanded={reviewOpen}
                  aria-controls="trip-review"
                  onClick={() => (reviewOpen ? closeReview() : openReview())}
                >
                  <ChevronUp className={reviewOpen ? "rotate-180" : ""} />
                  <span className={styles.reviewLabel}>Review</span>
                </Button>
                <Button
                  variant="outline"
                  aria-label="Previous step"
                  disabled={stepIndex === 0}
                  onClick={() => goTo(steps[stepIndex - 1])}
                >
                  <ArrowLeft />
                  <span className={styles.backLabel}>Back</span>
                </Button>
                {step === "Details" ? (
                  <Button
                    key="apply-details"
                    type="submit"
                    form="builder-details-form"
                    data-continue="true"
                    aria-label="Next step"
                  >
                    Next
                    <ArrowRight />
                  </Button>
                ) : (
                  <Button
                    key="advance-step"
                    type="button"
                    disabled={
                      !canContinue ||
                      (step === "Experiences" && creationIssues.length > 0)
                    }
                    aria-label={
                      stepIndex === steps.length - 1
                        ? "Create Trip"
                        : "Next step"
                    }
                    onClick={() =>
                      stepIndex === steps.length - 1
                        ? finishTrip()
                        : goTo(steps[stepIndex + 1])
                    }
                  >
                    {stepIndex === steps.length - 1 ? "Create Trip" : "Next"}
                    <ArrowRight />
                  </Button>
                )}
              </div>
            </TripDropZone>
          </div>
        </div>
        <DragOverlay>
          {dragLabel ? (
            <div className="rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground shadow-raised">
              {dragLabel}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
