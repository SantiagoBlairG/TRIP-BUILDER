"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, X, ArrowUp, ArrowDown } from "lucide-react";
import type { Trip } from "@/types/travel";
import { countries, cities, activities } from "@/data/catalog";
import { travelStyles } from "@/data/travel-styles";
import { tripToDraft, editTrip } from "@/lib/trips";
import { cleanDraft, assignedDays, type BuilderDraft } from "@/lib/builder";
import { useTripStore } from "@/stores/trip-store";
import { DetailsForm } from "@/components/builder/details-form";
import { Button } from "@/components/ui/button";
import styles from "./trip-actions.module.css";
export function TripActions({ trip }: { trip: Trip }) {
  const [mode, setMode] = useState<"edit" | "delete" | null>(null);
  return (
    <>
      <Button variant="outline" onClick={() => setMode("edit")}>
        <Pencil />
        Edit
      </Button>
      <Button variant="ghost" onClick={() => setMode("delete")}>
        <Trash2 />
        Delete
      </Button>
      {mode && (
        <TripDialog
          key={mode}
          trip={trip}
          mode={mode}
          close={() => setMode(null)}
        />
      )}
    </>
  );
}
function TripDialog({
  trip,
  mode,
  close,
}: {
  trip: Trip;
  mode: "edit" | "delete";
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [draft, setDraft] = useState(() => tripToDraft(trip));
  const [error, setError] = useState("");
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  function update(next: BuilderDraft) {
    setDraft(cleanDraft(next));
  }
  function remove() {
    if (!useTripStore.getState().remove(trip.id)) {
      setError(
        "Could not delete this trip. Please check browser storage and try again.",
      );
      return;
    }
    close();
    router.push("/trips");
  }
  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="trip-dialog-title"
      onCancel={close}
    >
      <header className={styles.header}>
        <div>
          <p className="text-xs text-primary">Your trip, your way</p>
          <h2
            id="trip-dialog-title"
            className="text-2xl font-bold tracking-tight"
          >
            {mode === "edit" ? "Edit trip" : "Delete trip?"}
          </h2>
        </div>
        <Button variant="ghost" aria-label="Close dialog" onClick={close}>
          <X />
        </Button>
      </header>
      <div className={styles.content}>
        {mode === "delete" ? (
          <>
            <p>
              Delete <strong>{trip.name}</strong> from this device? This removes
              its route, saved ideas, and plans. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={close}>
                Keep trip
              </Button>
              <Button className="bg-destructive text-white" onClick={remove}>
                Delete trip
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-5 text-sm text-muted-foreground">
              Changes save together. Removing cities or reducing their days also
              removes plans attached to those days. Any unused days will be
              distributed when you save a completed trip.
            </p>
            <fieldset className={styles.section}>
              <legend>Destinations</legend>
              <div className={styles.choices}>
                {countries.map((c) => (
                  <label key={c.id}>
                    <input
                      type="checkbox"
                      checked={draft.countryIds.includes(c.id)}
                      onChange={() =>
                        update({
                          ...draft,
                          countryIds: draft.countryIds.includes(c.id)
                            ? draft.countryIds.filter((id) => id !== c.id)
                            : [...draft.countryIds, c.id],
                        })
                      }
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className={styles.section}>
              <legend>Cities and route</legend>
              <div className={styles.choices}>
                {cities
                  .filter((c) => draft.countryIds.includes(c.countryId))
                  .map((c) => (
                    <label key={c.id}>
                      <input
                        type="checkbox"
                        checked={draft.route.some((s) => s.cityId === c.id)}
                        onChange={() =>
                          update({
                            ...draft,
                            route: draft.route.some((s) => s.cityId === c.id)
                              ? draft.route.filter((s) => s.cityId !== c.id)
                              : [...draft.route, { cityId: c.id, days: 1 }],
                          })
                        }
                      />
                      {c.name}
                    </label>
                  ))}
              </div>
              <ol className="mt-4 space-y-2">
                {draft.route.map((stop, i) => (
                  <li key={stop.cityId} className={styles.stop}>
                    <span>
                      {cities.find((c) => c.id === stop.cityId)?.name}
                    </span>
                    <label>
                      Days
                      <input
                        aria-label={
                          "Days in " +
                          cities.find((c) => c.id === stop.cityId)?.name
                        }
                        type="number"
                        min="1"
                        max="365"
                        value={stop.days}
                        onChange={(e) => {
                          const days = Number(e.target.value);
                          if (
                            Number.isInteger(days) &&
                            days >= 1 &&
                            days <= 365
                          )
                            update({
                              ...draft,
                              route: draft.route.map((s, j) =>
                                j === i ? { ...s, days } : s,
                              ),
                            });
                        }}
                      />
                    </label>
                    {[-1, 1].map((direction) => (
                      <Button
                        key={direction}
                        variant="ghost"
                        aria-label={
                          (direction === -1 ? "Move earlier " : "Move later ") +
                          cities.find((c) => c.id === stop.cityId)?.name
                        }
                        disabled={
                          i + direction < 0 ||
                          i + direction >= draft.route.length
                        }
                        onClick={() => {
                          const route = [...draft.route];
                          [route[i], route[i + direction]] = [
                            route[i + direction],
                            route[i],
                          ];
                          update({ ...draft, route });
                        }}
                      >
                        {direction === -1 ? <ArrowUp /> : <ArrowDown />}
                      </Button>
                    ))}
                  </li>
                ))}
              </ol>
            </fieldset>
            <fieldset className={styles.section}>
              <legend>Interests (selection order sets priority)</legend>
              <div className={styles.choices}>
                {travelStyles.map((style) => (
                  <label key={style.id}>
                    <input
                      type="checkbox"
                      checked={draft.priorities.includes(style.id)}
                      onChange={() =>
                        update({
                          ...draft,
                          priorities: draft.priorities.includes(style.id)
                            ? draft.priorities.filter((id) => id !== style.id)
                            : [...draft.priorities, style.id],
                        })
                      }
                    />
                    {style.name}
                  </label>
                ))}
              </div>
            </fieldset>
            <details className={styles.section}>
              <summary>Saved ideas ({draft.savedIds.length})</summary>
              <div className={styles.choices}>
                {activities
                  .filter((a) => draft.route.some((s) => s.cityId === a.cityId))
                  .map((a) => (
                    <label key={a.id}>
                      <input
                        type="checkbox"
                        checked={draft.savedIds.includes(a.id)}
                        onChange={() =>
                          update({
                            ...draft,
                            savedIds: draft.savedIds.includes(a.id)
                              ? draft.savedIds.filter((id) => id !== a.id)
                              : [...draft.savedIds, a.id],
                          })
                        }
                      />
                      {a.name}
                    </label>
                  ))}
              </div>
            </details>
            <DetailsForm
              value={draft.details}
              assigned={assignedDays(draft)}
              submitLabel="Save changes"
              onApply={(details) => {
                try {
                  const next = editTrip(
                    trip,
                    { ...draft, details },
                    new Date().toISOString().slice(0, 10),
                  );
                  if (!useTripStore.getState().save(next))
                    throw new Error(
                      "Could not save changes. Your original trip is unchanged.",
                    );
                  close();
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Please check your selections.",
                  );
                }
              }}
            />
            <Button className="mt-3" variant="ghost" onClick={close}>
              Cancel
            </Button>
          </>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </dialog>
  );
}
