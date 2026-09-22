"use client";
import { useDraggable } from "@dnd-kit/core";
import { Check, Plus } from "lucide-react";
import { DestinationPhoto } from "@/components/overview/destination-photo";
import styles from "./builder.module.css";

/** One native button: tap/keyboard selects; mouse drag or touch-and-hold moves it. */
export function SelectionCard({
  id,
  kind,
  name,
  image,
  detail,
  selected,
  onSelect,
}: {
  id: string;
  kind: "country" | "city" | "activity";
  name: string;
  image: string;
  detail: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const { setNodeRef, listeners, isDragging } = useDraggable({
    id: `${kind}:${id}`,
    data: { kind, id, name },
    disabled: selected,
  });
  return (
    <button
      ref={setNodeRef}
      type="button"
      className={styles.selectionCard}
      data-selected={selected}
      data-dragging={isDragging}
      aria-label={`${kind === "activity" ? "Save" : "Select"} ${name}`}
      aria-pressed={selected}
      onMouseDown={(e) => listeners?.onMouseDown?.(e)}
      onTouchStart={(e) => listeners?.onTouchStart?.(e)}
      onDragStart={(e) => e.preventDefault()}
      onClick={onSelect}
    >
      <span className={styles.selectionPhoto}>
        <DestinationPhoto
          src={image}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 280px"
        />
      </span>
      <span className={styles.selectionCopy}>
        <strong>{name}</strong>
        <span>{detail}</span>
      </span>
      <span className={styles.selectionMark} aria-hidden="true">
        {selected ? <Check size={16} /> : <Plus size={16} />}
      </span>
    </button>
  );
}
