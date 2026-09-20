import { MapPin } from "lucide-react";
import type { Country } from "@/types/travel";
import { getDestinationImage } from "@/data/images";
import { formatMoney } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { ImageCard } from "./image-card";
import { SelectionAction, type SelectionProps } from "./selection-action";

export function DestinationCard({
  country,
  selected,
  disabled,
  onToggle,
  priority = false,
}: SelectionProps & { country: Country; priority?: boolean }) {
  const image = getDestinationImage(country.image);
  if (!image) throw new Error(`Missing image metadata for ${country.id}`);
  return (
    <ImageCard
      image={image}
      theme={country.theme}
      priority={priority}
      state={disabled ? "disabled" : selected ? "selected" : "default"}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge tone="destination">{country.continent}</Badge>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" aria-hidden="true" />
          {country.cityIds.length} cities
        </span>
      </div>
      <div>
        <h3 className="font-display text-4xl leading-tight">{country.name}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
          {country.description}
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        <span className="font-medium tabular-nums text-foreground">
          {formatMoney(country.dailyBudget.min)}–
          {formatMoney(country.dailyBudget.max)}
        </span>{" "}
        / person / day · mock USD estimate
      </p>
      <SelectionAction
        name={country.name}
        selected={selected}
        disabled={disabled}
        onToggle={onToggle}
      />
    </ImageCard>
  );
}
