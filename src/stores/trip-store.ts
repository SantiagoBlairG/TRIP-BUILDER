"use client";
import { useEffect } from "react";
import { create } from "zustand";
import type { Trip } from "@/types/travel";
import { validLocalTrip } from "@/lib/trips";
const key = "roam-trips-v1";
type State = { trips: Trip[]; ready: boolean; error: string; hydrate: () => void; save: (trip: Trip) => boolean };
export const useTripStore = create<State>((set, get) => ({
  trips: [], ready: false, error: "",
  hydrate: () => {
    if (get().ready) return;
    try {
      const raw = localStorage.getItem(key);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) throw new Error("Invalid library");
      const trips = parsed.map(validLocalTrip).filter((t): t is Trip => t !== null);
      set({trips, ready:true, error:trips.length !== parsed.length ? "Some saved trips could not be recovered." : ""});
    } catch { set({ready:true, error:"Your saved library could not be read. Your current draft is still available."}); }
  },
  save: trip => {
    get().hydrate();
    if (get().error) return false;
    const trips = [trip, ...get().trips.filter(t => t.id !== trip.id)];
    try { localStorage.setItem(key, JSON.stringify(trips)); set({trips}); return true; }
    catch { return false; }
  }
}));
export function useTripLibrary() {
  const state = useTripStore();
  useEffect(() => {state.hydrate();}, [state.hydrate]);
  return state;
}
