import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { demoTrips } from "@/data/catalog";
import { TripPreview } from "@/components/overview/trip-preview";

type Props = { params: Promise<{ tripId: string }> };
export function generateStaticParams() {
  return demoTrips.map((trip) => ({ tripId: trip.id }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tripId } = await params;
  return {
    title:
      demoTrips.find((trip) => trip.id === tripId)?.name ?? "Trip not found",
  };
}
export default async function TripPage({ params }: Props) {
  const { tripId } = await params;
  const trip = demoTrips.find((trip) => trip.id === tripId);
  if (!trip) notFound();
  return <TripPreview trip={trip} />;
}
