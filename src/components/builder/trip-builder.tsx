"use client";
import { useState } from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
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
import { ArrowUp, Check, Compass, MapPin, RotateCcw, X } from "lucide-react";
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
  duration,
  draftIssues,
  estimateDraft,
  type BuilderDraft,
} from "@/lib/builder";
import { formatMoney } from "@/lib/format";
import { useBuilderStore } from "@/stores/builder-store";
import { Button } from "@/components/ui/button";
import { DestinationCard } from "@/components/cards/destination-card";
import { CityCard } from "@/components/cards/city-card";
import { PreferenceCard } from "@/components/cards/preference-card";
import { ActivityCard } from "@/components/cards/activity-card";
import { DetailsForm } from "./details-form";
import { DraggableCard, RouteStop, TripDropZone } from "./drag-cards";
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
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const remaining = duration(draft) - assignedDays(draft);
  const issues = draftIssues(draft);
  const estimate = estimateDraft(draft);
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
    if (over.id !== "trip-canvas" && !String(over.id).startsWith("route:"))
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
    <>
      <header className="page-hero">
        <p className="hero-copy mb-3 text-xs font-semibold uppercase tracking-widest">
          Your next chapter
        </p>
        <h1 className="text-4xl sm:text-5xl">
          Good trips start
          <br />
          with a little curiosity.
        </h1>
        <p className="hero-copy mt-4 max-w-xl text-sm leading-6">
          Collect destinations, shape your route, and save the things you love.
          Drag a card into your trip or use its add button.
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
      <div className="my-3 flex gap-3 text-sm text-primary lg:hidden">
        <a href="#trip-canvas" className="inline-flex min-h-11 items-center">
          Jump to your trip canvas ?
        </a>
      </div>
      <nav aria-label="Builder steps" className={styles.tabs}>
        {steps.map((label, i) => (
          <Button
            key={label}
            variant={step === label ? "default" : "outline"}
            aria-current={step === label ? "step" : undefined}
            onClick={() => {
              setStep(label);
              setQuery("");
            }}
          >
            <span className="opacity-60">0{i + 1}</span>
            {label}
          </Button>
        ))}
      </nav>
      <p aria-live="polite" className="mb-3 min-h-5 text-sm text-primary">
        {message}
      </p>
      <DndContext
        sensors={sensors}
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
              initial={reduced ? false : { opacity: 0.5, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="mb-2 text-2xl font-bold tracking-tight">
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
                    ? "Choose your interests, then move your favorites to the top in the canvas."
                    : step === "Experiences"
                      ? "Only ideas from your route, ranked by your travel interests. Save them for later itinerary planning."
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
                  <div className={styles.cards}>
                    {visibleCountries.map((c) => (
                      <DraggableCard
                        key={c.id}
                        id={c.id}
                        kind="country"
                        name={c.name}
                        disabled={draft.countryIds.includes(c.id)}
                      >
                        <DestinationCard
                          country={c}
                          selected={draft.countryIds.includes(c.id)}
                          onToggle={() =>
                            country(c.id, draft.countryIds.includes(c.id))
                          }
                        />
                      </DraggableCard>
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
                        <DraggableCard
                          key={c.id}
                          id={c.id}
                          kind="city"
                          name={c.name}
                          disabled={
                            draft.route.some((s) => s.cityId === c.id) ||
                            remaining < 1
                          }
                        >
                          <CityCard
                            city={c}
                            countryName={countryById[c.countryId]?.name ?? ""}
                            selected={draft.route.some(
                              (s) => s.cityId === c.id,
                            )}
                            onToggle={() =>
                              city(
                                c.id,
                                draft.route.some((s) => s.cityId === c.id),
                              )
                            }
                          />
                        </DraggableCard>
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
                  onApply={(details) =>
                    commit(
                      { ...draft, details },
                      "Trip details applied and saved.",
                    )
                  }
                />
              )}
              {step === "Interests" && (
                <div className={styles.cards}>
                  {travelStyles.map((p) => (
                    <DraggableCard
                      key={p.id}
                      id={p.id}
                      kind="interest"
                      name={p.name}
                      disabled={draft.priorities.includes(p.id)}
                    >
                      <PreferenceCard
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
                    </DraggableCard>
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
                        <DraggableCard
                          key={a.id}
                          id={a.id}
                          kind="activity"
                          name={a.name}
                          disabled={draft.savedIds.includes(a.id)}
                        >
                          <ActivityCard
                            activity={a}
                            cityName={cityById[a.cityId]?.name ?? ""}
                            saved={draft.savedIds.includes(a.id)}
                            onSave={() =>
                              save(a.id, draft.savedIds.includes(a.id))
                            }
                          />
                        </DraggableCard>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </section>
          <aside
            id="trip-canvas"
            className={styles.canvas}
            aria-label="Your trip canvas"
          >
            <a
              href="#option-tray"
              className="mb-2 inline-flex min-h-11 items-center text-sm text-primary lg:hidden"
            >
              Back to the options ?
            </a>
            <TripDropZone>
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
                  Drop your first destination here.
                  <br />
                  <span className={styles.note}>
                    Or use Add on any destination card.
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
                    const n = draft.route.length;
                    commit(
                      {
                        ...draft,
                        route: draft.route.map((r, i) => ({
                          ...r,
                          days:
                            r.days +
                            Math.floor(remaining / n) +
                            (i < remaining % n ? 1 : 0),
                        })),
                      },
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
                      <li key={id} className="flex items-center gap-2 text-xs">
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
                      <li key={id} className="flex items-center gap-2 text-xs">
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
                  {formatMoney(Math.round(estimate.max / estimate.people))} per
                  person
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
        </div>
        <DragOverlay>
          {dragLabel ? (
            <div className="rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground shadow-raised">
              {dragLabel}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
