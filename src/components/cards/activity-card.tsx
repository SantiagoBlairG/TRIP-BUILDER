"use client";

import { useId, useState } from "react";
import { Bookmark, Check, ChevronDown, Clock3, Plus, Star } from "lucide-react";
import type { Activity } from "@/types/travel";
import { getDestinationImage } from "@/data/images";
import { travelStyleById } from "@/data/travel-styles";
import { formatDuration, formatMoney } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageCard } from "./image-card";

export function ActivityCard({
  activity,
  cityName,
  saved = false,
  disabled = false,
  onSave,
  onAdd,
}: {
  activity: Activity;
  cityName: string;
  saved?: boolean;
  disabled?: boolean;
  onSave?: () => void;
  onAdd?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const image = getDestinationImage(activity.image);
  if (!image) throw new Error(`Missing image metadata for ${activity.id}`);
  return (
    <ImageCard
      image={image}
      aspect="wide"
      state={
        disabled
          ? "disabled"
          : expanded
            ? "expanded"
            : saved
              ? "selected"
              : "default"
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="recommendation">
          {travelStyleById[activity.category].name}
        </Badge>
        <span className="text-xs text-muted-foreground">{cityName}</span>
      </div>
      <div>
        <h3 className="text-lg leading-snug font-semibold">{activity.name}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {activity.description}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Clock3 className="size-4" aria-hidden="true" />
          {formatDuration(activity.durationMinutes)}
        </span>
        <span className="font-medium tabular-nums">
          {formatMoney(activity.estimatedCost)}{" "}
          <span className="text-xs font-normal text-muted-foreground">
            est. / person
          </span>
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {activity.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5" aria-hidden="true" />
          {activity.rating.toFixed(1)} · mock rating
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        type="button"
        disabled={disabled}
        aria-expanded={expanded}
        aria-controls={detailsId}
        onClick={() => setExpanded(!expanded)}
        className="w-full justify-between"
      >
        {expanded ? "Hide details" : "View details"}
        <ChevronDown
          className={expanded ? "rotate-180" : ""}
          aria-hidden="true"
        />
      </Button>
      {expanded && (
        <div
          id={detailsId}
          className="space-y-2 rounded-lg bg-muted p-4 text-xs leading-5"
        >
          <p>Suggested time: {activity.recommendedTimeOfDay.join(" or ")}.</p>
          <p>
            Demo estimate in USD. Prices, ratings, and map pins are simulated;
            the photo is destination inspiration.
          </p>
        </div>
      )}
      {(onSave || onAdd) && (
        <div className="flex flex-wrap gap-2 border-t pt-4">
          {onSave && (
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={disabled}
              aria-label={`Save ${activity.name}`}
              aria-pressed={saved}
              onClick={onSave}
            >
              {saved ? (
                <Check aria-hidden="true" />
              ) : (
                <Bookmark aria-hidden="true" />
              )}
              {saved ? "Saved" : "Save"}
            </Button>
          )}
          {onAdd && (
            <Button
              type="button"
              className="flex-1"
              disabled={disabled}
              onClick={onAdd}
            >
              <Plus aria-hidden="true" />
              Add to itinerary
            </Button>
          )}
        </div>
      )}
    </ImageCard>
  );
}
