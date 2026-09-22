import type { Metadata } from "next";
import { TripBuilder } from "@/components/builder/trip-builder";
export const metadata: Metadata = { title: "Trip builder" };
export default function BuilderPage() {
  return <TripBuilder />;
}
