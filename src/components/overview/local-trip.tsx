"use client";
import { useTripLibrary } from "@/stores/trip-store";
import { TripBento } from "./trip-bento";
import TripNotFound from "@/app/trips/[tripId]/not-found";
export function LocalTrip({id}: {id:string}) {
  const {trips, ready, error} = useTripLibrary();
  if (!ready) return <p role="status">Opening your adventure...</p>;
  const trip = trips.find(t=>t.id===id);
  return <>{error && <p role="alert">{error}</p>}{trip ? <TripBento trip={trip} /> : <TripNotFound />}</>;
}
