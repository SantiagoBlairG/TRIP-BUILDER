"use client";
import { useEffect } from "react";
import { create } from "zustand";
import type { Trip } from "@/types/travel";
import { validLocalTrip } from "@/lib/trips";
const key = "roam-trips-v1";
type State = {
  trips: Trip[];
  deletedIds: string[];
  remove: (id: string) => boolean;
  ready: boolean;
  error: string;
  hydrate: () => void;
  save: (trip: Trip) => boolean;
};
export const useTripStore = create<State>((set, get) => ({
  trips: [],
  deletedIds: [],
  remove: (id) => {
    get().hydrate();
    if (get().error) return false;
    const trips = get().trips.filter((t) => t.id !== id);
    const deletedIds = [...new Set([...get().deletedIds, id])];
    try {
      localStorage.setItem(key, JSON.stringify({ trips, deletedIds }));
      set({ trips, deletedIds });
      return true;
    } catch {
      return false;
    }
  },
  ready: false,
  error: "",
  hydrate: () => {
    if (get().ready) return;
    try {
      const raw = localStorage.getItem(key);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      const records = Array.isArray(parsed)
        ? parsed
        : (parsed as { trips?: unknown })?.trips;
      const deleted = Array.isArray(parsed)
        ? []
        : (parsed as { deletedIds?: unknown })?.deletedIds;
      if (
        !Array.isArray(records) ||
        !Array.isArray(deleted) ||
        deleted.some((id) => typeof id !== "string")
      )
        throw new Error("Invalid library");
      const trips = records
        .map(validLocalTrip)
        .filter((t): t is Trip => t !== null);
      set({
        trips,
        deletedIds: deleted,
        ready: true,
        error:
          trips.length !== records.length
            ? "Some saved trips could not be recovered."
            : "",
      });
    } catch {
      set({
        ready: true,
        error:
          "Your saved library could not be read. Your current draft is still available.",
      });
    }
  },
  save: (trip) => {
    get().hydrate();
    if (get().error) return false;
    const trips = [trip, ...get().trips.filter((t) => t.id !== trip.id)];
    try {
      localStorage.setItem(
        key,
        JSON.stringify(
          get().deletedIds.length
            ? {
                trips,
                deletedIds: get().deletedIds.filter((id) => id !== trip.id),
              }
            : trips,
        ),
      );
      set({
        trips,
        deletedIds: get().deletedIds.filter((id) => id !== trip.id),
      });
      return true;
    } catch {
      return false;
    }
  },
}));
export function useTripLibrary() {
  const state = useTripStore();
  const hydrate = state.hydrate;
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return state;
}
