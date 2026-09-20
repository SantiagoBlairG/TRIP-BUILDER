import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SelectionProps = {
  selected?: boolean;
  disabled?: boolean;
  onToggle?: () => void;
};
export function SelectionAction({
  name,
  selected = false,
  disabled = false,
  onToggle,
}: SelectionProps & { name: string }) {
  if (!onToggle) return null;
  return (
    <Button
      type="button"
      variant={selected ? "default" : "outline"}
      className="w-full"
      aria-label={`Select ${name}`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onToggle}
    >
      {selected ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
      {selected ? "Selected" : "Add to ideas"}
    </Button>
  );
}
