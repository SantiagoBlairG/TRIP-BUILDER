import type { Trip } from "@/types/travel";
import { TripBento } from "./trip-bento";

export function TripPreview({ trip }: { trip: Trip }) {
  return <TripBento trip={trip} />;
}
