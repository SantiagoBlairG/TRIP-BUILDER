import { ArrowUpRight, CalendarDays, Users } from "lucide-react";
import type { City, Country, Trip } from "@/types/travel";
import { formatTripDates } from "@/lib/format";
import { getDestinationImage } from "@/data/images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BaseCard } from "./base-card";
import { ImageCard } from "./image-card";

export function TripCard({
  trip,
  countries,
  cities,
  onOpen,
  actionLabel = "Open trip",
}: {
  trip: Trip;
  countries: readonly Country[];
  cities: readonly City[];
  onOpen?: () => void;
  actionLabel?: string;
}) {
  const country = countries.find((item) => item.id === trip.countryIds[0]);
  const image = country ? getDestinationImage(country.image) : undefined;
  const content = (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge
          tone={
            trip.status === "draft"
              ? "dates"
              : trip.status === "past"
                ? "neutral"
                : "budget"
          }
        >
          {trip.status === "draft"
            ? "Draft"
            : trip.status === "past"
              ? "Past adventure"
              : "Upcoming"}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {trip.totalDays} days
        </span>
      </div>
      <h3 className="font-display text-3xl leading-tight">{trip.name}</h3>
      <p className="text-sm text-muted-foreground">
        {trip.route
          .map(
            (stop) =>
              cities.find((city) => city.id === stop.cityId)?.name ??
              "Unknown city",
          )
          .join(" → ") || "Your route starts here"}
      </p>
      <div className="space-y-2 text-xs text-muted-foreground">
        <p className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
          {formatTripDates(trip.startDate, trip.endDate)}
        </p>
        <p className="flex items-center gap-2">
          <Users className="size-4" aria-hidden="true" />
          {trip.travelers.length} travelers
        </p>
      </div>
      {onOpen && (
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
          onClick={onOpen}
          aria-label={`${actionLabel}: ${trip.name}`}
        >
          {actionLabel}
          <ArrowUpRight aria-hidden="true" />
        </Button>
      )}
    </>
  );
  return image ? (
    <ImageCard image={image} theme={trip.theme} aspect="wide">
      {content}
    </ImageCard>
  ) : (
    <BaseCard theme={trip.theme} className="space-y-4">
      {content}
    </BaseCard>
  );
}
