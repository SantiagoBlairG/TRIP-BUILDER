import { TripLibrary } from "@/components/library/trip-library";
import { demoTrips } from "@/data/catalog";

export default function HomePage() {
  return <TripLibrary trips={demoTrips} />;
}
