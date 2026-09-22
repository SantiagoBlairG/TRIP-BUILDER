"use client";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cityById } from "@/data/catalog";
import styles from "./builder.module.css";

export function TripDropZone({
  children,
  id = "trip-canvas",
  className = styles.dropZone,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={className} data-over={isOver}>
      {children}
    </div>
  );
}
export function RouteStop({
  cityId,
  days,
  index,
  count,
  remaining,
  onMove,
  onDays,
  onRemove,
}: {
  cityId: string;
  days: number;
  index: number;
  count: number;
  remaining: number;
  onMove: (delta: number) => void;
  onDays: (delta: number) => void;
  onRemove: () => void;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `route:${cityId}`,
    data: { kind: "route", id: cityId },
  });
  const name = cityById[cityId]?.name ?? cityId;
  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      className={styles.stop}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={styles.grip}
          aria-label={`Reorder ${name}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical size={18} />
        </button>
        <span className="text-xs text-primary">
          {String(index + 1).padStart(2, "0")}
        </span>
        <strong className="min-w-0 flex-1">{name}</strong>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
        >
          <X />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          disabled={days <= 1}
          onClick={() => onDays(-1)}
          aria-label={`Fewer days in ${name}`}
        >
          <Minus />
        </Button>
        <span className="text-sm tabular-nums">{days} days</span>
        <Button
          variant="ghost"
          size="icon"
          disabled={remaining <= 0}
          onClick={() => onDays(1)}
          aria-label={`More days in ${name}`}
        >
          <Plus />
        </Button>
        <div className="ml-auto flex">
          <Button
            variant="ghost"
            size="icon"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            aria-label={`Move ${name} earlier`}
          >
            <ArrowUp />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={index === count - 1}
            onClick={() => onMove(1)}
            aria-label={`Move ${name} later`}
          >
            <ArrowDown />
          </Button>
        </div>
      </div>
    </li>
  );
}
