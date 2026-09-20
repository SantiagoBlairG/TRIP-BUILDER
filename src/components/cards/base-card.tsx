import type { ComponentProps } from "react";
import { CheckCircle2, CircleAlert, GripVertical } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ThemeId } from "@/types/travel";

const baseCardVariants = cva("travel-card group/card relative min-w-0", {
  variants: {
    size: {
      compact: "",
      horizontal: "sm:col-span-2",
      vertical: "sm:row-span-2",
      featured: "sm:col-span-2 sm:row-span-2",
    },
    tone: {
      neutral: "bg-card",
      route: "bg-route",
      dates: "bg-dates",
      travelers: "bg-travelers",
      budget: "bg-budget",
      recommendation: "bg-recommendation",
      destination: "bg-destination-soft",
    },
    state: {
      default: "",
      selected: "border-primary ring-2 ring-primary/25",
      dragging: "rotate-1 scale-[1.02] border-primary shadow-raised",
      "valid-drop": "border-dashed border-primary ring-2 ring-primary/20",
      "invalid-drop":
        "border-dashed border-destructive ring-2 ring-destructive/20",
      disabled: "opacity-60",
      loading: "",
      expanded: "border-primary/50 shadow-raised",
    },
  },
  defaultVariants: { size: "compact", tone: "neutral", state: "default" },
});

export type BaseCardProps = ComponentProps<typeof Card> &
  VariantProps<typeof baseCardVariants> & { theme?: ThemeId };
export function BaseCard({
  className,
  size,
  tone,
  state = "default",
  theme,
  children,
  ...props
}: BaseCardProps) {
  return (
    <Card
      {...props}
      data-theme={theme}
      data-state={state}
      data-size={size ?? "compact"}
      aria-disabled={state === "disabled" || undefined}
      aria-busy={state === "loading" || undefined}
      className={cn(baseCardVariants({ size, tone, state }), className)}
    >
      {state === "loading" ? (
        <>
          <span className="sr-only">Loading card</span>
          <div className="space-y-4">
            <Skeleton className="aspect-[4/3] w-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </>
      ) : (
        children
      )}
      {state === "valid-drop" && (
        <p className="mt-4 flex items-center gap-2 text-sm text-primary">
          <CheckCircle2 className="size-4" aria-hidden="true" />
          Ready to add here
        </p>
      )}
      {state === "invalid-drop" && (
        <p className="mt-4 flex items-center gap-2 text-sm text-destructive">
          <CircleAlert className="size-4" aria-hidden="true" />
          Choose a day in this city
        </p>
      )}
      {state === "dragging" && (
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <GripVertical className="size-4" aria-hidden="true" />
          Moving card
        </p>
      )}
    </Card>
  );
}
