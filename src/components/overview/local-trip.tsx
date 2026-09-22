"use client";
import { useEffect, useRef } from "react";
import { useTripLibrary } from "@/stores/trip-store";
import { TripBento } from "./trip-bento";
import TripNotFound from "@/app/trips/[tripId]/not-found";
export function LocalTrip({ id }: { id: string }) {
  const { trips, ready, error } = useTripLibrary();
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ready)
      container.current
        ?.querySelector<HTMLHeadingElement>("h1")
        ?.focus({ preventScroll: true });
  }, [ready, id]);
  if (!ready) return <p role="status">Opening your adventure...</p>;
  const trip = trips.find((t) => t.id === id);
  return (
    <div ref={container}>
      {error && <p role="alert">{error}</p>}
      {trip ? <TripBento trip={trip} /> : <TripNotFound />}
    </div>
  );
}
