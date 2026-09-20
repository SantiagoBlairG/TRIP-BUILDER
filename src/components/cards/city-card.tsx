import { CalendarDays } from "lucide-react";
import type { City } from "@/types/travel";
import { getDestinationImage } from "@/data/images";
import { Badge } from "@/components/ui/badge";
import { ImageCard } from "./image-card";
import { SelectionAction, type SelectionProps } from "./selection-action";

export function CityCard({
  city,
  countryName,
  selected,
  disabled,
  onToggle,
}: SelectionProps & { city: City; countryName: string }) {
  const image = getDestinationImage(city.image);
  if (!image) throw new Error(`Missing image metadata for ${city.id}`);
  return (
    <ImageCard
      image={image}
      aspect="wide"
      state={disabled ? "disabled" : selected ? "selected" : "default"}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {countryName}
        </span>
        <Badge tone="dates">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {city.recommendedDays} days suggested
        </Badge>
      </div>
      <div>
        <h3 className="text-xl font-semibold">{city.name}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {city.description}
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        {city.activityIds.length} experiences to discover
      </p>
      <SelectionAction
        name={city.name}
        selected={selected}
        disabled={disabled}
        onToggle={onToggle}
      />
    </ImageCard>
  );
}
