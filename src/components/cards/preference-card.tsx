import {
  Camera,
  Check,
  Footprints,
  Landmark,
  Leaf,
  Moon,
  Mountain,
  ShoppingBag,
  Sparkles,
  Trees,
  Users,
  Utensils,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { TravelStyleId } from "@/types/travel";
import { travelStyleById } from "@/data/travel-styles";
import { cn } from "@/lib/utils";

const icons: Record<TravelStyleId, LucideIcon> = {
  food: Utensils,
  beaches: Waves,
  hiking: Footprints,
  nature: Trees,
  culture: Landmark,
  history: Landmark,
  nightlife: Moon,
  shopping: ShoppingBag,
  photography: Camera,
  adventure: Mountain,
  wellness: Leaf,
  family: Users,
};

export function PreferenceCard({
  styleId,
  selected = false,
  priority,
  disabled = false,
  onToggle,
}: {
  styleId: TravelStyleId;
  selected?: boolean;
  priority?: number;
  disabled?: boolean;
  onToggle: () => void;
}) {
  const style = travelStyleById[styleId];
  const Icon = icons[styleId] ?? Sparkles;
  return (
    <button
      type="button"
      aria-label={style.name}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "travel-card flex w-full min-w-0 items-start gap-4 rounded-xl border bg-card p-5 text-left disabled:cursor-not-allowed disabled:opacity-60",
        selected && "border-primary bg-secondary ring-2 ring-primary/25",
      )}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-recommendation">
        <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{style.name}</span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
          {style.description}
        </span>
        {selected && (
          <span className="mt-2 flex items-center gap-1 text-xs font-medium text-primary">
            <Check className="size-3.5" aria-hidden="true" />
            Selected{priority ? ` · Priority ${priority}` : ""}
          </span>
        )}
      </span>
    </button>
  );
}
