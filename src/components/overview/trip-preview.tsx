"use client";
import type { Trip } from "@/types/travel";
import { useTripLibrary } from "@/stores/trip-store";
import TripNotFound from "@/app/trips/[tripId]/not-found";
import { TripBento } from "./trip-bento";
export function TripPreview({ trip }: { trip: Trip }) {
  const { trips, deletedIds } = useTripLibrary();
  return deletedIds.includes(trip.id) ? (
    <TripNotFound />
  ) : (
    <TripBento trip={trips.find((t) => t.id === trip.id) ?? trip} />
  );
}
